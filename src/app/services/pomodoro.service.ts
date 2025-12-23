import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseService } from './exercise.service';
import { ExerciseModalComponent } from '../components/exercise-modal/exercise-modal.component';

// Interfaces do serviço Pomodoro
export enum TimerState {
  IDLE = 'idle',
  WORKING = 'working',
  BREAK = 'break',
  LONG_BREAK = 'long_break',
  PAUSED = 'paused'
}

export interface PomodoroConfig {
  workTime: number;
  breakTime: number;
  longBreakTime: number;
  workSessions: number;
}

/**
 * Serviço Pomodoro - Angular v20 com Signals
 * 
 * Este serviço centraliza toda a lógica de negócio do Pomodoro Timer
 * usando Angular Signals para gerenciamento de estado reativo.
 * 
 * Responsabilidades:
 * - Gerenciar estado global do timer
 * - Controlar transições de sessões
 * - Notificações de áudio
 * - Validação de configurações
 */
@Injectable({
  providedIn: 'root'
})
export class PomodoroService {
  
  // Configuração padrão do Pomodoro
  private readonly defaultConfig: PomodoroConfig = {
    workTime: 25,        // 25 minutos de trabalho
    breakTime: 5,        // 5 minutos de pausa
    longBreakTime: 15,   // 15 minutos de pausa longa
    workSessions: 4      // 4 sessões antes da pausa longa
  };

  // Signals privados para controle interno do estado
  private _config = signal<PomodoroConfig>(this.defaultConfig);
  private _currentState = signal<TimerState>(TimerState.IDLE);
  private _remainingTime = signal<number>(this._config().workTime * 60);
  private _currentSession = signal<number>(1);
  private _totalSessions = signal<number>(0);
  private _isRunning = signal<boolean>(false);
  private _audioEnabled = signal<boolean>(false);

  // Computed signals públicos - API read-only para componentes
  public readonly config = computed(() => this._config());
  public readonly currentState = computed(() => this._currentState());
  public readonly remainingTime = computed(() => this._remainingTime());
  public readonly currentSession = computed(() => this._currentSession());
  public readonly totalSessions = computed(() => this._totalSessions());
  public readonly isRunning = computed(() => this._isRunning());
  public readonly audioEnabled = computed(() => this._audioEnabled());
  
  // Computed para formatar tempo em MM:SS
  public readonly formattedTime = computed(() => {
    const time = this._remainingTime();
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  // Computed para calcular progresso (0-100%)
  public readonly progress = computed(() => {
    const current = this._remainingTime();
    const total = this.getTotalTimeForCurrentState();
    return total > 0 ? ((total - current) / total) * 100 : 0;
  });

  // Timer interval privado
  private timerInterval: any = null;
  
  // Timestamp para cálculo preciso (evita problemas com tab inativa)
  private startTime: number = 0;
  private pausedTime: number = 0;
  
  // Áudios temáticos do Pomodoro
  private audio: HTMLAudioElement | null = null;
  private readonly audioFight = 'assets/sounds/mortal-kombat-fight.mp3';  // Início (Mortal Kombat)
  private readonly audioWin = 'assets/sounds/street-fighter-you-win.mp3'; // Final (Street Fighter)

  // Angular v20 - inject() API para serviços
  private readonly dialog = inject(MatDialog);
  private readonly exerciseService = inject(ExerciseService);

  constructor() {
    // Effect - Monitora mudanças de estado para logs
    effect(() => {
      const state = this._currentState();
      const time = this._remainingTime();
      
      console.log(`[PomodoroService] Estado: ${state}, Tempo: ${time}s`);
    });
  }

  // API pública do serviço - Métodos que componentes podem chamar
  
  public updateConfig(config: Partial<PomodoroConfig>): void {
    // Validação de entrada
    if (config.workTime && (config.workTime < 1 || config.workTime > 120)) {
      throw new Error('Tempo de trabalho deve estar entre 1 e 120 minutos');
    }
    if (config.breakTime && (config.breakTime < 1 || config.breakTime > 60)) {
      throw new Error('Tempo de pausa deve estar entre 1 e 60 minutos');
    }
    
    this._config.update(current => ({ ...current, ...config }));
    this.resetTimer();
  }

  public startTimer(): void {
    if (this._currentState() === TimerState.IDLE) {
      this.startWorkSession();
      this.playFightSound();
    } else {
      // Retomar de onde parou
      this.startTime = Date.now();
      this.pausedTime = this._remainingTime();
      this._isRunning.set(true);
      this.runTimer();
    }
  }

  public pauseTimer(): void {
    this._isRunning.set(false);
    this.clearTimer();
  }

  public resetTimer(): void {
    this.clearTimer();
    this._isRunning.set(false);
    this._currentState.set(TimerState.IDLE);
    this._currentSession.set(1);
    this._remainingTime.set(this._config().workTime * 60);
  }

  public skipSession(): void {
    this.clearTimer();
    this.nextSession();
  }

  public getStateDisplayName(): string {
    switch (this.currentState()) {
      case TimerState.WORKING: return 'Trabalhando';
      case TimerState.BREAK: return 'Pausa';
      case TimerState.LONG_BREAK: return 'Pausa Longa';
      case TimerState.PAUSED: return 'Pausado';
      default: return 'Pronto para começar';
    }
  }

  /**
   * Toggle de áudio - Solicita permissão ao ativar
   * Navegadores modernos bloqueiam autoplay até interação do usuário
   * 
   * Estratégia robusta:
   * 1. Toca um áudio de teste real (volume baixo)
   * 2. Aguarda confirmação de que o play() foi bem-sucedido
   * 3. Valida que o navegador permitiu a reprodução
   * 4. Só marca como habilitado após sucesso confirmado
   */
  public async toggleAudio(): Promise<void> {
    const currentState = this._audioEnabled();
    
    if (!currentState) {
      // Ativando áudio - solicitar permissão via reprodução real
      try {
        console.log('[PomodoroService] Solicitando permissão de áudio...');
        
        // Criar áudio de teste com um dos sons do app (volume baixo)
        const testAudio = new Audio(this.audioFight);
        testAudio.volume = 0.1; // Volume baixo para teste
        testAudio.currentTime = 0;
        
        // Tentar reproduzir - isso dispara o pedido de permissão
        const playPromise = testAudio.play();
        
        if (playPromise !== undefined) {
          // Aguardar promessa resolver (garantia que o browser permitiu)
          await playPromise;
          
          // Parar o áudio de teste imediatamente
          testAudio.pause();
          testAudio.currentTime = 0;
          
          // Validar que não houve erro
          if (!testAudio.error) {
            this._audioEnabled.set(true);
            console.log('[PomodoroService] ✅ Áudio habilitado com sucesso!');
            console.log('[PomodoroService] Permissão concedida pelo navegador');
          } else {
            throw new Error('Erro ao reproduzir áudio de teste');
          }
        } else {
          // Fallback para navegadores antigos
          testAudio.pause();
          this._audioEnabled.set(true);
          console.log('[PomodoroService] ✅ Áudio habilitado (navegador legado)');
        }
      } catch (error) {
        console.error('[PomodoroService] ❌ Falha ao habilitar áudio:', error);
        
        // Mensagem específica baseada no erro
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (errorMessage.includes('NotAllowedError') || errorMessage.includes('play')) {
          alert('⚠️ Permissão de áudio negada!\n\nO navegador bloqueou a reprodução de áudio.\n\nPor favor:\n1. Clique no ícone 🔒 na barra de endereços\n2. Permita áudio para este site\n3. Tente novamente');
        } else {
          alert('⚠️ Erro ao ativar áudio:\n' + errorMessage);
        }
        
        // Garantir que permanece desabilitado
        this._audioEnabled.set(false);
      }
    } else {
      // Desativando áudio
      this._audioEnabled.set(false);
      console.log('[PomodoroService] 🔇 Áudio desabilitado');
    }
  }

  // Métodos privados - Lógica interna do serviço
  
  private playSound(audioSrc: string, volume: number): void {
    // Verificar se áudio está habilitado
    if (!this._audioEnabled()) {
      console.log('[PomodoroService] Áudio desabilitado - não tocando som');
      return;
    }
    
    try {
      this.audio?.pause();
      this.audio = new Audio(audioSrc);
      this.audio.currentTime = 0;
      this.audio.volume = volume;
      this.audio.play().catch(err => {
        console.warn('[PomodoroService] Audio bloqueado ou falhou:', err);
      });
    } catch (e) {
      console.error('[PomodoroService] Erro no áudio:', e);
    }
  }
  
  private playFightSound(): void {
    console.log('🎮 Mortal Kombat: FIGHT!');
    this.playSound(this.audioFight, 1.0);
  }
  
  private playWinSound(): void {
    console.log('🎮 Street Fighter: YOU WIN!');
    this.playSound(this.audioWin, 0.7);
  }

  private startWorkSession(): void {
    this._currentState.set(TimerState.WORKING);
    const totalTime = this._config().workTime * 60;
    this._remainingTime.set(totalTime);
    this.startTime = Date.now();
    this.pausedTime = totalTime;
    this._isRunning.set(true);
    this.runTimer();
    
    // 🎮 Mortal Kombat: FIGHT! (início de trabalho)
    this.playFightSound();
  }

  private startBreak(): void {
    const isLongBreak = this._totalSessions() % this._config().workSessions === 0;
    
    let totalTime: number;
    if (isLongBreak) {
      this._currentState.set(TimerState.LONG_BREAK);
      totalTime = this._config().longBreakTime * 60;
    } else {
      this._currentState.set(TimerState.BREAK);
      totalTime = this._config().breakTime * 60;
    }
    
    this._remainingTime.set(totalTime);
    this.startTime = Date.now();
    this.pausedTime = totalTime;
    this._isRunning.set(true);
    this.runTimer();
  }

  private runTimer(): void {
    this.clearTimer();
    
    // Usar timestamp real ao invés de confiar apenas no setInterval
    // Isso evita problemas quando a aba fica inativa/minimizada
    this.timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
      const remaining = Math.max(0, this.pausedTime - elapsed);
      
      this._remainingTime.set(remaining);
      
      if (remaining <= 0) {
        // 🎮 Street Fighter: YOU WIN! (fim da sessão)
        this.playWinSound();
        this.nextSession();
      }
    }, 100); // Verificar a cada 100ms para UI mais responsiva
  }

  private nextSession(): void {
    this.clearTimer();
    
    const currentState = this._currentState();
    
    if (currentState === TimerState.WORKING) {
      // Final de sessão de trabalho - mostrar modal de exercício
      this._totalSessions.update(total => total + 1);
      this._isRunning.set(false);
      this._remainingTime.set(0); // Zera o timer
      
      // Abrir modal com exercício
      this.openExerciseModal();
    } else {
      // Final de pausa - iniciar próxima sessão de trabalho
      this._currentSession.update(session => session + 1);
      this.startWorkSession();
    }
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Abre o modal de exercício ao final de cada sessão de trabalho
   * O modal só fecha quando o usuário clicar em "Feito!"
   * Após fechar, o usuário deve iniciar manualmente a pausa
   */
  private openExerciseModal(): void {
    const exercise = this.exerciseService.getRandomExercise();
    
    const dialogRef = this.dialog.open(ExerciseModalComponent, {
      data: exercise,
      disableClose: true, // Não permite fechar clicando fora ou ESC
      width: '600px',
      maxWidth: '90vw',
      panelClass: 'exercise-modal-panel'
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('[PomodoroService] Exercise completed! User can now start break manually.');
      // Timer permanece zerado e parado - usuário deve iniciar a pausa manualmente
      this.startBreak();
    });

  }

  private getTotalTimeForCurrentState(): number {
    const config = this._config();
    const state = this._currentState();
    
    switch (state) {
      case TimerState.WORKING:
        return config.workTime * 60;
      case TimerState.BREAK:
        return config.breakTime * 60;
      case TimerState.LONG_BREAK:
        return config.longBreakTime * 60;
      default:
        return 0;
    }
  }
}

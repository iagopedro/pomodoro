import { Injectable, signal, computed, effect } from '@angular/core';
import { PomodoroConfig, TimerState, TimerStatus } from '../models/pomodoro.interface';

@Injectable({
  providedIn: 'root'
})
export class Pomodoro {
  
  // Angular Signals v20 - Estado reativo para gerenciamento de estado moderno
  // Signals substituem BehaviorSubject/Observable para estado local simples
  
  // Configuração padrão do Pomodoro
  private readonly defaultConfig: PomodoroConfig = {
    workTime: 25,        // 25 minutos de trabalho
    breakTime: 5,        // 5 minutos de pausa
    longBreakTime: 15,   // 15 minutos de pausa longa
    workSessions: 4      // 4 sessões antes da pausa longa
  };

  // Signals para estado reativo - Nova funcionalidade do Angular v20
  // Signals oferecem melhor performance que Zone.js para change detection
  private _config = signal<PomodoroConfig>(this.defaultConfig);
  private _currentState = signal<TimerState>(TimerState.IDLE);
  private _remainingTime = signal<number>(0);
  private _currentSession = signal<number>(1);
  private _totalSessions = signal<number>(0);
  private _isRunning = signal<boolean>(false);

  // Computed signals - Derivam estado automaticamente quando dependências mudam
  // Computed signals são apenas para leitura e recalculam automaticamente
  public readonly config = computed(() => this._config());
  public readonly currentState = computed(() => this._currentState());
  public readonly remainingTime = computed(() => this._remainingTime());
  public readonly currentSession = computed(() => this._currentSession());
  public readonly totalSessions = computed(() => this._totalSessions());
  public readonly isRunning = computed(() => this._isRunning());
  
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

  // Timer interval
  private timerInterval: any = null;

  constructor() {
    // Effect - Executa quando signals dependentes mudam
    // Effects substituem ngOnChanges para lógica reativa
    effect(() => {
      // Log do estado atual para debug
      console.log('Estado atual:', this._currentState(), 'Tempo restante:', this._remainingTime());
    });
  }

  // Métodos públicos para controle do timer
  public updateConfig(config: Partial<PomodoroConfig>): void {
    // Signals são imutáveis por padrão, use update() para modificar
    this._config.update(current => ({ ...current, ...config }));
    this.resetTimer();
  }

  public startTimer(): void {
    if (this._currentState() === TimerState.IDLE) {
      this.startWorkSession();
    } else {
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
    this._remainingTime.set(0);
  }

  public skipSession(): void {
    this.clearTimer();
    this.nextSession();
  }

  // Métodos privados
  private startWorkSession(): void {
    this._currentState.set(TimerState.WORKING);
    this._remainingTime.set(this._config().workTime * 60);
    this._isRunning.set(true);
    this.runTimer();
  }

  private startBreak(): void {
    const isLongBreak = this._totalSessions() % this._config().workSessions === 0;
    
    if (isLongBreak) {
      this._currentState.set(TimerState.LONG_BREAK);
      this._remainingTime.set(this._config().longBreakTime * 60);
    } else {
      this._currentState.set(TimerState.BREAK);
      this._remainingTime.set(this._config().breakTime * 60);
    }
    
    this._isRunning.set(true);
    this.runTimer();
  }

  private runTimer(): void {
    this.clearTimer();
    
    this.timerInterval = setInterval(() => {
      if (this._remainingTime() > 0) {
        // Usando update() para modificar signal de forma reativa
        this._remainingTime.update(time => time - 1);
      } else {
        this.nextSession();
      }
    }, 1000);
  }

  private nextSession(): void {
    this.clearTimer();
    
    const currentState = this._currentState();
    
    if (currentState === TimerState.WORKING) {
      // Sessão de trabalho completa
      this._totalSessions.update(total => total + 1);
      this.startBreak();
    } else {
      // Pausa completa, próxima sessão de trabalho
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

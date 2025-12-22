import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PomodoroService, TimerState } from '../../services/pomodoro.service';

/**
 * Componente Pomodoro - Angular v20 com Standalone Components
 * 
 * Este componente é responsável apenas pela apresentação (UI).
 * A lógica de negócio fica no PomodoroService.
 * 
 * Conceitos Angular v20 demonstrados:
 * - Standalone Components (sem módulos)
 * - inject() API (nova forma de injeção)
 * - Signals consumidos do serviço
 * - Control Flow (@if/@else)
 * - Separação clara de responsabilidades
 */
@Component({
  selector: 'app-pomodoro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pomodoro.component.html',
  styleUrl: './pomodoro.component.scss'
})
export class PomodoroComponent implements OnDestroy {
  
  // Angular v20 - inject() API para injeção de dependências
  // Substitui a injeção via constructor para melhor tree-shaking
  private readonly pomodoroService = inject(PomodoroService);

  // Signals públicos do serviço (read-only)
  public readonly config = this.pomodoroService.config;
  public readonly currentState = this.pomodoroService.currentState;
  public readonly remainingTime = this.pomodoroService.remainingTime;
  public readonly currentSession = this.pomodoroService.currentSession;
  public readonly totalSessions = this.pomodoroService.totalSessions;
  public readonly isRunning = this.pomodoroService.isRunning;
  public readonly formattedTime = this.pomodoroService.formattedTime;
  public readonly progress = this.pomodoroService.progress;

  // Enum para template
  public readonly TimerState = TimerState;

  // Configurações temporárias para o formulário
  public tempWorkTime = this.config().workTime;
  public tempBreakTime = this.config().breakTime;
  public tempLongBreakTime = this.config().longBreakTime;

  // Controle de visibilidade das configurações
  public readonly showConfig = signal(false);

  title = 'Pomodoro Timer';

  ngOnDestroy(): void {
    // Cleanup é feito pelo serviço (singleton)
    console.log('[PomodoroComponent] Component destroyed');
  }

  // Métodos públicos - Delegam para o serviço
  
  public updateConfig(): void {
    try {
      this.pomodoroService.updateConfig({
        workTime: this.tempWorkTime,
        breakTime: this.tempBreakTime,
        longBreakTime: this.tempLongBreakTime
      });

      this.toggleConfig();
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      alert('Configuração inválida: ' + (error as Error).message);
    }
  }

  public startTimer(): void {
    this.pomodoroService.startTimer();
  }

  public pauseTimer(): void {
    this.pomodoroService.pauseTimer();
  }

  public resetTimer(): void {
    this.pomodoroService.resetTimer();
    // Resetar formulário
    this.tempWorkTime = this.config().workTime;
    this.tempBreakTime = this.config().breakTime;
    this.tempLongBreakTime = this.config().longBreakTime;
  }

  public skipSession(): void {
    this.pomodoroService.skipSession();
  }

  public getStateDisplayName(): string {
    return this.pomodoroService.getStateDisplayName();
  }

  public toggleConfig(): void {
    this.showConfig.set(!this.showConfig());
  }
}

import { Component, inject, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Interfaces simples para o timer
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

@Component({
  selector: 'app-pomodoro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pomodoro.html',
  styleUrl: './pomodoro.scss'
})
export class Pomodoro implements OnDestroy {
  
  // Angular Signals v20 - Estado reativo moderno
  private readonly defaultConfig: PomodoroConfig = {
    workTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    workSessions: 4
  };

  // Signals para estado reativo
  private _config = signal<PomodoroConfig>(this.defaultConfig);
  private _currentState = signal<TimerState>(TimerState.IDLE);
  private _remainingTime = signal<number>(0);
  private _currentSession = signal<number>(1);
  private _totalSessions = signal<number>(0);
  private _isRunning = signal<boolean>(false);

  // Computed signals - recalculam automaticamente
  public readonly config = computed(() => this._config());
  public readonly currentState = computed(() => this._currentState());
  public readonly remainingTime = computed(() => this._remainingTime());
  public readonly currentSession = computed(() => this._currentSession());
  public readonly totalSessions = computed(() => this._totalSessions());
  public readonly isRunning = computed(() => this._isRunning());
  
  public readonly formattedTime = computed(() => {
    const time = this._remainingTime();
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  public readonly progress = computed(() => {
    const current = this._remainingTime();
    const total = this.getTotalTimeForCurrentState();
    return total > 0 ? ((total - current) / total) * 100 : 0;
  });

  // Enum para template
  public readonly TimerState = TimerState;

  // Configurações temporárias
  public tempWorkTime = this.config().workTime;
  public tempBreakTime = this.config().breakTime;
  public tempLongBreakTime = this.config().longBreakTime;

  private timerInterval: any = null;

  private audio: HTMLAudioElement | null = null;

  constructor() {
    // Effect - executa quando signals mudam
    effect(() => {
      console.log('Estado:', this._currentState(), 'Tempo:', this._remainingTime());
    });
  }

  ngOnDestroy(): void {
    this.resetTimer();
  }

  // Métodos públicos
  public updateConfig(): void {
    this._config.update(current => ({
      ...current,
      workTime: this.tempWorkTime,
      breakTime: this.tempBreakTime,
      longBreakTime: this.tempLongBreakTime
    }));
    this.resetTimer();
  }

  public startTimer(): void {
    if (this._currentState() === TimerState.IDLE) {
      this.startWorkSession();
      this.audio = new Audio('../../assets/sounds/final-round-fight_G_minor.wav');
      this.audio.load();
      this.audio.play();
    } else {
      this._isRunning.set(true);
      this.runTimer();
      this.audio = new Audio('../../assets/sounds/final-round-fight_G_minor.wav');
      this.audio.load();
      this.audio.play();
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

  public getStateDisplayName(): string {
    switch (this.currentState()) {
      case TimerState.WORKING: return 'Trabalhando';
      case TimerState.BREAK: return 'Pausa';
      case TimerState.LONG_BREAK: return 'Pausa Longa';
      case TimerState.PAUSED: return 'Pausado';
      default: return 'Pronto para começar';
    }
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
      this._totalSessions.update(total => total + 1);
      this.startBreak();
    } else {
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
      case TimerState.WORKING: return config.workTime * 60;
      case TimerState.BREAK: return config.breakTime * 60;
      case TimerState.LONG_BREAK: return config.longBreakTime * 60;
      default: return 0;
    }
  }
}

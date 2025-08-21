// Interface para definir os tipos de configuração do Pomodoro
// Angular v20 incentiva o uso de TypeScript para type safety
export interface PomodoroConfig {
  workTime: number;    // Tempo de trabalho em minutos
  breakTime: number;   // Tempo de pausa em minutos
  longBreakTime: number; // Tempo de pausa longa em minutos
  workSessions: number; // Número de sessões antes da pausa longa
}

// Estados possíveis do timer
export enum TimerState {
  IDLE = 'idle',
  WORKING = 'working',
  BREAK = 'break',
  LONG_BREAK = 'long_break',
  PAUSED = 'paused'
}

// Interface para o estado atual do timer
export interface TimerStatus {
  state: TimerState;
  remainingTime: number; // Tempo restante em segundos
  currentSession: number; // Sessão atual
  totalSessions: number; // Total de sessões completadas
}

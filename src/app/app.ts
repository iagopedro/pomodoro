import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Pomodoro as PomodoroComponent } from './pomodoro/pomodoro';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    PomodoroComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'Pomodoro Timer';
}

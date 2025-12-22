import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PomodoroComponent } from './components/pomodoro/pomodoro.component';

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
export class App { }

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PomodoroComponent } from './components/pomodoro/pomodoro.component';

/**
 * Componente Raiz - Angular v20 Standalone
 * 
 * Componente principal da aplicação sem NgModule.
 * Importa diretamente suas dependências (RouterOutlet, PomodoroComponent).
 */
@Component({
  selector: 'app-root',
  standalone: true, // Standalone Component - não precisa de NgModule
  imports: [
    RouterOutlet, 
    PomodoroComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App { }

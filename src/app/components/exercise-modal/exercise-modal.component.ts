import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Exercise } from '../../models/exercise.interface';

/**
 * Componente Modal de Exercício - Angular v20 Standalone
 * 
 * Exibe exercício de mobilidade ao final de cada sessão.
 * Timer fica parado até o usuário clicar em "Feito!".
 */
@Component({
  selector: 'app-exercise-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './exercise-modal.component.html',
  styleUrl: './exercise-modal.component.scss'
})
export class ExerciseModalComponent {
  // inject() API - Nova forma de injeção de dependências do Angular v20
  public readonly dialogRef = inject(MatDialogRef<ExerciseModalComponent>);
  
  // MAT_DIALOG_DATA - Token de injeção do Angular Material para dados do dialog
  public readonly exercise: Exercise = inject(MAT_DIALOG_DATA);

  public onDone(): void {
    this.dialogRef.close();
  }
}

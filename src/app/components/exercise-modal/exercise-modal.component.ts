import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Exercise } from '../../models/exercise.interface';

/**
 * Componente Modal de Exercício - Angular v20
 * 
 * Modal que exibe um exercício de mobilidade ao final de cada sessão de trabalho.
 * O usuário deve executar o exercício e clicar em "Feito!" para fechar.
 * 
 * O timer fica parado e zerado enquanto o modal está aberto.
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
  // Angular v20 - inject() API
  public readonly dialogRef = inject(MatDialogRef<ExerciseModalComponent>);
  public readonly exercise: Exercise = inject(MAT_DIALOG_DATA);

  /**
   * Fecha o modal quando o usuário clica em "Feito!"
   */
  public onDone(): void {
    this.dialogRef.close();
  }
}

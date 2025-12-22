import { Injectable, signal } from '@angular/core';
import { Exercise } from '../models/exercise.interface';

/**
 * Serviço de Exercícios - Gerencia lista de exercícios de mobilidade
 * 
 * Responsabilidades:
 * - Armazenar lista de 20 exercícios
 * - Selecionar exercícios aleatórios sem repetição
 * - Resetar lista quando todos forem utilizados
 * 
 * Usa Angular Signals para gerenciamento reativo do estado
 */
@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  
  // Lista completa de exercícios de mobilidade (1 minuto cada)
  private readonly allExercises: Exercise[] = [
    {
      id: 1,
      name: 'Rotação de Pescoço',
      instructions: 'Sente-se com a coluna reta. Gire a cabeça lentamente para a direita até sentir um leve alongamento. Volte ao centro e repita para o lado esquerdo. Faça 10 repetições de cada lado.',
      duration: 60
    },
    {
      id: 2,
      name: 'Alongamento de Ombros',
      instructions: 'Em pé ou sentado, cruze o braço direito na frente do corpo. Use a mão esquerda para puxar suavemente o cotovelo direito em direção ao peito. Segure por 15 segundos e troque de lado. Repita 2x.',
      duration: 60
    },
    {
      id: 3,
      name: 'Rotação de Punhos',
      instructions: 'Estenda os braços à frente. Faça círculos com os punhos, 10 vezes para cada direção (horário e anti-horário). Ajuda a prevenir tendinite e LER.',
      duration: 60
    },
    {
      id: 4,
      name: 'Alongamento de Dedos',
      instructions: 'Abra e feche as mãos completamente 10 vezes. Depois, estenda cada dedo individualmente, segurando por 3 segundos. Alivia tensão das mãos após digitação.',
      duration: 60
    },
    {
      id: 5,
      name: 'Elevação de Ombros',
      instructions: 'Sente-se com postura ereta. Eleve os ombros em direção às orelhas, segure por 5 segundos e relaxe completamente. Repita 8 vezes. Reduz tensão no trapézio.',
      duration: 60
    },
    {
      id: 6,
      name: 'Rotação de Tronco',
      instructions: 'Sentado na cadeira, mantenha os pés no chão. Gire o tronco para a direita, segurando no encosto da cadeira. Segure 10 segundos e repita para o outro lado. 3x cada.',
      duration: 60
    },
    {
      id: 7,
      name: 'Alongamento Lateral',
      instructions: 'Em pé, entrelaçe os dedos e estenda os braços acima da cabeça. Incline-se lentamente para a direita, segure 15 segundos. Volte ao centro e repita para a esquerda. 2x cada.',
      duration: 60
    },
    {
      id: 8,
      name: 'Flexão de Punho',
      instructions: 'Estenda o braço direito à frente com a palma para cima. Use a mão esquerda para puxar suavemente os dedos para baixo. Segure 15 segundos. Repita com outro braço. 2x cada.',
      duration: 60
    },
    {
      id: 9,
      name: 'Círculos de Ombros',
      instructions: 'Em pé ou sentado, faça círculos completos com os ombros. 10 vezes para frente e 10 para trás. Movimento suave e controlado. Melhora mobilidade escapular.',
      duration: 60
    },
    {
      id: 10,
      name: 'Alongamento de Lombar',
      instructions: 'Sentado, incline o corpo para frente lentamente, deixando os braços relaxados em direção ao chão. Segure por 20 segundos. Volte devagar. Repita 3 vezes.',
      duration: 60
    },
    {
      id: 11,
      name: 'Extensão de Coluna',
      instructions: 'Sentado, coloque as mãos atrás da cabeça. Arqueie suavemente a coluna para trás, olhando para o teto. Segure 10 segundos. Retorne. Repita 4 vezes. Contraria postura curvada.',
      duration: 60
    },
    {
      id: 12,
      name: 'Rotação de Tornozelos',
      instructions: 'Sentado, levante um pé do chão. Faça círculos com o tornozelo, 10 vezes em cada direção. Repita com o outro pé. Melhora circulação das pernas.',
      duration: 60
    },
    {
      id: 13,
      name: 'Alongamento de Quadríceps',
      instructions: 'Em pé (apoie-se se necessário), dobre o joelho direito trazendo o pé em direção ao glúteo. Segure o pé com a mão. Mantenha 20 segundos. Troque de perna. 2x cada.',
      duration: 60
    },
    {
      id: 14,
      name: 'Flexão de Pescoço',
      instructions: 'Sentado com postura reta, incline a cabeça para frente aproximando o queixo do peito. Segure 10 segundos. Volte. Depois incline para trás suavemente. Repita 3x.',
      duration: 60
    },
    {
      id: 15,
      name: 'Alongamento de Peitoral',
      instructions: 'Em pé, entrelaçe as mãos atrás das costas. Estenda os braços e levante suavemente, abrindo o peito. Segure 20 segundos. Relaxe. Repita 3 vezes. Corrige postura.',
      duration: 60
    },
    {
      id: 16,
      name: 'Elevação de Pernas',
      instructions: 'Sentado, estenda uma perna à frente mantendo-a reta e paralela ao chão. Segure 10 segundos. Abaixe. Repita com a outra perna. 5x cada lado. Fortalece quadríceps.',
      duration: 60
    },
    {
      id: 17,
      name: 'Rotação de Quadril',
      instructions: 'Em pé, coloque as mãos na cintura. Faça círculos amplos com o quadril, 10 vezes para cada direção. Mantenha os pés fixos. Mobiliza articulação do quadril.',
      duration: 60
    },
    {
      id: 18,
      name: 'Alongamento de Antebraço',
      instructions: 'Estenda o braço direito com palma para baixo. Use a mão esquerda para puxar os dedos para cima e para trás. Segure 15 segundos. Troque. 2x cada braço.',
      duration: 60
    },
    {
      id: 19,
      name: 'Respiração Profunda com Alongamento',
      instructions: 'Sentado com postura ereta, inspire profundamente pelo nariz enquanto eleva os braços lateralmente. No topo, segure 3 segundos. Expire pela boca abaixando os braços. Repita 8 vezes.',
      duration: 60
    },
    {
      id: 20,
      name: 'Mobilidade de Coluna (Gato-Vaca adaptado)',
      instructions: 'Sentado na beirada da cadeira, inspire arqueando suavemente a coluna para trás (olhando para cima). Expire curvando a coluna para frente (queixo ao peito). Repita 8 vezes lentamente.',
      duration: 60
    }
  ];

  // Signal para rastrear exercícios já utilizados
  private _usedExerciseIds = signal<Set<number>>(new Set());

  // Signal computed para exercícios disponíveis
  private _availableExercises = signal<Exercise[]>(this.allExercises);

  constructor() {
    console.log('[ExerciseService] Initialized with', this.allExercises.length, 'exercises');
  }

  /**
   * Retorna um exercício aleatório que ainda não foi utilizado
   * Quando todos forem usados, reseta a lista
   */
  public getRandomExercise(): Exercise {
    const usedIds = this._usedExerciseIds();
    
    // Se todos os exercícios foram usados, resetar
    if (usedIds.size >= this.allExercises.length) {
      console.log('[ExerciseService] All exercises used, resetting...');
      this._usedExerciseIds.set(new Set());
    }

    // Filtrar exercícios disponíveis
    const available = this.allExercises.filter(ex => !this._usedExerciseIds().has(ex.id));
    
    // Selecionar aleatório dos disponíveis
    const randomIndex = Math.floor(Math.random() * available.length);
    const selectedExercise = available[randomIndex];

    // Marcar como usado
    this._usedExerciseIds.update(used => {
      const newSet = new Set(used);
      newSet.add(selectedExercise.id);
      return newSet;
    });

    console.log('[ExerciseService] Selected exercise:', selectedExercise.name);
    console.log('[ExerciseService] Used exercises:', this._usedExerciseIds().size, '/', this.allExercises.length);

    return selectedExercise;
  }

  /**
   * Reseta a lista de exercícios utilizados (útil para testes ou reset manual)
   */
  public resetUsedExercises(): void {
    this._usedExerciseIds.set(new Set());
    console.log('[ExerciseService] Exercise history reset');
  }

  /**
   * Retorna quantos exercícios já foram utilizados
   */
  public getUsedCount(): number {
    return this._usedExerciseIds().size;
  }
}

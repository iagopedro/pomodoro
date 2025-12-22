/**
 * Interface para definir estrutura de um exercício de mobilidade
 * 
 * Cada exercício deve ter:
 * - id: identificador único
 * - name: nome do exercício
 * - instructions: instruções detalhadas de como executar
 * - duration: duração aproximada (sempre 1 minuto)
 */
export interface Exercise {
  id: number;
  name: string;
  instructions: string;
  duration: number; // em segundos
}

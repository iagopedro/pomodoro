# 🧪 Guia Rápido de Teste - Modal de Exercícios

## Como Testar a Nova Funcionalidade

### Método 1: Teste Rápido (Recomendado)

1. **Acesse**: http://localhost:4200

2. **Configure tempo curto**:
   - Clique no botão de engrenagem ⚙️ (configurações)
   - Altere "Tempo de Trabalho" para **1 minuto**
   - Clique em "Atualizar"

3. **Inicie o timer**:
   - Clique no botão "Iniciar" (Play)
   - Aguarde 1 minuto

4. **Observe o fluxo**:
   - ✅ Você ouvirá o som "YOU WIN!" do Street Fighter
   - ✅ O modal de exercício abrirá automaticamente
   - ✅ O timer ficará zerado: `00:00`
   - ✅ Um exercício aleatório será exibido

5. **Leia o exercício**:
   - Nome do exercício
   - Duração (60 segundos)
   - Instruções detalhadas
   - Dica de segurança

6. **Execute o exercício** (ou simule)

7. **Clique em "Feito!"**:
   - Modal fecha
   - Timer continua em `00:00`
   - Estado: "Pronto para começar"

8. **Inicie a pausa manualmente**:
   - Clique novamente em "Iniciar"
   - A pausa (5 min) começará

### Método 2: Teste de Não-Repetição

Execute o teste rápido **múltiplas vezes** e observe que:
- ✅ Cada modal mostra um **exercício diferente**
- ✅ Após 20 sessões, os exercícios começam a se repetir (lista resetada)

### Checklist de Validação

- [ ] Modal abre automaticamente ao fim do trabalho
- [ ] Timer fica zerado enquanto modal está aberto
- [ ] Não é possível fechar o modal com ESC
- [ ] Não é possível fechar clicando fora do modal
- [ ] Botão "Feito!" fecha o modal
- [ ] Timer não inicia automaticamente após fechar modal
- [ ] Exercícios não se repetem consecutivamente
- [ ] Design está consistente com o tema dark mode
- [ ] Layout é responsivo no mobile

## 🐛 Troubleshooting

### Modal não abre?
- Verifique o console do navegador (F12) para erros
- Certifique-se que o servidor recarregou após as mudanças

### Timer não para?
- Limpe o cache do navegador (Ctrl + Shift + R)

### Exercícios se repetem imediatamente?
- Isso não deve acontecer! Verifique os logs no console

## 📊 Logs Úteis no Console

Abra o DevTools (F12) e veja os logs:

```
[ExerciseService] Initialized with 20 exercises
[PomodoroService] Estado: working, Tempo: 60s
...
🎮 Street Fighter: YOU WIN!
[ExerciseService] Selected exercise: Rotação de Pescoço
[ExerciseService] Used exercises: 1 / 20
[PomodoroService] Exercise completed! User can now start break manually.
```

---

**Aproveite a funcionalidade! 🎉🏋️‍♂️**

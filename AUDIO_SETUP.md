# Instruções para Adicionar Áudios

## 🎮 Áudios Necessários:

Para completar a implementação, você precisa adicionar os seguintes arquivos de áudio em `src/assets/sounds/`:

### 1️⃣ Mortal Kombat - "FIGHT!" 
**Arquivo:** `mortal-kombat-fight.mp3`
**Quando toca:** Ao iniciar qualquer sessão (trabalho ou pausa)

### 2️⃣ Street Fighter - "You Win!"
**Arquivo:** `street-fighter-you-win.mp3`
**Quando toca:** Ao completar uma sessão (trabalho ou pausa)

## 📂 Estrutura de Pastas:

```
src/
  assets/
    sounds/
      mortal-kombat-fight.mp3    ← Adicione este arquivo
      street-fighter-you-win.mp3 ← Adicione este arquivo
```

## ✅ Verificação:

Após adicionar os arquivos, verifique:
1. ✅ Arquivos estão em `src/assets/sounds/`
2. ✅ Nomes dos arquivos estão corretos (case-sensitive)
3. ✅ Formato é MP3
4. ✅ Tamanho do arquivo é razoável (< 500KB cada)

## 🚀 Testando:

1. Execute `ng serve`
2. Inicie o timer - deve tocar "FIGHT!"
3. Aguarde o timer completar - deve tocar "YOU WIN!"
4. Verifique o console para logs de áudio

## 🎨 Personalização:

Você pode alterar os caminhos dos arquivos editando:
```typescript
// src/app/services/pomodoro.service.ts (linhas ~80-81)
private readonly audioFight = 'assets/sounds/mortal-kombat-fight.mp3';
private readonly audioWin = 'assets/sounds/street-fighter-you-win.mp3';
```

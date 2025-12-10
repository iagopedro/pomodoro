# 🍅 Pomodoro Timer - Angular v20

Aplicação de Pomodoro Timer moderna desenvolvida com Angular v20, utilizando os mais recentes recursos da framework.

## ✨ Funcionalidades

- ⏱️ **Timer Pomodoro Completo**: 25min trabalho, 5min pausa, 15min pausa longa
- 🎮 **Áudios Temáticos**: Sons do Mortal Kombat ("FIGHT!") e Street Fighter ("YOU WIN!")
- 🎨 **Interface Moderna**: Design responsivo com Material Design 3 (Dark Mode)
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile
- 🔔 **Notificações Sonoras**: Sons distintos para início e fim de sessões
- ⚡ **Performance Otimizada**: Timer preciso mesmo com aba minimizada/inativa

## 🚀 Tecnologias Angular v20

Este projeto demonstra os conceitos mais modernos do Angular:

- ✅ **Standalone Components**: Sem módulos, arquitetura simplificada
- ✅ **Signals**: Gerenciamento de estado reativo e performático
- ✅ **inject() API**: Nova forma de injeção de dependências
- ✅ **Control Flow**: Sintaxe @if/@else no template
- ✅ **Computed Signals**: Valores derivados automaticamente
- ✅ **Effects**: Reações a mudanças de estado
- ✅ **Tree-Shaking Otimizado**: Bundle menor e mais eficiente

## 🎮 Sistema de Áudios

A aplicação usa sons icônicos de jogos de luta:

- **Início de Sessão**: "FIGHT!" do Mortal Kombat 🥊
- **Fim de Sessão**: "YOU WIN!" do Street Fighter 🏆

### Configurar Áudios

Baixe os arquivos de áudio e coloque em `src/assets/sounds/`:
- `mortal-kombat-fight.mp3`
- `street-fighter-you-win.mp3`

Consulte `AUDIO_SETUP.md` para instruções detalhadas sobre onde encontrar os áudios.

## 🛠️ Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

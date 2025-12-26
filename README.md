# 🍅 Pomodoro Timer - Angular v20

Uma aplicação completa de Pomodoro Timer desenvolvida com **Angular v20** e **Angular Material**, demonstrando os recursos mais modernos do framework e oferecendo uma experiência produtiva para gerenciamento de tempo.

## ✨ Funcionalidades

### ⏱️ Timer Pomodoro Completo
- **Trabalho**: 25 minutos (configurável)
- **Pausa Curta**: 5 minutos (configurável)
- **Pausa Longa**: 15 minutos (configurável)
- **Sessões**: 4 sessões de trabalho antes da pausa longa
- **Timer Preciso**: Funciona corretamente mesmo com aba minimizada/inativa

### 🔔 Sistema de Notificações Multi-Camadas
- **Notificações do Browser**: Alertas nativos do sistema operacional
- **Snackbar Visual**: Alertas in-app que sempre funcionam
- **Piscar Título da Aba**: Notificação quando aba está inativa
- **Suporte Corporativo**: Funciona mesmo com restrições de permissões

### 🎮 Áudios Temáticos
- **Início de Sessão**: "FIGHT!" do Mortal Kombat 🥊
- **Fim de Sessão**: "YOU WIN!" do Street Fighter 🏆
- **Toggle Manual**: Ative/desative conforme preferência

### 🧘 Modal de Exercícios
- Exercícios físicos ao final de cada sessão de trabalho
- Previne problemas de postura e fadiga
- Variedade de exercícios de alongamento

### 🎨 Interface Moderna
- Design responsivo com Material Design 3
- Tema escuro elegante com cor vermelha
- Compatível com desktop e mobile
- Animações suaves e feedback visual

## 🚀 Tecnologias e Conceitos Angular v20

Este projeto demonstra os recursos mais modernos do Angular:

### Core Features
- ✅ **Standalone Components**: Arquitetura simplificada sem módulos
- ✅ **Signals**: Gerenciamento de estado reativo e performático
- ✅ **Computed Signals**: Valores derivados automaticamente
- ✅ **Effects**: Reações a mudanças de estado
- ✅ **inject() API**: Nova forma funcional de injeção de dependências
- ✅ **Control Flow**: Sintaxe `@if/@else/@for` no template

### Bibliotecas
- Angular v20
- Angular Material v20 (Material Design 3)
- TypeScript 5.x
- SCSS para estilos customizados

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos

1. **Clone o repositório** (se aplicável)
```bash
git clone [url-do-repositorio]
cd pomodoro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure os áudios** (opcional)
   - Baixe os arquivos MP3 (veja `docs/AUDIO_SETUP.md`)
   - Coloque em `src/assets/sounds/`:
     - `mortal-kombat-fight.mp3`
     - `street-fighter-you-win.mp3`

4. **Execute a aplicação**
```bash
npm start
# ou
ng serve
```

5. **Acesse no navegador**
```
http://localhost:4200
```

##  Estrutura do Projeto

```
pomodoro/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── pomodoro/              # Componente principal do timer
│   │   │   └── exercise-modal/        # Modal de exercícios
│   │   ├── models/
│   │   │   ├── pomodoro.interface.ts  # Interfaces do Pomodoro
│   │   │   └── exercise.interface.ts  # Interfaces de exercícios
│   │   ├── services/
│   │   │   ├── pomodoro.service.ts    # Lógica de negócio do timer
│   │   │   └── exercise.service.ts    # Gerenciamento de exercícios
│   │   ├── app.ts                     # Componente raiz
│   │   ├── app.config.ts              # Configuração da aplicação
│   │   └── app.routes.ts              # Rotas
│   ├── assets/
│   │   └── sounds/                    # Arquivos de áudio
│   ├── styles.scss                    # Estilos globais + Material theme
│   └── main.ts                        # Bootstrap da aplicação
├── docs/                              # Documentação adicional
│   ├── AUDIO_SETUP.md
│   ├── EXERCISE_FEATURE.md
│   ├── NOTIFICATIONS_GUIDE.md
│   ├── CORPORATE_ENVIRONMENT.md
│   ├── TROUBLESHOOTING_NOTIFICATIONS.md
│   └── TEST_GUIDE.md
└── README.md
```

## ⚙️ Configuração Padrão

| Configuração | Valor Padrão | Personalizável |
|--------------|--------------|----------------|
| Tempo de Trabalho | 25 minutos | ✅ 1-120 min |
| Pausa Curta | 5 minutos | ✅ 1-60 min |
| Pausa Longa | 15 minutos | ✅ 1-60 min |
| Sessões para Pausa Longa | 4 sessões | ✅ |

Todas as configurações podem ser ajustadas através da interface.

## 🎨 Personalização do Tema

O projeto utiliza **Material Design 3** com tema escuro e cor principal vermelha:

```scss
@use '@angular/material' as mat;

html {
  @include mat.theme((
    color: (
      theme-type: dark,
      primary: mat.$red-palette,
      tertiary: mat.$red-palette,
    ),
    typography: Roboto,
    density: 0,
  ));
}
```

Para mudar a cor principal, edite `src/styles.scss` e altere `mat.$red-palette` para outra paleta (ex: `mat.$blue-palette`, `mat.$green-palette`).

## 🔔 Sistema de Notificações

O app implementa notificações em múltiplas camadas para garantir que você seja alertado independente do ambiente:

### Notificações do Browser
- Alertas nativos do sistema operacional
- Requer permissão do usuário
- Funciona mesmo com aba inativa

### Snackbar In-App
- Alertas visuais no topo da tela
- **Sempre funciona** - não requer permissões
- Ideal para ambientes corporativos com restrições

### Piscar Título da Aba
- O título da aba pisca quando você está em outra aba
- Para automaticamente ao voltar
- Não requer permissões

**Ambientes Corporativos:** Consulte `docs/CORPORATE_ENVIRONMENT.md` para detalhes sobre como o sistema funciona com políticas de segurança restritivas.

## 🧪 Testes

### Testes Unitários
Execute os testes unitários com Karma:

```bash
npm test
# ou
ng test
```

### Build de Produção
```bash
npm run build
# ou
ng build
```

Os artefatos serão gerados em `dist/`.

## 📚 Documentação Adicional

Consulte a pasta `docs/` para documentação detalhada:

- **[AUDIO_SETUP.md](docs/AUDIO_SETUP.md)** - Como configurar os áudios temáticos
- **[EXERCISE_FEATURE.md](docs/EXERCISE_FEATURE.md)** - Detalhes sobre o sistema de exercícios
- **[NOTIFICATIONS_GUIDE.md](docs/NOTIFICATIONS_GUIDE.md)** - Guia completo da Notification API
- **[CORPORATE_ENVIRONMENT.md](docs/CORPORATE_ENVIRONMENT.md)** - Suporte para ambientes corporativos
- **[TROUBLESHOOTING_NOTIFICATIONS.md](docs/TROUBLESHOOTING_NOTIFICATIONS.md)** - Solução de problemas
- **[TEST_GUIDE.md](docs/TEST_GUIDE.md)** - Guia de testes

## 🔧 Scripts Disponíveis

```bash
npm start          # Inicia servidor de desenvolvimento
npm test           # Executa testes unitários
npm run build      # Build de produção
npm run watch      # Build em modo watch
```

## 🌐 Navegadores Suportados

- ✅ Chrome/Edge 120+
- ✅ Firefox 121+
- ✅ Safari 16.4+
- ✅ Opera 105+

## 🤝 Contribuição

Sinta-se livre para:

- 🔍 Explorar o código
- 🎨 Customizar conforme suas necessidades
- 🐛 Reportar bugs ou sugestões
- 🔧 Contribuir com melhorias

## 📝 Licença

Este projeto é open source e está disponível para uso educacional.

## 🙏 Agradecimentos

- Angular Team pelos excelentes recursos do v20
- Material Design Team pelo sistema de design
- Comunidade open source

---

**Desenvolvido com ❤️ usando Angular v20**

Para dúvidas ou sugestões, consulte a documentação adicional em `docs/`.


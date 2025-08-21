# 🍅 Pomodoro Timer - Angular v20

Uma aplicação de Pomodoro Timer desenvolvida com **Angular v20** e **Angular Material**, demonstrando os novos conceitos e funcionalidades da versão mais recente do framework.

## 📋 Funcionalidades

- ⏱️ Timer personalizável para trabalho e pausas
- 🔄 Ciclos automáticos entre trabalho e descanso
- 🎨 Interface moderna com Angular Material em modo escuro
- 📱 Design responsivo para desktop e mobile
- ⚡ Performance otimizada com Angular Signals
- 🎯 Controles intuitivos (play, pause, reset, skip)

## 🚀 Tecnologias Utilizadas

### Angular v20 - Novos Conceitos
- **Standalone Components**: Componentes independentes sem necessidade de módulos
- **Angular Signals**: Sistema reativo moderno para gerenciamento de estado
- **inject()**: Nova API para injeção de dependências
- **Control Flow**: Novo syntax `@if`, `@for` substituindo structural directives
- **Material Design 3**: Tema escuro com sistema de cores atualizado

### Bibliotecas
- Angular v20
- Angular Material v20
- TypeScript
- SCSS

## 🛠️ Instalação e Execução

1. **Clone o repositório** (se aplicável)
```bash
git clone [url-do-repositorio]
cd pomodoro
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute a aplicação**
```bash
ng serve
```

4. **Acesse no navegador**
```
http://localhost:4200
```

## 📖 Aprendendo Angular v20

### 🔄 Angular Signals
Os **Signals** são uma nova forma reativa de gerenciar estado no Angular v20:

```typescript
// Signal básico
private _remainingTime = signal<number>(0);

// Computed signal - recalcula automaticamente
public readonly formattedTime = computed(() => {
  const time = this._remainingTime();
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Effect - executa quando signals dependentes mudam
effect(() => {
  console.log('Tempo atual:', this._remainingTime());
});
```

### 🏗️ Standalone Components
Componentes independentes que não precisam de módulos:

```typescript
@Component({
  selector: 'app-pomodoro',
  standalone: true, // Componente standalone
  imports: [CommonModule, FormsModule, MatCardModule], // Imports diretos
  templateUrl: './pomodoro.html',
  styleUrls: ['./pomodoro.scss']
})
export class PomodoroComponent { }
```

### 💉 inject() API
Nova forma funcional de injeção de dependências:

```typescript
export class PomodoroComponent {
  // Novo padrão - mais funcional
  private pomodoroService = inject(PomodoroService);
  
  // Ao invés do constructor tradicional:
  // constructor(private pomodoroService: PomodoroService) { }
}
```

### 🔀 Control Flow
Novo sistema de controle de fluxo no template:

```html
<!-- Novo @if syntax -->
@if (isRunning()) {
  <button mat-fab (click)="pauseTimer()">
    <mat-icon>pause</mat-icon>
  </button>
} @else {
  <button mat-fab (click)="startTimer()">
    <mat-icon>play_arrow</mat-icon>
  </button>
}

<!-- Ao invés de *ngIf tradicional -->
```

## 🎨 Personalização do Tema

O projeto utiliza **Material Design 3** com tema escuro e cor principal vermelha:

```scss
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

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── models/
│   │   └── pomodoro.interface.ts    # Interfaces TypeScript
│   ├── services/
│   │   └── pomodoro.ts              # Service com Signals
│   ├── pomodoro/
│   │   ├── pomodoro.ts              # Componente principal
│   │   ├── pomodoro.html            # Template
│   │   └── pomodoro.scss            # Estilos
│   ├── app.ts                       # App component
│   └── main.ts                      # Bootstrap da aplicação
└── styles.scss                     # Estilos globais + Material theme
```

## ⚙️ Configuração do Pomodoro

Por padrão, a aplicação vem configurada com:
- **Trabalho**: 25 minutos
- **Pausa curta**: 5 minutos
- **Pausa longa**: 15 minutos
- **Sessões para pausa longa**: 4

Todas as configurações podem ser ajustadas na interface.

## 🔍 Conceitos Aprendidos

### Performance
- **Signals** oferecem melhor performance que observables para estado local
- **Change Detection** otimizada com computed signals
- **Lazy Loading** com standalone components

### Arquitetura
- **Separation of Concerns** com services dedicados
- **Reactive Programming** com signals
- **Type Safety** com TypeScript interfaces

### UI/UX
- **Material Design 3** com tema escuro
- **Responsive Design** para múltiplos dispositivos
- **Accessibility** com ARIA labels

## 📚 Recursos Adicionais

- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Standalone Components](https://angular.dev/guide/standalone-components)
- [Angular Material](https://material.angular.io/)
- [Material Design 3](https://m3.material.io/)

## 🤝 Contribuição

Este projeto foi criado para fins educacionais. Sinta-se livre para explorar, modificar e aprender com o código!

---

**Desenvolvido com ❤️ usando Angular v20**

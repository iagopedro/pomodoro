# 📢 Guia de Notificações Web - Para Desenvolvedores

## 🎯 O que são Web Notifications?

As **Web Notifications API** permitem que aplicações web enviem notificações ao usuário fora do contexto da página, mesmo quando a aba não está ativa. Elas aparecem como notificações nativas do sistema operacional.

---

## 🏗️ Arquitetura das Notificações

### 1. **Verificação de Suporte**

```typescript
if (!('Notification' in window)) {
  console.warn('Browser não suporta notificações');
  return;
}
```

**Por que verificar?**
- Nem todos os browsers suportam Notification API (ex: IE11)
- Safari mobile tem suporte limitado
- Contextos inseguros (HTTP sem S) podem bloquear

---

### 2. **Estados de Permissão**

A propriedade `Notification.permission` retorna um dos 3 estados:

| Estado | Descrição | Ação Necessária |
|--------|-----------|-----------------|
| `"default"` | Usuário nunca foi perguntado | Solicitar permissão |
| `"granted"` | Permissão concedida ✅ | Pode enviar notificações |
| `"denied"` | Permissão negada ❌ | Usuário deve mudar nas configs |

```typescript
// Verificar estado atual
const permission = Notification.permission;

if (permission === 'granted') {
  // Pode enviar notificações
} else if (permission === 'denied') {
  // Bloqueado - usuário deve mudar manualmente
} else {
  // Estado "default" - solicitar permissão
}
```

---

### 3. **Solicitando Permissão**

```typescript
const permission = await Notification.requestPermission();

if (permission === 'granted') {
  console.log('Permissão concedida!');
} else {
  console.log('Permissão negada');
}
```

**⚠️ IMPORTANTE - Timing da Solicitação:**

Browsers modernos **bloqueiam solicitações automáticas**. A permissão DEVE ser solicitada em resposta a uma **interação do usuário** (clique, tecla, etc).

**❌ NÃO FUNCIONA:**
```typescript
// Solicitar ao carregar a página
window.onload = () => {
  Notification.requestPermission(); // BLOQUEADO!
};
```

**✅ FUNCIONA:**
```typescript
// Solicitar ao clicar em um botão
button.onclick = () => {
  Notification.requestPermission(); // OK!
};
```

**Nossa Implementação no Pomodoro:**
```typescript
public startTimer(): void {
  if (this._currentState() === TimerState.IDLE) {
    // Primeira execução - usuário clicou em "Play"
    this.requestNotificationPermission(); // ✅ Contexto de interação!
    
    this.startWorkSession();
  }
}
```

---

### 4. **Criando Notificações**

#### **Sintaxe Básica:**

```typescript
const notification = new Notification('Título', {
  body: 'Corpo da mensagem',
  icon: '/icon.png'
});
```

#### **Opções Completas:**

```typescript
const notification = new Notification('🎯 Pomodoro', {
  // Texto
  body: 'Sessão de trabalho concluída!',
  
  // Visuais
  icon: '/icon.png',        // Ícone grande (pelo menos 192x192)
  badge: '/badge.png',      // Ícone pequeno (96x96) - Android
  image: '/banner.png',     // Imagem banner (opcional)
  
  // Comportamento
  tag: 'unique-id',         // ID única - substitui notificações com mesma tag
  requireInteraction: false, // true = não fecha automaticamente
  silent: false,            // true = sem som do sistema
  
  // Dados extras
  data: { sessionId: 123 }, // Dados customizados
  timestamp: Date.now(),    // Timestamp customizado
  
  // Experimental (Chrome)
  vibrate: [200, 100, 200], // Padrão de vibração (mobile)
  actions: [                // Botões de ação (Service Worker)
    { action: 'reply', title: 'Responder' },
    { action: 'close', title: 'Fechar' }
  ]
});
```

---

### 5. **Eventos de Notificação**

```typescript
const notification = new Notification('Título', { body: 'Corpo' });

// Ao clicar na notificação
notification.onclick = (event) => {
  console.log('Notificação clicada!');
  window.focus(); // Focar a janela do app
  notification.close(); // Fechar a notificação
};

// Quando a notificação fecha
notification.onclose = (event) => {
  console.log('Notificação fechada');
};

// Se houver erro
notification.onerror = (event) => {
  console.error('Erro na notificação:', event);
};

// Quando a notificação é exibida
notification.onshow = (event) => {
  console.log('Notificação exibida');
};
```

---

### 6. **Tag - Substituição de Notificações**

A propriedade `tag` é crucial para evitar spam de notificações:

```typescript
// Sem tag - cria múltiplas notificações
new Notification('Mensagem 1', { body: 'Texto 1' });
new Notification('Mensagem 2', { body: 'Texto 2' });
new Notification('Mensagem 3', { body: 'Texto 3' });
// Resultado: 3 notificações simultâneas 😱

// Com tag - substitui notificação anterior
new Notification('Mensagem 1', { tag: 'chat', body: 'Texto 1' });
new Notification('Mensagem 2', { tag: 'chat', body: 'Texto 2' });
new Notification('Mensagem 3', { tag: 'chat', body: 'Texto 3' });
// Resultado: Apenas 1 notificação (a última) ✅
```

**Nossa Implementação:**
```typescript
const notification = new Notification(title, {
  tag: 'pomodoro-notification', // Sempre substitui a anterior
  // ... outras opções
});
```

---

### 7. **Fechamento Automático**

Notificações podem ser fechadas programaticamente:

```typescript
const notification = new Notification('Título', { body: 'Corpo' });

// Fechar após 5 segundos
setTimeout(() => {
  notification.close();
}, 5000);
```

**⚠️ Comportamento varia por browser/OS:**
- **Windows**: Notificações permanecem na Central de Ações
- **macOS**: Desaparecem após tempo configurado
- **Android**: Permanecem até serem dispensadas
- **requireInteraction: true**: Nunca fecha automaticamente

---

## 🔒 Segurança e Permissões

### **Quando a permissão é solicitada?**

1. **Primeira vez**: Browser exibe popup nativo
2. **Granted**: Permissão permanece até ser revogada
3. **Denied**: Bloqueado - usuário deve mudar manualmente

### **Como usuário revoga permissão?**

**Chrome/Edge:**
1. Clicar no 🔒 na barra de endereços
2. Configurações do site > Notificações
3. Alterar para "Bloquear" ou "Permitir"

**Firefox:**
1. Clicar no ℹ️ na barra de endereços
2. Permissões > Notificações
3. Alterar estado

### **Como testar permissão negada?**

```typescript
// Simular bloqueio
Object.defineProperty(Notification, 'permission', {
  value: 'denied'
});
```

---

## 🎨 Boas Práticas

### ✅ **DO's:**

1. **Solicitar permissão em contexto de interação**
   ```typescript
   button.onclick = () => {
     Notification.requestPermission();
   };
   ```

2. **Usar tags para evitar spam**
   ```typescript
   new Notification('Msg', { tag: 'unique-id' });
   ```

3. **Prover valor claro ao usuário**
   ```typescript
   // ✅ Bom: Informação relevante
   new Notification('Sessão Concluída!', {
     body: 'Parabéns! Hora de descansar 🎉'
   });
   
   // ❌ Ruim: Genérico demais
   new Notification('Notification', {
     body: 'Something happened'
   });
   ```

4. **Fechar automaticamente quando apropriado**
   ```typescript
   setTimeout(() => notification.close(), 5000);
   ```

5. **Focar janela ao clicar**
   ```typescript
   notification.onclick = () => {
     window.focus();
     notification.close();
   };
   ```

### ❌ **DON'Ts:**

1. **Não solicitar permissão sem contexto**
   ```typescript
   // ❌ Ao carregar página
   window.onload = () => {
     Notification.requestPermission();
   };
   ```

2. **Não enviar notificações excessivas**
   ```typescript
   // ❌ Spam
   setInterval(() => {
     new Notification('Ping!');
   }, 1000);
   ```

3. **Não assumir que permissão foi concedida**
   ```typescript
   // ❌ Não verificar estado
   new Notification('Msg'); // Pode falhar!
   
   // ✅ Sempre verificar
   if (Notification.permission === 'granted') {
     new Notification('Msg');
   }
   ```

---

## 🧪 Casos de Uso Comuns

### 1. **Sistema de Mensagens**
```typescript
// Notificar nova mensagem (substitui anterior)
function notifyNewMessage(sender: string, message: string) {
  new Notification(`💬 ${sender}`, {
    body: message,
    tag: `chat-${sender}`, // Uma notificação por pessoa
    icon: `/avatars/${sender}.jpg`,
    data: { sender }
  });
}
```

### 2. **Timer/Alarme**
```typescript
// Notificar timer concluído
function notifyTimerComplete(duration: number) {
  new Notification('⏰ Timer Concluído!', {
    body: `${duration} minutos se passaram`,
    tag: 'timer',
    requireInteraction: true, // Não fecha automaticamente
    vibrate: [200, 100, 200]
  });
}
```

### 3. **Background Updates**
```typescript
// Notificar quando tab está inativa
document.addEventListener('visibilitychange', () => {
  if (document.hidden && hasNewData) {
    new Notification('🔔 Novidades!', {
      body: 'Há atualizações disponíveis',
      tag: 'updates'
    });
  }
});
```

---

## 🚀 Funcionalidades Avançadas

### **Service Worker Notifications**

Para notificações persistentes (funcionam mesmo com app fechado):

```typescript
// Registrar Service Worker
navigator.serviceWorker.register('/sw.js');

// Enviar notificação via Service Worker
navigator.serviceWorker.ready.then(registration => {
  registration.showNotification('Título', {
    body: 'Corpo',
    actions: [
      { action: 'yes', title: 'Sim' },
      { action: 'no', title: 'Não' }
    ]
  });
});

// sw.js - Responder a ações
self.addEventListener('notificationclick', (event) => {
  if (event.action === 'yes') {
    // Ação "Sim"
  } else if (event.action === 'no') {
    // Ação "Não"
  }
  event.notification.close();
});
```

### **Push Notifications**

Para notificações do servidor (requer Service Worker + backend):

```typescript
// Frontend - Inscrever em push
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: 'PUBLIC_KEY'
});

// Enviar subscription ao servidor
await fetch('/api/subscribe', {
  method: 'POST',
  body: JSON.stringify(subscription)
});

// Backend (Node.js + web-push)
const webpush = require('web-push');

webpush.sendNotification(subscription, JSON.stringify({
  title: 'Nova Mensagem',
  body: 'Você tem uma nova mensagem!'
}));
```

---

## 📊 Compatibilidade de Browsers

| Browser | Suporte Básico | Service Worker | Push API |
|---------|---------------|----------------|----------|
| Chrome 22+ | ✅ | ✅ | ✅ |
| Firefox 22+ | ✅ | ✅ | ✅ |
| Safari 7+ | ✅ | ✅ (16.4+) | ✅ (16.4+) |
| Edge 14+ | ✅ | ✅ | ✅ |
| Opera 25+ | ✅ | ✅ | ✅ |
| iOS Safari | ❌ (16.4+ apenas PWA) | ❌ | ❌ |
| Android Chrome | ✅ | ✅ | ✅ |

**Recursos:**
- [Can I Use - Notifications](https://caniuse.com/notifications)
- [MDN - Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification)

---

## 🐛 Troubleshooting

### **Notificações não aparecem?**

1. **Verificar permissão**
   ```typescript
   console.log(Notification.permission); // "granted"?
   ```

2. **Verificar suporte**
   ```typescript
   console.log('Notification' in window); // true?
   ```

3. **Verificar contexto**
   - HTTPS obrigatório (ou localhost)
   - Solicitar em interação do usuário

4. **Verificar configurações do browser**
   - Notificações globais habilitadas?
   - Site permitido nas configurações?
   - Modo "Não perturbe" desativado?

### **Notificação não fecha automaticamente?**

```typescript
// Garantir fechamento
const notification = new Notification('Msg', {
  requireInteraction: false // Permitir fechamento automático
});

// Fechar manualmente após timeout
setTimeout(() => notification.close(), 5000);
```

### **Som não toca?**

```typescript
// Propriedade "silent" pode estar bloqueando
new Notification('Msg', {
  silent: false // Permitir som do sistema
});
```

---

## 📚 Nossa Implementação no Pomodoro

### **Fluxo Completo:**

```
1. Usuário clica "Play" 
   ↓
2. startTimer() → requestNotificationPermission()
   ↓
3. Browser solicita permissão (popup nativo)
   ↓
4. Se "granted" → _notificationsEnabled.set(true)
   ↓
5. Enviar notificação de teste
   ↓
6. Durante sessões:
   - Início de trabalho → Notificação
   - Fim de trabalho → Notificação
   - Início de pausa → Notificação
   - Fim de pausa → Notificação
```

### **Código Chave:**

```typescript
// Solicitar permissão (apenas uma vez)
public async requestNotificationPermission(): Promise<void> {
  if (!('Notification' in window)) return;

  const permission = await Notification.requestPermission();
  
  if (permission === 'granted') {
    this._notificationsEnabled.set(true);
    this.sendNotification('🎯 Notificações Ativadas!', 'Você será notificado');
  }
}

// Enviar notificação
private sendNotification(title: string, body: string): void {
  if (!this._notificationsEnabled()) return;
  if (Notification.permission !== 'granted') return;

  const notification = new Notification(title, {
    body,
    icon: '/favicon.ico',
    tag: 'pomodoro-notification', // Substitui anterior
    requireInteraction: false
  });

  // Focar ao clicar
  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  // Auto-fechar após 5s
  setTimeout(() => notification.close(), 5000);
}
```

---

## 🎓 Conclusão

Web Notifications são uma ferramenta poderosa para **engajamento do usuário**, mas devem ser usadas com **responsabilidade**:

✅ **Solicitar permissão em contexto apropriado**  
✅ **Enviar notificações relevantes e úteis**  
✅ **Respeitar configurações do usuário**  
✅ **Evitar spam de notificações**  
✅ **Prover valor claro ao usuário**

**Referências:**
- [MDN - Notification API](https://developer.mozilla.org/en-US/docs/Web/API/Notification)
- [Web.dev - Notifications Best Practices](https://web.dev/notifications/)
- [W3C - Notifications Spec](https://notifications.spec.whatwg.org/)

---

**Autor:** Pomodoro Timer - Angular v20  
**Data:** Dezembro 2025

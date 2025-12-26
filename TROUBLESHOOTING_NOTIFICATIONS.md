# 🔧 Troubleshooting - Notificações não funcionam

## ✅ Problema Corrigido

**Erro identificado:** A função `startTimer()` não estava aguardando a permissão de notificação antes de iniciar a sessão.

**Correção aplicada:**
```typescript
// ❌ ANTES (não funcionava)
public startTimer(): void {
  this.requestNotificationPermission(); // Não aguardava
  this.startWorkSession(); // Executava imediatamente
}

// ✅ DEPOIS (funciona)
public async startTimer(): Promise<void> {
  await this.requestNotificationPermission(); // Aguarda permissão
  this.startWorkSession(); // Só executa após permissão
}
```

---

## 🧪 Como Testar Agora

### Passo 1: Recarregar a Aplicação
1. Pare o servidor (`Ctrl+C` no terminal)
2. Execute `npm start`
3. Acesse `http://localhost:4200`

### Passo 2: Resetar Permissões (se necessário)

**Chrome/Edge:**
1. Pressione `F12` para abrir DevTools
2. Vá em **Application** > **Storage** > **Clear site data**
3. Ou clique no ícone 🔒 > **Site settings** > **Notifications** > Reset

**Firefox:**
1. Pressione `F12`
2. Console: `localStorage.clear(); location.reload()`
3. Ou clique no ℹ️ > **Permissions** > **Notifications** > Reset

### Passo 3: Testar Fluxo
1. Clique em **Play** ▶️
2. Popup do browser aparece solicitando permissão
3. Clique em **"Permitir"** / **"Allow"**
4. Você deve ver uma notificação: **"🎯 Notificações Ativadas!"**
5. A sessão começa e notificação aparece: **"💼 Sessão de Trabalho Iniciada!"**

---

## 🔍 Debug via Console

Abra o DevTools (`F12`) e observe os logs:

### ✅ Logs Esperados (Sucesso)
```
[PomodoroService] 📢 Solicitando permissão de notificação...
[PomodoroService] ✅ Permissão de notificação concedida!
[PomodoroService] 🔔 Tentando enviar notificação: "🎯 Notificações Ativadas!"
[PomodoroService] Estado notificações: true
[PomodoroService] Notification.permission: granted
[PomodoroService] 📢 Criando notificação...
[PomodoroService] ✅ Notificação criada com sucesso!
[PomodoroService] 📢 Notificação enviada: 🎯 Notificações Ativadas!
```

### ❌ Logs de Erro (Permissão Negada)
```
[PomodoroService] ❌ Permissão de notificação negada
[PomodoroService] ⚠️ Notificações desabilitadas no signal - não enviando
```

### ⚠️ Logs de Alerta (Browser não suporta)
```
[PomodoroService] ⚠️ Browser não suporta notificações
[PomodoroService] ❌ Browser não suporta Notification API
```

---

## 🚨 Problemas Comuns

### 1. "Permissão negada anteriormente"

**Sintoma:** Notificações não aparecem e console mostra `denied`

**Solução:**
1. Chrome/Edge: Clique no 🔒 > **Site settings** > **Notifications** > **Allow**
2. Firefox: Clique no ℹ️ > **Permissions** > **Notifications** > **Allow**
3. Recarregue a página (`F5`)

---

### 2. "Popup de permissão não aparece"

**Sintoma:** Ao clicar Play, nada acontece

**Causas possíveis:**
- ✅ Já concedeu permissão (verifique ícone 🔒)
- ❌ Já negou permissão (precisa resetar manualmente)
- ❌ Browser bloqueou por política

**Solução:**
```javascript
// No Console do DevTools
console.log(Notification.permission);
// "default" → Ainda não perguntou
// "granted" → Já permitiu
// "denied" → Negou (precisa mudar manualmente)
```

---

### 3. "Notificações aparecem mas não fazem som"

**Sintoma:** Notificação visual OK, mas sem som

**Causas:**
- Sistema operacional em modo "Não perturbe"
- Volume de notificações do sistema desativado
- Configuração do browser

**Solução:**
- Windows: Verifique **Configurações** > **Sistema** > **Notificações**
- macOS: Verifique **Preferências** > **Notificações**
- Browser: Configurações de notificações

---

### 4. "HTTPS necessário"

**Sintoma:** Notificações não funcionam em produção

**Causa:** Notification API requer **HTTPS** (ou localhost)

**Solução:**
- ✅ Localhost: OK (http://localhost:4200)
- ❌ IP Local: Bloqueado (http://192.168.1.100:4200)
- ✅ Produção: Usar HTTPS obrigatoriamente

---

### 5. "Notificações duplicadas"

**Sintoma:** Duas notificações iguais aparecem

**Causa:** Tag única não funcionando ou múltiplas abas

**Solução:**
- Feche abas duplicadas
- Tag `pomodoro-notification` garante apenas 1 notificação por vez

---

## 🧪 Teste Manual de Permissão

Execute no Console do DevTools:

```javascript
// Verificar suporte
console.log('Suporte:', 'Notification' in window);

// Verificar permissão atual
console.log('Permissão:', Notification.permission);

// Solicitar permissão manualmente
Notification.requestPermission().then(permission => {
  console.log('Nova permissão:', permission);
  
  if (permission === 'granted') {
    // Testar notificação
    new Notification('🧪 Teste Manual', {
      body: 'Se você vê isso, notificações funcionam!',
      tag: 'test'
    });
  }
});
```

---

## 📊 Compatibilidade Verificada

| Browser | Versão | Status |
|---------|--------|--------|
| Chrome | 120+ | ✅ Testado |
| Edge | 120+ | ✅ Testado |
| Firefox | 121+ | ✅ Funciona |
| Safari | 16.4+ | ⚠️ Limitado (requer PWA) |
| Opera | 105+ | ✅ Funciona |

---

## 🎯 Checklist Completo

Antes de reportar problema, verifique:

- [ ] Página está em HTTPS ou localhost
- [ ] DevTools aberto (F12) para ver logs
- [ ] Permissão não está em "denied"
- [ ] Browser suporta Notification API
- [ ] Não está em modo anônimo/privado
- [ ] Sistema operacional permite notificações
- [ ] Não está em "Não perturbe"
- [ ] Apenas uma aba do app aberta

---

## 📞 Ainda não funciona?

1. **Compartilhe os logs do Console** (F12)
2. **Informe seu browser e versão**
3. **Descreva exatamente o que acontece**
4. **Qual sistema operacional**

---

**Última atualização:** Dezembro 2025  
**Versão:** Angular v20 - Pomodoro Timer

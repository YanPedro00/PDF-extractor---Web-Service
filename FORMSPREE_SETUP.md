# 📧 Configuração do Formspree

## ✅ O que foi implementado:
- ✅ Formulário envia mensagens via Formspree
- ✅ Feedback visual (carregando, sucesso, erro)
- ✅ Validação de campos
- ✅ Experiência do usuário melhorada

---

## 🚀 Como configurar (5 minutos):

### **Passo 1: Criar conta no Formspree**
1. Acesse: https://formspree.io/
2. Clique em **"Sign Up"**
3. Escolha **"Continue with Google"**
4. Use o email: **pdf.utilities00@gmail.com**

---

### **Passo 2: Criar um novo formulário**
1. Após fazer login, clique em **"+ New Form"**
2. Nome do formulário: **"PDF Utilities - Contato"**
3. Email de destino: **pdf.utilities00@gmail.com** (já vai estar preenchido)
4. Clique em **"Create Form"**

---

### **Passo 3: Copiar o endpoint**
Após criar o formulário, você verá algo assim:

```
Your form endpoint is ready!
https://formspree.io/f/xyzabc123
```

**Copie esse URL!** (exemplo: `https://formspree.io/f/xyzabc123`)

---

### **Passo 4: Configurar variável de ambiente no Railway**

1. **Acesse o Railway Dashboard**
2. **Clique no serviço do Frontend (Next.js)**
3. **Vá em "Variables"**
4. **Adicione uma nova variável:**
   ```
   Nome: NEXT_PUBLIC_FORMSPREE_ENDPOINT
   Valor: https://formspree.io/f/xyzabc123
   ```
   (substitua `xyzabc123` pelo seu ID do Formspree)

5. **Salve** (Railway vai fazer redeploy automático)

---

### **Passo 5: Para testar localmente (opcional)**

Crie um arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/xyzabc123
```

**⚠️ IMPORTANTE:** Adicione `.env.local` no `.gitignore` (já deve estar)

---

### **Passo 6: Fazer commit (se necessário)**

Se fez alguma modificação local:
```bash
git add .
git commit -m "feat: configurar Formspree com variável de ambiente"
git push
```

---

## 🎉 Pronto!

Após o deploy:
1. ✅ Usuários preenchem o formulário no site
2. ✅ Mensagem é enviada automaticamente
3. ✅ Você recebe no email: **pdf.utilities00@gmail.com**
4. ✅ Pode responder diretamente do Gmail

---

## 📊 Plano Gratuito do Formspree:

- ✅ **50 envios/mês** (mais que suficiente para começar)
- ✅ **Sem limite de formulários**
- ✅ **Proteção anti-spam**
- ✅ **Notificações por email**

Se precisar de mais, planos pagos começam em $10/mês (1000 envios).

---

## 🛡️ Recursos incluídos:

### **Proteção anti-spam:**
- Formspree já inclui proteção contra bots
- Captcha automático se detectar tráfego suspeito

### **Campos enviados:**
- Nome do usuário
- Email do usuário
- Assunto selecionado
- Mensagem

### **Email recebido terá:**
```
De: noreply@formspree.io
Para: pdf.utilities00@gmail.com
Assunto: [PDF Utilities] [Assunto escolhido pelo usuário]
Reply-To: [email do usuário]

Nome: João Silva
Email: joao@example.com
Assunto: Dúvida sobre ferramenta
Mensagem: [mensagem do usuário]
```

Ao clicar em "Responder" no Gmail, o email vai direto para o usuário!

---

## ⚙️ Configurações avançadas (opcional):

No dashboard do Formspree, você pode:
- ✅ Adicionar email de notificação extra
- ✅ Configurar auto-resposta para o usuário
- ✅ Integrar com Slack, Discord, etc.
- ✅ Ver estatísticas de envios
- ✅ Exportar mensagens recebidas

---

## 🧪 Testar localmente:

1. Inicie o servidor local: `npm run dev`
2. Acesse: http://localhost:3000/contato
3. Preencha o formulário
4. Clique em "Enviar"
5. ✅ Veja o feedback de sucesso
6. ✅ Confira o email em pdf.utilities00@gmail.com

---

## 🆘 Solução de problemas:

### **Erro: "Erro ao enviar mensagem"**
- Verifique se o endpoint do Formspree está correto
- Verifique se a conta do Formspree está ativa
- Veja os logs no dashboard do Formspree

### **Não recebo os emails:**
- Confira a caixa de spam do Gmail
- Verifique o email de destino no Formspree
- Teste enviando pelo próprio dashboard do Formspree

### **Limite de 50 envios atingido:**
- Upgrade para plano pago ($10/mês = 1000 envios)
- Ou aguarde o reset mensal

---

## 📝 Alternativa sem conta (para teste):

Se quiser testar ANTES de criar conta:

1. Use o endpoint de teste do Formspree:
   ```typescript
   const formspreeEndpoint = 'https://formspree.io/f/test'
   ```

2. Isso funciona, mas as mensagens não chegam para você (vão para o Formspree)

3. Útil apenas para testar se o formulário funciona

---

**Dúvidas?** É super simples, vai levar 5 minutos! 🚀


# 🔐 Variáveis de Ambiente

## 📋 Lista completa de variáveis necessárias:

### **1. API Backend (Python Flask)**
```bash
NEXT_PUBLIC_OCR_API_URL=http://localhost:5003
```
- **Local:** `http://localhost:5003`
- **Railway:** `https://sua-api-python.up.railway.app`
- **Usado em:** OCR, Compressão de PDF

---

### **2. Formspree (Formulário de Contato)** ✨ NOVO
```bash
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/xyzabc123
```
- **Como obter:**
  1. Crie conta em: https://formspree.io/
  2. Faça login com: pdf.utilities00@gmail.com
  3. Crie um novo form: "PDF Utilities - Contato"
  4. Copie o endpoint fornecido

---

### **3. Google AdSense (Anúncios)**
```bash
NEXT_PUBLIC_GOOGLE_ADS_PUBLISHER_ID=ca-pub-1782940009467994
NEXT_PUBLIC_GOOGLE_ADS_SLOT_1=6280286471
NEXT_PUBLIC_GOOGLE_ADS_SLOT_2=4093106837
```
- **Já configurado** ✅
- Substitua pelos seus IDs quando o AdSense aprovar

---

## 🚀 Configurar no Railway:

### **Frontend (Next.js):**
1. Vá em: **Railway Dashboard → Serviço Frontend → Variables**
2. Adicione:
   ```
   NEXT_PUBLIC_OCR_API_URL=https://sua-api.up.railway.app
   NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/SEU_ID
   NEXT_PUBLIC_GOOGLE_ADS_PUBLISHER_ID=ca-pub-1782940009467994
   NEXT_PUBLIC_GOOGLE_ADS_SLOT_1=6280286471
   NEXT_PUBLIC_GOOGLE_ADS_SLOT_2=4093106837
   ```

### **Backend (Python):**
- ✅ Não precisa de variáveis extras
- A porta é definida automaticamente pelo Railway

---

## 💻 Configurar Localmente:

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# .env.local
NEXT_PUBLIC_OCR_API_URL=http://localhost:5003
NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/SEU_ID
NEXT_PUBLIC_GOOGLE_ADS_PUBLISHER_ID=ca-pub-1782940009467994
NEXT_PUBLIC_GOOGLE_ADS_SLOT_1=6280286471
NEXT_PUBLIC_GOOGLE_ADS_SLOT_2=4093106837
```

**⚠️ IMPORTANTE:** Não commitar `.env.local` (já está no `.gitignore`)

---

## ✅ Checklist de Configuração:

- [ ] Criar conta no Formspree
- [ ] Criar formulário no Formspree
- [ ] Copiar endpoint do Formspree
- [ ] Adicionar variável `NEXT_PUBLIC_FORMSPREE_ENDPOINT` no Railway
- [ ] Testar formulário de contato
- [ ] Confirmar recebimento de email

---

## 🔍 Validação:

### **Como saber se está funcionando:**

1. **API Backend:**
   - Teste: `https://sua-api.up.railway.app/health`
   - Esperado: `{"status": "ok"}`

2. **Formspree:**
   - Acesse: `/contato` no site
   - Envie uma mensagem de teste
   - Verifique se chegou no email: pdf.utilities00@gmail.com

3. **Google AdSense:**
   - Anúncios aparecem após aprovação
   - Enquanto isso, espaços vazios são normais

---

## ⚠️ Importante:

- **Variáveis `NEXT_PUBLIC_*`** são expostas no frontend (não colocar senhas!)
- **Após adicionar/modificar variáveis**, Railway faz redeploy automático
- **Testar localmente** antes de fazer deploy em produção
- **Variáveis não aparecem imediatamente** - aguardar redeploy completo

---

## 🆘 Problemas Comuns:

### **"Formspree não configurado"**
- Verifique se a variável `NEXT_PUBLIC_FORMSPREE_ENDPOINT` existe no Railway
- Verifique se o valor está correto (URL completa)
- Faça redeploy manual se necessário

### **"Failed to fetch" na API**
- Verifique se `NEXT_PUBLIC_OCR_API_URL` aponta para a URL correta
- Teste o endpoint `/health` da API
- Verifique se os 2 serviços estão rodando no Railway

### **Variável não funciona**
- Lembre-se: só variáveis `NEXT_PUBLIC_*` funcionam no frontend
- Após adicionar variável, aguardar redeploy completo
- Limpar cache do navegador e recarregar página


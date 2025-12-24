# 🚂 Deploy no Railway - PDFUtilities

## ⚠️ IMPORTANTE: Webservice e API Python devem rodar JUNTOS!

Este projeto precisa de **2 serviços** no Railway:
1. **Next.js** (webservice frontend)
2. **API Python** (OCR com img2table + EasyOCR)

---

## 📋 Passo a Passo Completo

### 1. Preparar o Projeto

✅ Já está pronto! O projeto já tem:
- `package.json` com scripts de build
- API Python em `/api`
- `nixpacks.toml` na raiz (para Next.js)
- `nixpacks.toml` em `/api` (para Python)
- Configurações necessárias

**IMPORTANTE**: Os arquivos `nixpacks.toml` garantem que cada serviço use o ambiente correto (Node.js vs Python)

### 2. Criar Conta no Railway

1. Acesse: https://railway.app/
2. Clique em "Start a New Project"
3. Faça login com **GitHub** (recomendado)
4. Autorize o Railway a acessar seus repositórios

### 3. Criar o Primeiro Serviço (Next.js)

3.1. No dashboard do Railway, clique em **"New Project"**
3.2. Selecione **"Deploy from GitHub repo"**
3.3. Escolha o repositório **PDFUtilities**
3.4. Railway detectará automaticamente que é Next.js

3.5. **Configure o serviço:**
   - Nome: `pdfutilities-web` (ou qualquer nome)
   - Root Directory: `/` (raiz)
   - Build Command: **DEIXE VAZIO** (o `nixpacks.toml` na raiz cuida disso)
   - Start Command: **DEIXE VAZIO** (o `nixpacks.toml` na raiz cuida disso)
   - **OU** configure manualmente:
     - Build: `npm install && npm run build`
     - Start: `npm start`

### 4. Criar o Segundo Serviço (API Python)

4.1. No **mesmo projeto**, clique em **"New Service"** (ou "+" ao lado do serviço existente)

4.2. Selecione **"Deploy from GitHub repo"** novamente
   - Escolha o **mesmo repositório**
   - Mas agora configure diferente:

4.3. **Configure o serviço Python:**
   - Nome: `pdfutilities-api` (ou qualquer nome)
   - Root Directory: `/api` (pasta da API) ⚠️ **MUITO IMPORTANTE!**
   - Build Command: **DEIXE VAZIO** (o `nixpacks.toml` em `/api` cuida disso)
   - Start Command: **DEIXE VAZIO** (o `nixpacks.toml` em `/api` cuida disso)
   - **OU** configure manualmente:
     - Build: `pip install -r requirements.txt`
     - Start: `python3 pdf_ocr_api.py`

4.4. **Configurar Python no Railway:**
   - O arquivo `nixpacks.toml` em `/api` já configura Python 3.13
   - Railway detectará automaticamente pelo `nixpacks.toml`

### 5. Configurar Variáveis de Ambiente

#### 5.1. No Serviço Next.js (Web):

Vá em **Variables** e adicione:

```env
NODE_ENV=production
PORT=3000
```

**Se tiver Google Ads:**
```env
NEXT_PUBLIC_GOOGLE_ADS_PUBLISHER_ID=ca-pub-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_SLOT_1=1234567890
NEXT_PUBLIC_GOOGLE_ADS_SLOT_2=0987654321
```

**URL da API Python (será configurada depois):**
```env
NEXT_PUBLIC_OCR_API_URL=https://pdfutilities-api-production.up.railway.app
```
*(Substitua pela URL real da API depois do deploy)*

#### 5.2. No Serviço Python (API):

Vá em **Variables** e adicione:

```env
PORT=5003
PYTHON_VERSION=3.13
```

### 6. Obter URL da API Python

6.1. Após o deploy da API Python, vá em **Settings** > **Networking**
6.2. Clique em **"Generate Domain"** (ou use um domínio customizado)
6.3. Copie a URL gerada (ex: `https://pdfutilities-api-production.up.railway.app`)

6.4. **Volte ao serviço Next.js** e atualize a variável:
```env
NEXT_PUBLIC_OCR_API_URL=https://pdfutilities-api-production.up.railway.app
```

### 7. Configurar Domínio do Next.js

7.1. No serviço Next.js, vá em **Settings** > **Networking**
7.2. Clique em **"Generate Domain"** para obter um domínio gratuito
7.3. Ou configure um domínio customizado se tiver

### 8. Verificar Deploy

8.1. Acesse o domínio do Next.js
8.2. Teste todas as funcionalidades
8.3. Teste especialmente a função OCR (deve usar a API Python)

---

## 🔧 Configurações Importantes

### Build Settings - Next.js:
- **Root Directory**: `/` (raiz do projeto)
- **Build Command**: Deixe vazio (o `nixpacks.toml` na raiz cuida disso)
- **Start Command**: Deixe vazio (o `nixpacks.toml` na raiz cuida disso)
- **Ou configure manualmente:**
  - Build: `npm install && npm run build`
  - Start: `npm start`

### Build Settings - Python API:
- **Root Directory**: `/api` (pasta da API)
- **Build Command**: Deixe vazio (o `nixpacks.toml` em `/api` cuida disso)
- **Start Command**: Deixe vazio (o `nixpacks.toml` em `/api` cuida disso)
- **Ou configure manualmente:**
  - Build: `pip install -r requirements.txt`
  - Start: `python3 pdf_ocr_api.py`
- **Python Version**: 3.13 (configurado no nixpacks.toml)

### Portas:
- **Next.js**: Railway define automaticamente (variável `PORT`)
- **API Python**: Use porta dinâmica do Railway (variável `PORT`)

---

## 🐛 Troubleshooting

### API Python não conecta:
1. Verifique se a API está rodando (veja logs no Railway)
2. Verifique a URL na variável `NEXT_PUBLIC_OCR_API_URL`
3. Verifique se o CORS está configurado na API (já está!)

### Build falha:
1. Verifique os logs no Railway
2. Certifique-se que todas as dependências estão no `package.json` e `requirements.txt`
3. Verifique se o Python está na versão correta
4. **Se aparecer "npm: command not found" no serviço Python:**
   - Verifique se o **Root Directory** está configurado como `/api`
   - Verifique se o arquivo `nixpacks.toml` existe em `/api`
   - Force um novo deploy após corrigir

### Anúncios não aparecem:
1. Verifique se as variáveis do Google Ads estão configuradas
2. Verifique se o site foi aprovado pelo Google AdSense

---

## 📝 Checklist Final

- [ ] Conta Railway criada
- [ ] Repositório conectado
- [ ] Serviço Next.js criado e configurado
- [ ] Serviço Python criado e configurado
- [ ] Variáveis de ambiente configuradas em ambos
- [ ] URL da API Python configurada no Next.js
- [ ] Domínios gerados para ambos os serviços
- [ ] Deploy bem-sucedido
- [ ] Site funcionando e testado

---

## 💡 Dica

Você pode ver os logs de ambos os serviços em tempo real no Railway:
- Clique no serviço
- Vá na aba "Deployments"
- Clique no deployment mais recente
- Veja os logs em tempo real


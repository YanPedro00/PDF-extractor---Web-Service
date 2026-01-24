# Como Configurar Google Drive API

## Passo a Passo para Obter Credenciais

### 1. Acessar Google Cloud Console
- Acesse: https://console.cloud.google.com/

### 2. Criar ou Selecionar Projeto
- Clique em "Select a project" no topo
- Clique em "NEW PROJECT"
- Nome: `translator-model-kmb` (ou outro nome)
- Clique em "CREATE"

### 3. Ativar Google Drive API
- No menu lateral, vá em: **APIs & Services** > **Library**
- Procure por: `Google Drive API`
- Clique em **ENABLE**

### 4. Criar Service Account
- No menu lateral: **APIs & Services** > **Credentials**
- Clique em: **CREATE CREDENTIALS** > **Service Account**
- Preencha:
  - Service account name: `pdf-ocr-service`
  - Service account ID: (será gerado automaticamente)
- Clique em **CREATE AND CONTINUE**
- Role: Selecione **Basic** > **Editor** (ou **Owner**)
- Clique em **DONE**

### 5. Criar Chave JSON
- Na lista de Service Accounts, clique na conta criada
- Vá na aba **KEYS**
- Clique em **ADD KEY** > **Create new key**
- Selecione: **JSON**
- Clique em **CREATE**
- Um arquivo JSON será baixado automaticamente

### 6. Salvar Credenciais
- Renomeie o arquivo baixado para: `google_credentials.json`
- Mova para a pasta: `/Users/yanpedro/Documents/translator-model-kmb/credentials/`

## Estrutura Esperada do Arquivo

O arquivo `google_credentials.json` deve ter esta estrutura:

```json
{
  "type": "service_account",
  "project_id": "seu-projeto-id",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "pdf-ocr-service@seu-projeto.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

## Testar

Depois de salvar as credenciais, execute:

```bash
./src/extract_pdf_google.py
```

Ou:

```bash
/Library/Frameworks/Python.framework/Versions/3.13/bin/python3 src/extract_pdf_google.py
```

## Observações

- ⚠️ **NUNCA** commite o arquivo `google_credentials.json` no Git!
- O arquivo `.gitignore` já está configurado para ignorar esta pasta
- A Service Account precisa ter permissões de escrita/leitura no Drive


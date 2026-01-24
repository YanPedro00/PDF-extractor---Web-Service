# 🚀 Guia de Deploy - Translator PDF API

## ✅ O QUE JÁ FOI IMPLEMENTADO

- ✅ Dockerfile otimizado (`translator-pdf-api/Dockerfile`)
- ✅ API FastAPI completa (`translator-pdf-api/main.py`)
- ✅ Integração no `docker-compose.yml`
- ✅ Configuração do Nginx (`nginx.conf`)
- ✅ Componente React (`TranslatorPDFUploader.tsx`)
- ✅ Página admin (`app/tradutor-tecnico/page.tsx`)

---

## 📋 TAREFAS QUE VOCÊ PRECISA FAZER

### TAREFA 1: Configurar Google Cloud Credentials ⚠️

#### Passo 1.1: Criar Projeto no Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Clique em "Select a project" → "NEW PROJECT"
3. Nome do projeto: `pdf-translator` (ou outro nome)
4. Clique em "CREATE"

#### Passo 1.2: Ativar Google Vision API

1. No menu lateral: **APIs & Services** → **Library**
2. Procure por: `Cloud Vision API`
3. Clique em **ENABLE**

#### Passo 1.3: Criar Service Account

1. No menu lateral: **APIs & Services** → **Credentials**
2. Clique em: **CREATE CREDENTIALS** → **Service Account**
3. Preencha:
   - Service account name: `pdf-translator-service`
   - Service account ID: (gerado automaticamente)
4. Clique em **CREATE AND CONTINUE**
5. Role: Selecione **Cloud Vision** → **Cloud Vision API User**
6. Clique em **DONE**

#### Passo 1.4: Criar Chave JSON

1. Na lista de Service Accounts, clique na conta criada
2. Vá na aba **KEYS**
3. Clique em **ADD KEY** → **Create new key**
4. Selecione: **JSON**
5. Clique em **CREATE**
6. Um arquivo JSON será baixado automaticamente

#### Passo 1.5: Renomear e Upload para Servidor

```bash
# No seu Mac, renomear arquivo baixado
mv ~/Downloads/pdf-translator-service-*.json ~/Downloads/google_credentials.json

# Upload para servidor
scp -i ~/Downloads/ssh-key-2026-01-09.key \
    ~/Downloads/google_credentials.json \
    ubuntu@129.80.198.250:/home/ubuntu/

# Conectar no servidor
ssh -i ~/Downloads/ssh-key-2026-01-09.key ubuntu@129.80.198.250

# No servidor, criar diretório e mover arquivo
sudo mkdir -p /home/ubuntu/translator-credentials
sudo mv /home/ubuntu/google_credentials.json /home/ubuntu/translator-credentials/
sudo chown -R ubuntu:ubuntu /home/ubuntu/translator-credentials
sudo chmod 600 /home/ubuntu/translator-credentials/google_credentials.json

# Verificar
ls -la /home/ubuntu/translator-credentials/
```

**Resultado esperado:**
```
-rw------- 1 ubuntu ubuntu 2345 Jan 24 21:00 google_credentials.json
```

---

### TAREFA 2: Copiar Modelo Gemma para Servidor ⚠️

#### Opção A: Via SCP (Recomendado se modelo está no Mac)

```bash
# No seu Mac
cd "/Users/yanpedro/Documents/PDF extractor - Web Service/translator-pdf-api/translator-model"

# Comprimir modelo
tar -czf final_model_gemma_sft.tar.gz final_model_gemma_sft/

# Verificar tamanho
ls -lh final_model_gemma_sft.tar.gz

# Upload para servidor (~500MB, pode demorar 5-10 minutos)
scp -i ~/Downloads/ssh-key-2026-01-09.key \
    final_model_gemma_sft.tar.gz \
    ubuntu@129.80.198.250:/home/ubuntu/

# Conectar no servidor
ssh -i ~/Downloads/ssh-key-2026-01-09.key ubuntu@129.80.198.250

# No servidor, descomprimir
cd /home/ubuntu
mkdir -p translator-model
tar -xzf final_model_gemma_sft.tar.gz -C translator-model/
rm final_model_gemma_sft.tar.gz

# Verificar estrutura
ls -la /home/ubuntu/translator-model/final_model_gemma_sft/
```

**Resultado esperado:**
```
/home/ubuntu/translator-model/final_model_gemma_sft/
├── adapter_config.json
├── adapter_model.safetensors
├── chat_template.jinja
├── special_tokens_map.json
├── tokenizer_config.json
├── tokenizer.json
├── tokenizer.model
└── ...
```

#### Opção B: Via Git LFS (Se preferir versionar)

```bash
# No seu Mac
cd "/Users/yanpedro/Documents/PDF extractor - Web Service"

# Instalar Git LFS (se não tiver)
brew install git-lfs
git lfs install

# Configurar tracking de arquivos grandes
git lfs track "translator-pdf-api/translator-model/**/*.safetensors"
git lfs track "translator-pdf-api/translator-model/**/*.bin"

# Adicionar .gitattributes
git add .gitattributes

# Commit e push
git add translator-pdf-api/translator-model/
git commit -m "Add Gemma 2 2B model with Git LFS"
git push origin oracle-oci-deploy

# No servidor, o webhook vai baixar automaticamente
```

---

### TAREFA 3: Criar Diretório Temporário ⚠️

```bash
# No servidor
ssh -i ~/Downloads/ssh-key-2026-01-09.key ubuntu@129.80.198.250

# Criar diretório para arquivos temporários
sudo mkdir -p /home/ubuntu/translator-temp
sudo chown -R ubuntu:ubuntu /home/ubuntu/translator-temp
sudo chmod 777 /home/ubuntu/translator-temp

# Verificar
ls -la /home/ubuntu/ | grep translator
```

**Resultado esperado:**
```
drwxr-xr-x 2 ubuntu ubuntu 4096 Jan 24 21:00 translator-credentials
drwxr-xr-x 3 ubuntu ubuntu 4096 Jan 24 21:00 translator-model
drwxrwxrwx 2 ubuntu ubuntu 4096 Jan 24 21:00 translator-temp
```

---

### TAREFA 4: Fazer Push e Deploy 🚀

```bash
# No seu Mac
cd "/Users/yanpedro/Documents/PDF extractor - Web Service"

# Verificar mudanças
git status

# Adicionar todos os arquivos novos
git add translator-pdf-api/ components/TranslatorPDFUploader.tsx app/tradutor-tecnico/page.tsx docker-compose.yml nginx.conf

# Commit
git commit -m "feat: adicionar API de tradução técnica com Gemma 2 2B"

# Push
git push origin oracle-oci-deploy
```

**O webhook vai detectar o push e fazer o rebuild automaticamente!**

---

### TAREFA 5: Acompanhar Build no Servidor 📊

```bash
# No servidor
ssh -i ~/Downloads/ssh-key-2026-01-09.key ubuntu@129.80.198.250

# Acompanhar logs do webhook
sudo journalctl -u github-webhook -n 100 -f
```

**O que esperar:**
1. Webhook detecta push
2. Pull do código
3. Build da nova imagem `translator-api` (~20-30 minutos primeira vez)
4. Restart dos containers
5. Translator API disponível em: `https://api.pdf-utilities.com.br/translator-api/health`

---

### TAREFA 6: Testar API 🧪

#### Teste 1: Health Check

```bash
# No servidor
curl https://api.pdf-utilities.com.br/translator-api/health
```

**Resultado esperado:**
```json
{
  "status": "healthy",
  "service": "translator-pdf-api",
  "version": "1.0.0",
  "timestamp": "2026-01-24T21:00:00.000Z",
  "credentials_found": true
}
```

#### Teste 2: Traduzir PDF de Teste

```bash
# Criar PDF de teste simples
echo "Test PDF" > test.txt
# (ou use um PDF real que você tenha)

# Upload e tradução
curl -X POST \
  https://api.pdf-utilities.com.br/translator-api/translate \
  -F "file=@test.pdf" \
  -F "start_page=1" \
  -F "end_page=1" \
  --output translated_test.pdf

# Verificar se arquivo foi gerado
ls -lh translated_test.pdf
```

#### Teste 3: Via Interface Web

1. Acesse: https://pdf-utilities.com.br/auth/login
2. Login: `admin@pdf-utilities.com` / `Admin@2026!`
3. Clique em "Tradutor Técnico" no menu
4. Faça upload de um PDF
5. Configure páginas
6. Clique em "Traduzir PDF"
7. Aguarde download automático

---

## 🐛 TROUBLESHOOTING

### Problema 1: `credentials_found: false`

**Causa:** Credenciais Google não encontradas

**Solução:**
```bash
# Verificar se arquivo existe
ls -la /home/ubuntu/translator-credentials/google_credentials.json

# Verificar permissões
sudo chmod 600 /home/ubuntu/translator-credentials/google_credentials.json
sudo chown ubuntu:ubuntu /home/ubuntu/translator-credentials/google_credentials.json

# Restart container
docker restart pdf-utilities-translator-api
```

### Problema 2: Container não inicia (health check failing)

**Causa:** Modelo não encontrado ou erro ao carregar

**Solução:**
```bash
# Ver logs do container
docker logs pdf-utilities-translator-api --tail 100

# Verificar se modelo existe
ls -la /home/ubuntu/translator-model/final_model_gemma_sft/

# Verificar permissões
sudo chown -R ubuntu:ubuntu /home/ubuntu/translator-model
```

### Problema 3: Build muito lento

**Causa:** Download de PyTorch (~2.5GB)

**Solução:** Aguardar. Primeira build demora ~30 minutos. Próximas builds usam cache e levam ~5 minutos.

### Problema 4: Erro 500 ao traduzir

**Causa:** Possível erro no modelo ou Vision API

**Solução:**
```bash
# Ver logs detalhados
docker logs pdf-utilities-translator-api -f

# Testar Vision API separadamente
curl -X POST \
  https://vision.googleapis.com/v1/images:annotate?key=YOUR_API_KEY \
  -H "Content-Type: application/json" \
  -d '{"requests":[{"image":{"content":"..."},"features":[{"type":"TEXT_DETECTION"}]}]}'
```

### Problema 5: Timeout ao traduzir

**Causa:** PDF muito grande ou muitas páginas

**Solução:** 
- Processar menos páginas por vez (máximo 10)
- Aumentar timeout no Nginx (já configurado para 600s)

---

## 📊 MONITORAMENTO

### Ver uso de recursos

```bash
# CPU e RAM dos containers
docker stats

# Espaço em disco
df -h

# Logs em tempo real
docker logs pdf-utilities-translator-api -f
```

### Limpar arquivos temporários

```bash
# Via API
curl -X DELETE https://api.pdf-utilities.com.br/translator-api/cleanup?older_than_hours=24

# Ou manualmente
sudo rm -rf /home/ubuntu/translator-temp/*
```

---

## ✅ CHECKLIST FINAL

Antes de considerar concluído, verifique:

- [ ] Google Cloud credentials configuradas
- [ ] Modelo Gemma copiado para servidor
- [ ] Diretórios criados com permissões corretas
- [ ] Push feito e webhook executou
- [ ] Container `translator-api` rodando (healthy)
- [ ] Health check retorna `credentials_found: true`
- [ ] Teste de tradução via curl funcionou
- [ ] Interface web acessível e funcional
- [ ] Login admin funciona
- [ ] Upload e tradução via web funciona

---

## 🎉 PRONTO!

Se todos os itens acima estão ✅, sua API de tradução está funcionando!

**URLs importantes:**
- Health: https://api.pdf-utilities.com.br/translator-api/health
- Docs: https://api.pdf-utilities.com.br/translator-api/docs
- Interface: https://pdf-utilities.com.br/tradutor-tecnico

**Próximos passos (opcional):**
- Implementar fila para múltiplos requests
- Adicionar cache de traduções
- Implementar processamento em batch
- Adicionar métricas e analytics

---

**Dúvidas?** Consulte os logs ou entre em contato! 🚀


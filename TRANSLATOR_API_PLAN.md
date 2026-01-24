# 🔄 Plano de Implementação: API de Tradução Técnica de PDFs

## 📋 RESUMO EXECUTIVO

**Objetivo:** Criar uma API para traduzir PDFs técnicos (EN→PT) usando modelo Gemma 2 2B fine-tuned, acessível apenas para usuários admin autenticados.

**Componentes:**
1. Nova API Python (Flask/FastAPI) + Modelo Gemma 2 2B
2. Google Cloud Vision API para OCR preciso
3. Interface web React para upload e download
4. Integração com sistema de autenticação existente

---

## 🏗️ ARQUITETURA DA SOLUÇÃO

### Pipeline de Tradução (3 Etapas):

```
┌─────────────────┐
│   PDF Input     │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  STEP 1: Extração (Google Vision API)   │
│  - Extrai texto + posições exatas        │
│  - Output: vision_extracted.json         │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  STEP 2: Tradução (Gemma 2 2B)          │
│  - Traduz textos técnicos EN→PT          │
│  - Modelo fine-tuned para peças moto    │
│  - Output: vision_translated.json        │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  STEP 3: Reconstrução (reportlab)       │
│  - Reconstrói PDF com textos traduzidos  │
│  - Mantém posições e formatação original │
│  - Output: translated_pdf_final.pdf      │
└────────┬─────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│  PDF Traduzido  │
└─────────────────┘
```

---

## 📦 DEPENDÊNCIAS PRINCIPAIS

### Python Packages:
```
# ML/AI
torch>=2.0.0                 # ~500MB
transformers>=4.36.0         # ~300MB
peft>=0.7.0                  # LoRA adapters
accelerate>=0.25.0

# Google Cloud
google-cloud-vision>=3.4.0
google-auth>=2.17.0

# PDF Processing
pdf2image>=1.16.0
Pillow>=9.5.0
reportlab>=4.0.0
PyPDF2>=3.0.0

# API Framework
flask>=2.3.0 ou fastapi>=0.100.0
gunicorn>=20.1.0 (Flask) ou uvicorn>=0.22.0 (FastAPI)

# Utilities
pandas>=2.0.0
numpy>=1.24.0
```

### Modelo Gemma 2 2B:
- **Tamanho:** ~5GB (base model) + ~500MB (LoRA adapters)
- **RAM:** ~8GB durante inferência
- **Já treinado:** `translator-model/final_model_gemma_sft/`

### Google Cloud Vision API:
- **Credenciais:** `google_credentials.json` (não versionado)
- **Custo:** ~$1.50 por 1000 páginas
- **Limite gratuito:** 1000 páginas/mês

---

## 🎯 TAREFAS DETALHADAS

### TAREFA 1: Criar Dockerfile para translator-pdf-api ✅

**Arquivo:** `translator-pdf-api/Dockerfile`

**Desafios:**
- Imagem Docker grande (~7GB+ final)
- Tempo de build longo (primeira vez: ~20-30min)
- Dependências complexas (torch, transformers)

**Solução:**
```dockerfile
# Multi-stage build para otimizar
FROM python:3.11-slim AS base
# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    poppler-utils \  # para pdf2image
    && rm -rf /var/lib/apt/lists/*

# Stage para dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage final
COPY . /app
WORKDIR /app
```

**Volume necessário:**
- `/app/translator-model/` → montado do servidor (modelo persistente)
- `/app/credentials/` → credenciais Google Cloud

---

### TAREFA 2: Criar API REST ✅

**Arquivo:** `translator-pdf-api/main.py`

**Endpoints:**
1. `POST /translate`
   - Input: PDF file + start_page + end_page
   - Output: PDF traduzido
   - Autenticação: JWT token (NextAuth)

2. `GET /health`
   - Health check

3. `GET /status/{job_id}` (opcional, para jobs longos)
   - Status do processamento

**Exemplo de implementação (FastAPI):**
```python
from fastapi import FastAPI, File, UploadFile, Header
from src.run_pipeline import run_full_pipeline

app = FastAPI()

@app.post("/translate")
async def translate_pdf(
    file: UploadFile = File(...),
    start_page: int = 1,
    end_page: int = None,
    authorization: str = Header(None)
):
    # 1. Validar autenticação (JWT token)
    # 2. Salvar PDF temporário
    # 3. Executar pipeline
    # 4. Retornar PDF traduzido
    pass
```

---

### TAREFA 3: Adicionar ao docker-compose.yml ✅

```yaml
  # API Tradutor Técnico (Gemma 2 2B + Google Vision)
  translator-api:
    build:
      context: ./translator-pdf-api
      dockerfile: Dockerfile
    container_name: pdf-utilities-translator-api
    restart: unless-stopped
    expose:
      - "8082"
    volumes:
      # Modelo Gemma 2 2B (persistente)
      - /home/ubuntu/translator-model:/app/translator-model:ro
      # Credenciais Google Cloud
      - /home/ubuntu/translator-credentials:/app/credentials:ro
      # Temp files
      - /home/ubuntu/translator-temp:/app/temp
    environment:
      - PORT=8082
      - GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/google_credentials.json
      - MODEL_PATH=/app/translator-model/final_model_gemma_sft
    networks:
      - app-network
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:8082/health"]
      interval: 60s
      timeout: 30s
      retries: 3
      start_period: 120s  # Modelo demora para carregar
```

---

### TAREFA 4: Configurar Nginx ✅

**Adicionar em `nginx.conf`:**

```nginx
# API Tradutor Técnico (só via HTTPS)
location /translator-api/ {
    # Limite de upload maior (PDFs podem ser grandes)
    client_max_body_size 50M;
    
    # Timeouts longos (tradução pode demorar)
    proxy_connect_timeout 600s;
    proxy_send_timeout 600s;
    proxy_read_timeout 600s;
    
    limit_req zone=general burst=2 nodelay;

    proxy_pass http://translator_api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Upstream
upstream translator_api {
    server translator-api:8082;
}
```

---

### TAREFA 5 & 6: Criar Interface Web ✅

**Arquivo:** `app/tradutor-tecnico/page.tsx`

**Componente:** `components/TranslatorPDFUploader.tsx`

**Funcionalidades:**
- Upload de PDF (drag & drop)
- Seleção de páginas (início/fim)
- Barra de progresso durante tradução
- Download automático do PDF traduzido
- Validação de autenticação (admin only)

**Tecnologias:**
- React + TypeScript
- TailwindCSS para UI
- Fetch API para comunicação com backend
- NextAuth para autenticação

---

### TAREFA 7: Google Cloud Credentials no Servidor ⚠️

**Você precisará fazer manualmente:**

1. **Criar projeto no Google Cloud Console**
   - https://console.cloud.google.com/

2. **Ativar Google Vision API**
   - APIs & Services > Library > "Cloud Vision API" > Enable

3. **Criar Service Account**
   - APIs & Services > Credentials > Create Credentials > Service Account
   - Role: "Cloud Vision API User" ou "Editor"

4. **Baixar JSON de credenciais**
   - Keys > Add Key > Create new key > JSON
   - Arquivo será baixado

5. **Upload para servidor:**
   ```bash
   # No seu Mac
   scp -i ~/Downloads/ssh-key-2026-01-09.key \
       google_credentials.json \
       ubuntu@129.80.198.250:/home/ubuntu/translator-credentials/
   
   # No servidor
   sudo chown -R 1000:1000 /home/ubuntu/translator-credentials
   sudo chmod 600 /home/ubuntu/translator-credentials/google_credentials.json
   ```

---

### TAREFA 8: Copiar Modelo para Servidor ⚠️

**Você precisará fazer manualmente:**

O modelo Gemma 2 2B treinado está em:
`translator-pdf-api/translator-model/final_model_gemma_sft/`

**Opção 1: SCP (direto do seu Mac)**
```bash
# Comprimir modelo
cd "translator-pdf-api/translator-model"
tar -czf final_model_gemma_sft.tar.gz final_model_gemma_sft/

# Upload (~500MB, pode demorar)
scp -i ~/Downloads/ssh-key-2026-01-09.key \
    final_model_gemma_sft.tar.gz \
    ubuntu@129.80.198.250:/home/ubuntu/

# No servidor
ssh -i ~/Downloads/ssh-key-2026-01-09.key ubuntu@129.80.198.250
mkdir -p /home/ubuntu/translator-model
cd /home/ubuntu/translator-model
tar -xzf ../final_model_gemma_sft.tar.gz
rm ../final_model_gemma_sft.tar.gz
```

**Opção 2: Git LFS (se subir no repo)**
```bash
# Adicionar .gitattributes para arquivos grandes
*.safetensors filter=lfs diff=lfs merge=lfs -text
*.bin filter=lfs diff=lfs merge=lfs -text

# Commit e push
git lfs track "*.safetensors"
git add .gitattributes translator-pdf-api/translator-model/
git commit -m "Add translator model with Git LFS"
git push
```

---

## ⚙️ CONFIGURAÇÕES NO CLOUDFLARE

### **Boa Notícia: Nenhuma mudança necessária! 🎉**

Como vamos usar a rota `/translator-api/` no mesmo domínio:
- `https://api.pdf-utilities.com.br/translator-api/` (já coberto pelo DNS existente)

**Se fosse um subdomínio novo (`translator.pdf-utilities.com.br`), seria necessário:**
1. Criar registro DNS tipo A apontando para 129.80.198.250
2. Deixar "Proxied" desativado (DNS only) igual ao `api.*`
3. Configurar SSL no Nginx

**Mas não é o caso! ✅**

---

## 📊 ESTIMATIVAS

### Recursos do Servidor:
- **Disco:** +7GB (imagem Docker) + 500MB (modelo) = ~8GB
- **RAM:** +8GB durante tradução (pico)
- **CPU:** Intensivo durante inferência do modelo

### Performance:
- **Build inicial:** ~30 minutos
- **Rebuild (sem cache):** ~5-10 minutos
- **Tempo por página:** ~5-10 segundos
- **PDF de 10 páginas:** ~1-2 minutos

### Custos Google Cloud Vision:
- **1000 páginas/mês:** Grátis
- **Acima disso:** $1.50 por 1000 páginas
- **Exemplo:** 5000 páginas = $6/mês

---

## 🚀 ORDEM DE EXECUÇÃO

### FASE 1: Preparação (Manual - Você)
1. ✅ Criar projeto Google Cloud + Ativar Vision API
2. ✅ Baixar `google_credentials.json`
3. ✅ Upload credenciais para servidor
4. ✅ Upload modelo Gemma para servidor

### FASE 2: Desenvolvimento (AI)
5. ✅ Criar `translator-pdf-api/Dockerfile`
6. ✅ Criar `translator-pdf-api/main.py` (API)
7. ✅ Criar `translator-pdf-api/requirements.txt`
8. ✅ Atualizar `docker-compose.yml`
9. ✅ Atualizar `nginx.conf`
10. ✅ Criar componente `TranslatorPDFUploader.tsx`
11. ✅ Atualizar página `app/tradutor-tecnico/page.tsx`

### FASE 3: Deploy & Testes
12. ✅ Push para GitHub
13. ✅ Aguardar rebuild automático
14. ✅ Testar localmente: `curl -X POST ...`
15. ✅ Testar via interface web
16. ✅ Validar tradução end-to-end

---

## ⚠️ RISCOS E MITIGAÇÕES

### Risco 1: Container muito grande (>7GB)
**Mitigação:** 
- Multi-stage build
- Usar imagem slim do Python
- Limpeza de cache do pip

### Risco 2: Modelo lento sem GPU
**Mitigação:**
- Usar CPU inference otimizado
- Processar em batch pequeno
- Implementar fila para múltiplos requests

### Risco 3: Credenciais Google vazadas
**Mitigação:**
- Volume read-only no Docker
- Permissões 600 no arquivo
- Nunca commitar no Git
- Rotacionar keys periodicamente

### Risco 4: Alto uso de RAM
**Mitigação:**
- Limitar requests simultâneos (burst=2)
- Lazy loading do modelo
- Implementar swap se necessário

---

## 📝 PRÓXIMOS PASSOS

**O que você precisa fazer AGORA:**

1. **Confirmar que tem o modelo treinado:**
   ```bash
   ls -lh "translator-pdf-api/translator-model/final_model_gemma_sft/"
   ```

2. **Escolher método de upload do modelo** (Opção 1 ou 2 acima)

3. **Criar projeto Google Cloud e baixar credenciais**

4. **Confirmar que podemos começar a implementação**

**Depois eu implemento todo o resto automaticamente.**

---

## ❓ DÚVIDAS?

- **Posso usar FastAPI ao invés de Flask?** Sim, FastAPI é melhor para isso.
- **Preciso configurar Cloudflare?** Não, usamos rota existente.
- **Quanto tempo leva?** Build inicial ~30min, depois rápido.
- **E se o modelo não couber?** Podemos usar quantização (4-bit).

---

**Pronto para começar?** 🚀

Confirme que:
1. [ ] Modelo Gemma está disponível localmente
2. [ ] Você pode criar projeto Google Cloud
3. [ ] Servidor tem ~10GB de espaço livre
4. [ ] Podemos começar a implementação

Depois me avise e eu começo! 💪


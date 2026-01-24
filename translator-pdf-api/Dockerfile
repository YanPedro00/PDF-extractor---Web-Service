# Dockerfile para Translator PDF API - Gemma 2 2B + Google Vision API
# Multi-stage build otimizado para ARM64

# Stage 1: Base com dependências do sistema
FROM python:3.11-slim AS base

# Variáveis de ambiente
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Para pdf2image
    poppler-utils \
    # Para Pillow
    libjpeg-dev \
    zlib1g-dev \
    # Para compilação
    build-essential \
    gcc \
    g++ \
    # Utilitários
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Stage 2: Instalar dependências Python
FROM base AS dependencies

# Copiar requirements
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir -r requirements.txt

# Stage 3: Runtime
FROM base AS runner

# Copiar dependências instaladas
COPY --from=dependencies /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=dependencies /usr/local/bin /usr/local/bin

# Copiar código da aplicação
COPY src/ /app/src/
COPY main.py /app/
COPY gunicorn_conf.py /app/

# Criar diretórios necessários
RUN mkdir -p /app/temp /app/output && \
    chmod 777 /app/temp /app/output

# Expor porta
EXPOSE 8082

# Health check
HEALTHCHECK --interval=60s --timeout=30s --start-period=120s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8082/health || exit 1

# Comando de inicialização
CMD ["gunicorn", "--config", "gunicorn_conf.py", "main:app"]


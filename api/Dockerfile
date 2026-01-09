# Dockerfile para API OCR com Ghostscript
# FORÇAR x86_64/AMD64 (PaddleOCR não funciona em ARM64 nativo)
# Railway usa x86_64, aqui emulamos no ARM64 via QEMU
FROM --platform=linux/amd64 python:3.13-slim

# Instalar dependências do sistema (incluindo Ghostscript)
RUN apt-get update && apt-get install -y \
    ghostscript \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar requirements
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Baixar modelos (se existir o script)
RUN python3 download_models.py || true

# Variáveis de ambiente
ENV PORT=8080 \
    OPENCV_IO_ENABLE_OPENEXR=0 \
    QT_QPA_PLATFORM=offscreen \
    OPENCV_HEADLESS=1 \
    OPENCV_AVOID_OPENGL=1 \
    OPENCV_SKIP_OPENCL=1 \
    DISPLAY=:99 \
    PADDLE_DISABLE_SIGNAL_HANDLER=1 \
    FLAGS_use_mkldnn=0 \
    FLAGS_use_cudnn=0 \
    OMP_NUM_THREADS=2 \
    OPENBLAS_NUM_THREADS=2 \
    MKL_NUM_THREADS=2 \
    DISABLE_MODEL_SOURCE_CHECK=True

# Expor porta
EXPOSE 8080

# Comando de start com Gunicorn (modo threads para economizar memória)
CMD ["gunicorn", "--config", "gunicorn_conf.py", "pdf_ocr_api:app"]

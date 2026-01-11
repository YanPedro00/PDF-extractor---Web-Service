# Dockerfile para API OCR com PaddleOCR ARM64 NATIVO
# Python 3.11 é CRÍTICO - 3.13 tem bugs com PaddlePaddle em ARM64
# Solução baseada em issues do GitHub e fóruns da comunidade
FROM python:3.11-slim

# Instalar dependências do sistema (incluindo Ghostscript)
# PaddleOCR requer: OpenCV deps, Ghostscript para compressão
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

# Instalar dependências Python COM VERSÕES RECENTES ARM64
# PaddlePaddle 3.2.2 é a versão mais recente estável (necessária para PaddleOCR moderno)
# PaddleOCR requer PaddlePaddle 3.0+ para funcionar corretamente
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir paddlepaddle==3.2.2 && \
    pip install --no-cache-dir paddleocr && \
    pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Variáveis de ambiente OTIMIZADAS PARA ARM64
# Baseado em issues do GitHub e testes da comunidade
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
    FLAGS_fraction_of_gpu_memory_to_use=0.1 \
    OPENBLAS_CORETYPE=ARMV8 \
    OMP_NUM_THREADS=4 \
    OPENBLAS_NUM_THREADS=4 \
    MKL_NUM_THREADS=1 \
    DISABLE_MODEL_SOURCE_CHECK=True

# Expor porta
EXPOSE 8080

# Comando de start com Gunicorn (modo threads para economizar memória)
CMD ["gunicorn", "--config", "gunicorn_conf.py", "pdf_ocr_api:app"]

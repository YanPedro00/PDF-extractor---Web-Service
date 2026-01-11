# Dockerfile para API OCR com PaddleOCR via ONNX Runtime (ARM64 otimizado)
# Python 3.10 é mais estável com PaddleOCR em ARM64
# ONNX Runtime usa instruções NEON nativas do ARM (não AVX/MKL Intel)
FROM python:3.10-slim-bookworm

# Instalar dependências ARM64 otimizadas (seguindo recomendações Gemini)
# libopenblas-dev: Álgebra linear ARM-nativa (substitui MKL Intel)
# opencv-python-headless será instalado via pip (mais leve para containers)
RUN apt-get update && apt-get install -y \
    ghostscript \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    libopenblas-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar requirements
COPY requirements.txt .

# ESTRATÉGIA ONNX RUNTIME (Recomendação Gemini para ARM64)
# ONNX Runtime usa instruções NEON do ARM (não AVX/MKL Intel que causam segfault)
# opencv-python-headless: Sem dependências GUI (mais leve para containers)
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir opencv-python-headless && \
    pip install --no-cache-dir onnxruntime && \
    pip install --no-cache-dir paddleocr>=2.6 && \
    pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Variáveis de ambiente ARM64 - RECOMENDAÇÕES GEMINI
# OMP_NUM_THREADS=1: CRÍTICO! Múltiplos threads causam segfault em ARM64
# FLAGS_use_gpu=0: Força CPU (evita detecção incorreta de GPU)
# OPENBLAS_CORETYPE=ARMV8: Usa instruções ARM nativas
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
    FLAGS_use_gpu=0 \
    FLAGS_fraction_of_gpu_memory_to_use=0.1 \
    OPENBLAS_CORETYPE=ARMV8 \
    OMP_NUM_THREADS=1 \
    OPENBLAS_NUM_THREADS=1 \
    MKL_NUM_THREADS=1 \
    DISABLE_MODEL_SOURCE_CHECK=True

# Expor porta
EXPOSE 8080

# Comando de start com Gunicorn (modo threads para economizar memória)
CMD ["gunicorn", "--config", "gunicorn_conf.py", "pdf_ocr_api:app"]

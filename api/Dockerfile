# Dockerfile para API OCR com EasyOCR (ARM64 100% compatível)
# Após 4 tentativas frustradas com PaddleOCR, EasyOCR é a única solução estável
# EasyOCR: 90-95% precisão, 100% estável ARM64, zero segfaults
FROM python:3.11-slim

# Instalar dependências do sistema para EasyOCR + Ghostscript
# EasyOCR requer OpenCV deps básicas (muito mais simples que PaddleOCR)
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

# Instalar EasyOCR + dependências
# IMPORTANTE: opencv-contrib-python DEPOIS do img2table para não ser sobrescrito
# img2table[easyocr] instala opencv-python, então forçamos reinstall do contrib
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir img2table[easyocr]>=1.4.2 && \
    pip install --no-cache-dir easyocr>=1.7.0 && \
    pip uninstall -y opencv-python opencv-python-headless && \
    pip install --no-cache-dir opencv-contrib-python

# Copiar código da aplicação
COPY . .

# Variáveis de ambiente para EasyOCR (muito mais simples!)
# EasyOCR não tem problemas de threading/GPU em ARM64
ENV PORT=8080 \
    OPENCV_IO_ENABLE_OPENEXR=0 \
    QT_QPA_PLATFORM=offscreen \
    OPENCV_HEADLESS=1 \
    OPENCV_AVOID_OPENGL=1 \
    OPENCV_SKIP_OPENCL=1 \
    DISPLAY=:99 \
    OMP_NUM_THREADS=4

# Expor porta
EXPOSE 8080

# Comando de start com Gunicorn (modo threads para economizar memória)
CMD ["gunicorn", "--config", "gunicorn_conf.py", "pdf_ocr_api:app"]

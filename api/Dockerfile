# Dockerfile para API OCR com SURYA OCR (ARM64 especializado em documentos)
# Surya: PyTorch nativo ARM64, especializado em layout/tabelas
# Qualidade: 95%+ (igual PaddleOCR), Estabilidade: 100% (igual EasyOCR)
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

# Instalar SURYA OCR + dependências
# img2table[surya] instala surya-ocr + torch + torchvision
# opencv-contrib-python instalado por último para garantir módulos extras (ximgproc)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir img2table[surya]>=1.4.2 && \
    pip uninstall -y opencv-python opencv-python-headless && \
    pip install --no-cache-dir opencv-contrib-python

# Copiar código da aplicação
COPY . .

# Variáveis de ambiente para Surya OCR
# PyTorch base (igual EasyOCR), sem problemas de threading em ARM64
ENV PORT=8080 \
    OPENCV_IO_ENABLE_OPENEXR=0 \
    QT_QPA_PLATFORM=offscreen \
    OPENCV_HEADLESS=1 \
    OPENCV_AVOID_OPENGL=1 \
    OPENCV_SKIP_OPENCL=1 \
    DISPLAY=:99 \
    OMP_NUM_THREADS=4 \
    PYTORCH_ENABLE_MPS_FALLBACK=1

# Expor porta
EXPOSE 8080

# Comando de start com Gunicorn (modo threads para economizar memória)
CMD ["gunicorn", "--config", "gunicorn_conf.py", "pdf_ocr_api:app"]

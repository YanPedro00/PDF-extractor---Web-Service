FROM python:3.13-slim

# Instalar dependências do sistema necessárias para OpenCV headless
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar requirements primeiro (para cache de layers)
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip uninstall -y opencv-python opencv-contrib-python opencv-python-headless || true && \
    pip install --no-cache-dir opencv-contrib-python-headless>=4.8.0 && \
    pip install --no-cache-dir -r requirements.txt && \
    pip uninstall -y opencv-python opencv-contrib-python || true

# Copiar código da aplicação
COPY . .

# Baixar modelos do PaddleOCR durante o build
RUN python3 download_models.py || true

# Variáveis de ambiente para OpenCV headless
ENV OPENCV_IO_ENABLE_OPENEXR=0
ENV QT_QPA_PLATFORM=offscreen
ENV DISPLAY=:99
ENV OPENCV_HEADLESS=1
ENV OPENCV_AVOID_OPENGL=1
ENV OPENCV_SKIP_OPENCL=1
ENV PORT=5003

# Expor porta
EXPOSE 5003

# Comando para iniciar a aplicação
CMD ["python3", "pdf_ocr_api.py"]


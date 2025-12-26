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
# IMPORTANTE: Instalar opencv-contrib-python-headless ANTES de img2table
RUN pip install --no-cache-dir --upgrade pip && \
    pip uninstall -y opencv-python opencv-python-headless || true && \
    pip install --no-cache-dir opencv-contrib-python-headless>=4.8.0 && \
    python3 -c "import cv2; print(f'✅ OpenCV {cv2.__version__} instalado')" && \
    pip install --no-cache-dir flask==3.0.0 flask-cors==4.0.0 && \
    pip install --no-cache-dir img2table>=1.4.2 && \
    pip install --no-cache-dir paddleocr>=2.7.0 paddlepaddle>=2.5.0 && \
    pip install --no-cache-dir pandas>=2.1.4 openpyxl>=3.1.2 && \
    pip uninstall -y opencv-python || true && \
    python3 -c "import cv2; print(f'✅ OpenCV {cv2.__version__} ainda disponível após instalação')"

# Copiar código da aplicação
COPY . .

# Verificar cv2 e img2table antes de baixar modelos
RUN python3 -c "import cv2; print(f'✅ cv2 disponível: {cv2.__version__}')" && \
    python3 -c "from img2table.ocr import PaddleOCR; print('✅ img2table pode importar PaddleOCR')" && \
    python3 download_models.py || echo "Aviso: Modelos serão baixados na primeira requisição"

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

# Build: Fri Dec 26 13:57:09 -04 2025

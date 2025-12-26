FROM python:3.13-slim

# Instalar dependências do sistema necessárias para OpenCV headless e PaddleOCR
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Definir diretório de trabalho
WORKDIR /app

# Copiar requirements primeiro (para cache de layers)
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip uninstall -y opencv-python opencv-python-headless || true && \
    pip install --no-cache-dir opencv-contrib-python-headless>=4.8.0 && \
    python3 -c "import cv2; print(f'✅ OpenCV {cv2.__version__} instalado')" && \
    pip install --no-cache-dir -r requirements.txt && \
    pip uninstall -y opencv-python || true && \
    python3 -c "import cv2; print(f'✅ OpenCV {cv2.__version__} ainda disponível')"

# Copiar código da aplicação
COPY . .

# Verificar dependências antes de baixar modelos
RUN python3 -c "import cv2; print(f'✅ cv2 disponível: {cv2.__version__}')" && \
    python3 -c "from paddleocr import PaddleOCR; print('✅ PaddleOCR pode ser importado')" && \
    python3 -c "import fitz; print('✅ PyMuPDF disponível')" && \
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

#!/bin/bash
# Script para iniciar a API de OCR

echo "🚀 Iniciando API de OCR..."
echo "📦 Instalando dependências..."

# Criar virtual environment se não existir
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Ativar virtual environment
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Iniciar servidor
echo "✅ Dependências instaladas"
echo "🌐 Iniciando servidor em http://localhost:5000"
python pdf_ocr_api.py


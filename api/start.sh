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

# Iniciar servidor com Gunicorn (modo baixa memória)
echo "✅ Dependências instaladas"
echo "🌐 Iniciando servidor Gunicorn em http://localhost:5003"
echo "⚡ Modo: 1 worker + 2 threads (baixa memória)"
gunicorn --config gunicorn_conf.py pdf_ocr_api:app


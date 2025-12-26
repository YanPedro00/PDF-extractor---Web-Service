#!/bin/bash
# Script para garantir que opencv-python-headless seja usado
# Remove opencv-python se instalado e força instalação do headless

echo "🔧 Configurando OpenCV headless..."

# Desinstalar opencv-python se existir
pip uninstall -y opencv-python 2>/dev/null || true

# Garantir que opencv-python-headless está instalado
pip install opencv-python-headless>=4.8.0 --force-reinstall --no-deps || pip install opencv-python-headless>=4.8.0

echo "✅ OpenCV headless configurado!"


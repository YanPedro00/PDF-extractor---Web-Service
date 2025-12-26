#!/bin/bash
# Script para instalar dependências do sistema necessárias para OpenCV headless
# Este script é usado como fallback se o Dockerfile não for usado

set -e

echo "🔧 Instalando bibliotecas do sistema para OpenCV..."

# Verificar se temos permissão para usar apt-get
if command -v apt-get >/dev/null 2>&1; then
    echo "📦 Sistema com apt-get detectado"
    
    # Tentar instalar bibliotecas (pode falhar se não tiver permissão)
    if apt-get update -qq 2>/dev/null; then
        apt-get install -y --no-install-recommends \
            libgl1-mesa-glx \
            libglib2.0-0 \
            libsm6 \
            libxext6 \
            libxrender-dev \
            2>/dev/null || echo "⚠️  Não foi possível instalar bibliotecas (pode precisar de sudo)"
        echo "✅ Tentativa de instalação concluída"
    else
        echo "⚠️  Não foi possível executar apt-get (pode precisar de sudo ou usar Dockerfile)"
    fi
else
    echo "⚠️  apt-get não disponível. Use Dockerfile para instalar bibliotecas do sistema."
fi


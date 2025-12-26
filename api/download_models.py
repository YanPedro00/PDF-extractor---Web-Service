#!/usr/bin/env python3
"""
Script para baixar modelos do PaddleOCR durante o build
Isso garante que os modelos estejam prontos quando o container iniciar
"""
# Configurar variáveis de ambiente ANTES de qualquer import
import os
os.environ['OPENCV_IO_ENABLE_OPENEXR'] = '0'
os.environ['QT_QPA_PLATFORM'] = 'offscreen'
os.environ['DISPLAY'] = ':99'

import sys

print("📥 Baixando modelos do PaddleOCR durante o build...")
print("⏳ Isso pode levar alguns minutos, mas é melhor fazer durante o build do que na primeira requisição")

try:
    from img2table.ocr import PaddleOCR
    
    print("🔍 Inicializando PaddleOCR para baixar modelos...")
    ocr = PaddleOCR(
        lang="pt",
        use_angle_cls=True,
        use_gpu=False,
        show_log=True  # Mostrar progresso do download
    )
    
    print("✅ Modelos do PaddleOCR baixados com sucesso!")
    print("📦 Os modelos estão prontos para uso quando o container iniciar")
    
except Exception as e:
    print(f"❌ Erro ao baixar modelos: {e}")
    print("⚠️  Os modelos serão baixados na primeira requisição (pode demorar)")
    sys.exit(0)  # Não falhar o build, apenas avisar


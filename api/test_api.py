#!/usr/bin/env python3
"""
Script para testar a API localmente e ver erros detalhados
"""
import sys
import traceback

# Configurar variáveis de ambiente ANTES de qualquer import
import os
os.environ['OPENCV_IO_ENABLE_OPENEXR'] = '0'
os.environ['QT_QPA_PLATFORM'] = 'offscreen'
os.environ['DISPLAY'] = ':99'
os.environ['OPENCV_HEADLESS'] = '1'
os.environ['OPENCV_AVOID_OPENGL'] = '1'
os.environ['OPENCV_SKIP_OPENCL'] = '1'

print("🔍 Testando imports...")
try:
    from paddleocr import PaddleOCR
    print("✅ PaddleOCR importado")
except Exception as e:
    print(f"❌ Erro ao importar PaddleOCR: {e}")
    traceback.print_exc()
    sys.exit(1)

try:
    import fitz
    print("✅ PyMuPDF (fitz) importado")
except Exception as e:
    print(f"❌ Erro ao importar PyMuPDF: {e}")
    traceback.print_exc()
    sys.exit(1)

print("\n🔍 Testando inicialização do PaddleOCR...")
try:
    ocr = PaddleOCR(lang="pt", use_textline_orientation=True)
    print("✅ PaddleOCR inicializado com sucesso")
except Exception as e:
    print(f"❌ Erro ao inicializar PaddleOCR: {e}")
    traceback.print_exc()
    sys.exit(1)

print("\n✅ Todos os testes passaram! API pronta para rodar.")

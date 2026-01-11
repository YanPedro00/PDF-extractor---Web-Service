#!/usr/bin/env python3
"""
Script de teste SURYA OCR local
Para entender a API EXATA do Surya 0.17.0 antes de integrar no img2table
"""

import sys
import os
from pathlib import Path
from PIL import Image
import fitz  # PyMuPDF

# Adicionar path do projeto
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

print("=" * 70)
print("🔍 TESTE SURYA OCR 0.17.0 - API CORRETA")
print("=" * 70)

# 1. IMPORTAR SURYA
print("\n📦 1. Importando Surya...")
try:
    from surya.models import load_predictors
    from surya.recognition import RecognitionPredictor
    from surya.detection import DetectionPredictor
    print("✅ Surya importado com sucesso!")
    print(f"   RecognitionPredictor: {RecognitionPredictor}")
    print(f"   DetectionPredictor: {DetectionPredictor}")
    print(f"   load_predictors: {load_predictors}")
except ImportError as e:
    print(f"❌ Erro ao importar: {e}")
    sys.exit(1)

# 2. CARREGAR MODELOS (usando load_predictors)
print("\n🧠 2. Carregando modelos Surya...")
try:
    # load_predictors carrega TUDO (detection + recognition)
    predictors = load_predictors()
    print(f"✅ Predictors carregados!")
    print(f"   Tipo: {type(predictors)}")
    print(f"   Keys: {predictors.keys() if isinstance(predictors, dict) else 'N/A'}")
    
    # Separar os predictors
    if isinstance(predictors, dict):
        det_predictor = predictors.get('detection') or predictors.get('det')
        rec_predictor = predictors.get('recognition') or predictors.get('rec')
    else:
        # Se retornar algo diferente, tentar usar diretamente
        det_predictor = DetectionPredictor()
        rec_predictor = RecognitionPredictor()
    
    print(f"   Detection predictor: {det_predictor}")
    print(f"   Recognition predictor: {rec_predictor}")
    
except Exception as e:
    print(f"❌ Erro ao carregar modelos: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

# 3. CONVERTER PDF PARA IMAGENS
pdf_path = project_root / "validation" / "INVOICETESTE.pdf"
if not pdf_path.exists():
    print(f"❌ PDF não encontrado: {pdf_path}")
    sys.exit(1)

print(f"\n📄 3. Convertendo PDF para imagens...")
print(f"   Arquivo: {pdf_path.name}")

try:
    pdf_doc = fitz.open(str(pdf_path))
    images = []
    
    for page_num in range(min(1, len(pdf_doc))):  # Só primeira página para teste
        page = pdf_doc[page_num]
        # Converter para imagem (150 DPI)
        pix = page.get_pixmap(matrix=fitz.Matrix(150/72, 150/72))
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        images.append(img)
        print(f"   ✅ Página {page_num + 1}: {pix.width}x{pix.height}px")
    
    pdf_doc.close()
    print(f"✅ {len(images)} página(s) convertidas (teste limitado a 1)")
except Exception as e:
    print(f"❌ Erro ao converter PDF: {e}")
    sys.exit(1)

# 4. TESTAR API DO SURYA
print("\n🧪 4. Testando Surya OCR...")
print("=" * 70)

# TESTE 1: Ver assinatura do RecognitionPredictor
print("\n📝 TESTE 1: Inspecionando RecognitionPredictor.__call__")
try:
    import inspect
    sig = inspect.signature(rec_predictor.__call__)
    print(f"   Assinatura: {sig}")
    print(f"   Parâmetros:")
    for param_name, param in sig.parameters.items():
        print(f"     - {param_name}: {param.annotation} = {param.default}")
except Exception as e:
    print(f"❌ Erro ao inspecionar: {e}")

# TESTE 2: Chamar RecognitionPredictor com diferentes formas
print("\n📝 TESTE 2: Tentando chamar RecognitionPredictor...")

# 2A: Sem argumentos extras
print("\n   2A: rec_predictor(images)")
try:
    result = rec_predictor(images)
    print(f"   ✅ FUNCIONOU!")
    print(f"      Tipo resultado: {type(result)}")
    print(f"      Len: {len(result) if hasattr(result, '__len__') else 'N/A'}")
    if result:
        print(f"      Primeiro item: {type(result[0])}")
        if hasattr(result[0], '__dict__'):
            print(f"      Atributos: {list(result[0].__dict__.keys())[:10]}")
except Exception as e:
    print(f"   ❌ FALHOU: {e}")

# 2B: Com languages como parâmetro
print("\n   2B: rec_predictor(images, languages=['pt'])")
try:
    result = rec_predictor(images, languages=['pt'])
    print(f"   ✅ FUNCIONOU!")
except Exception as e:
    print(f"   ❌ FALHOU: {e}")

# 2C: Com langs como parâmetro
print("\n   2C: rec_predictor(images, langs=['pt'])")
try:
    result = rec_predictor(images, langs=['pt'])
    print(f"   ✅ FUNCIONOU!")
except Exception as e:
    print(f"   ❌ FALHOU: {e}")

# TESTE 3: Fluxo completo (detection + recognition)
print("\n📝 TESTE 3: Fluxo completo (detection + recognition)")
try:
    # Detection primeiro
    print("   Rodando detection...")
    det_results = det_predictor(images)
    print(f"   ✅ Detection OK: {len(det_results)} resultado(s)")
    
    # Recognition depois
    print("   Rodando recognition...")
    rec_results = rec_predictor(images)
    print(f"   ✅ Recognition OK: {len(rec_results)} resultado(s)")
    
    # Mostrar conteúdo
    if rec_results and len(rec_results) > 0:
        result = rec_results[0]
        print(f"\n   📊 Resultado página 1:")
        print(f"      Tipo: {type(result)}")
        if hasattr(result, 'text_lines'):
            print(f"      Linhas de texto: {len(result.text_lines)}")
            if result.text_lines:
                first_line = result.text_lines[0]
                print(f"      Primeira linha: {first_line}")
        if hasattr(result, 'text'):
            print(f"      Texto: {result.text[:200]}...")
            
except Exception as e:
    print(f"   ❌ FALHOU: {e}")
    import traceback
    traceback.print_exc()

# CONCLUSÃO
print("\n" + "=" * 70)
print("✅ ANÁLISE CONCLUÍDA!")
print("=" * 70)
print("\n💡 Agora sabemos como o Surya funciona!")
print("   Próximo passo: adaptar para img2table")
print("=" * 70)

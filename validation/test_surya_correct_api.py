#!/usr/bin/env python3
"""
TESTE FINAL: API CORRETA DO SURYA 0.17.0
Descobrindo como fazer OCR completo com detection + recognition
"""

import sys
from pathlib import Path
from PIL import Image
import fitz

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

print("="*70)
print("🎯 SURYA OCR 0.17.0 - API CORRETA DESCOBERTA!")
print("="*70)

# Importar Surya
from surya.models import load_predictors

# Carregar predictors
print("\n🧠 Carregando modelos...")
predictors = load_predictors()
det_predictor = predictors['detection']
rec_predictor = predictors['recognition']
print("✅ Modelos carregados!")

# Carregar PDF
pdf_path = project_root / "validation" / "INVOICETESTE.pdf"
pdf_doc = fitz.open(str(pdf_path))

print(f"\n📄 Processando: {pdf_path.name}")

# Converter primeira página
page = pdf_doc[0]
pix = page.get_pixmap(matrix=fitz.Matrix(150/72, 150/72))
img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
pdf_doc.close()

images = [img]
print(f"   ✅ Imagem: {img.width}x{img.height}px")

# TESTE 1: Detection
print("\n🔍 1. Rodando DETECTION...")
det_results = det_predictor(images)
print(f"   ✅ Detection OK: {len(det_results)} resultado(s)")
print(f"   Tipo: {type(det_results[0])}")
if hasattr(det_results[0], 'bboxes'):
    print(f"   Bboxes detectadas: {len(det_results[0].bboxes)}")

# TESTE 2: Recognition COM det_predictor
print("\n🔍 2. Rodando RECOGNITION (com det_predictor)...")
rec_results = rec_predictor(images, det_predictor=det_predictor)
print(f"   ✅ Recognition OK: {len(rec_results)} resultado(s)")

# Mostrar resultados
result = rec_results[0]
print(f"\n📊 RESULTADO DA PÁGINA 1:")
print(f"   Tipo: {type(result)}")

if hasattr(result, 'text_lines'):
    print(f"   ✅ {len(result.text_lines)} linhas de texto detectadas!")
    print("\n   📝 Primeiras 5 linhas:")
    for i, line in enumerate(result.text_lines[:5]):
        if hasattr(line, 'text'):
            print(f"      {i+1}. {line.text}")
        else:
            print(f"      {i+1}. {line}")

if hasattr(result, 'languages'):
    print(f"\n   🌐 Idiomas detectados: {result.languages}")

# CONCLUSÃO
print("\n" + "="*70)
print("🎉 SUCESSO!")
print("="*70)
print("\n✅ API CORRETA DO SURYA 0.17.0:")
print("   1. Carregar: predictors = load_predictors()")
print("   2. Detection: det_results = det_predictor(images)")
print("   3. Recognition: rec_results = rec_predictor(images, det_predictor=det_predictor)")
print("   4. NÃO HÁ parâmetro 'langs' ou 'languages'!")
print("   5. Surya faz auto-detecção de idiomas")
print("\n💡 PROBLEMA NO IMG2TABLE:")
print("   O img2table.ocr.SuryaOCR está passando 'langs' internamente,")
print("   o que NÃO é compatível com Surya 0.17.0!")
print("="*70)


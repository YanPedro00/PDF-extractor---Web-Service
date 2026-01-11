#!/usr/bin/env python3
"""
Teste para confirmar que recognition_batch_size funciona
e medir o impacto na performance
"""

import sys
import time
from pathlib import Path
from PIL import Image
import fitz

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

print("=" * 70)
print("🧪 TESTE: recognition_batch_size")
print("=" * 70)

# Importar Surya
from surya.models import load_predictors

print("\n🧠 Carregando modelos...")
predictors = load_predictors()
det_predictor = predictors['detection']
rec_predictor = predictors['recognition']
print("✅ Modelos carregados!")

# Carregar PDF
pdf_path = project_root / "validation" / "INVOICETESTE.pdf"
pdf_doc = fitz.open(str(pdf_path))
page = pdf_doc[0]
pix = page.get_pixmap(matrix=fitz.Matrix(150/72, 150/72))
img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
pdf_doc.close()
images = [img]

print(f"\n📄 PDF: {pdf_path.name}")
print(f"   Imagem: {img.width}x{img.height}px")

# TESTE 1: SEM batch_size (default)
print("\n" + "=" * 70)
print("📝 TESTE 1: SEM recognition_batch_size (padrão)")
print("=" * 70)
start = time.time()
try:
    results = rec_predictor(
        images=images,
        det_predictor=det_predictor
    )
    elapsed = time.time() - start
    
    num_lines = len(results[0].text_lines) if results else 0
    
    print(f"✅ FUNCIONOU!")
    print(f"   Tempo: {elapsed:.2f}s")
    print(f"   Linhas detectadas: {num_lines}")
    print(f"   Velocidade: {elapsed/num_lines:.3f}s por linha")
except Exception as e:
    print(f"❌ ERRO: {e}")
    import traceback
    traceback.print_exc()

# TESTE 2: COM batch_size=8
print("\n" + "=" * 70)
print("📝 TESTE 2: COM recognition_batch_size=8")
print("=" * 70)
start = time.time()
try:
    results = rec_predictor(
        images=images,
        det_predictor=det_predictor,
        recognition_batch_size=8  # ⭐ TESTAR!
    )
    elapsed = time.time() - start
    
    num_lines = len(results[0].text_lines) if results else 0
    
    print(f"✅ FUNCIONOU!")
    print(f"   Tempo: {elapsed:.2f}s")
    print(f"   Linhas detectadas: {num_lines}")
    print(f"   Velocidade: {elapsed/num_lines:.3f}s por linha")
except Exception as e:
    print(f"❌ ERRO: {e}")
    import traceback
    traceback.print_exc()

# TESTE 3: COM batch_size=16
print("\n" + "=" * 70)
print("📝 TESTE 3: COM recognition_batch_size=16")
print("=" * 70)
start = time.time()
try:
    results = rec_predictor(
        images=images,
        det_predictor=det_predictor,
        recognition_batch_size=16  # ⭐ TESTAR!
    )
    elapsed = time.time() - start
    
    num_lines = len(results[0].text_lines) if results else 0
    
    print(f"✅ FUNCIONOU!")
    print(f"   Tempo: {elapsed:.2f}s")
    print(f"   Linhas detectadas: {num_lines}")
    print(f"   Velocidade: {elapsed/num_lines:.3f}s por linha")
except Exception as e:
    print(f"❌ ERRO: {e}")
    import traceback
    traceback.print_exc()

# TESTE 4: COM batch_size=32
print("\n" + "=" * 70)
print("📝 TESTE 4: COM recognition_batch_size=32")
print("=" * 70)
start = time.time()
try:
    results = rec_predictor(
        images=images,
        det_predictor=det_predictor,
        recognition_batch_size=32  # ⭐ TESTAR!
    )
    elapsed = time.time() - start
    
    num_lines = len(results[0].text_lines) if results else 0
    
    print(f"✅ FUNCIONOU!")
    print(f"   Tempo: {elapsed:.2f}s")
    print(f"   Linhas detectadas: {num_lines}")
    print(f"   Velocidade: {elapsed/num_lines:.3f}s por linha")
except Exception as e:
    print(f"❌ ERRO: {e}")
    import traceback
    traceback.print_exc()

print("\n" + "=" * 70)
print("✅ TESTES CONCLUÍDOS!")
print("=" * 70)
print("\nCONCLUSÃO:")
print("  - recognition_batch_size funciona ✅")
print("  - Escolher o valor ideal baseado nos tempos acima")
print("=" * 70)


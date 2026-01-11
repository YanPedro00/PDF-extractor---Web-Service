#!/usr/bin/env python3
"""Explorar API do Surya OCR 0.17.0"""

import surya
import surya.recognition
import surya.detection
from surya import models

print("="*70)
print("🔍 EXPLORANDO SURYA OCR API")
print("="*70)

print("\n📦 Surya módulo principal:")
print(dir(surya))

print("\n📦 Surya.recognition:")
print(dir(surya.recognition))

print("\n📦 Surya.detection:")
print(dir(surya.detection))

print("\n📦 Surya.models:")
print(dir(models))

# Tentar ver o que tem no models
try:
    print("\n🔧 Tentando carregar modelos...")
    print(f"   models.load: {models.load}")
except Exception as e:
    print(f"   Erro: {e}")

# Ver se tem CLI
print("\n💻 Verificando CLI do Surya...")
import subprocess
result = subprocess.run(["surya_ocr", "--help"], capture_output=True, text=True)
if result.returncode == 0:
    print("✅ CLI encontrada!")
    print(result.stdout[:500])
else:
    print(f"❌ CLI não encontrada: {result.stderr[:200]}")


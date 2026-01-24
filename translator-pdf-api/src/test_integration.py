#!/usr/bin/env python3
"""
Teste rápido da integração do Gemma 2 2B na pipeline
"""

from gemma_translator import GemmaTranslator

print("="*70)
print("🧪 TESTE DE INTEGRAÇÃO - GEMMA 2 2B NA PIPELINE")
print("="*70)
print()

# Criar tradutor
print("1. Criando tradutor...")
translator = GemmaTranslator()
print("   ✅ Instância criada (modelo será carregado no primeiro uso)")
print()

# Testar casos simples
test_cases = [
    "Brake hose (black)",
    "Clutch cable (brown)",
    "Use clamp to fix wire",
]

print("2. Testando traduções:")
print("-"*70)

for i, text in enumerate(test_cases, 1):
    print(f"\n[{i}] EN: {text}")
    translation = translator.translate(text)
    print(f"    PT: {translation}")

print()
print("="*70)
print("✅ INTEGRAÇÃO FUNCIONANDO!")
print("="*70)
print()
print("📌 Próximo passo: Execute a pipeline completa com:")
print("   cd /Users/yanpedro/Documents/translator-model-kmb/src")
print("   python run_pipeline.py")
print()


#!/usr/bin/env python3
"""
Script para baixar modelos do Surya OCR durante Docker build

PROPÓSITO:
- Baixar ~1.5GB de modelos DURANTE a build da imagem
- Evitar download na primeira execução (economiza 2-3 minutos)
- Modelos ficam cached na imagem Docker

MODELOS BAIXADOS:
- Detection model (~500MB)
- Recognition model (~700MB)
- Layout model (~1.3GB)
- Table recognition model (~200MB)

CACHE LOCATION:
- /root/.cache/datalab/models/ (dentro do container)
"""

import os
import sys

print("=" * 70)
print("📦 BAIXANDO MODELOS DO SURYA OCR 0.17.0")
print("=" * 70)

try:
    from surya.models import load_predictors
    print("\n✅ Surya importado com sucesso")
except ImportError as e:
    print(f"\n❌ ERRO: Surya não instalado: {e}")
    sys.exit(1)

# Configurar variáveis de ambiente para forçar CPU
os.environ['TORCH_DEVICE'] = 'cpu'
os.environ['CUDA_VISIBLE_DEVICES'] = ''

print("\n🔄 Iniciando download dos modelos...")
print("   (Isso pode levar 5-10 minutos dependendo da conexão)")
print()

try:
    # load_predictors() vai baixar TODOS os modelos necessários
    # Detection, Recognition, Layout, Table Recognition
    predictors = load_predictors()
    
    print("\n" + "=" * 70)
    print("✅ TODOS OS MODELOS BAIXADOS COM SUCESSO!")
    print("=" * 70)
    print("\n📊 Modelos disponíveis:")
    for name in predictors.keys():
        print(f"   ✅ {name}")
    
    print("\n📁 Localização do cache:")
    cache_dir = os.path.expanduser("~/.cache/datalab/models/")
    print(f"   {cache_dir}")
    
    # Listar tamanho total
    if os.path.exists(cache_dir):
        import subprocess
        result = subprocess.run(
            ['du', '-sh', cache_dir],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            size = result.stdout.split()[0]
            print(f"   Tamanho total: {size}")
    
    print("\n✅ Build pode continuar!")
    print("=" * 70)
    
except Exception as e:
    print(f"\n❌ ERRO ao baixar modelos: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)


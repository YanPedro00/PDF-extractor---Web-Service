#!/usr/bin/env python3
"""
Script para testar e comparar as duas engines de OCR
"""
import requests
import sys
import json
import base64
import time
from pathlib import Path

def test_api(api_url, pdf_path, engine_name):
    """Testa uma API e retorna resultados"""
    print(f"\n{'='*60}")
    print(f"🔧 Testando: {engine_name}")
    print(f"📍 URL: {api_url}")
    print(f"{'='*60}")
    
    try:
        # Health check
        print("🏥 Health check...")
        health_response = requests.get(f"{api_url}/health", timeout=5)
        if health_response.ok:
            print("✅ API está rodando")
        else:
            print("❌ API não está respondendo")
            return None
    except Exception as e:
        print(f"❌ Erro ao conectar: {e}")
        print(f"💡 Certifique-se que a API está rodando na porta correta")
        return None
    
    # Processar PDF
    print(f"📄 Processando: {Path(pdf_path).name}...")
    
    start_time = time.time()
    
    try:
        with open(pdf_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(
                f"{api_url}/process-pdf",
                files=files,
                timeout=300  # 5 minutos
            )
        
        elapsed = time.time() - start_time
        
        if response.ok:
            result = response.json()
            print(f"✅ Processado em {elapsed:.2f} segundos")
            
            # Salvar Excel
            if result.get('success') and result.get('excel_base64'):
                filename = result.get('filename', f'resultado_{engine_name}.xlsx')
                excel_bytes = base64.b64decode(result['excel_base64'])
                
                output_path = Path('resultados') / filename
                output_path.parent.mkdir(exist_ok=True)
                
                with open(output_path, 'wb') as f:
                    f.write(excel_bytes)
                
                print(f"💾 Excel salvo: {output_path}")
                
                return {
                    'success': True,
                    'time': elapsed,
                    'filename': filename,
                    'output_path': str(output_path)
                }
            else:
                print(f"❌ Resposta sem sucesso: {result}")
                return None
        else:
            print(f"❌ Erro na API: {response.status_code}")
            print(f"   {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Erro ao processar: {e}")
        return None


def main():
    if len(sys.argv) < 2:
        print("Uso: python test_both_engines.py <caminho_do_pdf>")
        print("\nExemplo:")
        print("  python test_both_engines.py ../validation/INVOICETESTE.pdf")
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    
    if not Path(pdf_path).exists():
        print(f"❌ Arquivo não encontrado: {pdf_path}")
        sys.exit(1)
    
    print("\n" + "="*60)
    print("🧪 TESTE DE COMPARAÇÃO DE ENGINES")
    print("="*60)
    print(f"📄 Arquivo: {Path(pdf_path).name}")
    print("="*60)
    
    # Testar ambas as engines
    engines = [
        {
            'name': 'Híbrida (PaddleOCR + img2table)',
            'url': 'http://localhost:5003'
        },
        {
            'name': 'PP-Structure (Unificada)',
            'url': 'http://localhost:5004'
        }
    ]
    
    results = {}
    
    for engine in engines:
        result = test_api(engine['url'], pdf_path, engine['name'])
        results[engine['name']] = result
    
    # Resumo
    print("\n" + "="*60)
    print("📊 RESUMO DA COMPARAÇÃO")
    print("="*60)
    
    for engine_name, result in results.items():
        print(f"\n🔧 {engine_name}")
        if result:
            print(f"   ✅ Sucesso")
            print(f"   ⏱️  Tempo: {result['time']:.2f}s")
            print(f"   📁 Arquivo: {result['output_path']}")
        else:
            print(f"   ❌ Falhou ou API não disponível")
    
    print("\n" + "="*60)
    print("💡 Próximos passos:")
    print("1. Abra os arquivos Excel gerados na pasta 'resultados/'")
    print("2. Compare a qualidade da extração")
    print("3. Verifique layout, completude e organização")
    print("="*60 + "\n")


if __name__ == '__main__':
    main()


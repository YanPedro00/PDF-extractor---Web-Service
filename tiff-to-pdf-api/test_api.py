"""
Script de teste para a API TIFF to PDF
"""

import requests
import sys
from pathlib import Path

API_URL = "http://localhost:8001"


def test_health():
    """Testa endpoint de health check"""
    print("\n🔍 Testando health check...")
    
    try:
        response = requests.get(f"{API_URL}/health")
        if response.status_code == 200:
            data = response.json()
            print("✅ API está saudável!")
            print(f"   Status: {data['status']}")
            print(f"   Dependências: {data['dependencies']}")
            return True
        else:
            print(f"❌ API retornou status {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Não foi possível conectar à API")
        print("   Certifique-se de que a API está rodando em http://localhost:8001")
        return False


def test_convert(tiff_file: str):
    """Testa conversão de TIFF para PDF"""
    print(f"\n📄 Testando conversão: {tiff_file}")
    
    # Verificar se arquivo existe
    if not Path(tiff_file).exists():
        print(f"❌ Arquivo não encontrado: {tiff_file}")
        return False
    
    try:
        # Obter informações primeiro
        print("   Obtendo informações do arquivo...")
        with open(tiff_file, 'rb') as f:
            response = requests.post(f"{API_URL}/convert/info", files={'file': f})
            
        if response.status_code == 200:
            info = response.json()
            print(f"   ✅ Arquivo: {info['filename']}")
            print(f"   ✅ Tamanho: {info['size_mb']} MB")
            print(f"   ✅ Páginas: {info['pages']}")
            print(f"   ✅ Dimensões: {info['width']}x{info['height']}")
            print(f"   ✅ Modo: {info['mode']}")
        
        # Converter para PDF
        print("   Convertendo para PDF...")
        with open(tiff_file, 'rb') as f:
            response = requests.post(
                f"{API_URL}/convert",
                files={'file': f},
                params={'optimize': True}
            )
        
        if response.status_code == 200:
            # Salvar PDF
            output_file = Path(tiff_file).stem + '_converted.pdf'
            with open(output_file, 'wb') as f:
                f.write(response.content)
            
            print(f"   ✅ PDF gerado com sucesso!")
            print(f"   ✅ Arquivo salvo: {output_file}")
            print(f"   ✅ Tamanho: {len(response.content) / 1024 / 1024:.2f} MB")
            return True
        else:
            print(f"   ❌ Erro na conversão: {response.status_code}")
            print(f"   {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erro: {str(e)}")
        return False


def main():
    """Função principal"""
    print("=" * 70)
    print("🧪 TESTE DA API TIFF TO PDF")
    print("=" * 70)
    
    # Testar health
    if not test_health():
        print("\n❌ API não está funcionando. Inicie com: python main.py")
        sys.exit(1)
    
    # Verificar se arquivo foi passado
    if len(sys.argv) < 2:
        print("\n📋 USO:")
        print("   python test_api.py <arquivo.tiff>")
        print("\nEXEMPLO:")
        print("   python test_api.py documento.tiff")
        sys.exit(0)
    
    # Testar conversão
    tiff_file = sys.argv[1]
    success = test_convert(tiff_file)
    
    print("\n" + "=" * 70)
    if success:
        print("✅ TODOS OS TESTES PASSARAM!")
    else:
        print("❌ ALGUNS TESTES FALHARAM")
    print("=" * 70)


if __name__ == "__main__":
    main()


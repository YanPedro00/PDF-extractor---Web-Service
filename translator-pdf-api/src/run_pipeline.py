#!/Library/Frameworks/Python.framework/Versions/3.13/bin/python3
"""
Pipeline completa - Orquestrador
Executa os 3 passos em sequência
"""

import sys
from pathlib import Path

# Importar os módulos
from extract_vision import extract_with_vision
from translate_json import translate_json
from rebuild_pdf import rebuild_pdf


def run_full_pipeline(pdf_path, credentials_path, start_page, end_page, output_pdf_path=None):
    """Executa pipeline completa em 3 etapas."""
    
    base_dir = Path(__file__).parent.parent
    
    # Definir caminhos
    extracted_json = base_dir / "output" / "vision_extracted.json"
    translated_json = base_dir / "output" / "vision_translated.json"
    
    # Usar output_pdf_path se fornecido, senão usar padrão
    if output_pdf_path:
        output_pdf = Path(output_pdf_path)
    else:
        output_pdf = base_dir / "output" / "translated_pdf_final.pdf"
    
    print("\n" + "=" * 70)
    print("🚀 PIPELINE DE TRADUÇÃO DE PDF")
    print("=" * 70)
    print(f"PDF: {pdf_path}")
    print(f"Páginas: {start_page}-{end_page}")
    print(f"Saída: {output_pdf}")
    print("=" * 70)
    
    try:
        # STEP 1: Extração
        print("\n[1/3] EXTRAÇÃO COM VISION API")
        print("-" * 70)
        extract_with_vision(
            str(pdf_path),
            str(credentials_path),
            str(extracted_json),
            start_page,
            end_page
        )
        
        # STEP 2: Tradução
        print("\n[2/3] TRADUÇÃO DO JSON")
        print("-" * 70)
        success = translate_json(str(extracted_json), str(translated_json))
        if not success:
            return False
        
        # STEP 3: Reconstrução
        print("\n[3/3] RECONSTRUÇÃO DO PDF")
        print("-" * 70)
        success = rebuild_pdf(str(pdf_path), str(translated_json), str(output_pdf))
        if not success:
            return False
        
        print("\n" + "=" * 70)
        print("✅ PIPELINE CONCLUÍDA COM SUCESSO!")
        print("=" * 70)
        print(f"\n📄 PDF traduzido: {output_pdf}")
        print(f"📊 Arquivos intermediários:")
        print(f"   - {extracted_json}")
        print(f"   - {translated_json}")
        print("\n" + "=" * 70)
        print()
        
        return True
        
    except Exception as e:
        print("\n" + "=" * 70)
        print("❌ ERRO NA PIPELINE:")
        print("=" * 70)
        print(f"  {e}")
        print("=" * 70)
        print()
        import traceback
        traceback.print_exc()
        return False


def main():
    """Função principal."""
    base_dir = Path(__file__).parent.parent
    
    pdf_path = base_dir / "database" / "pdf_teste.pdf"
    credentials_path = base_dir / "credentials" / "google_credentials.json"
    
    # Configurar páginas (pdf_teste.pdf tem 2 páginas)
    start_page = 1
    end_page = 2
    
    success = run_full_pipeline(
        str(pdf_path),
        str(credentials_path),
        start_page,
        end_page
    )
    
    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()

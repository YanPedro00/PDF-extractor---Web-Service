#!/Library/Frameworks/Python.framework/Versions/3.13/bin/python3
"""
Pipeline completa - Orquestrador
Executa os 3 passos em sequência
"""

import sys
from pathlib import Path

# Importar os módulos usando imports relativos
from .extract_vision import extract_with_vision
from .translate_json import translate_json
from .rebuild_pdf import rebuild_pdf


def run_full_pipeline(pdf_path, credentials_path, model_dir, output_dir, final_output_pdf_path, start_page, end_page):
    """Executa pipeline completa em 3 etapas."""
    
    # Definir caminhos de saída intermediários dentro do output_dir fornecido
    extracted_json = Path(output_dir) / "vision_extracted.json"
    translated_json = Path(output_dir) / "vision_translated.json"
    
    print("\n" + "=" * 70)
    print("🚀 PIPELINE DE TRADUÇÃO DE PDF")
    print("=" * 70)
    print(f"PDF: {pdf_path}")
    print(f"Páginas: {start_page}-{end_page}")
    print(f"Saída: {final_output_pdf_path}")
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
        success = translate_json(str(extracted_json), str(translated_json), model_dir)
        if not success:
            return False
        
        # STEP 3: Reconstrução
        print("\n[3/3] RECONSTRUÇÃO DO PDF")
        print("-" * 70)
        success = rebuild_pdf(str(pdf_path), str(translated_json), str(final_output_pdf_path))
        if not success:
            return False
        
        print("\n" + "=" * 70)
        print("✅ PIPELINE CONCLUÍDA COM SUCESSO!")
        print("=" * 70)
        print(f"\n📄 PDF traduzido: {final_output_pdf_path}")
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
    model_dir = base_dir / "translator-model" / "final_model_gemma_sft"
    output_dir = base_dir / "output"
    final_output_pdf_path = output_dir / "translated_pdf_final.pdf"
    
    # Configurar páginas (pdf_teste.pdf tem 2 páginas)
    start_page = 1
    end_page = 2
    
    success = run_full_pipeline(
        pdf_path=pdf_path,
        credentials_path=credentials_path,
        model_dir=model_dir,
        output_dir=output_dir,
        final_output_pdf_path=final_output_pdf_path,
        start_page=start_page,
        end_page=end_page
    )
    
    if not success:
        sys.exit(1)


if __name__ == "__main__":
    main()

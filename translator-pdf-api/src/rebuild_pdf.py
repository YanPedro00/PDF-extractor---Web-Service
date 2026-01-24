#!/Library/Frameworks/Python.framework/Versions/3.13/bin/python3
"""
STEP 3: Reconstrução do PDF com traduções
Input: output/vision_translated.json
Output: output/translated_pdf_final.pdf
"""

import json
from pathlib import Path
import fitz  # PyMuPDF


def calcular_bounding_box(vertices, scale_x, scale_y):
    """Converte vértices do Vision para Retângulo PyMuPDF."""
    xs = [v.get('x', 0) * scale_x for v in vertices]
    ys = [v.get('y', 0) * scale_y for v in vertices]
    return fitz.Rect(min(xs), min(ys), max(xs), max(ys))


def inserir_texto_ajustado(page, rect, text, fontname="helv"):
    """
    Insere texto com ajuste automático de fonte.
    Permite múltiplas linhas (word wrap).
    """
    if not text or not text.strip():
        return False
    
    fontsize = 10
    min_fontsize = 3
    
    while fontsize >= min_fontsize:
        try:
            result = page.insert_textbox(
                rect, text, fontsize=fontsize, fontname=fontname,
                align=fitz.TEXT_ALIGN_LEFT, color=(0, 0, 0), overlay=True
            )
            
            if result >= 0:
                return True
            else:
                fontsize -= 0.3
        except:
            fontsize -= 0.3
    
    return False


def rebuild_pdf(original_pdf_path, translated_json_path, output_pdf_path):
    """Reconstrói PDF com traduções."""
    print("\n" + "=" * 70)
    print("RECONSTRUÇÃO DO PDF")
    print("=" * 70)
    print(f"PDF Original: {original_pdf_path}")
    print(f"JSON Traduzido: {translated_json_path}")
    print(f"PDF Saída: {output_pdf_path}")
    print("=" * 70)
    print()
    
    # Carregar JSON
    if not Path(translated_json_path).exists():
        print(f"❌ Erro: JSON não encontrado: {translated_json_path}")
        return False
    
    with open(translated_json_path, 'r', encoding='utf-8') as f:
        vision_data = json.load(f)
    
    # Abrir PDF
    doc = fitz.open(original_pdf_path)
    
    total_paragraphs = 0
    paragraphs_inserted = 0
    
    for page_data in vision_data['pages']:
        page_num = page_data.get('page_number', 1) - 1
        
        if page_num >= len(doc):
            continue
        
        page = doc[page_num]
        
        print(f"📄 Página {page_num + 1}:")
        
        # Calcular escala
        vision_width = page_data['image_size']['width']
        vision_height = page_data['image_size']['height']
        pdf_width = page.rect.width
        pdf_height = page.rect.height
        scale_x = pdf_width / vision_width
        scale_y = pdf_height / vision_height
        
        # Processar blocos
        for block in page_data['blocks']:
            for paragraph in block['paragraphs']:
                total_paragraphs += 1
                
                # Obter tradução
                texto_traduzido = paragraph.get('translated_text', paragraph.get('original_text', ''))
                
                if not texto_traduzido or not texto_traduzido.strip():
                    continue
                
                # Calcular posições
                rect = calcular_bounding_box(paragraph['bounding_box']['vertices'], scale_x, scale_y)
                
                # Máscara branca (apagar original)
                mask_rect = fitz.Rect(rect.x0 - 2, rect.y0 - 2, rect.x1 + 2, rect.y1 + 2)
                page.draw_rect(mask_rect, color=None, fill=(1, 1, 1))
                
                # Retângulo expandido para texto
                text_rect = fitz.Rect(
                    rect.x0 - 2, rect.y0 - 2,
                    rect.x1 + rect.width * 0.15,
                    rect.y1 + rect.height * 0.15
                )
                
                # Inserir texto traduzido
                if inserir_texto_ajustado(page, text_rect, texto_traduzido):
                    paragraphs_inserted += 1
        
        print(f"  ✓ Processada\n")
    
    # Salvar
    Path(output_pdf_path).parent.mkdir(parents=True, exist_ok=True)
    doc.save(output_pdf_path, garbage=4, deflate=True, clean=True)
    doc.close()
    
    print("=" * 70)
    print("RESUMO:")
    print("=" * 70)
    print(f"  Parágrafos processados: {total_paragraphs}")
    if total_paragraphs > 0:
        print(f"  Parágrafos inseridos: {paragraphs_inserted} ({100*paragraphs_inserted/total_paragraphs:.1f}%)")
    else:
        print(f"  ⚠️  Nenhum parágrafo encontrado para processar!")
    print(f"  ✅ PDF salvo: {output_pdf_path}")
    print("=" * 70)
    print()
    
    return True


if __name__ == "__main__":
    base_dir = Path(__file__).parent.parent
    
    original_pdf = base_dir / "database" / "ZR902A_SOP_mass.pdf"
    translated_json = base_dir / "output" / "vision_translated.json"
    output_pdf = base_dir / "output" / "translated_pdf_final.pdf"
    
    rebuild_pdf(str(original_pdf), str(translated_json), str(output_pdf))


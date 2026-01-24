#!/Library/Frameworks/Python.framework/Versions/3.13/bin/python3
"""
STEP 1: Extração de texto usando Google Vision API
Gera: output/vision_extracted.json
"""

import json
from pathlib import Path
from google.cloud import vision
from google.oauth2 import service_account
from pdf2image import convert_from_path
import io


def setup_vision_client(credentials_path):
    """Configura cliente do Google Cloud Vision."""
    credentials = service_account.Credentials.from_service_account_file(
        credentials_path,
        scopes=['https://www.googleapis.com/auth/cloud-vision']
    )
    return vision.ImageAnnotatorClient(credentials=credentials)


def extract_bounding_box(bounding_box):
    """Converte bounding box do Vision API para formato simples."""
    vertices = [(v.x, v.y) for v in bounding_box.vertices]
    
    xs = [v[0] for v in vertices]
    ys = [v[1] for v in vertices]
    
    left = min(xs)
    top = min(ys)
    right = max(xs)
    bottom = max(ys)
    
    return {
        'left': left,
        'top': top,
        'width': right - left,
        'height': bottom - top,
        'vertices': [{'x': v[0], 'y': v[1]} for v in vertices]
    }


def extract_text_from_image_vision(image_pil, page_num, client):
    """Extrai texto de uma imagem usando Vision API."""
    print(f"  📄 Página {page_num}...")
    
    # Converter PIL para bytes
    img_byte_arr = io.BytesIO()
    image_pil.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    
    # Criar imagem para Vision API
    image = vision.Image(content=img_byte_arr)
    
    # Detectar texto
    response = client.document_text_detection(image=image)
    
    if response.error.message:
        raise Exception(f"Vision API Error: {response.error.message}")
    
    # Estrutura da página
    page_data = {
        'page_number': page_num,
        'image_size': {
            'width': image_pil.width,
            'height': image_pil.height
        },
        'full_text': response.full_text_annotation.text if response.full_text_annotation else "",
        'blocks': [],
        'total_blocks': 0,
        'total_paragraphs': 0,
        'total_words': 0
    }
    
    if not response.full_text_annotation:
        return page_data
    
    # Processar cada página
    for page in response.full_text_annotation.pages:
        for block in page.blocks:
            block_data = {
                'confidence': block.confidence,
                'bounding_box': extract_bounding_box(block.bounding_box),
                'paragraphs': []
            }
            
            for paragraph in block.paragraphs:
                paragraph_data = {
                    'confidence': paragraph.confidence,
                    'bounding_box': extract_bounding_box(paragraph.bounding_box),
                    'words': []
                }
                
                for word in paragraph.words:
                    word_text = ''.join([symbol.text for symbol in word.symbols])
                    
                    word_data = {
                        'text': word_text,
                        'confidence': word.confidence,
                        'bounding_box': extract_bounding_box(word.bounding_box),
                        'symbols': []
                    }
                    
                    for symbol in word.symbols:
                        symbol_data = {
                            'text': symbol.text,
                            'confidence': symbol.confidence,
                            'bounding_box': extract_bounding_box(symbol.bounding_box)
                        }
                        word_data['symbols'].append(symbol_data)
                    
                    paragraph_data['words'].append(word_data)
                    page_data['total_words'] += 1
                
                block_data['paragraphs'].append(paragraph_data)
                page_data['total_paragraphs'] += 1
            
            page_data['blocks'].append(block_data)
            page_data['total_blocks'] += 1
    
    return page_data


def extract_with_vision(pdf_path, credentials_path, output_path, start_page, end_page, dpi=300):
    """Extrai texto usando Google Vision API e salva em JSON."""
    print("\n" + "=" * 70)
    print("EXTRAÇÃO DE TEXTO (GOOGLE VISION API)")
    print("=" * 70)
    print(f"PDF: {pdf_path}")
    print(f"Páginas: {start_page}-{end_page}")
    print(f"Saída: {output_path}")
    print("=" * 70)
    print()
    
    # Setup Vision client
    client = setup_vision_client(credentials_path)
    
    # Converter PDF para imagens
    print(f"Convertendo PDF para imagens (DPI {dpi})...")
    images = convert_from_path(pdf_path, dpi=dpi, first_page=start_page, last_page=end_page)
    print(f"  ✓ {len(images)} páginas convertidas\n")
    
    # Extrair texto
    print("Extraindo texto com Vision API...\n")
    pages_data = []
    
    for i, image in enumerate(images, start=start_page):
        page_data = extract_text_from_image_vision(image, i, client)
        pages_data.append(page_data)
    
    # Preparar output
    output_data = {
        "pdf_file": Path(pdf_path).name,
        "extraction_method": "Google Cloud Vision API",
        "dpi": dpi,
        "total_pages_processed": len(pages_data),
        "page_range": f"{start_page}-{end_page}",
        "pages": pages_data
    }
    
    # Salvar JSON
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    # Estatísticas
    total_blocks = sum(p['total_blocks'] for p in pages_data)
    total_paragraphs = sum(p['total_paragraphs'] for p in pages_data)
    total_words = sum(p['total_words'] for p in pages_data)
    
    print("\n" + "=" * 70)
    print("RESUMO DA EXTRAÇÃO:")
    print("=" * 70)
    print(f"  Páginas: {len(pages_data)}")
    print(f"  Blocos: {total_blocks}")
    print(f"  Parágrafos: {total_paragraphs}")
    print(f"  Palavras: {total_words}")
    print(f"  ✅ Salvo em: {output_path}")
    print("=" * 70)
    print()


if __name__ == "__main__":
    base_dir = Path(__file__).parent.parent
    
    pdf_path = base_dir / "database" / "ZR902A_SOP_mass.pdf"
    credentials_path = base_dir / "credentials" / "google_credentials.json"
    output_path = base_dir / "output" / "vision_extracted.json"
    
    extract_with_vision(
        str(pdf_path),
        str(credentials_path),
        str(output_path),
        start_page=15,
        end_page=16
    )


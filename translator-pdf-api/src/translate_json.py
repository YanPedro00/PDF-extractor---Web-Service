#!/Library/Frameworks/Python.framework/Versions/3.13/bin/python3
"""
STEP 2: Tradução do JSON extraído
Input: output/vision_extracted.json
Output: output/vision_translated.json
"""

import json
from pathlib import Path
import time

# Importar o tradutor customizado Gemma 2 2B
from .gemma_translator import GemmaTranslator
import os

# Inicializar tradutor (lazy loading - só carrega quando necessário)
_translator = None

def get_translator(model_dir=None):
    """Obtém instância do tradutor (singleton)"""
    global _translator
    if _translator is None:
        # Usar model_dir do parâmetro, env var, ou padrão
        if model_dir is None:
            model_dir = os.environ.get('GEMMA_MODEL_DIR', None)
        _translator = GemmaTranslator(model_dir=model_dir)
    return _translator


def translate_text(text, model_dir=None, source_lang='en', target_lang='pt'):
    """
    Traduz texto usando Gemma 2 2B fine-tuned.
    
    Args:
        text: Texto em inglês para traduzir
        model_dir: Diretório do modelo (opcional)
        source_lang: Idioma de origem (não usado, mantido por compatibilidade)
        target_lang: Idioma de destino (não usado, mantido por compatibilidade)
    
    Returns:
        Texto traduzido em português
    """
    try:
        if not text or not text.strip():
            return text
        
        # Usar modelo Gemma 2 2B treinado
        translator = get_translator(model_dir)
        return translator.translate(text)
        
    except Exception as e:
        print(f"    ⚠️  Erro ao traduzir: {e}")
        return text


def add_translations(vision_data, model_dir=None):
    """Adiciona traduções aos parágrafos do JSON."""
    print("\n" + "=" * 70)
    print("TRADUÇÃO DE TEXTO")
    print("=" * 70)
    print()
    
    total_paragraphs = 0
    
    for page_data in vision_data['pages']:
        page_num = page_data['page_number']
        print(f"📄 Página {page_num}:")
        
        for block_idx, block in enumerate(page_data['blocks']):
            for para_idx, paragraph in enumerate(block['paragraphs']):
                # Reconstruir texto do parágrafo
                palavras = []
                for word in paragraph['words']:
                    text_content = "".join([sym['text'] for sym in word['symbols']])
                    palavras.append(text_content)
                
                texto_original = " ".join(palavras)
                total_paragraphs += 1
                
                # Traduzir
                texto_traduzido = translate_text(texto_original, model_dir)
                
                # Adicionar ao parágrafo
                paragraph['original_text'] = texto_original
                paragraph['translated_text'] = texto_traduzido
        
        print(f"  ✓ {len(page_data['blocks'])} blocos processados\n")
    
    print(f"✅ {total_paragraphs} parágrafos traduzidos\n")
    
    return vision_data


def translate_json(input_path, output_path, model_dir=None):
    """Traduz JSON extraído e salva novo JSON."""
    print("\n" + "=" * 70)
    print("TRADUÇÃO DE JSON")
    print("=" * 70)
    print(f"Input: {input_path}")
    print(f"Output: {output_path}")
    print(f"Model: {model_dir or os.environ.get('GEMMA_MODEL_DIR', 'default')}")
    print("=" * 70)
    print()
    
    # Carregar JSON
    if not Path(input_path).exists():
        print(f"❌ Erro: Arquivo não encontrado: {input_path}")
        return False
    
    with open(input_path, 'r', encoding='utf-8') as f:
        vision_data = json.load(f)
    
    print(f"✓ Carregado: {len(vision_data['pages'])} páginas\n")
    
    # Adicionar traduções
    vision_data = add_translations(vision_data, model_dir)
    
    # Adicionar informação de tradução
    vision_data['translation_method'] = "Gemma 2 2B LoRA Fine-tuned"
    vision_data['translation_note'] = "Modelo treinado para tradução técnica de peças de motocicleta (EN→PT)"
    vision_data['model_path'] = model_dir or os.environ.get('GEMMA_MODEL_DIR', 'translator-model/final_model_gemma_sft')
    
    # Salvar JSON traduzido
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(vision_data, f, ensure_ascii=False, indent=2)
    
    print("=" * 70)
    print(f"✅ JSON traduzido salvo: {output_path}")
    print("=" * 70)
    print()
    
    return True


if __name__ == "__main__":
    base_dir = Path(__file__).parent.parent
    
    input_path = base_dir / "output" / "vision_extracted.json"
    output_path = base_dir / "output" / "vision_translated.json"
    
    translate_json(str(input_path), str(output_path))


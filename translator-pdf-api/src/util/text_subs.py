import fitz  # PyMuPDF
import json

def meu_modelo_traducao(paragraph_data):
    """
    Retorna a tradução do parágrafo.
    Se houver 'translated_text' no JSON, usa ele.
    Caso contrário, retorna o texto original.
    """
    # Se já tem tradução no JSON, usa ela
    if 'translated_text' in paragraph_data:
        return paragraph_data['translated_text']
    
    # Se não, retorna o texto original
    if 'original_text' in paragraph_data:
        return paragraph_data['original_text']
    
    # Fallback: reconstruir das palavras
    palavras_originais = []
    for word in paragraph_data.get('words', []):
        text_content = "".join([sym['text'] for sym in word['symbols']])
        palavras_originais.append(text_content)
    
    return " ".join(palavras_originais)

def calcular_bounding_box(vertices, scale_x, scale_y):
    """
    Converte os vértices do Google Vision para um Retângulo PyMuPDF (x0, y0, x1, y1)
    com a escala correta aplicada.
    """
    xs = [v.get('x', 0) * scale_x for v in vertices]
    ys = [v.get('y', 0) * scale_y for v in vertices]
    return fitz.Rect(min(xs), min(ys), max(xs), max(ys))

def inserir_texto_ajustado(page, rect, text, fontname="helv"):
    """
    Insere texto dentro de um retângulo, ajustando o tamanho da fonte
    para caber na largura e altura disponíveis.
    Permite múltiplas linhas (word wrap).
    """
    if not text or not text.strip():
        return False
    
    fontsize = 10  # Tamanho inicial menor
    min_fontsize = 3  # Mínimo mais agressivo
    
    # Tentar inserir com tamanhos decrescentes de fonte
    while fontsize >= min_fontsize:
        try:
            # insert_textbox retorna:
            # > 0: sucesso (espaço sobrando)
            # 0: texto coube exatamente
            # < 0: texto não coube (overflow)
            result = page.insert_textbox(
                rect, 
                text, 
                fontsize=fontsize, 
                fontname=fontname, 
                align=fitz.TEXT_ALIGN_LEFT,
                color=(0, 0, 0),
                overlay=True  # Importante para sobrepor
            )
            
            if result >= 0:
                # Sucesso!
                return True
            else:
                # Não coube, tentar fonte menor
                fontsize -= 0.3
        except Exception as e:
            fontsize -= 0.3
    
    # Se chegou aqui, não conseguiu inserir mesmo com fonte mínima
    print(f"    ⚠️  Texto muito longo para o espaço: '{text[:40]}...'")
    return False

def processar_pdf(pdf_path, json_data, output_path):
    doc = fitz.open(pdf_path)
    
    # Estatísticas
    total_paragraphs = 0
    paragraphs_inserted = 0
    paragraphs_failed = 0
    
    # Vamos iterar pelas páginas do JSON
    for page_data in json_data['pages']:
        # O Google Vision usa 1-based index, fitz usa 0-based
        page_num = page_data.get('page_number', 1) - 1
        
        if page_num >= len(doc):
            print(f"Aviso: Página {page_num+1} não existe no PDF.")
            continue
            
        page = doc[page_num]
        
        print(f"\n📄 Processando página {page_num + 1}:")
        
        # --- CÁLCULO DE ESCALA (CRUCIAL) ---
        # Dimensões da imagem escaneada (do JSON)
        vision_width = page_data['image_size']['width']
        vision_height = page_data['image_size']['height']
        
        # Dimensões da página do PDF real (pontos)
        pdf_width = page.rect.width
        pdf_height = page.rect.height
        
        scale_x = pdf_width / vision_width
        scale_y = pdf_height / vision_height
        
        print(f"  Escala: {scale_x:.3f}x (largura), {scale_y:.3f}x (altura)")
        print(f"  Vision: {vision_width}x{vision_height} → PDF: {pdf_width:.0f}x{pdf_height:.0f}\n")
        
        # Iterar sobre os blocos de texto
        # DICA: Usar 'paragraphs' ou 'blocks' é melhor que 'words' para tradução de contexto
        for block_idx, block in enumerate(page_data['blocks'], 1):
            for para_idx, paragraph in enumerate(block['paragraphs'], 1):
                total_paragraphs += 1
                
                # 1. Obter tradução (já está no JSON ou fallback para original)
                texto_traduzido = meu_modelo_traducao(paragraph)
                
                if not texto_traduzido or not texto_traduzido.strip():
                    print(f"  Bloco {block_idx}, Parágrafo {para_idx}: [VAZIO] - pulando")
                    continue
                
                # 2. Obter coordenadas do parágrafo inteiro
                # O Vision dá bbox por parágrafo, o que é perfeito para substituir blocos
                rect = calcular_bounding_box(paragraph['bounding_box']['vertices'], scale_x, scale_y)
                
                # Pequeno ajuste de margem (padding) para cobrir totalmente o texto antigo
                # Aumentar um pouco mais para dar espaço ao texto traduzido (que geralmente é mais longo)
                mask_rect = fitz.Rect(rect.x0 - 2, rect.y0 - 2, rect.x1 + 2, rect.y1 + 2)
                
                # Aumentar retângulo para texto traduzido (15% maior em largura e altura)
                text_rect = fitz.Rect(
                    rect.x0 - 2, 
                    rect.y0 - 2, 
                    rect.x1 + rect.width * 0.15,  # 15% mais largo
                    rect.y1 + rect.height * 0.15  # 15% mais alto
                )
                
                # 3. Desenhar a máscara (Apagar o antigo)
                # fill=(1, 1, 1) é Branco RGB. Se o fundo for colorido, precisa detectar a cor antes.
                page.draw_rect(mask_rect, color=None, fill=(1, 1, 1))
                
                # 4. Escrever o novo texto (usando retângulo expandido)
                print(f"  Bloco {block_idx}, Parágrafo {para_idx}: '{texto_traduzido[:50]}...'")
                success = inserir_texto_ajustado(page, text_rect, texto_traduzido)
                
                if success:
                    paragraphs_inserted += 1
                else:
                    paragraphs_failed += 1

    doc.save(output_path)
    
    print("\n" + "=" * 70)
    print("RESUMO DO PROCESSAMENTO:")
    print("=" * 70)
    print(f"  Total de parágrafos: {total_paragraphs}")
    print(f"  Inseridos com sucesso: {paragraphs_inserted} ({100*paragraphs_inserted/total_paragraphs:.1f}%)")
    print(f"  Falhas na inserção: {paragraphs_failed} ({100*paragraphs_failed/total_paragraphs:.1f}%)")
    print("=" * 70)
    print(f"\n✅ Processamento concluído. Salvo em: {output_path}")

# --- EXECUÇÃO ---
if __name__ == "__main__":
    # Nome do arquivo PDF real (deve estar na mesma pasta)
    input_pdf = "/Users/yanpedro/Documents/translator-model-kmb/database/ZR902A_SOP_mass.pdf" 
    
    # Carrega o JSON que você forneceu (salve o json do seu prompt como 'vision_output.json')
    try:
        with open('/Users/yanpedro/Documents/translator-model-kmb/output/vision_extracted_translated.json', 'r', encoding='utf-8') as f:
            vision_data = json.load(f)
            
        # Executa
        # Nota: Como não tenho o PDF real aqui, o script vai falhar se não tiver o arquivo.
        # Crie um PDF em branco com o nome acima ou mude o nome para testar.
        print("Iniciando reconstrução do PDF...")
        try:
            processar_pdf(input_pdf, vision_data, "ZR902A_SOP_mass_TRADUZIDO.pdf")
        except Exception as e:
            print(f"Erro ao abrir PDF (Certifique-se que o arquivo existe): {e}")
            
    except FileNotFoundError:
        print("Por favor, salve o JSON do seu prompt em um arquivo chamado 'vision_output.json'")
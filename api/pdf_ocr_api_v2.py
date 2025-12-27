#!/usr/bin/env python3
"""
API Flask MELHORADA para processar PDFs com OCR usando PaddleOCR + img2table

Melhorias:
- Detecção de duplicação simplificada e mais precisa
- Clustering de colunas mais robusto
- Pré-processamento de imagem melhorado
- Código mais organizado e fácil de manter
"""
# CRÍTICO: Configurar variáveis de ambiente ANTES de qualquer import
import os
os.environ['OPENCV_IO_ENABLE_OPENEXR'] = '0'
os.environ['QT_QPA_PLATFORM'] = 'offscreen'
os.environ['DISPLAY'] = ':99'
os.environ['OPENCV_HEADLESS'] = '1'
os.environ['OPENCV_AVOID_OPENGL'] = '1'
os.environ['OPENCV_SKIP_OPENCL'] = '1'

import tempfile
import base64
import numpy as np
import cv2
from flask import Flask, request, jsonify
from flask_cors import CORS
from paddleocr import PaddleOCR
import pandas as pd
import io
import fitz  # PyMuPDF

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": "*"}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

ocr_instance = None

def get_ocr():
    """Inicializa ou retorna instância do PaddleOCR"""
    global ocr_instance
    if ocr_instance is None:
        print("🚀 Inicializando PaddleOCR...")
        ocr_instance = PaddleOCR(lang="pt", use_textline_orientation=True)
    return ocr_instance


def preprocess_image(img_array):
    """
    Pré-processa imagem para melhorar qualidade do OCR
    Mantém 3 canais RGB para compatibilidade com PaddleOCR
    """
    # Garantir que está em RGB
    if len(img_array.shape) == 2:
        img_array = cv2.cvtColor(img_array, cv2.COLOR_GRAY2RGB)
    
    # Denoise para remover ruído (em cada canal)
    denoised = cv2.fastNlMeansDenoisingColored(img_array, h=10, hColor=10)
    
    # Ajustar contraste usando CLAHE em cada canal
    lab = cv2.cvtColor(denoised, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l = clahe.apply(l)
    enhanced = cv2.merge([l, a, b])
    enhanced_rgb = cv2.cvtColor(enhanced, cv2.COLOR_LAB2RGB)
    
    return enhanced_rgb


def extract_table_texts_simple(tables_dict, page_idx):
    """
    Extrai textos das tabelas de forma SIMPLES
    Retorna apenas conjunto de textos normalizados completos
    """
    table_texts = set()
    if page_idx in tables_dict:
        for table in tables_dict[page_idx]:
            for _, row in table.df.iterrows():
                for cell in row:
                    if pd.notna(cell):
                        text = str(cell).strip().lower()
                        if len(text) > 2:
                            table_texts.add(text)
    return table_texts


def is_text_in_table(text, table_texts):
    """
    Verifica se texto já está na tabela usando estratégia SIMPLIFICADA
    Evita falsos positivos da versão anterior
    """
    text_normalized = text.strip().lower()
    
    # Verificação 1: Texto completo está na tabela
    if text_normalized in table_texts:
        return True
    
    # Verificação 2: Texto é substring de algum texto da tabela (> 80% do tamanho)
    for table_text in table_texts:
        if len(text_normalized) > 10 and text_normalized in table_text:
            if len(text_normalized) / len(table_text) > 0.8:
                return True
        if len(table_text) > 10 and table_text in text_normalized:
            if len(table_text) / len(text_normalized) > 0.8:
                return True
    
    return False


def cluster_columns_simple(x_positions):
    """
    Agrupa posições X em colunas usando método SIMPLES e ROBUSTO
    Usa K-means manual baseado em gaps
    """
    if not x_positions:
        return []
    
    sorted_x = sorted(set(x_positions))
    
    if len(sorted_x) == 1:
        return [sorted_x[0]]
    
    # Calcular gaps entre posições consecutivas
    gaps = [sorted_x[i+1] - sorted_x[i] for i in range(len(sorted_x)-1)]
    
    # Threshold: usar mediana dos gaps * 2 (mais robusto que média)
    threshold = np.median(gaps) * 2.5 if gaps else 30
    threshold = max(threshold, 20)  # Mínimo de 20 pixels
    
    # Agrupar posições com gap < threshold
    columns = []
    current_group = [sorted_x[0]]
    
    for i in range(1, len(sorted_x)):
        if sorted_x[i] - sorted_x[i-1] <= threshold:
            current_group.append(sorted_x[i])
        else:
            # Finalizar grupo atual (usar média como posição da coluna)
            columns.append(np.mean(current_group))
            current_group = [sorted_x[i]]
    
    # Adicionar último grupo
    if current_group:
        columns.append(np.mean(current_group))
    
    return columns


def organize_text_into_grid(page_data, line_tolerance=15):
    """
    Organiza textos em grid (linhas x colunas)
    Versão SIMPLIFICADA e mais robusta
    """
    if not page_data:
        return []
    
    # Ordenar por Y, depois X
    page_data.sort(key=lambda x: (x[0], x[1]))
    
    # Agrupar em linhas baseado em Y
    lines = []
    current_line = []
    current_y = None
    
    for y, x, text in page_data:
        if current_y is None or abs(y - current_y) <= line_tolerance:
            current_line.append((x, text, y))
            current_y = y if current_y is None else min(current_y, y)
        else:
            if current_line:
                # Ordenar linha por X
                current_line.sort(key=lambda item: item[0])
                lines.append(current_line)
            current_line = [(x, text, y)]
            current_y = y
    
    if current_line:
        current_line.sort(key=lambda item: item[0])
        lines.append(current_line)
    
    # Detectar colunas
    all_x = [x for line in lines for x, _, _ in line]
    column_positions = cluster_columns_simple(all_x)
    
    if not column_positions:
        return []
    
    # Criar grid
    grid = []
    for line in lines:
        row = [""] * len(column_positions)
        for x, text, _ in line:
            # Encontrar coluna mais próxima
            col_idx = min(range(len(column_positions)), 
                         key=lambda i: abs(column_positions[i] - x))
            # Concatenar se já tem texto nessa coluna
            if row[col_idx]:
                row[col_idx] += " " + text
            else:
                row[col_idx] = text
        grid.append(row)
    
    return grid


def get_table_y_position(table_df, all_text_data):
    """
    Estima posição Y de uma tabela baseado no primeiro texto encontrado
    """
    if not all_text_data or table_df.empty:
        return 0
    
    # Pegar primeira célula não-vazia da tabela
    first_cell_text = None
    for _, row in table_df.iterrows():
        for cell in row:
            if pd.notna(cell) and str(cell).strip():
                first_cell_text = str(cell).strip().lower()
                break
        if first_cell_text:
            break
    
    if not first_cell_text:
        return 0
    
    # Procurar esse texto nos dados extraídos
    for y, x, text in all_text_data:
        if first_cell_text in text.lower():
            return y
    
    # Fallback: meio da página
    return np.mean([y for y, _, _ in all_text_data]) if all_text_data else 0


@app.route('/health', methods=['GET'])
def health():
    """Endpoint de health check"""
    return jsonify({"status": "ok"})


@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    """Processa PDF com OCR - VERSÃO MELHORADA"""
    try:
        # Validações
        if 'file' not in request.files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400
        
        file = request.files['file']
        if file.filename == '' or not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Arquivo deve ser PDF"}), 400
        
        # Validar tamanho
        file.seek(0, 2)
        file_size = file.tell()
        file.seek(0)
        
        if file_size > 50 * 1024 * 1024:
            return jsonify({"error": f"Arquivo muito grande. Máximo: 50MB"}), 400
        
        print(f"📄 Processando: {file.filename} ({file_size / 1024 / 1024:.2f}MB)")
        
        # Salvar temporário
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            pdf_path = tmp_file.name
        
        try:
            ocr = get_ocr()
            pdf_document = fitz.open(pdf_path)
            num_pages = len(pdf_document)
            print(f"📄 {num_pages} página(s)")
            
            # ETAPA 1: Extrair tabelas com img2table
            all_tables = {}
            try:
                from img2table.document import PDF as Img2TablePDF
                from img2table.ocr import PaddleOCR as Img2TableOCR
                
                print("📊 Extraindo tabelas...")
                img2table_ocr = Img2TableOCR(lang="pt")
                img2table_doc = Img2TablePDF(src=pdf_path)
                all_tables = img2table_doc.extract_tables(
                    ocr=img2table_ocr,
                    implicit_rows=True,
                    borderless_tables=True,
                    min_confidence=50
                )
                print(f"✅ {sum(len(tables) for tables in all_tables.values())} tabela(s)")
            except Exception as e:
                print(f"⚠️  Erro ao extrair tabelas: {e}")
            
            # ETAPA 2: Processar cada página
            all_pages_data = []
            
            for page_num in range(num_pages):
                print(f"📖 Página {page_num + 1}/{num_pages}...")
                
                page = pdf_document[page_num]
                
                # Converter para imagem
                mat = fitz.Matrix(2.0, 2.0)
                pix = page.get_pixmap(matrix=mat)
                img_array = np.frombuffer(pix.samples, dtype=np.uint8).reshape(
                    pix.height, pix.width, pix.n
                )
                if pix.n == 4:
                    img_array = img_array[:, :, :3]
                
                # Pré-processar imagem (com fallback)
                try:
                    processed_img = preprocess_image(img_array)
                except Exception as e:
                    print(f"⚠️  Erro no pré-processamento, usando imagem original: {e}")
                    processed_img = img_array
                
                # Garantir que imagem tem 3 canais (RGB) para PaddleOCR
                if len(processed_img.shape) == 2:
                    processed_img = cv2.cvtColor(processed_img, cv2.COLOR_GRAY2RGB)
                elif processed_img.shape[2] == 4:
                    processed_img = processed_img[:, :, :3]
                
                # OCR
                result = ocr.predict(processed_img)
                
                # Extrair textos das tabelas (para evitar duplicação)
                table_texts = extract_table_texts_simple(all_tables, page_num)
                
                # Extrair palavras com coordenadas
                page_data = []
                if result:
                    for ocr_result in result:
                        rec_texts = ocr_result.get('rec_texts', []) if isinstance(ocr_result, dict) else getattr(ocr_result, 'rec_texts', [])
                        rec_scores = ocr_result.get('rec_scores', []) if isinstance(ocr_result, dict) else getattr(ocr_result, 'rec_scores', [])
                        rec_polys = ocr_result.get('rec_polys', []) if isinstance(ocr_result, dict) else getattr(ocr_result, 'rec_polys', [])
                        
                        for i, text in enumerate(rec_texts):
                            if text and i < len(rec_scores) and rec_scores[i] > 0.5:
                                # Verificar se não está na tabela
                                if not is_text_in_table(text, table_texts):
                                    if i < len(rec_polys) and rec_polys[i] is not None:
                                        poly = rec_polys[i]
                                        if len(poly) > 0:
                                            y = min(point[1] for point in poly)
                                            x = min(point[0] for point in poly)
                                            page_data.append((y, x, text))
                
                # Organizar texto em grid
                text_grid = organize_text_into_grid(page_data)
                
                # ETAPA 3: Combinar tabelas + texto em ordem Y
                combined_rows = []
                
                # Criar lista de itens com posição Y
                items_with_y = []
                
                # Adicionar linhas de texto
                for row_idx, row in enumerate(text_grid):
                    if any(cell.strip() for cell in row):  # Linha não-vazia
                        # Estimar Y médio da linha
                        y_estimate = row_idx * 50  # Estimativa simples
                        items_with_y.append((y_estimate, 'text', row))
                
                # Adicionar tabelas
                if page_num in all_tables:
                    for table in all_tables[page_num]:
                        table_y = get_table_y_position(table.df, page_data)
                        items_with_y.append((table_y, 'table', table.df))
                
                # Ordenar por Y e montar resultado final
                items_with_y.sort(key=lambda x: x[0])
                
                for _, item_type, item_data in items_with_y:
                    if item_type == 'table':
                        # Adicionar tabela
                        for _, row in item_data.iterrows():
                            combined_rows.append(row.tolist())
                    else:
                        # Adicionar linha de texto
                        combined_rows.append(item_data)
                
                # Fallback: se vazio, usar apenas texto
                if not combined_rows and text_grid:
                    combined_rows = text_grid
                
                # Normalizar colunas
                if combined_rows:
                    max_cols = max(len(row) for row in combined_rows)
                    normalized_rows = []
                    for row in combined_rows:
                        padded = row + [''] * (max_cols - len(row))
                        normalized_rows.append(padded[:max_cols])
                    
                    df = pd.DataFrame(normalized_rows)
                    all_pages_data.append((page_num + 1, df))
                    print(f"✅ Página {page_num + 1}: {len(combined_rows)} linhas")
                else:
                    df = pd.DataFrame([["Nenhum conteúdo encontrado"]])
                    all_pages_data.append((page_num + 1, df))
            
            # ETAPA 4: Criar Excel
            excel_buffer = io.BytesIO()
            with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
                for page_num, page_df in all_pages_data:
                    sheet_name = f"Pagina_{page_num}"
                    page_df.to_excel(
                        writer,
                        sheet_name=sheet_name[:31],
                        index=False,
                        header=False
                    )
            
            excel_buffer.seek(0)
            excel_base64 = base64.b64encode(excel_buffer.read()).decode('utf-8')
            
            print("✅ Processamento concluído!")
            return jsonify({
                "success": True,
                "excel_base64": excel_base64,
                "filename": file.filename.replace('.pdf', '_OCR.xlsx')
            })
            
        finally:
            if os.path.exists(pdf_path):
                os.unlink(pdf_path)
                
    except Exception as e:
        import traceback
        error_msg = str(e)
        print(f"❌ Erro: {error_msg}")
        print(traceback.format_exc())
        return jsonify({"error": f"Erro ao processar PDF: {error_msg}"}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5003))
    print("🚀 Iniciando API OCR MELHORADA...")
    print(f"📝 Endpoint: http://0.0.0.0:{port}/process-pdf")
    print(f"🌐 Health: http://0.0.0.0:{port}/health")
    
    try:
        get_ocr()
        print("✅ PaddleOCR pronto!")
    except Exception as e:
        print(f"⚠️  PaddleOCR será inicializado na primeira requisição: {e}")
    
    app.run(host='0.0.0.0', port=port, debug=False)


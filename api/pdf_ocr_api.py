#!/usr/bin/env python3
"""
API Flask para processar PDFs com OCR usando PaddleOCR

PaddleOCR oferece alta performance para extração de texto:
- Processamento rápido (12-15 páginas/minuto)
- Baixo uso de memória (~500MB-1GB)
- Alta precisão para OCR (95-98%)
- Extrai TODO o texto do PDF, não apenas tabelas
"""
# CRÍTICO: Configurar variáveis de ambiente ANTES de qualquer import
# Isso evita erro de libGL.so.1 no Railway
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
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from paddleocr import PaddleOCR
import pandas as pd
import io
import fitz  # PyMuPDF

app = Flask(__name__)
# Configurar CORS para permitir requisições do frontend
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": "*"}})

# Adicionar headers CORS manualmente em todas as respostas
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Inicializar PaddleOCR uma vez (reutilizar)
# Os modelos são baixados durante o build (veja download_models.py)
ocr_instance = None

def get_ocr():
    """Inicializa ou retorna instância do PaddleOCR
    
    Os modelos já foram baixados durante o build, então a inicialização é rápida.
    
    PaddleOCR oferece alta performance para OCR:
    - Processamento rápido (12-15 páginas/minuto)
    - Baixo uso de memória (~500MB-1GB)
    - Alta precisão para OCR (95-98%)
    - Extrai TODO o texto do PDF
    
    Configurações:
    - lang: idioma (pt = português)
    - use_angle_cls: detecta rotação de texto
    - use_gpu: False para CPU (True se tiver GPU disponível)
    """
    global ocr_instance
    if ocr_instance is None:
        print("🚀 Inicializando PaddleOCR (modelos já baixados durante o build)...")
        # PaddleOCR direto (não através do img2table)
        ocr_instance = PaddleOCR(
            lang="pt",
            use_textline_orientation=True,  # Detecta rotação de texto
            use_gpu=False,  # CPU mode
            show_log=False
        )
    return ocr_instance

@app.route('/health', methods=['GET'])
def health():
    """Endpoint de health check"""
    return jsonify({"status": "ok"})

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    """Processa PDF enviado e retorna Excel em base64 usando PaddleOCR
    Extrai TODO o texto do PDF, não apenas tabelas"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Nome de arquivo vazio"}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Arquivo deve ser PDF"}), 400
        
        # Validar tamanho do arquivo (limite de 50MB)
        file.seek(0, 2)  # Ir para o final do arquivo
        file_size = file.tell()
        file.seek(0)  # Voltar para o início
        
        MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
        if file_size > MAX_FILE_SIZE:
            return jsonify({
                "error": f"Arquivo muito grande ({file_size / 1024 / 1024:.1f}MB). Tamanho máximo: 50MB"
            }), 400
        
        print(f"📄 Processando PDF: {file.filename} ({file_size / 1024 / 1024:.2f}MB)")
        
        # Salvar arquivo temporário
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            pdf_path = tmp_file.name
        
        try:
            print("🔍 Iniciando OCR com PaddleOCR...")
            ocr = get_ocr()
            
            # Abrir PDF com PyMuPDF
            pdf_document = fitz.open(pdf_path)
            num_pages = len(pdf_document)
            print(f"📄 PDF tem {num_pages} página(s)")
            
            # Lista para armazenar texto de cada página
            all_pages_text = []
            
            # Processar cada página do PDF
            for page_num in range(num_pages):
                print(f"📖 Processando página {page_num + 1}/{num_pages}...")
                page = pdf_document[page_num]
                
                # Converter página em imagem (matriz numpy)
                # DPI alto para melhor qualidade OCR
                mat = fitz.Matrix(2.0, 2.0)  # Zoom 2x = ~144 DPI
                pix = page.get_pixmap(matrix=mat)
                
                # Converter para numpy array (formato que PaddleOCR espera)
                img_array = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
                
                # Se a imagem tem canal alpha, remover
                if pix.n == 4:  # RGBA
                    img_array = img_array[:, :, :3]  # Remover canal alpha
                
                # Extrair texto usando PaddleOCR
                result = ocr.ocr(img_array, cls=True)
                
                # Processar resultados do OCR
                page_text_lines = []
                if result and result[0]:
                    for line in result[0]:
                        if line and len(line) >= 2:
                            text_info = line[1]
                            if text_info and len(text_info) >= 2:
                                text = text_info[0]  # Texto extraído
                                confidence = text_info[1]  # Confiança
                                if text and confidence > 0.5:  # Filtrar por confiança mínima
                                    page_text_lines.append(text)
                
                # Adicionar texto da página à lista
                page_text = '\n'.join(page_text_lines)
                all_pages_text.append({
                    'page': page_num + 1,
                    'text': page_text,
                    'lines': page_text_lines
                })
                
                print(f"✅ Página {page_num + 1}: {len(page_text_lines)} linhas extraídas")
            
            pdf_document.close()
            
            if not all_pages_text or all(not p['text'].strip() for p in all_pages_text):
                return jsonify({
                    "error": "Nenhum texto encontrado no PDF"
                }), 400
            
            print(f"✅ Total: {sum(len(p['lines']) for p in all_pages_text)} linhas extraídas de {num_pages} página(s)")
            
            # Criar Excel em memória
            excel_buffer = io.BytesIO()
            with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
                # Criar uma planilha por página
                for page_data in all_pages_text:
                    page_num = page_data['page']
                    lines = page_data['lines']
                    
                    # Criar DataFrame com uma coluna de texto
                    df = pd.DataFrame(lines, columns=['Texto Extraído'])
                    sheet_name = f"Pagina_{page_num}"
                    df.to_excel(
                        writer,
                        sheet_name=sheet_name[:31],
                        index=False
                    )
            
            excel_buffer.seek(0)
            
            print("💾 Convertendo para base64...")
            # Converter para base64
            excel_base64 = base64.b64encode(excel_buffer.read()).decode('utf-8')
            
            print("✅ Processamento concluído com sucesso!")
            return jsonify({
                "success": True,
                "excel_base64": excel_base64,
                "filename": file.filename.replace('.pdf', '_OCR.xlsx')
            })
            
        finally:
            # Limpar arquivo temporário
            if os.path.exists(pdf_path):
                os.unlink(pdf_path)
                
    except Exception as e:
        import traceback
        error_msg = str(e)
        print(f"❌ Erro ao processar PDF: {error_msg}")
        print(traceback.format_exc())
        return jsonify({
            "error": f"Erro ao processar PDF: {error_msg}"
        }), 500

if __name__ == '__main__':
    # Railway fornece a porta via variável de ambiente PORT
    port = int(os.environ.get('PORT', 5003))
    print("🚀 Iniciando servidor API de OCR com PaddleOCR...")
    print(f"📝 Endpoint: http://0.0.0.0:{port}/process-pdf")
    print(f"🌐 Health check: http://0.0.0.0:{port}/health")
    print("📄 Extração de TODO o texto do PDF (não apenas tabelas)")
    
    # Inicializar PaddleOCR na inicialização (modelos já baixados durante build)
    print("🔧 Inicializando PaddleOCR...")
    try:
        get_ocr()  # Inicializa agora para garantir que está pronto
        print("✅ PaddleOCR pronto! API pronta para receber requisições.")
    except Exception as e:
        print(f"⚠️  Aviso: PaddleOCR será inicializado na primeira requisição: {e}")
    
    # Railway requer host 0.0.0.0 e debug=False em produção
    app.run(host='0.0.0.0', port=port, debug=False)

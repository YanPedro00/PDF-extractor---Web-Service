#!/usr/bin/env python3
"""
API Flask para processar PDFs com OCR usando img2table + PaddleOCR

PaddleOCR oferece alta performance para extração de tabelas:
- Processamento rápido (12-15 páginas/minuto)
- Baixo uso de memória (~500MB-1GB)
- Alta precisão para tabelas (95-98%)
"""
# CRÍTICO: Configurar variáveis de ambiente ANTES de qualquer import
# Isso evita erro de libGL.so.1 no Railway
import os
os.environ['OPENCV_IO_ENABLE_OPENEXR'] = '0'
os.environ['QT_QPA_PLATFORM'] = 'offscreen'
os.environ['DISPLAY'] = ':99'  # Dummy display para OpenCV headless

import tempfile
import base64
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from img2table.document import PDF
from img2table.ocr import PaddleOCR
import pandas as pd
import io

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
    - Alta precisão para extração de tabelas (95-98%)
    
    Configurações:
    - lang: idioma (pt = português)
    - use_angle_cls: detecta rotação de texto (importante para PDFs escaneados)
    - use_gpu: False para CPU (True se tiver GPU disponível)
    """
    global ocr_instance
    if ocr_instance is None:
        print("🚀 Inicializando PaddleOCR (modelos já baixados durante o build)...")
        ocr_instance = PaddleOCR(
            lang="pt",  # Português
            use_angle_cls=True,  # Detecção de rotação (importante para PDFs escaneados)
            use_gpu=False,  # False para CPU, True se tiver GPU
            show_log=False  # Reduz logs verbosos
        )
        print("✅ PaddleOCR inicializado com sucesso!")
    return ocr_instance

@app.route('/health', methods=['GET'])
def health():
    """Endpoint de health check"""
    return jsonify({"status": "ok"})

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    """Processa PDF enviado e retorna Excel em base64 usando PaddleOCR"""
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
            # Processar PDF com img2table + PaddleOCR
            ocr = get_ocr()
            doc = PDF(src=pdf_path)
            
            print("📊 Extraindo tabelas...")
            # Extrair tabelas usando PaddleOCR
            tabelas_extraidas = doc.extract_tables(
                ocr=ocr,
                implicit_rows=True,
                borderless_tables=True,
                min_confidence=50
            )
            
            print(f"✅ Encontradas {len(tabelas_extraidas)} páginas com tabelas")
            
            if not tabelas_extraidas:
                return jsonify({
                    "error": "Nenhuma tabela encontrada no PDF"
                }), 400
            
            # Criar Excel em memória
            excel_buffer = io.BytesIO()
            with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
                for pagina_idx, tabelas in tabelas_extraidas.items():
                    for tab_idx, tabela in enumerate(tabelas):
                        df = tabela.df
                        sheet_name = f"Pag_{pagina_idx + 1}_Tab_{tab_idx + 1}"
                        df.to_excel(
                            writer,
                            sheet_name=sheet_name[:31],
                            index=False,
                            header=False
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
    
    # Inicializar PaddleOCR na inicialização (modelos já baixados durante build)
    print("🔧 Inicializando PaddleOCR...")
    try:
        get_ocr()  # Inicializa agora para garantir que está pronto
        print("✅ PaddleOCR pronto! API pronta para receber requisições.")
    except Exception as e:
        print(f"⚠️  Aviso: PaddleOCR será inicializado na primeira requisição: {e}")
    
    # Railway requer host 0.0.0.0 e debug=False em produção
    app.run(host='0.0.0.0', port=port, debug=False)

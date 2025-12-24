#!/usr/bin/env python3
"""
API Flask para processar PDFs com OCR usando img2table + EasyOCR
"""
import os
import ssl
import tempfile
import base64
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from img2table.document import PDF
from img2table.ocr import EasyOCR
import pandas as pd
import io

# Desabilitar verificação SSL para downloads do EasyOCR
ssl._create_default_https_context = ssl._create_unverified_context

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

# Inicializar EasyOCR uma vez (reutilizar)
ocr_instance = None

def get_ocr():
    """Inicializa ou retorna instância do EasyOCR"""
    global ocr_instance
    if ocr_instance is None:
        ocr_instance = EasyOCR(lang=["pt", "en"])
    return ocr_instance

@app.route('/health', methods=['GET'])
def health():
    """Endpoint de health check"""
    return jsonify({"status": "ok"})

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    """Processa PDF enviado e retorna Excel em base64"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "Nenhum arquivo enviado"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "Nome de arquivo vazio"}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({"error": "Arquivo deve ser PDF"}), 400
        
        # Salvar arquivo temporário
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            pdf_path = tmp_file.name
        
        try:
            # Processar PDF com img2table
            ocr = get_ocr()
            doc = PDF(src=pdf_path)
            
            # Extrair tabelas
            tabelas_extraidas = doc.extract_tables(
                ocr=ocr,
                implicit_rows=True,
                borderless_tables=True,
                min_confidence=50
            )
            
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
            
            # Converter para base64
            excel_base64 = base64.b64encode(excel_buffer.read()).decode('utf-8')
            
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
        return jsonify({
            "error": f"Erro ao processar PDF: {str(e)}"
        }), 500

if __name__ == '__main__':
    # Railway fornece a porta via variável de ambiente PORT
    port = int(os.environ.get('PORT', 5003))
    print("🚀 Iniciando servidor API de OCR...")
    print(f"📝 Endpoint: http://0.0.0.0:{port}/process-pdf")
    print(f"🌐 Health check: http://0.0.0.0:{port}/health")
    # Railway requer host 0.0.0.0 e debug=False em produção
    app.run(host='0.0.0.0', port=port, debug=False)


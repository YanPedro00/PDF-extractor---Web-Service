#!/usr/bin/env python3
"""
API Flask SIMPLIFICADA - APENAS IMG2TABLE
Para faturas, notas fiscais e documentos com tabelas

VANTAGENS:
- Código limpo e simples (100 linhas vs 500)
- Zero duplicação (um único motor)
- Mais estável e rápido
- Cada página = 1 aba no Excel
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
import pandas as pd
import io
import re
import sys
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Importar dependências críticas no início para detectar erros cedo
try:
    import fitz  # PyMuPDF
    logger.info(f"PyMuPDF {fitz.__version__} carregado")
except ImportError as e:
    logger.critical(f"ERRO CRITICO: PyMuPDF nao encontrado: {e}")
    sys.exit(1)

try:
    from img2table.document import PDF as Img2TablePDF
    from img2table.ocr import PaddleOCR as Img2TableOCR
    logger.info("img2table carregado")
except ImportError as e:
    logger.critical(f"ERRO CRITICO: img2table nao encontrado: {e}")
    sys.exit(1)

# Cache global de OCR (Singleton Pattern)
# Reutiliza instância de OCR para economizar 2-3 segundos por request
_ocr_instance = None

def get_ocr():
    """
    Retorna instância singleton de OCR.
    Inicializa apenas uma vez e reutiliza nas próximas chamadas.
    """
    global _ocr_instance
    if _ocr_instance is None:
        logger.info("Inicializando instancia de OCR (PaddleOCR)...")
        _ocr_instance = Img2TableOCR(lang="pt")
        logger.info("Instancia de OCR criada e cacheada")
    else:
        logger.debug("Reutilizando instancia de OCR cacheada")
    return _ocr_instance

app = Flask(__name__)

# Configuração de CORS
# Permitir origens específicas
CORS(app, resources={
    r"/*": {
        "origins": "*",  # Temporário: permitir todas as origens
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": False
    }
})

# Rate Limiting para prevenir abuso
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per hour"],  # Limite global
    storage_uri="memory://",
    strategy="fixed-window"
)

@app.after_request
def after_request(response):
    # Headers de segurança adicionais
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response


def clean_text(text):
    """
    Remove caracteres inválidos para XML 1.0 de forma ULTRA AGRESSIVA
    
    XML 1.0 válido apenas permite:
    - #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
    """
    if text is None or text == '':
        return ''
    
    if not isinstance(text, str):
        text = str(text)
    
    # Regex para REMOVER caracteres inválidos para XML 1.0
    # Mantém apenas os ranges válidos da especificação XML
    illegal_xml_chars = re.compile(
        '[\x00-\x08\x0B-\x0C\x0E-\x1F\uD800-\uDFFF\uFFFE\uFFFF]'
    )
    
    # Remover caracteres inválidos
    cleaned = illegal_xml_chars.sub('', text)
    
    return cleaned.strip()


@app.route('/health', methods=['GET'])
@limiter.exempt  # Health check sem limite
def health():
    """Endpoint de health check"""
    return jsonify({"status": "ok"})


@app.route('/process-pdf', methods=['POST'])
@limiter.limit("10 per hour")  # Máximo 10 conversões por hora por IP
def process_pdf():
    """
    Processa PDF usando APENAS img2table
    Versão SIMPLIFICADA e ROBUSTA
    
    Rate Limit: 10 requisições por hora por IP
    """
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
        
        # Anonimizar nome do arquivo nos logs por segurança
        import hashlib
        file_hash = hashlib.sha256(file.filename.encode()).hexdigest()[:12]
        
        logger.info(f"{'='*60}")
        logger.info(f"Processando arquivo: {file_hash} ({file_size / 1024 / 1024:.2f}MB)")
        logger.info(f"Tipo: {file.content_type}")
        logger.info(f"IP: {get_remote_address()}")
        logger.info(f"{'='*60}")
        
        # Salvar temporário
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            pdf_path = tmp_file.name
        
        try:
            # Contar páginas
            pdf_doc = fitz.open(pdf_path)
            num_pages = len(pdf_doc)
            pdf_doc.close()
            logger.info(f"PDF possui {num_pages} pagina(s)")
            
            # Processar com img2table usando OCR cacheado
            logger.info("Extraindo tabelas com img2table...")
            img2table_ocr = get_ocr()  # Usa instância cacheada (otimização)
            img2table_doc = Img2TablePDF(src=pdf_path)
            
            all_tables = img2table_doc.extract_tables(
                ocr=img2table_ocr,
                implicit_rows=True,
                borderless_tables=True,
                min_confidence=50
            )
            
            total_tables = sum(len(tables) for tables in all_tables.values())
            logger.info(f"{total_tables} tabela(s) detectadas")
            
            # Processar cada página
            all_pages_data = []
            
            for page_num in range(num_pages):
                logger.info(f"Processando pagina {page_num + 1}/{num_pages}...")
                
                page_rows = []
                
                # Adicionar tabelas desta página
                if page_num in all_tables and len(all_tables[page_num]) > 0:
                    logger.info(f"  {len(all_tables[page_num])} tabela(s) nesta pagina")
                    
                    for table_idx, table in enumerate(all_tables[page_num]):
                        logger.debug(f"  Tabela {table_idx + 1}: {table.df.shape[0]} linhas x {table.df.shape[1]} colunas")
                        
                        # Adicionar cada linha da tabela
                        for _, row in table.df.iterrows():
                            cleaned_row = []
                            for cell in row:
                                if pd.notna(cell) and str(cell).strip():
                                    cleaned_row.append(clean_text(str(cell)))
                                else:
                                    cleaned_row.append('')
                            page_rows.append(cleaned_row)
                        
                        # Adicionar linha vazia entre tabelas
                        if table_idx < len(all_tables[page_num]) - 1:
                            page_rows.append([''])
                
                # Criar DataFrame para a página
                if page_rows:
                    # Normalizar colunas
                    max_cols = max(len(row) for row in page_rows)
                    normalized_rows = []
                    for row in page_rows:
                        padded = row + [''] * (max_cols - len(row))
                        normalized_rows.append(padded[:max_cols])
                    
                    df = pd.DataFrame(normalized_rows)
                    
                    # CORREÇÃO: Limpar TODAS as células do DataFrame antes de salvar
                    # Usar map() ao invés de applymap() (deprecado em pandas 2.1+)
                    for col in df.columns:
                        df[col] = df[col].map(lambda x: clean_text(str(x)) if pd.notna(x) and x != '' else '')
                    
                    all_pages_data.append((page_num + 1, df))
                    logger.info(f"  {len(page_rows)} linha(s) extraidas")
                else:
                    # Página sem conteúdo
                    df = pd.DataFrame([["Nenhum conteudo encontrado"]])
                    all_pages_data.append((page_num + 1, df))
                    logger.warning(f"  Nenhuma tabela detectada na pagina {page_num + 1}")
            
            # Criar Excel com abas por página
            logger.info(f"Gerando Excel com {len(all_pages_data)} aba(s)...")
            excel_buffer = io.BytesIO()
            
            try:
                with pd.ExcelWriter(excel_buffer, engine='openpyxl') as writer:
                    for page_num, page_df in all_pages_data:
                        # VALIDAÇÃO FINAL: Garantir que não há caracteres inválidos
                        # Substituir qualquer valor não-string por string vazia
                        page_df = page_df.fillna('')
                        
                        # Limpar AGRESSIVAMENTE todas as células
                        for col in page_df.columns:
                            def ultra_clean(x):
                                """Limpeza ultra agressiva + fallback ASCII"""
                                try:
                                    cleaned = clean_text(str(x))
                                    # Última camada: tentar encode/decode para remover caracteres problemáticos
                                    cleaned = cleaned.encode('utf-8', errors='ignore').decode('utf-8', errors='ignore')
                                    return cleaned
                                except:
                                    return ''  # Se falhar, retornar vazio
                            
                            page_df[col] = page_df[col].apply(ultra_clean)
                        
                        sheet_name = f"Pagina_{page_num}"
                        
                        try:
                            page_df.to_excel(
                                writer,
                                sheet_name=sheet_name[:31],  # Excel limita nomes a 31 chars
                                index=False,
                                header=False
                            )
                            logger.debug(f"  Aba '{sheet_name}' criada")
                        except Exception as e:
                            logger.warning(f"  Erro na pagina {page_num}: {e}")
                            # Tentar novamente convertendo TUDO para ASCII puro
                            for col in page_df.columns:
                                page_df[col] = page_df[col].apply(
                                    lambda x: str(x).encode('ascii', errors='ignore').decode('ascii')
                                )
                            page_df.to_excel(
                                writer,
                                sheet_name=sheet_name[:31],
                                index=False,
                                header=False
                            )
                            logger.info(f"  Aba '{sheet_name}' criada (modo ASCII)")
            except Exception as e:
                logger.error(f"Erro ao criar Excel: {e}")
                raise
            
            excel_buffer.seek(0)
            excel_base64 = base64.b64encode(excel_buffer.read()).decode('utf-8')
            
            logger.info(f"{'='*60}")
            logger.info("Processamento concluido com sucesso!")
            logger.info(f"{'='*60}")
            
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
        traceback_str = traceback.format_exc()
        
        # Log detalhado
        logger.error("ERRO DETALHADO:")
        logger.error(f"Tipo: {type(e).__name__}")
        logger.error(f"Mensagem: {error_msg}")
        logger.error(f"Traceback: {traceback_str}")
        
        return jsonify({"error": f"Erro ao processar PDF: {error_msg}"}), 500


@app.route('/compress-pdf', methods=['POST', 'OPTIONS'])
@limiter.limit("20 per hour")  # Máximo 20 compressões por hora por IP
def compress_pdf():
    """
    Comprime um PDF reduzindo o tamanho do arquivo
    
    Rate Limit: 20 requisições por hora por IP
    """
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        logger.info("="*60)
        logger.info("INICIANDO COMPRESSAO DE PDF")
        logger.info("="*60)
        
        # Validar request
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        
        pdf_file = request.files['file']
        compression_level = request.form.get('compression_level', 'medium')
        
        if pdf_file.filename == '':
            return jsonify({'error': 'Nome de arquivo vazio'}), 400
        
        if not pdf_file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Apenas arquivos PDF são aceitos'}), 400
        
        # Anonimizar nome do arquivo nos logs
        import hashlib
        file_hash = hashlib.sha256(pdf_file.filename.encode()).hexdigest()[:12]
        
        logger.info(f"Arquivo: {file_hash}")
        logger.info(f"Nivel de compressao: {compression_level}")
        logger.info(f"IP: {get_remote_address()}")
        
        # Salvar PDF temporário
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_input:
            pdf_file.save(temp_input.name)
            input_path = temp_input.name
        
        # Criar arquivo de saída
        output_path = tempfile.mktemp(suffix='_compressed.pdf')
        
        try:
            # Abrir PDF
            doc = fitz.open(input_path)
            original_size = os.path.getsize(input_path)
            logger.info(f"Tamanho original: {original_size / 1024:.2f} KB")
            
            # Configurar níveis de compressão
            compression_settings = {
                'low': {'deflate': 1, 'garbage': 1},
                'medium': {'deflate': 4, 'garbage': 3},
                'high': {'deflate': 9, 'garbage': 4}
            }
            
            settings = compression_settings.get(compression_level, compression_settings['medium'])
            
            # Salvar com compressão
            doc.save(
                output_path,
                garbage=settings['garbage'],
                deflate=True,
                deflate_images=True,
                deflate_fonts=True,
                clean=True
            )
            doc.close()
            
            # Verificar redução
            compressed_size = os.path.getsize(output_path)
            reduction = ((original_size - compressed_size) / original_size) * 100
            
            logger.info(f"Tamanho comprimido: {compressed_size / 1024:.2f} KB")
            logger.info(f"Reducao: {reduction:.1f}%")
            
            # Ler arquivo comprimido
            with open(output_path, 'rb') as f:
                pdf_data = f.read()
            
            # Converter para base64
            pdf_base64 = base64.b64encode(pdf_data).decode('utf-8')
            
            return jsonify({
                'success': True,
                'pdf': pdf_base64,
                'filename': pdf_file.filename.replace('.pdf', '_comprimido.pdf'),
                'original_size': original_size,
                'compressed_size': compressed_size,
                'reduction_percentage': round(reduction, 1)
            })
            
        finally:
            # Limpar arquivos temporários
            if os.path.exists(input_path):
                os.remove(input_path)
            if os.path.exists(output_path):
                os.remove(output_path)
        
    except Exception as e:
        import traceback
        traceback_str = traceback.format_exc()
        
        # Log detalhado
        logger.error("ERRO NA COMPRESSAO:")
        logger.error(f"Tipo: {type(e).__name__}")
        logger.error(f"Mensagem: {str(e)}")
        logger.error(f"Traceback: {traceback_str}")
        
        return jsonify({'error': f'Erro ao comprimir PDF: {str(e)}'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5003))
    logger.info("="*60)
    logger.info("API OCR SIMPLIFICADA - IMG2TABLE")
    logger.info("="*60)
    logger.info(f"Endpoint OCR: http://0.0.0.0:{port}/process-pdf")
    logger.info(f"Endpoint Compressao: http://0.0.0.0:{port}/compress-pdf")
    logger.info(f"Health: http://0.0.0.0:{port}/health")
    logger.info("Engine: img2table (PaddleOCR)")
    logger.info("Otimizacao: Cache de OCR ativado (Singleton Pattern)")
    logger.info("="*60)
    
    app.run(host='0.0.0.0', port=port, debug=False)

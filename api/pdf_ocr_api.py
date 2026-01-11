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
import shutil
import gc
import time
import threading
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
    logger.info("img2table + PaddleOCR carregado")
except ImportError as e:
    logger.critical(f"ERRO CRITICO: img2table nao encontrado: {e}")
    sys.exit(1)

# ============================================================================
# OTIMIZAÇÃO DE MEMÓRIA: Lazy Loading + Auto-unload do OCR
# ============================================================================
_ocr_instance = None
_ocr_last_used = None
_ocr_lock = threading.Lock()
_ocr_unload_timer = None

# Tempo de inatividade antes de descarregar OCR (em segundos)
OCR_UNLOAD_TIMEOUT = 300  # 5 minutos de inatividade

def _unload_ocr():
    """
    Descarrega instância OCR para liberar memória (~700MB-1GB).
    Chamado automaticamente após período de inatividade.
    """
    global _ocr_instance, _ocr_last_used
    with _ocr_lock:
        if _ocr_instance is not None:
            current_time = time.time()
            if _ocr_last_used and (current_time - _ocr_last_used) >= OCR_UNLOAD_TIMEOUT:
                logger.info("⚡ Descarregando OCR por inatividade (liberando ~700MB-1GB RAM)...")
                _ocr_instance = None
                _ocr_last_used = None
                # Forçar garbage collection agressivo
                gc.collect()
                gc.collect()  # Duas vezes para garantir
                logger.info("✅ OCR descarregado, memória liberada")

def _schedule_ocr_unload():
    """Agenda descarregamento do OCR após timeout"""
    global _ocr_unload_timer
    if _ocr_unload_timer:
        _ocr_unload_timer.cancel()
    _ocr_unload_timer = threading.Timer(OCR_UNLOAD_TIMEOUT, _unload_ocr)
    _ocr_unload_timer.daemon = True
    _ocr_unload_timer.start()

def get_ocr():
    """
    Retorna instância singleton de OCR com lazy loading otimizado.
    
    OTIMIZAÇÕES:
    - Lazy loading: carrega apenas quando necessário
    - Auto-unload: descarrega após 5 minutos de inatividade
    - PaddleOCR ARM64 nativo (Python 3.11 + versões corretas)
    - Thread-safe com lock
    """
    global _ocr_instance, _ocr_last_used
    
    with _ocr_lock:
        if _ocr_instance is None:
            logger.info("🚀 Inicializando PaddleOCR (ARM64 nativo - Python 3.11)...")
            
            # PaddleOCR com configuração ARM64 otimizada
            # lang="pt" para português
            # Img2TableOCR é wrapper simplificado (sem parâmetros avançados)
            _ocr_instance = Img2TableOCR(lang="pt")
            logger.info("✅ PaddleOCR inicializado (ARM64 nativo)")
        else:
            logger.debug("♻️  Reutilizando instância OCR cacheada")
        
        # Atualizar timestamp de último uso
        _ocr_last_used = time.time()
        
        # Agendar descarregamento automático
        _schedule_ocr_unload()
        
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
    
    # OTIMIZAÇÃO: Garbage collection agressivo após cada request
    # Libera memória de objetos temporários (PDFs, imagens, DataFrames)
    gc.collect()
    
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
        
        # Validar tamanho (reduzido para economizar memória)
        file.seek(0, 2)
        file_size = file.tell()
        file.seek(0)
        
        MAX_FILE_SIZE = 20 * 1024 * 1024  # 20MB (reduzido de 50MB)
        if file_size > MAX_FILE_SIZE:
            return jsonify({"error": f"Arquivo muito grande. Máximo: 20MB"}), 400
        
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


def detect_pdf_type(pdf_path):
    """
    Detecta se o PDF é escaneado ou tem texto selecionável
    Retorna: 'scanned' ou 'text'
    """
    doc = fitz.open(pdf_path)
    
    # Analisar primeiras 5 páginas (ou todas se for menor)
    pages_to_check = min(5, len(doc))
    total_text_chars = 0
    total_images = 0
    
    for page_num in range(pages_to_check):
        page = doc[page_num]
        
        # Contar caracteres de texto
        text = page.get_text().strip()
        total_text_chars += len(text)
        
        # Contar imagens
        images = page.get_images(full=True)
        total_images += len(images)
    
    doc.close()
    
    # Heurística: Se tem muitas imagens E pouco texto, é escaneado
    avg_text_per_page = total_text_chars / pages_to_check
    avg_images_per_page = total_images / pages_to_check
    
    logger.info(f"Analise: {avg_text_per_page:.0f} chars/pagina, {avg_images_per_page:.1f} imgs/pagina")
    
    if avg_images_per_page >= 1 and avg_text_per_page < 500:
        return 'scanned'
    else:
        return 'text'


def compress_scanned_pdf_ghostscript(input_path, output_path, compression_level):
    """
    Comprime PDF ESCANEADO usando Ghostscript
    Retorna True se comprimiu, False se ficou maior (usa original)
    """
    import subprocess
    
    quality_map = {
        'low': '/printer',
        'medium': '/ebook',
        'high': '/screen'
    }
    
    preset = quality_map.get(compression_level, '/ebook')
    
    gs_command = [
        'gs',
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.4',
        f'-dPDFSETTINGS={preset}',
        '-dNOPAUSE',
        '-dQUIET',
        '-dBATCH',
        f'-sOutputFile={output_path}',
        input_path
    ]
    
    try:
        result = subprocess.run(
            gs_command,
            capture_output=True,
            text=True,
            timeout=300,
            check=True
        )
        
        # Verificar se realmente diminuiu
        original_size = os.path.getsize(input_path)
        compressed_size = os.path.getsize(output_path)
        
        if compressed_size >= original_size:
            logger.warning("Ghostscript aumentou o arquivo - usando original")
            shutil.copy2(input_path, output_path)
            return False
        
        return True
        
    except FileNotFoundError:
        raise Exception("Ghostscript não instalado. Instale com: brew install ghostscript")
    except subprocess.TimeoutExpired:
        raise Exception("Timeout de 5 minutos excedido")
    except subprocess.CalledProcessError as e:
        raise Exception(f"Ghostscript falhou: {e.stderr}")


def compress_text_pdf_pymupdf(input_path, output_path, compression_level):
    """
    Comprime PDF COM TEXTO usando PyMuPDF
    Retorna True se comprimiu, False se ficou maior (usa original)
    """
    doc = fitz.open(input_path)
    
    garbage_settings = {
        'low': 1,
        'medium': 3,
        'high': 4
    }
    
    garbage_level = garbage_settings.get(compression_level, 3)
    
    # Salvar com compressão
    doc.save(
        output_path,
        garbage=garbage_level,
        deflate=True,
        deflate_images=True,
        deflate_fonts=True,
        clean=True
    )
    doc.close()
    
    # Verificar se realmente diminuiu
    original_size = os.path.getsize(input_path)
    compressed_size = os.path.getsize(output_path)
    
    if compressed_size >= original_size:
        logger.warning("PyMuPDF aumentou o arquivo - usando original")
        shutil.copy2(input_path, output_path)
        return False
    
    return True


@app.route('/compress-pdf', methods=['POST', 'OPTIONS'])
@limiter.limit("20 per hour")  # Máximo 20 compressões por hora por IP
def compress_pdf():
    """
    Comprime um PDF reduzindo o tamanho do arquivo
    SOLUÇÃO HÍBRIDA:
    - PDFs Escaneados: Ghostscript (melhor para imagens)
    - PDFs com Texto: PyMuPDF (melhor para texto selecionável)
    
    Rate Limit: 20 requisições por hora por IP
    """
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        logger.info("="*60)
        logger.info("INICIANDO COMPRESSAO DE PDF (HIBRIDA)")
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
            original_size = os.path.getsize(input_path)
            logger.info(f"Tamanho original: {original_size / 1024 / 1024:.2f} MB")
            
            # Detectar tipo de PDF
            pdf_type = detect_pdf_type(input_path)
            logger.info(f"Tipo detectado: {pdf_type.upper()}")
            
            # Comprimir usando técnica apropriada
            if pdf_type == 'scanned':
                logger.info("Usando Ghostscript (PDF escaneado)")
                compression_worked = compress_scanned_pdf_ghostscript(input_path, output_path, compression_level)
            else:
                logger.info("Usando PyMuPDF (PDF com texto)")
                compression_worked = compress_text_pdf_pymupdf(input_path, output_path, compression_level)
            
            # Verificar redução
            compressed_size = os.path.getsize(output_path)
            reduction = ((original_size - compressed_size) / original_size) * 100
            
            if not compression_worked:
                logger.info(f"Tamanho final: {compressed_size / 1024 / 1024:.2f} MB")
                logger.info("Reducao: 0% (PDF ja estava otimizado)")
                logger.info("="*60)
            else:
                logger.info(f"Tamanho comprimido: {compressed_size / 1024 / 1024:.2f} MB")
                logger.info(f"Reducao total: {reduction:.1f}%")
                logger.info("="*60)
            
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
                'reduction_percentage': round(reduction, 1),
                'pdf_type': pdf_type
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
    logger.info("API OCR SIMPLIFICADA - IMG2TABLE + PADDLEOCR")
    logger.info("="*60)
    logger.info(f"Endpoint OCR: http://0.0.0.0:{port}/process-pdf")
    logger.info(f"Endpoint Compressao: http://0.0.0.0:{port}/compress-pdf")
    logger.info(f"Health: http://0.0.0.0:{port}/health")
    logger.info("Engine: img2table + PaddleOCR (ARM64 nativo)")
    logger.info("Versao: Python 3.11 + PaddlePaddle 3.2.2")
    logger.info("Otimizacao: Cache de OCR ativado (Singleton Pattern)")
    logger.info("="*60)
    
    app.run(host='0.0.0.0', port=port, debug=False)

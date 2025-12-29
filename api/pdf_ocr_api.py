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
from flask import Flask, request, jsonify
from flask_cors import CORS

# Importar dependências críticas no início para detectar erros cedo
try:
    import fitz  # PyMuPDF
    print(f"✅ PyMuPDF {fitz.__version__} carregado", file=sys.stderr, flush=True)
except ImportError as e:
    print(f"❌ ERRO CRÍTICO: PyMuPDF não encontrado: {e}", file=sys.stderr, flush=True)
    sys.exit(1)

try:
    from img2table.document import PDF as Img2TablePDF
    from img2table.ocr import PaddleOCR as Img2TableOCR
    print("✅ img2table carregado", file=sys.stderr, flush=True)
except ImportError as e:
    print(f"❌ ERRO CRÍTICO: img2table não encontrado: {e}", file=sys.stderr, flush=True)
    sys.exit(1)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*", "methods": ["GET", "POST", "OPTIONS"], "allow_headers": "*"}})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
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
def health():
    """Endpoint de health check"""
    return jsonify({"status": "ok"})


@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    """
    Processa PDF usando APENAS img2table
    Versão SIMPLIFICADA e ROBUSTA
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
        
        print(f"\n{'='*60}")
        print(f"📄 Processando: {file.filename} ({file_size / 1024 / 1024:.2f}MB)")
        print(f"{'='*60}")
        
        # Salvar temporário
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            pdf_path = tmp_file.name
        
        try:
            # Contar páginas
            pdf_doc = fitz.open(pdf_path)
            num_pages = len(pdf_doc)
            pdf_doc.close()
            print(f"📄 {num_pages} página(s)")
            
            # Processar com img2table
            print(f"📊 Extraindo tabelas com img2table...")
            img2table_ocr = Img2TableOCR(lang="pt")
            img2table_doc = Img2TablePDF(src=pdf_path)
            
            all_tables = img2table_doc.extract_tables(
                ocr=img2table_ocr,
                implicit_rows=True,
                borderless_tables=True,
                min_confidence=50
            )
            
            total_tables = sum(len(tables) for tables in all_tables.values())
            print(f"✅ {total_tables} tabela(s) detectadas")
            
            # Processar cada página
            all_pages_data = []
            
            for page_num in range(num_pages):
                print(f"\n📖 Página {page_num + 1}/{num_pages}...")
                
                page_rows = []
                
                # Adicionar tabelas desta página
                if page_num in all_tables and len(all_tables[page_num]) > 0:
                    print(f"  📊 {len(all_tables[page_num])} tabela(s) nesta página")
                    
                    for table_idx, table in enumerate(all_tables[page_num]):
                        print(f"    Tabela {table_idx + 1}: {table.df.shape[0]} linhas x {table.df.shape[1]} colunas")
                        
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
                    print(f"  ✅ {len(page_rows)} linha(s) extraídas")
                else:
                    # Página sem conteúdo
                    df = pd.DataFrame([["Nenhum conteúdo encontrado"]])
                    all_pages_data.append((page_num + 1, df))
                    print(f"  ⚠️  Nenhuma tabela detectada")
            
            # Criar Excel com abas por página
            print(f"\n💾 Gerando Excel com {len(all_pages_data)} aba(s)...")
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
                            print(f"  ✅ Aba '{sheet_name}' criada")
                        except Exception as e:
                            print(f"  ⚠️  Erro na página {page_num}: {e}")
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
                            print(f"  ✅ Aba '{sheet_name}' criada (modo ASCII)")
            except Exception as e:
                print(f"❌ Erro ao criar Excel: {e}")
                raise
            
            excel_buffer.seek(0)
            excel_base64 = base64.b64encode(excel_buffer.read()).decode('utf-8')
            
            print(f"\n{'='*60}")
            print(f"✅ Processamento concluído com sucesso!")
            print(f"{'='*60}\n")
            
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
        
        # Log detalhado para Railway
        print(f"\n❌ ERRO DETALHADO:", file=sys.stderr, flush=True)
        print(f"Tipo: {type(e).__name__}", file=sys.stderr, flush=True)
        print(f"Mensagem: {error_msg}", file=sys.stderr, flush=True)
        print(f"Traceback:", file=sys.stderr, flush=True)
        print(traceback_str, file=sys.stderr, flush=True)
        
        return jsonify({"error": f"Erro ao processar PDF: {error_msg}"}), 500


@app.route('/compress-pdf', methods=['POST', 'OPTIONS'])
def compress_pdf():
    """Comprime um PDF reduzindo o tamanho do arquivo"""
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        print("\n" + "="*60)
        print("📦 INICIANDO COMPRESSÃO DE PDF")
        print("="*60)
        
        # Validar request
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        
        pdf_file = request.files['file']
        compression_level = request.form.get('compression_level', 'medium')
        
        if pdf_file.filename == '':
            return jsonify({'error': 'Nome de arquivo vazio'}), 400
        
        if not pdf_file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Apenas arquivos PDF são aceitos'}), 400
        
        print(f"📄 Arquivo: {pdf_file.filename}")
        print(f"🔧 Nível de compressão: {compression_level}")
        
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
            print(f"📊 Tamanho original: {original_size / 1024:.2f} KB")
            
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
            
            print(f"📊 Tamanho comprimido: {compressed_size / 1024:.2f} KB")
            print(f"💾 Redução: {reduction:.1f}%")
            
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
        
        # Log detalhado para Railway
        print(f"\n❌ ERRO NA COMPRESSÃO:", file=sys.stderr, flush=True)
        print(f"Tipo: {type(e).__name__}", file=sys.stderr, flush=True)
        print(f"Mensagem: {str(e)}", file=sys.stderr, flush=True)
        print(f"Traceback:", file=sys.stderr, flush=True)
        print(traceback_str, file=sys.stderr, flush=True)
        
        return jsonify({'error': f'Erro ao comprimir PDF: {str(e)}'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5003))
    print("\n" + "="*60)
    print("🚀 API OCR SIMPLIFICADA - IMG2TABLE")
    print("="*60)
    print(f"📝 Endpoint OCR: http://0.0.0.0:{port}/process-pdf")
    print(f"📦 Endpoint Compressão: http://0.0.0.0:{port}/compress-pdf")
    print(f"🌐 Health: http://0.0.0.0:{port}/health")
    print("🔧 Engine: img2table (PaddleOCR)")
    print("\n✨ Características:")
    print("  ✅ Código limpo e simples (~200 linhas)")
    print("  ✅ Zero duplicação (motor único)")
    print("  ✅ Ideal para faturas, notas fiscais, listas")
    print("  ✅ Cada página = 1 aba no Excel")
    print("  ✅ Compressão real de PDF com PyMuPDF")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=port, debug=False)

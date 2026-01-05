"""
API para conversão de arquivos TIFF para PDF
Suporta TIFF single e multi-página
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import io
import logging
from PIL import Image
import img2pdf
from typing import Optional
import traceback
import unicodedata
import re

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Criar app FastAPI
app = FastAPI(
    title="TIFF to PDF Converter API",
    description="API para converter arquivos TIFF (single e multi-página) em PDF",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurações
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
SUPPORTED_FORMATS = ['tiff', 'tif']


def sanitize_filename(filename: str) -> str:
    """
    Remove caracteres especiais e acentos do nome do arquivo
    Mantém apenas caracteres ASCII seguros
    
    Args:
        filename: Nome original do arquivo
        
    Returns:
        str: Nome do arquivo sanitizado
    """
    # Separar nome e extensão
    parts = filename.rsplit('.', 1)
    name = parts[0] if len(parts) > 1 else filename
    extension = parts[1] if len(parts) > 1 else ''
    
    # Normalizar unicode (decompor acentos)
    name = unicodedata.normalize('NFKD', name)
    
    # Remover caracteres não-ASCII
    name = name.encode('ascii', 'ignore').decode('ascii')
    
    # Substituir espaços e caracteres especiais por underscore
    name = re.sub(r'[^\w\s-]', '', name)
    name = re.sub(r'[-\s]+', '_', name)
    
    # Limitar tamanho
    name = name[:100]
    
    # Reconstruir com extensão
    if extension:
        return f"{name}.{extension}"
    return name


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "service": "TIFF to PDF Converter",
        "version": "1.0.0",
        "endpoints": {
            "convert": "/convert",
            "health": "/health"
        }
    }


@app.get("/health")
async def health_check():
    """Endpoint de health check detalhado"""
    return {
        "status": "healthy",
        "service": "tiff-to-pdf-api",
        "dependencies": {
            "pillow": "ok",
            "img2pdf": "ok",
            "fastapi": "ok"
        }
    }


def detect_tiff_pages(image: Image.Image) -> int:
    """
    Detecta número de páginas em um arquivo TIFF
    
    Args:
        image: Objeto PIL Image
        
    Returns:
        int: Número de páginas
    """
    try:
        n_frames = 0
        while True:
            try:
                image.seek(n_frames)
                n_frames += 1
            except EOFError:
                break
        return n_frames
    except Exception as e:
        logger.error(f"Erro ao detectar páginas: {str(e)}")
        return 1


def tiff_to_pdf(tiff_bytes: bytes, optimize: bool = True) -> bytes:
    """
    Converte TIFF para PDF mantendo todas as páginas
    
    Args:
        tiff_bytes: Bytes do arquivo TIFF
        optimize: Se True, otimiza o PDF final
        
    Returns:
        bytes: PDF gerado
    """
    try:
        # Abrir TIFF com Pillow
        tiff_image = Image.open(io.BytesIO(tiff_bytes))
        
        # Detectar número de páginas
        num_pages = detect_tiff_pages(tiff_image)
        logger.info(f"TIFF detectado com {num_pages} página(s)")
        
        # Se for single page, conversão direta
        if num_pages == 1:
            logger.info("Convertendo TIFF single-page")
            pdf_bytes = img2pdf.convert(tiff_bytes)
            return pdf_bytes
        
        # Se for multi-page, processar cada página
        logger.info("Convertendo TIFF multi-page")
        tiff_image = Image.open(io.BytesIO(tiff_bytes))
        
        images_bytes = []
        for i in range(num_pages):
            tiff_image.seek(i)
            
            # Converter para RGB se necessário
            if tiff_image.mode not in ('RGB', 'L'):
                img = tiff_image.convert('RGB')
            else:
                img = tiff_image.copy()
            
            # Salvar página como bytes
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='PNG', optimize=optimize)
            images_bytes.append(img_byte_arr.getvalue())
        
        # Converter todas as páginas para PDF
        pdf_bytes = img2pdf.convert(images_bytes)
        
        logger.info(f"PDF gerado com sucesso: {len(pdf_bytes)} bytes")
        return pdf_bytes
        
    except Exception as e:
        logger.error(f"Erro na conversão: {str(e)}")
        logger.error(traceback.format_exc())
        raise


@app.post("/convert")
async def convert_tiff_to_pdf(
    file: UploadFile = File(...),
    optimize: Optional[bool] = True
):
    """
    Converte arquivo TIFF para PDF
    
    Args:
        file: Arquivo TIFF (single ou multi-página)
        optimize: Otimizar PDF final (default: True)
        
    Returns:
        PDF file
    """
    
    # Validar nome do arquivo
    if not file.filename:
        raise HTTPException(status_code=400, detail="Nome do arquivo não fornecido")
    
    # Validar extensão
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in SUPPORTED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"❌ Formato não suportado. Apenas TIFF é aceito (.tiff ou .tif)"
        )
    
    # Validar MIME type (se fornecido)
    valid_mime_types = ['image/tiff', 'image/tif', 'image/x-tiff']
    if file.content_type and file.content_type not in valid_mime_types:
        raise HTTPException(
            status_code=400,
            detail=f"❌ Tipo de arquivo inválido: {file.content_type}. Apenas TIFF é aceito."
        )
    
    try:
        # Ler arquivo (usando repr para log seguro)
        logger.info(f"Recebendo arquivo: {repr(file.filename)}")
        file_bytes = await file.read()
        file_size = len(file_bytes)
        
        # Validar tamanho
        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"Arquivo muito grande. Tamanho máximo: {MAX_FILE_SIZE / 1024 / 1024}MB"
            )
        
        logger.info(f"Arquivo recebido: {file_size} bytes")
        
        # Converter TIFF para PDF
        pdf_bytes = tiff_to_pdf(file_bytes, optimize=optimize)
        
        # Gerar nome do arquivo de saída (sanitizado)
        sanitized_name = sanitize_filename(file.filename)
        output_filename = sanitized_name.rsplit('.', 1)[0] + '.pdf'
        
        # Retornar PDF
        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=\"{output_filename}\"",
                "Content-Length": str(len(pdf_bytes))
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro ao processar arquivo: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar arquivo: {str(e)}"
        )


@app.post("/convert/info")
async def get_tiff_info(file: UploadFile = File(...)):
    """
    Retorna informações sobre o arquivo TIFF sem converter
    
    Args:
        file: Arquivo TIFF
        
    Returns:
        JSON com informações do arquivo
    """
    
    # Validar nome do arquivo
    if not file.filename:
        raise HTTPException(status_code=400, detail="Nome do arquivo não fornecido")
    
    # Validar extensão
    file_extension = file.filename.split('.')[-1].lower()
    if file_extension not in SUPPORTED_FORMATS:
        raise HTTPException(
            status_code=400,
            detail=f"❌ Formato não suportado. Apenas TIFF é aceito (.tiff ou .tif)"
        )
    
    # Validar MIME type (se fornecido)
    valid_mime_types = ['image/tiff', 'image/tif', 'image/x-tiff']
    if file.content_type and file.content_type not in valid_mime_types:
        raise HTTPException(
            status_code=400,
            detail=f"❌ Tipo de arquivo inválido: {file.content_type}. Apenas TIFF é aceito."
        )
    
    try:
        file_bytes = await file.read()
        tiff_image = Image.open(io.BytesIO(file_bytes))
        
        num_pages = detect_tiff_pages(tiff_image)
        tiff_image.seek(0)
        
        info = {
            "filename": file.filename,
            "size_bytes": len(file_bytes),
            "size_mb": round(len(file_bytes) / 1024 / 1024, 2),
            "pages": num_pages,
            "format": tiff_image.format,
            "mode": tiff_image.mode,
            "width": tiff_image.width,
            "height": tiff_image.height,
            "dpi": tiff_image.info.get('dpi', 'unknown')
        }
        
        return JSONResponse(content=info)
        
    except Exception as e:
        logger.error(f"Erro ao obter informações: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar arquivo: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)


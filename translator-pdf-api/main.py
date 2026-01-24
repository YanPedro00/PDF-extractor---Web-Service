"""
Translator PDF API - FastAPI
Traduz PDFs técnicos EN→PT usando Gemma 2 2B + Google Vision API
"""

import os
import tempfile
import shutil
from pathlib import Path
from typing import Optional
from datetime import datetime
import logging

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Header
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Importar pipeline de tradução
from src.run_pipeline import run_full_pipeline

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Criar app FastAPI
app = FastAPI(
    title="Translator PDF API",
    description="API para tradução técnica de PDFs usando Gemma 2 2B",
    version="1.0.0"
)

# CORS (será gerenciado pelo Nginx, mas manter para desenvolvimento)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurações
BASE_DIR = Path(__file__).parent
TEMP_DIR = BASE_DIR / "temp"
OUTPUT_DIR = BASE_DIR / "output"
CREDENTIALS_PATH = BASE_DIR / "credentials" / "google_credentials.json"

# Criar diretórios se não existirem
TEMP_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Validar credenciais Google
if not CREDENTIALS_PATH.exists():
    logger.error(f"⚠️  Google credentials not found at: {CREDENTIALS_PATH}")
    logger.error("    Please mount credentials volume correctly")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "translator-pdf-api",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "credentials_found": CREDENTIALS_PATH.exists()
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Translator PDF API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "translate": "/translate (POST)",
            "docs": "/docs"
        }
    }


@app.post("/translate")
async def translate_pdf(
    file: UploadFile = File(..., description="PDF file to translate"),
    start_page: int = Form(1, description="Start page number (1-indexed)"),
    end_page: Optional[int] = Form(None, description="End page number (optional, defaults to last page)"),
    authorization: Optional[str] = Header(None, description="JWT token for authentication")
):
    """
    Traduz um PDF técnico de inglês para português.
    
    **Processo:**
    1. Extração de texto com Google Vision API
    2. Tradução com modelo Gemma 2 2B fine-tuned
    3. Reconstrução do PDF mantendo layout original
    
    **Parâmetros:**
    - file: Arquivo PDF (multipart/form-data)
    - start_page: Página inicial (padrão: 1)
    - end_page: Página final (opcional, padrão: última página)
    - authorization: Token JWT (opcional, para produção)
    
    **Retorna:**
    - PDF traduzido para download
    """
    
    # TODO: Validar JWT token em produção
    # if not authorization or not validate_jwt(authorization):
    #     raise HTTPException(status_code=401, detail="Unauthorized")
    
    # Validar arquivo
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Invalid file format. Only PDF files are allowed."
        )
    
    # Validar credenciais Google
    if not CREDENTIALS_PATH.exists():
        raise HTTPException(
            status_code=500,
            detail="Google Cloud credentials not configured. Please contact administrator."
        )
    
    # Gerar IDs únicos para este job
    job_id = datetime.utcnow().strftime("%Y%m%d_%H%M%S_%f")
    
    # Caminhos temporários
    input_pdf_path = TEMP_DIR / f"{job_id}_input.pdf"
    output_pdf_path = OUTPUT_DIR / f"{job_id}_translated.pdf"
    
    try:
        logger.info(f"📥 Recebendo PDF: {file.filename}")
        logger.info(f"   Job ID: {job_id}")
        logger.info(f"   Páginas: {start_page} - {end_page or 'última'}")
        
        # Salvar arquivo enviado
        with open(input_pdf_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        file_size_mb = len(content) / (1024 * 1024)
        logger.info(f"   Tamanho: {file_size_mb:.2f} MB")
        
        # Definir end_page se não especificado
        # (run_pipeline usa None para processar até o fim)
        actual_end_page = end_page if end_page else None
        
        logger.info(f"🚀 Iniciando pipeline de tradução...")
        
        # Executar pipeline completa
        success = run_full_pipeline(
            pdf_path=str(input_pdf_path),
            credentials_path=str(CREDENTIALS_PATH),
            start_page=start_page,
            end_page=actual_end_page,
            output_pdf_path=str(output_pdf_path)
        )
        
        if not success:
            raise HTTPException(
                status_code=500,
                detail="Translation pipeline failed. Check logs for details."
            )
        
        # Verificar se arquivo foi gerado
        if not output_pdf_path.exists():
            raise HTTPException(
                status_code=500,
                detail="Translation completed but output file not found."
            )
        
        logger.info(f"✅ Tradução concluída com sucesso!")
        logger.info(f"   Output: {output_pdf_path}")
        
        # Retornar arquivo traduzido
        return FileResponse(
            path=str(output_pdf_path),
            media_type="application/pdf",
            filename=f"translated_{file.filename}",
            headers={
                "Content-Disposition": f'attachment; filename="translated_{file.filename}"'
            }
        )
        
    except HTTPException:
        raise
    
    except Exception as e:
        logger.error(f"❌ Erro durante tradução: {e}")
        import traceback
        traceback.print_exc()
        
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )
    
    finally:
        # Limpeza: remover arquivo de entrada (mas manter output por um tempo)
        try:
            if input_pdf_path.exists():
                input_pdf_path.unlink()
                logger.info(f"🗑️  Arquivo temporário removido: {input_pdf_path.name}")
        except Exception as e:
            logger.warning(f"⚠️  Erro ao remover arquivo temporário: {e}")


@app.delete("/cleanup")
async def cleanup_old_files(older_than_hours: int = 24):
    """
    Remove arquivos antigos das pastas temp/ e output/
    
    **Parâmetros:**
    - older_than_hours: Remover arquivos mais antigos que N horas (padrão: 24h)
    """
    from datetime import timedelta
    
    now = datetime.now()
    cutoff = now - timedelta(hours=older_than_hours)
    
    removed_count = 0
    freed_space = 0
    
    for directory in [TEMP_DIR, OUTPUT_DIR]:
        for file_path in directory.glob("*"):
            if file_path.is_file():
                file_mtime = datetime.fromtimestamp(file_path.stat().st_mtime)
                
                if file_mtime < cutoff:
                    file_size = file_path.stat().st_size
                    file_path.unlink()
                    removed_count += 1
                    freed_space += file_size
    
    freed_space_mb = freed_space / (1024 * 1024)
    
    logger.info(f"🗑️  Cleanup concluído: {removed_count} arquivos removidos ({freed_space_mb:.2f} MB liberados)")
    
    return {
        "removed_files": removed_count,
        "freed_space_mb": round(freed_space_mb, 2),
        "older_than_hours": older_than_hours
    }


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8082))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info"
    )


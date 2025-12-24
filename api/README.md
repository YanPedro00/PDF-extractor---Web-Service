# API de OCR para PDFUtilities

API Python usando Flask para processar PDFs escaneados com img2table + EasyOCR.

## Instalação

1. Instale as dependências:
```bash
cd api
pip install -r requirements.txt
```

## Execução

```bash
python pdf_ocr_api.py
```

A API estará disponível em `http://localhost:5002` (ou porta definida na variável PORT)

## Endpoints

### GET /health
Verifica se a API está funcionando.

### POST /process-pdf
Processa um PDF e retorna Excel em base64.

**Request:**
- Content-Type: multipart/form-data
- Body: arquivo PDF no campo `file`

**Response:**
```json
{
  "success": true,
  "excel_base64": "...",
  "filename": "arquivo_OCR.xlsx"
}
```

## Configuração no Frontend

A aplicação Next.js tentará usar esta API automaticamente. Se a API não estiver disponível, usará Tesseract.js como fallback.

Para configurar a URL da API, adicione no `.env.local`:
```
NEXT_PUBLIC_OCR_API_URL=http://localhost:5002
```


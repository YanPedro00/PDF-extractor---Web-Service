# 📄 TIFF to PDF Converter API

API REST completa para converter arquivos TIFF (single e multi-página) em PDF.

## 🚀 Features

- ✅ Conversão de TIFF single-page → PDF single-page
- ✅ Conversão de TIFF multi-page → PDF multi-page
- ✅ Otimização automática do PDF gerado
- ✅ Detecção automática do número de páginas
- ✅ Suporte para TIFF colorido, escala de cinza e P&B
- ✅ Endpoint de informações do arquivo
- ✅ Health check
- ✅ CORS habilitado
- ✅ Logging detalhado

## 📦 Instalação

### 1. Instalar dependências

```bash
cd tiff-to-pdf-api
pip install -r requirements.txt
```

### 2. Executar API

```bash
python main.py
```

Ou com uvicorn:

```bash
uvicorn main:app --reload --port 8001
```

A API estará rodando em: **http://localhost:8001**

## 📖 Documentação da API

### **GET /**
Health check básico

**Response:**
```json
{
  "status": "online",
  "service": "TIFF to PDF Converter",
  "version": "1.0.0"
}
```

---

### **POST /convert**
Converte arquivo TIFF para PDF

**Parameters:**
- `file` (form-data): Arquivo TIFF (required)
- `optimize` (query): Otimizar PDF (default: true)

**Request:**
```bash
curl -X POST "http://localhost:8001/convert?optimize=true" \
  -F "file=@documento.tiff" \
  --output resultado.pdf
```

**Response:**
- Content-Type: `application/pdf`
- Arquivo PDF para download

---

### **POST /convert/info**
Retorna informações sobre o arquivo TIFF sem converter

**Parameters:**
- `file` (form-data): Arquivo TIFF (required)

**Request:**
```bash
curl -X POST "http://localhost:8001/convert/info" \
  -F "file=@documento.tiff"
```

**Response:**
```json
{
  "filename": "documento.tiff",
  "size_bytes": 1048576,
  "size_mb": 1.0,
  "pages": 3,
  "format": "TIFF",
  "mode": "RGB",
  "width": 2480,
  "height": 3508,
  "dpi": [300, 300]
}
```

---

### **GET /health**
Health check detalhado

**Response:**
```json
{
  "status": "healthy",
  "service": "tiff-to-pdf-api",
  "dependencies": {
    "pillow": "ok",
    "img2pdf": "ok",
    "fastapi": "ok"
  }
}
```

## 🧪 Testes

### Teste com cURL

**1. Converter TIFF para PDF:**
```bash
curl -X POST "http://localhost:8001/convert" \
  -F "file=@test.tiff" \
  --output output.pdf
```

**2. Obter informações do TIFF:**
```bash
curl -X POST "http://localhost:8001/convert/info" \
  -F "file=@test.tiff"
```

### Teste com Python

```python
import requests

# Converter TIFF para PDF
with open('documento.tiff', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:8001/convert', files=files)
    
    # Salvar PDF
    with open('resultado.pdf', 'wb') as pdf:
        pdf.write(response.content)
    
    print(f"PDF gerado: {len(response.content)} bytes")

# Obter informações
with open('documento.tiff', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://localhost:8001/convert/info', files=files)
    info = response.json()
    print(f"Páginas: {info['pages']}")
    print(f"Tamanho: {info['size_mb']} MB")
```

## 📋 Limites

- **Tamanho máximo:** 50MB por arquivo
- **Formatos suportados:** .tiff, .tif
- **Modos de cor:** RGB, L (grayscale), 1 (P&B), etc.

## 🔧 Tecnologias

- **FastAPI** - Framework web moderno e rápido
- **Pillow (PIL)** - Processamento de imagens
- **img2pdf** - Conversão de imagens para PDF
- **Uvicorn** - Servidor ASGI

## 📝 Logs

A API gera logs detalhados:
- Arquivos recebidos e tamanho
- Número de páginas detectadas
- Tempo de processamento
- Erros e stack traces

## 🚀 Deploy

### Railway / Render

Adicione um `Procfile`:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY main.py .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
```

## 📄 Licença

MIT

## 👨‍💻 Autor

PDFUtilities - pdf.utilities00@gmail.com


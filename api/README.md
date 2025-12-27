# 📊 API OCR Simplificada - img2table

API Python usando Flask para processar PDFs com tabelas usando **img2table + PaddleOCR**.

## ✨ Características

- 🚀 **Código limpo e simples** (~200 linhas)
- 📊 **Ideal para documentos estruturados** (faturas, notas fiscais, listas)
- ✅ **Zero duplicação** (motor único)
- 📑 **Cada página = 1 aba** no Excel
- 🧹 **Limpeza automática** de caracteres inválidos
- ⚡ **Rápido e estável**

## 🔧 Engine

**img2table** com PaddleOCR:
- Detecta tabelas automaticamente
- Extrai estrutura e conteúdo
- Alta precisão para documentos tabulares
- Baixo uso de memória (~500MB-1GB)

## 📦 Instalação Local

### 1. Instalar dependências:

```bash
cd api
pip install -r requirements.txt
```

### 2. Executar:

```bash
python pdf_ocr_api.py
```

A API estará disponível em `http://localhost:5003`

## 🚀 Deploy no Railway

### 1. Conectar ao GitHub:
- Faça push do código para o GitHub
- Conecte o repositório no Railway

### 2. Configurar:
O Railway detectará automaticamente o `nixpacks.toml` e configurará tudo.

### 3. Variáveis de ambiente (já configuradas):
```
PORT=5003
OPENCV_IO_ENABLE_OPENEXR=0
QT_QPA_PLATFORM=offscreen
OPENCV_HEADLESS=1
```

## 📡 Endpoints

### `GET /health`
Verifica se a API está funcionando.

**Response:**
```json
{
  "status": "ok"
}
```

### `POST /process-pdf`
Processa um PDF e retorna Excel em base64.

**Request:**
- Content-Type: `multipart/form-data`
- Body: arquivo PDF no campo `file`

**Response:**
```json
{
  "success": true,
  "excel_base64": "...",
  "filename": "arquivo_OCR.xlsx"
}
```

**Excel gerado:**
- 1 aba por página do PDF
- Estrutura de tabelas preservada
- Texto limpo e formatado

## 🔄 Versões

### Versão Atual: **Simplificada**
- Arquivo: `pdf_ocr_api.py`
- Motor: img2table (único)
- Status: ✅ **ATIVA**

### Versões de Backup:
- `pdf_ocr_api_hybrid_backup.py` - Versão híbrida (PaddleOCR + img2table)
- `pdf_ocr_api_v2.py` - Versão V2 com melhorias
- `pdf_ocr_api_old.py` - Versão original

Para trocar de versão, renomeie os arquivos e reinicie a API.

## ⚙️ Configuração no Frontend

A aplicação Next.js se conecta automaticamente à API.

Configurar URL da API no `.env.local`:
```
NEXT_PUBLIC_OCR_API_URL=http://localhost:5003
```

Para produção (Railway):
```
NEXT_PUBLIC_OCR_API_URL=https://sua-api.railway.app
```

## 🐛 Troubleshooting

### Erro de dependências no Railway:
- Verifique se `nixpacks.toml` está na pasta `/api`
- Verifique se `requirements.txt` está correto

### Erro de memória:
- No Railway, aumente a memória do serviço
- Recomendado: mínimo 1GB RAM

### PDF não processa:
- Verifique se o PDF tem tabelas/estruturas
- Tamanho máximo: 50MB
- Formatos suportados: PDF com texto ou imagens

## 📝 Notas de Desenvolvimento

### Arquivos importantes para o Railway:
- ✅ `pdf_ocr_api.py` - Código principal
- ✅ `requirements.txt` - Dependências Python
- ✅ `nixpacks.toml` - Configuração de build
- ✅ `download_models.py` - Download de modelos (opcional)

### Arquivos ignorados (não vão pro GitHub):
- `venv/` - Ambiente virtual local
- `__pycache__/` - Cache do Python
- `*_backup.py` - Arquivos de backup
- `validation/` - PDFs de teste

## 🤝 Suporte

Se tiver problemas:
1. Verifique os logs no Railway
2. Teste localmente primeiro
3. Verifique se o PDF é compatível
4. Considere usar a versão híbrida para documentos complexos

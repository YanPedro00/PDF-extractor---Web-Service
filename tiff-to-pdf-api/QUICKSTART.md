# 🚀 Quick Start - TIFF to PDF API

Guia rápido para começar a usar a API em 2 minutos!

## ⚡ Setup Rápido

```bash
# 1. Entrar na pasta
cd tiff-to-pdf-api

# 2. Instalar dependências
pip install -r requirements.txt

# 3. Rodar API
python main.py
```

✅ API rodando em: **http://localhost:8001**

## 🧪 Teste Rápido

### Opção 1: Documentação Interativa (RECOMENDADO)

Abra no navegador: **http://localhost:8001/docs**

Você verá uma interface Swagger onde pode:
- Testar todos os endpoints
- Fazer upload de arquivos TIFF
- Ver responses em tempo real
- Baixar PDFs gerados

### Opção 2: Script de Teste

```bash
# Testar com seu arquivo TIFF
python test_api.py seu_arquivo.tiff
```

### Opção 3: cURL

```bash
# Converter TIFF para PDF
curl -X POST "http://localhost:8001/convert" \
  -F "file=@seu_arquivo.tiff" \
  --output resultado.pdf

# Ver informações do TIFF
curl -X POST "http://localhost:8001/convert/info" \
  -F "file=@seu_arquivo.tiff"
```

## 📁 Precisa de arquivo TIFF para teste?

Você pode:

1. **Criar um TIFF de teste:**
```python
from PIL import Image

# Single page
img = Image.new('RGB', (200, 200), color='red')
img.save('teste.tiff')

# Multi page
img1 = Image.new('RGB', (200, 200), color='red')
img2 = Image.new('RGB', (200, 200), color='blue')
img1.save('teste_multipagina.tiff', save_all=True, append_images=[img2])
```

2. **Baixar exemplos online:**
   - https://www.fileformat.info/format/tiff/sample/
   - Converter qualquer imagem para TIFF no Photoshop/GIMP

## ❓ Problemas?

### API não inicia
```bash
# Verificar se porta 8001 está livre
lsof -i :8001

# Rodar em outra porta
uvicorn main:app --port 8002
```

### Erro ao instalar Pillow
```bash
# macOS
brew install libjpeg libtiff

# Ubuntu/Debian
sudo apt-get install libjpeg-dev libtiff-dev

# Reinstalar
pip install --upgrade Pillow
```

### Arquivo muito grande
- Limite atual: 50MB
- Para aumentar, edite `MAX_FILE_SIZE` em `main.py`

## 🎯 Próximos Passos

1. ✅ Testou a API? Maravilha!
2. 📱 Vamos integrar no site Next.js
3. 🎨 Criar interface bonita para usuários

**Está funcionando? Me avise para continuarmos!** 🚀


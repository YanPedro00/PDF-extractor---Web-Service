# 🔗 Integração com Next.js

## ✅ Integração Concluída!

A API TIFF to PDF foi integrada ao site com sucesso!

---

## 📁 Arquivos Criados/Atualizados:

### 1. **components/TiffUploader.tsx**
Componente React para upload e conversão de arquivos TIFF

### 2. **app/tiff-to-pdf/page.tsx**
Página completa da ferramenta com:
- Interface de upload
- Informações do arquivo
- Conversão
- AD1 + AD2 (anúncios)
- FAQ

### 3. **components/Navbar.tsx** ✨ ATUALIZADA
Nova navbar inteligente com:
- 4 ferramentas principais visíveis
- Dropdown "Mais" para ferramentas extras
- Espaço reservado para Login/Cadastro
- Responsiva

### 4. **app/page.tsx**
Card da ferramenta TIFF to PDF adicionado

---

## ⚙️ Configuração Necessária:

### 1. Variável de Ambiente

Adicione no seu `.env.local`:

```bash
# API TIFF to PDF
NEXT_PUBLIC_TIFF_API_URL=http://localhost:8001
```

**Em produção**, atualize para a URL real da API (Railway/Render/etc)

---

## 🚀 Como Rodar:

### 1. Iniciar API (Terminal 1):
```bash
cd tiff-to-pdf-api
python3 main.py
```
API rodará em: http://localhost:8001

### 2. Iniciar Next.js (Terminal 2):
```bash
cd ..
npm run dev
```
Site rodará em: http://localhost:3000

### 3. Testar:
Acesse: http://localhost:3000/tiff-to-pdf

---

## 📋 Checklist de Deploy:

### Antes de fazer deploy:

- [ ] API rodando e acessível
- [ ] Variável `NEXT_PUBLIC_TIFF_API_URL` configurada
- [ ] Testado localmente
- [ ] Anúncios AD1 e AD2 aparecendo
- [ ] Navbar com dropdown funcionando

### Deploy da API:

**Opção 1: Railway**
1. Criar novo projeto no Railway
2. Conectar repositório
3. Configurar build: `pip install -r requirements.txt`
4. Configurar start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Anotar URL gerada

**Opção 2: Render**
1. Criar novo Web Service
2. Conectar repositório
3. Root Directory: `tiff-to-pdf-api`
4. Build: `pip install -r requirements.txt`
5. Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Atualizar variável no Next.js:

```bash
NEXT_PUBLIC_TIFF_API_URL=https://sua-api.railway.app
```

---

## 🎯 Resultado Final:

**Navbar:**
```
[Logo] [Converter] [OCR] [Juntar] [Dividir] [Mais ▼] ············· [Login]
                                             └─ Comprimir PDF
                                             └─ TIFF para PDF
```

**Página /tiff-to-pdf:**
- ✅ Upload de arquivos TIFF
- ✅ Visualização de informações (páginas, tamanho, etc)
- ✅ Conversão para PDF
- ✅ Download automático
- ✅ AD1 (Native Banner) no topo
- ✅ AD2 (iframe Banner) no rodapé
- ✅ FAQ completo

---

## 📱 Responsivo:

- Desktop: 4 ferramentas + dropdown "Mais"
- Mobile: Menu hamburguer com todas as ferramentas

---

## 🔍 Troubleshooting:

### API não conecta:
1. Verifique se a API está rodando: `curl http://localhost:8001/health`
2. Confirme a variável de ambiente
3. Veja logs da API: `cat api.log`

### Erro CORS:
- A API já tem CORS habilitado para `*`
- Se necessário, ajuste em `main.py`

### Arquivo muito grande:
- Limite atual: 50MB
- Para aumentar, edite `MAX_FILE_SIZE` em `main.py`

---

## 📞 Endpoints da API:

- `GET /health` → Health check
- `POST /convert` → Converter TIFF para PDF
- `POST /convert/info` → Obter informações do TIFF

---

**Tudo pronto! 🚀**


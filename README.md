# PDFUtilities

> **Suite completa de ferramentas online para manipulação de PDFs**
> 
> Site: [https://pdf-utilities.up.railway.app](https://pdf-utilities.up.railway.app)

Um conjunto completo de ferramentas web para manipular arquivos PDF de forma rápida, segura e gratuita. Todas as ferramentas funcionam 100% no navegador ou via APIs dedicadas.

## Ferramentas Disponíveis

### 1. [PDF para Excel](https://pdf-utilities.up.railway.app/converter)
Converte PDFs em planilhas Excel (.xlsx) com alta precisão
- Conversão rápida de PDFs com texto selecionável
- Preserva a estrutura de tabelas e formatação

### 2. [PDF para Excel com OCR](https://pdf-utilities.up.railway.app/ocr)
Converte PDFs escaneados usando reconhecimento óptico de caracteres
- Powered by PaddleOCR (2-3x mais rápido que alternativas)
- Precisão de 95-98% na extração de tabelas
- Suporte para documentos escaneados e imagens

### 3. [Juntar PDFs](https://pdf-utilities.up.railway.app/juntar)
Combine múltiplos arquivos PDF em um único documento
- Upload de múltiplos arquivos
- Reordenação fácil via drag-and-drop
- Processamento instantâneo

### 4. [Dividir PDF](https://pdf-utilities.up.railway.app/dividir)
Extraia páginas específicas de um PDF
- Divisão por intervalos de páginas
- Visualização das páginas
- Download individual ou em lote

### 5. [Comprimir PDF](https://pdf-utilities.up.railway.app/comprimir)
Reduza o tamanho de arquivos PDF mantendo a qualidade
- Compressão inteligente de imagens
- Otimização de recursos
- Redução de até 70% do tamanho

### 6. [TIFF para PDF](https://pdf-utilities.up.railway.app/tiff-to-pdf)
Converte arquivos TIFF (single ou multi-page) em PDF
- Suporte para TIFF multi-página
- Preservação de qualidade
- API dedicada FastAPI + Pillow + img2pdf

## Tecnologias Utilizadas

### Frontend
- **Next.js 14**: Framework React com SSR e otimizações
- **TypeScript**: Tipagem estática e maior segurança
- **Tailwind CSS**: Design system moderno e responsivo
- **pdfjs-dist**: Processamento e renderização de PDFs
- **pdf-lib**: Manipulação avançada de PDFs
- **xlsx**: Geração de arquivos Excel
- **Tesseract.js**: OCR fallback client-side

### Backend APIs
- **Python FastAPI**: API para conversão TIFF → PDF
  - **Pillow (PIL)**: Processamento de imagens TIFF
  - **img2pdf**: Conversão eficiente para PDF
  - **uvicorn**: Servidor ASGI de alta performance

- **Python Flask**: API para OCR avançado
  - **PaddleOCR**: OCR de alta precisão
  - **img2table**: Extração inteligente de tabelas

### Infraestrutura
- **Railway**: Hospedagem e deploy automático
- **Adsterra**: Monetização com ads não-intrusivas
- **Google Search Console**: SEO e indexação

## Instalação e Desenvolvimento

### Frontend (Next.js)

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm start
```

### API TIFF to PDF

```bash
cd tiff-to-pdf-api

# Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Rodar API
uvicorn main:app --port 8001 --host 0.0.0.0
```

### API OCR (Opcional)

```bash
cd api

# Criar ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Rodar API
python3 pdf_ocr_api.py
```

## Estrutura do Projeto

```
PDFUtilities/
├── app/                          # Páginas Next.js
│   ├── page.tsx                  # Home page
│   ├── converter/page.tsx        # PDF → Excel
│   ├── ocr/page.tsx              # PDF → Excel (OCR)
│   ├── juntar/page.tsx           # Juntar PDFs
│   ├── dividir/page.tsx          # Dividir PDF
│   ├── comprimir/page.tsx        # Comprimir PDF
│   ├── tiff-to-pdf/page.tsx      # TIFF → PDF
│   ├── layout.tsx                # Layout global
│   ├── sitemap.ts                # Sitemap SEO
│   └── globals.css               # Estilos globais
│
├── components/                   # Componentes React
│   ├── Navbar.tsx                # Barra de navegação
│   ├── Footer.tsx                # Rodapé
│   ├── PDFUploader.tsx           # Upload PDF
│   ├── TiffUploader.tsx          # Upload TIFF
│   ├── PDFCompressor.tsx         # Compressor
│   ├── AdsterraAd.tsx            # Ads Adsterra
│   ├── StickySidebarAd.tsx       # Ads laterais fixas
│   └── PageLayoutWithSidebars.tsx # Layout com sidebars
│
├── utils/                        # Utilitários
│   ├── pdfConverter.ts           # Conversão PDF → Excel
│   └── pdfManipulator.ts         # Manipulação de PDFs
│
├── tiff-to-pdf-api/              # API TIFF → PDF
│   ├── main.py                   # FastAPI app
│   ├── requirements.txt          # Dependências Python
│   ├── Procfile                  # Deploy Railway
│   └── README.md                 # Docs API
│
├── public/                       # Arquivos estáticos
│   ├── robots.txt                # SEO robots
│   └── ...
│
└── package.json                  # Dependências Node.js
```

## Como Usar

### Acessar Online
Visite [https://pdf-utilities.up.railway.app](https://pdf-utilities.up.railway.app) e escolha a ferramenta desejada.

### Conversão PDF → Excel
1. Acesse [/converter](https://pdf-utilities.up.railway.app/converter) ou [/ocr](https://pdf-utilities.up.railway.app/ocr)
2. Faça upload do PDF (drag-and-drop ou clique)
3. Aguarde o processamento
4. Download automático do Excel

### Juntar PDFs
1. Acesse [/juntar](https://pdf-utilities.up.railway.app/juntar)
2. Faça upload de múltiplos PDFs
3. Reordene conforme necessário
4. Clique em "Juntar PDFs"
5. Download do arquivo combinado

### Dividir PDF
1. Acesse [/dividir](https://pdf-utilities.up.railway.app/dividir)
2. Faça upload do PDF
3. Defina os intervalos de páginas
4. Download das páginas separadas

### Comprimir PDF
1. Acesse [/comprimir](https://pdf-utilities.up.railway.app/comprimir)
2. Faça upload do PDF
3. Escolha o nível de compressão
4. Download do arquivo otimizado

### TIFF → PDF
1. Acesse [/tiff-to-pdf](https://pdf-utilities.up.railway.app/tiff-to-pdf)
2. Faça upload do arquivo TIFF
3. Conversão automática via API
4. Download do PDF gerado

## Segurança e Privacidade

- Processamento 100% client-side (exceto OCR e TIFF)
- Nenhum arquivo é armazenado em servidores
- Arquivos processados são descartados imediatamente
- Sem rastreamento de dados pessoais
- HTTPS em todas as conexões

Leia nossa [Política de Privacidade](https://pdf-utilities.up.railway.app/privacidade) para mais detalhes.

## Monetização

O site é gratuito e monetizado através de anúncios não-intrusivos da **Adsterra**:
- AD1: Native Banner (topo)
- AD2: Banner Footer (rodapé)
- AD3: Sidebar Left (desktop, 160x600)
- AD4: Sidebar Right (desktop, 160x300)

Os ads são exibidos de forma responsiva e não prejudicam a experiência do usuário.

## SEO e Links

- **Site Principal**: [https://pdf-utilities.up.railway.app](https://pdf-utilities.up.railway.app)
- **Sitemap**: [https://pdf-utilities.up.railway.app/sitemap.xml](https://pdf-utilities.up.railway.app/sitemap.xml)
- **Robots.txt**: [https://pdf-utilities.up.railway.app/robots.txt](https://pdf-utilities.up.railway.app/robots.txt)
- **Google Search Console**: Indexado e monitorado

### Páginas Indexadas
- [Home](https://pdf-utilities.up.railway.app/)
- [PDF para Excel](https://pdf-utilities.up.railway.app/converter)
- [OCR para Excel](https://pdf-utilities.up.railway.app/ocr)
- [Juntar PDFs](https://pdf-utilities.up.railway.app/juntar)
- [Dividir PDF](https://pdf-utilities.up.railway.app/dividir)
- [Comprimir PDF](https://pdf-utilities.up.railway.app/comprimir)
- [TIFF para PDF](https://pdf-utilities.up.railway.app/tiff-to-pdf)
- [Sobre](https://pdf-utilities.up.railway.app/sobre)
- [Contato](https://pdf-utilities.up.railway.app/contato)
- [Privacidade](https://pdf-utilities.up.railway.app/privacidade)
- [Termos de Uso](https://pdf-utilities.up.railway.app/termos)

## Performance

### Métricas
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Mobile-friendly: 100%
- Accessibility: WCAG 2.1 AA

### Otimizações
- Next.js 14 com App Router
- Server Components
- Image Optimization
- Code Splitting automático
- Lazy Loading de componentes
- Tailwind CSS tree-shaking

## Deploy

### Railway (Produção)

**Frontend Next.js:**
```bash
# Variáveis de ambiente necessárias:
NEXT_PUBLIC_ADSTERRA_ZONE_1=xxxxx          # AD1
NEXT_PUBLIC_ADSTERRA_ZONE_2=xxxxx          # AD2
NEXT_PUBLIC_ADSTERRA_ZONE_3=xxxxx          # AD3
NEXT_PUBLIC_ADSTERRA_ZONE_4=xxxxx          # AD4
NEXT_PUBLIC_SITE_URL=https://pdf-utilities.up.railway.app
NEXT_PUBLIC_TIFF_API_URL=https://sua-api-tiff.railway.app
NEXT_PUBLIC_OCR_API_URL=https://sua-api-ocr.railway.app
```

**API TIFF to PDF:**
- Root Directory: `/tiff-to-pdf-api`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Python Version: 3.13.0

## Roadmap Futuro

- [ ] Sistema de login e cadastro
- [ ] Dashboard de usuário
- [ ] Histórico de conversões
- [ ] PDF → Word (.docx)
- [ ] PDF → PowerPoint (.pptx)
- [ ] Assinatura digital de PDFs
- [ ] Proteção de PDF com senha
- [ ] Modo dark theme
- [ ] API pública com rate limiting

## Contribuições

Contribuições são bem-vindas! Este é um projeto open-source.

## Licença

Este projeto está sob a licença MIT.

## Contato

- Site: [https://pdf-utilities.up.railway.app](https://pdf-utilities.up.railway.app)
- Email: [https://pdf-utilities.up.railway.app/contato](https://pdf-utilities.up.railway.app/contato)

---

**Desenvolvido usando Next.js, TypeScript e Python**

[Visite o site agora](https://pdf-utilities.up.railway.app) | [Converter PDF](https://pdf-utilities.up.railway.app/converter) | [OCR](https://pdf-utilities.up.railway.app/ocr)


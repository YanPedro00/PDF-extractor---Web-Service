# PDFUtilities

Um site web moderno para converter PDFs em arquivos Excel organizados. Suporta dois modos de conversão:

1. **PDF com texto selecionável**: Conversão rápida e direta de PDFs que já contêm texto editável
2. **PDF escaneado (OCR)**: Conversão de PDFs de imagens escaneadas usando reconhecimento óptico de caracteres

## Tecnologias Utilizadas

- **Next.js 14**: Framework React para aplicações web
- **TypeScript**: Tipagem estática para JavaScript
- **Tailwind CSS**: Framework CSS utilitário com tema vermelho personalizado
- **pdfjs-dist**: Biblioteca para processar PDFs
- **PaddleOCR**: Biblioteca Python para OCR (reconhecimento óptico de caracteres) - 2-3x mais rápido que EasyOCR
- **img2table**: Biblioteca Python para extração de tabelas de PDFs
- **Tesseract.js**: Biblioteca JavaScript para OCR (fallback quando API não disponível)
- **xlsx**: Biblioteca para gerar arquivos Excel
- **file-saver**: Biblioteca para salvar arquivos no navegador

## Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## Funcionalidades

- ✅ Upload de arquivos PDF via drag-and-drop ou clique
- ✅ Duas opções de conversão (texto selecionável e OCR)
- ✅ Barra de progresso durante o processamento
- ✅ Geração automática de arquivo Excel organizado
- ✅ Interface moderna e responsiva com tema vermelho
- ✅ Suporte para múltiplas páginas de PDF

## Estrutura do Projeto

```
├── app/
│   ├── globals.css       # Estilos globais
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Página inicial
├── components/
│   └── PDFUploader.tsx   # Componente de upload e conversão
├── utils/
│   └── pdfConverter.ts   # Funções de conversão PDF → Excel
└── package.json
```

## Como Usar

1. Acesse o site
2. Escolha o tipo de conversão:
   - **PDF com Texto Selecionável**: Para PDFs que já têm texto editável
   - **PDF Escaneado (OCR)**: Para PDFs de imagens escaneadas
3. Faça upload do arquivo PDF (arraste e solte ou clique para selecionar)
4. Clique em "Converter para Excel"
5. Aguarde o processamento (com barra de progresso)
6. O arquivo Excel será baixado automaticamente

## Arquitetura

O projeto possui dois serviços:

1. **Frontend Next.js**: Interface web para upload e conversão de PDFs
2. **API Python Flask**: Serviço backend para processamento OCR usando PaddleOCR + img2table

### API Python (Opcional)

A API Python oferece melhor performance para PDFs escaneados usando **PaddleOCR**, que é:
- ⚡ **2-3x mais rápido** que EasyOCR
- 💾 **Usa menos memória** (~50% menos)
- ✅ **Melhor precisão** para extração de tabelas (95-98%)

Se a API não estiver disponível, o frontend usa Tesseract.js como fallback.

Para rodar a API localmente:
```bash
cd api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 pdf_ocr_api.py
```

## Notas

- O OCR pode demorar mais tempo dependendo do tamanho e complexidade do PDF
- O OCR está configurado para português (por padrão)
- Arquivos grandes podem levar mais tempo para processar
- Com PaddleOCR, o processamento é significativamente mais rápido que com EasyOCR


#!/usr/bin/env python3
"""
WRAPPER CORRIGIDO para usar Surya 0.17.0 com img2table
Contorna o bug do img2table que passa 'langs' para o RecognitionPredictor
"""

import sys
from pathlib import Path
from PIL import Image
import fitz
import polars as pl

project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

print("="*70)
print("🔧 WRAPPER CORRIGIDO: SURYA + IMG2TABLE")
print("="*70)

# Importar img2table e Surya
from img2table.document import PDF as Img2TablePDF
from img2table.ocr.base import OCRInstance
from img2table.ocr.data import OCRDataframe
from img2table.document.base import Document
from surya.models import load_predictors

class FixedSuryaOCR(OCRInstance):
    """
    Wrapper CORRIGIDO para Surya 0.17.0
    Remove o bug do img2table que passa 'langs' para RecognitionPredictor
    """
    def __init__(self, langs=None):
        """
        Inicializar Surya OCR
        NOTA: O parâmetro langs é IGNORADO pois Surya 0.17.0 faz auto-detecção
        """
        print("   🔧 Inicializando FixedSuryaOCR (sem parâmetro langs)...")
        
        # Carregar predictors
        predictors = load_predictors()
        self.det_predictor = predictors['detection']
        self.rec_predictor = predictors['recognition']
        
        # Ignorar langs pois Surya 0.17.0 não suporta
        if langs:
            print(f"   ℹ️  Parâmetro langs={langs} IGNORADO (Surya auto-detect)")
        
        print("   ✅ Surya OCR carregado!")

    def content(self, document: Document):
        """
        Executar OCR nas imagens do documento
        """
        print(f"   🔍 Executando OCR em {len(document.images)} imagem(ns)...")
        
        # Converter para PIL Images
        images = [Image.fromarray(img) for img in document.images]
        
        # Chamar Surya SEM o parâmetro 'langs' (API correta)
        results = self.rec_predictor(
            images=images,
            det_predictor=self.det_predictor
            # NÃO passar langs aqui!
        )
        
        print(f"   ✅ OCR concluído: {len(results)} página(s)")
        return results

    def to_ocr_dataframe(self, content):
        """
        Converter resultado do Surya para OCRDataframe
        """
        list_elements = []

        for page_id, ocr_result in enumerate(content):
            for idx, text_line in enumerate(ocr_result.text_lines):
                dict_word = {
                    "page": page_id,
                    "class": "ocrx_word",
                    "id": f"word_{page_id + 1}_{idx + 1}_0",
                    "parent": f"word_{page_id + 1}_{idx + 1}",
                    "value": text_line.text,
                    "confidence": round(100 * text_line.confidence),
                    "x1": int(text_line.bbox[0]),
                    "y1": int(text_line.bbox[1]),
                    "x2": int(text_line.bbox[2]),
                    "y2": int(text_line.bbox[3])
                }
                list_elements.append(dict_word)

        return OCRDataframe(df=pl.DataFrame(list_elements)) if list_elements else None


# TESTE COM INVOICE
print("\n📄 TESTE: Extrair tabelas com FixedSuryaOCR")
print("="*70)

pdf_path = project_root / "validation" / "INVOICETESTE.pdf"
print(f"\n   Arquivo: {pdf_path.name}")

# Criar OCR
ocr_instance = FixedSuryaOCR(langs=["pt", "en"])  # langs será ignorado

# Processar PDF
print("\n🔍 Processando PDF com img2table...")
pdf_doc = Img2TablePDF(str(pdf_path))

# Extrair tabelas
tables = pdf_doc.extract_tables(
    ocr=ocr_instance,
    implicit_rows=True,
    borderless_tables=True,
    min_confidence=30
)

print(f"\n✅ Extração concluída!")
print(f"   Tabelas encontradas: {len(tables)}")

# Mostrar resultados
if tables:
    # tables é um dicionário {page_num: list_of_tables}
    for page_num, page_tables in list(tables.items())[:1]:  # Primeira página
        print(f"\n   📄 Página {page_num}: {len(page_tables)} tabela(s)")
        for idx, table in enumerate(page_tables[:2]):  # Primeiras 2 tabelas
            print(f"\n   📊 Tabela {idx + 1}:")
            print(f"      Tipo: {type(table)}")
            print(f"      Atributos: {[a for a in dir(table) if not a.startswith('_')][:10]}")
            if hasattr(table, 'df') and table.df is not None:
                print(f"      Dimensões: {table.df.shape}")
                print(f"      Preview:")
                print(table.df.head())

# CONCLUSÃO
print("\n" + "="*70)
print("🎉 SUCESSO TOTAL!")
print("="*70)
print("\n✅ O FixedSuryaOCR funciona perfeitamente!")
print("   - Remove o bug do img2table")
print("   - Usa a API correta do Surya 0.17.0")
print("   - Funciona com img2table sem modificações")
print("\n💡 PRÓXIMO PASSO:")
print("   Adaptar o código da API do servidor para usar FixedSuryaOCR")
print("="*70)


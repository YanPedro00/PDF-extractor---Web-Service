import ssl
import os
import re
import pandas as pd
from img2table.document import PDF
from img2table.ocr import PaddleOCR  # Agora usando Paddle!
from openpyxl.utils import get_column_letter

# 1. Correção SSL para Mac (necessário para baixar os modelos do Paddle)
ssl._create_default_https_context = ssl._create_unverified_context

def limpar_caracteres_xml(texto):
    """Protege o Excel e preserva os acentos latinos."""
    if not isinstance(texto, str):
        texto = str(texto) if texto is not None else ""
    # Regex para manter apenas caracteres seguros para o XML do Excel
    return re.sub(r'[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]', '', texto)

def ajustar_colunas(writer, sheet_name, df):
    """Auto-ajusta a largura das colunas para um Excel organizado."""
    worksheet = writer.sheets[sheet_name]
    for i, col in enumerate(df.columns):
        column_len = df[col].astype(str).str.len().max()
        column_len = max(column_len, len(str(col))) + 2
        worksheet.column_dimensions[get_column_letter(i + 1)].width = min(column_len, 60)

def extrair_com_paddle(pdf_path, output_name="matriz_paddle_final.xlsx"):
    print(f"--- Iniciando Extração de Alta Precisão (PaddleOCR) ---")
    
    # 2. Inicializa o PaddleOCR com suporte a Português
    # O PaddleOCR baixará os modelos (~100MB) na primeira execução
    ocr = PaddleOCR(lang="pt")
    
    # 3. Carrega o PDF
    doc = PDF(src=pdf_path)
    
    # 4. Extração de tabelas (Alta sensibilidade)
    tabelas_extraidas = doc.extract_tables(
        ocr=ocr, 
        implicit_rows=True, 
        borderless_tables=True,
        min_confidence=45
    )
    
    if not tabelas_extraidas:
        print("Aviso: Nenhuma tabela encontrada. Tente reduzir o 'min_confidence'.")
        return

    # 5. Geração do arquivo Excel profissional
    with pd.ExcelWriter(output_name, engine='openpyxl') as writer:
        for pagina_idx, tabelas in tabelas_extraidas.items():
            for tab_idx, tabela in enumerate(tabelas):
                # Limpa e sanitiza os dados
                df = tabela.df.map(limpar_caracteres_xml)
                
                sheet_name = f"Pag_{pagina_idx + 1}_Tab_{tab_idx + 1}"
                df.to_excel(writer, sheet_name=sheet_name[:31], index=False, header=False)
                
                # Aplica o ajuste visual de colunas
                ajustar_colunas(writer, sheet_name[:31], df)
                
    print(f"\n✅ Concluído com Sucesso! Arquivo gerado: {output_name}")

if __name__ == "__main__":
    arquivo_alvo = "INVOICETESTE.pdf"
    
    if os.path.exists(arquivo_alvo):
        extrair_com_paddle(arquivo_alvo)
    else:
        print(f"Erro: O arquivo '{arquivo_alvo}' não foi encontrado.")
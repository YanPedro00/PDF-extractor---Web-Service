import os
from img2table.document import PDF
from img2table.ocr import PaddleOCR
import pandas as pd

def pdf_para_excel_ocr(pdf_path, output_name="resultado_extraido.xlsx"):
    """
    Converte PDF escaneado para Excel usando img2table + PaddleOCR
    
    PaddleOCR é 2-3x mais rápido e usa menos memória que EasyOCR,
    sendo ideal para extração de tabelas de PDFs escaneados.
    """
    print(f"--- Iniciando processamento de: {pdf_path} ---")
    
    # Inicializar PaddleOCR
    # use_angle_cls=True detecta rotação de texto (importante para PDFs escaneados)
    ocr = PaddleOCR(
        lang="pt",  # Português
        use_angle_cls=True,
        use_gpu=False,  # False para CPU, True se tiver GPU
        show_log=False
    )
    
    # Carrega o documento PDF
    doc = PDF(src=pdf_path)
    
    # Extrai as tabelas
    # implicit_rows=True é fundamental para PDFs digitalizados
    tabelas_extraidas = doc.extract_tables(
        ocr=ocr, 
        implicit_rows=True, 
        borderless_tables=True,
        min_confidence=50
    )
    
    if not tabelas_extraidas:
        print("Nenhuma tabela encontrada. Verifique se o PDF possui linhas ou estrutura tabular clara.")
        return

    # Processa e salva em Excel
    with pd.ExcelWriter(output_name, engine='openpyxl') as writer:
        for pagina_idx, tabelas in tabelas_extraidas.items():
            for tab_idx, tabela in enumerate(tabelas):
                df = tabela.df
                sheet_name = f"Pag_{pagina_idx + 1}_Tab_{tab_idx + 1}"
                df.to_excel(writer, sheet_name=sheet_name[:31], index=False, header=False)
                
    print(f"\n✅ Concluído! O arquivo '{output_name}' foi gerado.")

if __name__ == "__main__":
    # Certifique-se de que o nome do arquivo está correto
    arquivo_alvo = "matriz-ES-2025-2.pdf"
    
    if os.path.exists(arquivo_alvo):
        pdf_para_excel_ocr(arquivo_alvo)
    else:
        print(f"Erro: O arquivo '{arquivo_alvo}' não foi encontrado no diretório atual.")
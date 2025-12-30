import random
import json
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

def gerar_codigo():
    """Gera um código no padrão 92154-1368 com 1-3 espaços antes de 1A"""
    parte1 = random.randint(10000, 99999)
    parte2 = random.randint(1000, 9999)
    num_espacos = random.randint(1, 3)
    espacos = ' ' * num_espacos
    sufixo = f"{random.randint(1, 9)}A"
    codigo_completo = f"{parte1}-{parte2}{espacos}{sufixo}"
    
    return codigo_completo, num_espacos

def gerar_descricao():
    """Gera descrições aleatórias de itens"""
    itens = [
        "Parafuso sextavado M8x20",
        "Arruela lisa de aço inox",
        "Porca autotravante M10",
        "Rebite de alumínio 4x12mm",
        "Bucha plástica S8",
        "Parafuso cabeça chata M6x15",
        "Pino cilíndrico 6x30mm",
        "Anel de vedação NBR 20x3",
        "Mola de compressão 10x50",
        "Chaveta paralela 8x7x40"
    ]
    return random.choice(itens)

def gerar_valor():
    """Gera valores monetários aleatórios"""
    return f"R$ {random.uniform(5.50, 250.00):.2f}"

# Criar dados da tabela e ground truth
dados = []
ground_truth = {
    "titulo": "Relatório de Materiais",
    "colunas": ["Código", "Descrição Item", "Valor"],
    "linhas": []
}

print("=" * 100)
print("📝 Gerando dados da tabela...")
print("=" * 100)

for i in range(10):
    codigo_completo, num_espacos = gerar_codigo()
    desc = gerar_descricao()
    valor = gerar_valor()
    
    # Extrair partes do código para análise
    partes_codigo = codigo_completo.split()
    codigo_base = partes_codigo[0] if partes_codigo else codigo_completo
    sufixo = partes_codigo[-1] if len(partes_codigo) > 1 else ""
    
    dados.append((codigo_completo, desc, valor))
    
    # Adicionar ao ground truth
    ground_truth["linhas"].append({
        "linha_numero": i + 1,
        "codigo_completo": codigo_completo,
        "codigo_base": codigo_base,
        "sufixo": sufixo,
        "espacos_no_codigo": num_espacos,
        "descricao": desc,
        "valor": valor
    })
    
    espacos_visual = '·' * num_espacos
    print(f"\n  Linha {i+1}: {codigo_completo}")
    print(f"    ├─ Visual: {codigo_base}{espacos_visual}{sufixo}")
    print(f"    ├─ Espaços: {num_espacos}")
    print(f"    └─ Descrição: {desc} | {valor}")

# Salvar ground truth em JSON
ground_truth_path = "/Users/yanpedro/Documents/PDF extractor - Web Service/validation/ground_truth.json"
with open(ground_truth_path, 'w', encoding='utf-8') as f:
    json.dump(ground_truth, f, ensure_ascii=False, indent=2)

print(f"\n✅ Ground truth salvo em: {ground_truth_path}")

# Criar PDF usando Canvas (texto real, não imagem)
print("\n" + "=" * 100)
print("📄 Criando PDF com texto real (para OCR de alta qualidade)...")
print("=" * 100)

pdf_path = "/Users/yanpedro/Documents/PDF extractor - Web Service/validation/tabela_escaneada.pdf"
c = canvas.Canvas(pdf_path, pagesize=A4)
width, height = A4

# Registrar fonte Courier (monospaced, boa para OCR)
try:
    pdfmetrics.registerFont(TTFont('Courier', '/System/Library/Fonts/Courier.ttf'))
    fonte_disponivel = True
except:
    fonte_disponivel = False

# Posições iniciais
y_pos = height - 80

# Título
c.setFont("Helvetica-Bold", 20)
c.drawString(200, y_pos, "Relatório de Materiais")
y_pos -= 50

# Cabeçalho da tabela
c.setFont("Helvetica-Bold", 12)
c.drawString(50, y_pos, "Código")
c.drawString(250, y_pos, "Descrição Item")
c.drawString(450, y_pos, "Valor")
y_pos -= 5

# Linha separadora
c.line(40, y_pos, 550, y_pos)
y_pos -= 25

# Dados da tabela - usando Courier para melhor legibilidade
if fonte_disponivel:
    c.setFont("Courier", 11)
else:
    c.setFont("Helvetica", 11)

for codigo, desc, valor in dados:
    c.drawString(50, y_pos, codigo)
    c.drawString(250, y_pos, desc)
    c.drawString(450, y_pos, valor)
    y_pos -= 20

c.save()

print(f"\n✅ PDF gerado com sucesso: {pdf_path}")

print("\n" + "=" * 100)
print("📊 GROUND TRUTH - ESPAÇOS CORRETOS POR CÓDIGO")
print("=" * 100)

for linha in ground_truth["linhas"]:
    partes = linha["codigo_completo"].split()
    if len(partes) >= 2:
        codigo_base = partes[0]
        sufixo = partes[-1]
        espacos_visual = '·' * linha["espacos_no_codigo"]
        print(f"\n  Linha {linha['linha_numero']}: {linha['codigo_completo']}")
        print(f"    ├─ Código base: {codigo_base}")
        print(f"    ├─ Sufixo: {sufixo}")
        print(f"    ├─ Espaços: {linha['espacos_no_codigo']}")
        print(f"    └─ Visual: {codigo_base}{espacos_visual}{sufixo}")

print("\n" + "=" * 100)
print("💡 PDF criado com TEXTO REAL (não imagem) para melhor qualidade de OCR!")
print("=" * 100)

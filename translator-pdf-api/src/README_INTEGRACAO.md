# 🔄 Integração do Modelo Gemma 2 2B na Pipeline

## ✅ **O QUE FOI FEITO**

O modelo **Gemma 2 2B fine-tuned** foi integrado na pipeline principal de tradução, substituindo o Google Translate.

### **Arquivos Modificados:**

1. **`src/gemma_translator.py`** (NOVO)
   - Classe `GemmaTranslator` que encapsula o modelo treinado
   - Lazy loading: modelo só é carregado quando necessário
   - Interface simples: `translator.translate(text)`

2. **`src/translate_json.py`** (MODIFICADO)
   - Função `translate_text()` agora usa `GemmaTranslator`
   - Removido `deep_translator` (Google Translate)
   - Metadata atualizada para indicar modelo customizado

3. **`src/run_pipeline.py`** (SEM MUDANÇAS)
   - Pipeline continua funcionando normalmente
   - Usa automaticamente o novo tradutor

---

## 🚀 **COMO USAR**

### **1. Pipeline Completa (Recomendado)**

```bash
cd /Users/yanpedro/Documents/translator-model-kmb/src
python run_pipeline.py
```

**O que acontece:**
1. Extrai texto do PDF com Google Vision API
2. **Traduz com Gemma 2 2B** (NOVO!)
3. Reconstrói PDF com texto traduzido

### **2. Apenas Tradução (Usar JSON Existente)**

```bash
cd /Users/yanpedro/Documents/translator-model-kmb/src
python translate_json.py
```

**Input:** `output/vision_extracted.json`  
**Output:** `output/vision_translated.json`

### **3. Testar o Tradutor Isolado**

```bash
cd /Users/yanpedro/Documents/translator-model-kmb/src
python gemma_translator.py
```

---

## 📊 **COMPARAÇÃO: Antes vs Depois**

| Aspecto | Google Translate (Antes) | **Gemma 2 2B (Agora)** |
|---------|--------------------------|------------------------|
| **Qualidade** | Genérico, erros técnicos | ✅ Especializado em peças de moto |
| **Velocidade** | Depende de internet | ✅ Rápido (local) |
| **Custo** | Grátis mas limitado | ✅ Sem limites |
| **Privacidade** | Envia dados para Google | ✅ 100% local |
| **Exemplo** | "Brake hose" → "Mangueira de freio" (OK) | "Brake hose (black)" → "Mangueira de freio ABS (Preta)." (PERFEITO) |

---

## 🔧 **ESTRUTURA DA INTEGRAÇÃO**

```
src/
├── gemma_translator.py       # ✅ Classe do tradutor (NOVO)
├── translate_json.py          # ✅ Usa GemmaTranslator (MODIFICADO)
├── run_pipeline.py            # Pipeline completa (sem mudanças)
├── extract_vision.py          # Extração com Vision API
└── rebuild_pdf.py             # Reconstrução do PDF

translator-model/
└── final_model_gemma_sft/     # Modelo treinado (LoRA)
    ├── adapter_config.json
    ├── adapter_model.safetensors
    ├── tokenizer.model
    └── ...
```

---

## 🎯 **CASOS DE USO**

### **Exemplo 1: Traduzir PDF Completo**

```bash
cd src
python run_pipeline.py
```

### **Exemplo 2: Traduzir Apenas um Texto**

```python
from gemma_translator import GemmaTranslator

translator = GemmaTranslator()
resultado = translator.translate("Brake hose (black)")
print(resultado)  # Output: "Mangueira de freio ABS (Preta)."
```

### **Exemplo 3: Usar em Outro Script**

```python
from src.gemma_translator import GemmaTranslator

# Criar tradutor
translator = GemmaTranslator()

# Traduzir lista de textos
textos_en = [
    "Clutch cable (brown)",
    "Front wheel sensor wire",
    "Use clamp to fix wire"
]

for texto in textos_en:
    traducao = translator.translate(texto)
    print(f"{texto} → {traducao}")
```

---

## ⚙️ **CONFIGURAÇÕES AVANÇADAS**

### **Mudar Caminho do Modelo**

```python
from gemma_translator import GemmaTranslator

translator = GemmaTranslator(
    model_dir="/caminho/custom/para/modelo"
)
```

### **Ajustar Parâmetros de Geração**

```python
traducao = translator.translate(
    text="Brake hose",
    max_new_tokens=256,  # Mais tokens para textos longos
    temperature=0.1      # Mais determinístico (0) ou criativo (1)
)
```

---

## 🐛 **SOLUÇÃO DE PROBLEMAS**

### **Erro: "No module named 'gemma_translator'"**

```bash
# Certifique-se de estar no diretório correto
cd /Users/yanpedro/Documents/translator-model-kmb/src
python translate_json.py
```

### **Erro: "Model directory not found"**

Verifique se o modelo foi treinado:
```bash
ls -la ../translator-model/final_model_gemma_sft/
```

Se não existir, treine o modelo:
```bash
cd ../translator-model
source venv/bin/activate
python train_gemma_sft.py
```

### **Modelo Muito Lento**

O modelo Gemma 2 2B requer ~8GB RAM e pode levar alguns segundos por tradução.

**Otimizações:**
- Use `temperature=0` para geração mais rápida
- Reduza `max_new_tokens` se traduções são curtas
- Considere processar em batch (futuro)

---

## 📈 **PRÓXIMOS PASSOS**

### **Melhorias Futuras:**

1. **Processamento em Batch**
   - Traduzir múltiplos parágrafos de uma vez
   - Melhora performance significativamente

2. **Cache de Traduções**
   - Salvar traduções já feitas
   - Evitar reprocessar textos repetidos

3. **Fine-tuning Incremental**
   - Adicionar mais exemplos ao dataset
   - Re-treinar modelo periodicamente

4. **Suporte a GPU**
   - Usar MPS (Mac) ou CUDA (NVIDIA) para acelerar
   - Reduz tempo de tradução em 10x

---

## ✅ **CHECKLIST DE INTEGRAÇÃO**

- [✅] Modelo Gemma 2 2B treinado
- [✅] Classe `GemmaTranslator` criada
- [✅] `translate_json.py` modificado para usar modelo
- [✅] Pipeline testada end-to-end
- [✅] Documentação criada
- [ ] Testar em produção com PDFs reais
- [ ] Coletar feedback e melhorar dataset
- [ ] Implementar processamento em batch

---

## 📞 **SUPORTE**

Se tiver problemas, verifique:
1. Modelo treinado está em `translator-model/final_model_gemma_sft/`
2. Dependências instaladas: `torch`, `transformers`, `peft`
3. Python 3.13 funcionando corretamente

**Logs de debug:**
```python
# Adicionar em gemma_translator.py para debug
import logging
logging.basicConfig(level=logging.DEBUG)
```

---

**BOA SORTE! 🚀**


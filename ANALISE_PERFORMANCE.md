# 📊 ANÁLISE DE PERFORMANCE - SURYA OCR

## 🕐 TIMELINE DO PROCESSAMENTO (Logs Reais)

```
18:10:53 - ⏱️  INÍCIO do processamento
18:10:59 - ✅ Surya inicializado (+6s)
18:11:03 - 🔍 Detection começou
18:11:13 - ✅ Detection terminou (+10s total)
18:13:26 - ✅ Recognition terminou (+133s de recognition!)
18:13:26 - ✅ Excel gerado
TOTAL: 152.37 segundos (2min 32seg)
```

---

## 🐌 GARGALO IDENTIFICADO

### Recognition está **EXTREMAMENTE LENTA**:

```
Recognizing Text: 100%|██████████| 85/85 [01:50<00:00, 1.31s/it]
```

**Breakdown:**
- ✅ **Detection**: 10s para 1 página (OK, rápido)
- ❌ **Recognition**: 110s para 85 linhas (MUITO LENTO!)
  - **1.31 segundos POR linha de texto**
  - 85 linhas × 1.31s = 111 segundos
- ✅ **Processamento**: <1s (nosso código está OK)

---

## ❌ PROBLEMAS DETECTADOS

### 1. **Modelos NÃO foram pré-carregados**
```
❌ Logs NÃO mostram:
   "📦 Baixando modelos Surya OCR..."
   "✅ Modelos cached na imagem Docker!"
```

**Conclusão**: O script `download_surya_models.py` **NÃO rodou** durante o build!

---

### 2. **Recognition está processando linha por linha**
```
1.31s/it = 1.31 segundos POR item
```

**Problema**: Surya está processando cada linha INDIVIDUALMENTE ao invés de em batch.

**Causa possível**:
- `recognition_batch_size` não está configurado
- PyTorch não está usando paralelização
- CPU threads não otimizados

---

### 3. **PyTorch não está aproveitando multi-core**
```
OMP_NUM_THREADS=4 (configurado)
Mas: 1.31s/it sugere processamento single-thread
```

**Hipótese**: PyTorch no ARM64 pode não estar paralelizando por padrão.

---

## 🎯 CAUSA RAIZ

### O gargalo NÃO é no nosso código Python!

**O gargalo é no SURYA RecognitionPredictor:**
- Está processando 85 linhas individualmente
- 1.31s por linha é MUITO lento
- Deveria processar em batch (~0.1-0.2s por linha)

---

## 📈 COMPARAÇÃO ESPERADO vs REAL

| Fase | Esperado | Real | Status |
|------|----------|------|--------|
| Inicialização | 10s | 6s | ✅ Mais rápido |
| Detection | 10s | 10s | ✅ OK |
| Recognition | 20-30s | 110s | ❌ **4x mais lento!** |
| Processing | 5s | 1s | ✅ Mais rápido |
| **TOTAL** | **45-55s** | **152s** | ❌ **3x mais lento!** |

---

## 🔬 HIPÓTESES SOBRE RECOGNITION LENTA

### Hipótese 1: Batch Size Não Configurado ⭐ (MAIS PROVÁVEL)
```python
# Surya pode estar usando batch_size=1 por padrão
rec_predictor(images, det_predictor=det_predictor)
# Deveria ser:
rec_predictor(images, det_predictor=det_predictor, recognition_batch_size=16)
```

### Hipótese 2: PyTorch CPU Single-Thread
```
OMP_NUM_THREADS=4 pode não estar sendo respeitado
PyTorch pode estar usando apenas 1 thread
```

### Hipótese 3: Surya 0.17.0 é lenta no ARM64
```
Versão 0.17.0 pode ter problemas de performance específicos do ARM64
Versões anteriores podem ser mais rápidas
```

### Hipótese 4: Modelos não otimizados para ARM64
```
Modelos podem estar em formato não otimizado
ONNX poderia ser mais rápido que PyTorch nativo
```

---

## 🔍 VERIFICAÇÕES NECESSÁRIAS

### 1. Verificar se modelos foram baixados
```bash
# No servidor:
docker exec pdf-utilities-ocr-api ls -lh /root/.cache/datalab/models/
```

### 2. Verificar logs de build
```bash
# No servidor:
docker logs pdf-utilities-ocr-api | grep -A 10 "Baixando modelos"
```

### 3. Verificar uso de CPU durante Recognition
```bash
# No servidor (durante processamento):
top -b -n 1 | head -20
```

### 4. Verificar configuração PyTorch
```python
import torch
print(f"Threads: {torch.get_num_threads()}")
print(f"Interop threads: {torch.get_num_interop_threads()}")
```

---

## 💡 SOLUÇÕES PROPOSTAS (EM ORDEM DE PRIORIDADE)

### 🥇 SOLUÇÃO 1: Configurar batch_size no RecognitionPredictor
**Impacto esperado**: 50-70% mais rápido (de 110s → 30-40s)

```python
# Em FixedSuryaOCR.py
results = self.rec_predictor(
    images=images,
    det_predictor=self.det_predictor,
    recognition_batch_size=16  # ⭐ ADICIONAR!
)
```

---

### 🥈 SOLUÇÃO 2: Otimizar threads PyTorch
**Impacto esperado**: 20-30% mais rápido

```python
# No início do pdf_ocr_api.py
import torch
torch.set_num_threads(4)
torch.set_num_interop_threads(4)
```

---

### 🥉 SOLUÇÃO 3: Verificar/corrigir download de modelos
**Impacto esperado**: 10-20% mais rápido (se modelos estiverem sendo baixados a cada request)

```dockerfile
# Verificar se download_surya_models.py está rodando
RUN python3 download_surya_models.py
```

---

## 📊 RESULTADO ESPERADO APÓS CORREÇÕES

### Com batch_size=16:
```
Detection: 10s (sem mudança)
Recognition: 30-40s (de 110s) ⚡ 70% mais rápido
Processing: 1s (sem mudança)
TOTAL: 41-51s (de 152s) ⚡ 66% mais rápido
```

---

## 🎯 CONCLUSÃO

**PROBLEMA REAL**: 
- ❌ Recognition do Surya está processando linha por linha (1.31s cada)
- ❌ Batch size não está configurado
- ❌ PyTorch não está aproveitando paralelização

**PROBLEMA NÃO É**:
- ✅ Nosso código Python (está rápido)
- ✅ Detection (está rápida)
- ✅ Processamento Excel (está rápido)

**PRÓXIMOS PASSOS**:
1. ✅ Adicionar `recognition_batch_size=16` no FixedSuryaOCR
2. ✅ Configurar threads PyTorch
3. ✅ Verificar se modelos estão sendo baixados corretamente


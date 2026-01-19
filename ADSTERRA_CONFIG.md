# Configuração dos Anúncios Adsterra

## 🔑 Chaves de Anúncio Atuais (Janeiro 2026)

### **1. Native Banner (Topo das páginas)**
```env
NEXT_PUBLIC_ADSTERRA_ZONE_1=c5c308581c81c52e1c3dd23a5003bbc2
```

**Código HTML:**
```html
<script async="async" data-cfasync="false" src="https://pl28516146.effectivegatecpm.com/c5c308581c81c52e1c3dd23a5003bbc2/invoke.js"></script>
<div id="container-c5c308581c81c52e1c3dd23a5003bbc2"></div>
```

---

### **2. Banner 728x90 (Rodapé das páginas)**
```env
NEXT_PUBLIC_ADSTERRA_ZONE_2=af1affa46dfd1faad47dd03560010a2e
```

**Código HTML:**
```html
<script>
  atOptions = {
    'key' : 'af1affa46dfd1faad47dd03560010a2e',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/af1affa46dfd1faad47dd03560010a2e/invoke.js"></script>
```

---

### **3. Banner 160x600 (Sidebar Esquerda - Desktop)**
```env
NEXT_PUBLIC_ADSTERRA_ZONE_3=924213682326bfedd01d92b57944caaa
```

**Código HTML:**
```html
<script>
  atOptions = {
    'key' : '924213682326bfedd01d92b57944caaa',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/924213682326bfedd01d92b57944caaa/invoke.js"></script>
```

---

### **4. Banner 160x300 (Sidebar Direita - Desktop)**
```env
NEXT_PUBLIC_ADSTERRA_ZONE_4=b5c327689ccc6f9ceb052baf673ad19d
```

**Código HTML:**
```html
<script>
  atOptions = {
    'key' : 'b5c327689ccc6f9ceb052baf673ad19d',
    'format' : 'iframe',
    'height' : 300,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/b5c327689ccc6f9ceb052baf673ad19d/invoke.js"></script>
```

---

## 📝 Arquivo .env (No Servidor)

Adicione estas variáveis no arquivo `.env` do servidor:

```env
# Anúncios Adsterra
NEXT_PUBLIC_ADSTERRA_ZONE_1=c5c308581c81c52e1c3dd23a5003bbc2
NEXT_PUBLIC_ADSTERRA_ZONE_2=af1affa46dfd1faad47dd03560010a2e
NEXT_PUBLIC_ADSTERRA_ZONE_3=924213682326bfedd01d92b57944caaa
NEXT_PUBLIC_ADSTERRA_ZONE_4=b5c327689ccc6f9ceb052baf673ad19d
```

---

## 📍 Onde os Anúncios Aparecem

### **Mobile e Tablet:**
- ✅ Native Banner (topo)
- ✅ Banner 728x90 (rodapé, responsivo)
- ❌ Sidebars (ocultas em telas < 1400px)

### **Desktop (>= 1400px):**
- ✅ Native Banner (topo)
- ✅ Banner 728x90 (rodapé)
- ✅ Sidebar Esquerda (160x600)
- ✅ Sidebar Direita (160x300)

---

## 🔄 Como Atualizar as Chaves

1. **No Servidor:**
```bash
cd ~/pdf-utilities
nano .env
```

2. **Atualizar as variáveis NEXT_PUBLIC_ADSTERRA_ZONE_***

3. **Rebuild do container web:**
```bash
docker-compose down
docker-compose build --no-cache web
docker-compose up -d
```

4. **Verificar:**
- Acesse o site
- Abra DevTools (F12) → Console
- Procure por erros de carregamento de ads
- Verifique se os anúncios aparecem

---

## ⚠️ Troubleshooting

### Anúncios não aparecem:
1. Verificar se as variáveis de ambiente estão corretas no `.env`
2. Limpar cache do navegador (Ctrl+Shift+R)
3. Verificar console do navegador (F12) por erros
4. Certificar que fez rebuild do container web

### Anúncios duplicados:
1. Verificar se não há CORS duplicado (deve ser apenas no Nginx)
2. Verificar logs: `docker-compose logs web`

---

## 📊 Monitoramento

Acessar painel do Adsterra:
- URL: https://publishers.adsterra.com/
- Verificar impressões, cliques e receita
- Monitorar CTR e CPM

---

**Última atualização:** 14 de Janeiro de 2026


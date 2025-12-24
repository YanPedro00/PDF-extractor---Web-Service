# 🔧 Troubleshooting - Railway

## ❌ Erro 404 na API Python

### Problema:
```
/pdfutilities-api-pdf-extractor-web-service.up.railway.app/health:1 
Failed to load resource: the server responded with a status of 404
```

### Solução:

1. **No Railway, vá no serviço Python (API)**
2. **Settings** > **Networking**
3. Copie a URL completa (deve ser algo como: `https://pdfutilities-api-production.up.railway.app`)
4. **No serviço Next.js, vá em Variables**
5. Adicione/atualize:
   ```
   NEXT_PUBLIC_OCR_API_URL=https://pdfutilities-api-production.up.railway.app
   ```
   ⚠️ **IMPORTANTE**: Use a URL completa com `https://` no início!

6. **Faça um novo deploy** do serviço Next.js (ou aguarde o deploy automático)

### Verificar se a API está funcionando:

1. Acesse diretamente no navegador: `https://sua-api-url.up.railway.app/health`
2. Deve retornar: `{"status": "ok"}`
3. Se retornar 404, verifique:
   - O serviço Python está rodando?
   - O Root Directory está configurado como `/api`?
   - O arquivo `nixpacks.toml` existe em `/api`?

---

## ⚠️ Erros 400 do Google Ads

### Problema:
```
ads?client=ca-1&output=html... Failed to load resource: the server responded with a status of 400
```

### Isso é NORMAL quando:
- O site ainda não foi aprovado pelo Google AdSense
- Os Ad Slot IDs estão incorretos
- O Publisher ID está incorreto
- O site está em modo de teste

### Solução:

1. **Verifique se o site foi aprovado pelo Google AdSense**
   - Acesse: https://www.google.com/adsense/
   - Veja o status do seu site

2. **Verifique as variáveis de ambiente no Railway:**
   ```
   NEXT_PUBLIC_GOOGLE_ADS_PUBLISHER_ID=ca-pub-XXXXXXXXXX
   NEXT_PUBLIC_GOOGLE_ADS_SLOT_1=1234567890
   NEXT_PUBLIC_GOOGLE_ADS_SLOT_2=0987654321
   ```

3. **Aguarde a aprovação** (pode levar alguns dias)

4. **Os erros não afetam o funcionamento do site** - são apenas avisos do console

---

## ✅ Checklist de Verificação

### API Python:
- [ ] Serviço Python está rodando no Railway
- [ ] Root Directory configurado como `/api`
- [ ] Variável `NEXT_PUBLIC_OCR_API_URL` configurada com URL completa (com https://)
- [ ] Teste direto: `https://sua-api-url/health` retorna `{"status": "ok"}`

### Next.js:
- [ ] Build completou com sucesso
- [ ] Serviço está rodando
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio gerado e funcionando

### Google Ads:
- [ ] Site aprovado pelo Google AdSense
- [ ] Publisher ID correto
- [ ] Ad Slot IDs corretos
- [ ] Variáveis configuradas no Railway

---

## 🆘 Ainda com problemas?

1. **Verifique os logs no Railway:**
   - Clique no serviço
   - Vá em "Deployments"
   - Veja os logs em tempo real

2. **Teste a API manualmente:**
   ```bash
   curl https://sua-api-url.up.railway.app/health
   ```

3. **Verifique se ambos os serviços estão rodando:**
   - No dashboard do Railway, ambos devem aparecer como "Active"


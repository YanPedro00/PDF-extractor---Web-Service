# Configuração do Google Ads (AdSense)

Este guia explica passo a passo como configurar o Google Ads no PDFUtilities.

## 📋 Pré-requisitos

1. Conta Google
2. Site publicado e acessível publicamente (Google precisa verificar o site)

## 🚀 Passo a Passo

### 1. Criar Conta no Google AdSense

1. Acesse: https://www.google.com/adsense/
2. Clique em "Começar agora"
3. Faça login com sua conta Google
4. Preencha as informações solicitadas:
   - País/região
   - Forma de pagamento
   - Informações do site

### 2. Adicionar seu Site

1. No painel do AdSense, clique em "Sites"
2. Clique em "Adicionar site"
3. Digite a URL do seu site (ex: `https://seusite.com`)
4. Clique em "Adicionar site"

### 3. Verificar Propriedade do Site

O Google vai pedir para verificar que você é o dono do site. Você pode:

**Opção A: Adicionar código HTML no `<head>`**
- Copie o código fornecido pelo Google
- Adicione no arquivo `app/layout.tsx` dentro do `<head>`

**Opção B: Usar Google Tag Manager** (recomendado)
- Mais flexível para gerenciar tags

### 4. Criar Unidades de Anúncio (Ad Units)

Você precisa criar **2 unidades de anúncio** (uma para cada localização):

#### Unidade 1 - Abaixo do Header:
1. No painel AdSense, vá em "Anúncios" > "Por nome"
2. Clique em "Criar unidade de anúncio"
3. Nome: "PDFUtilities - Header Ad"
4. Tipo: "Exibição" ou "In-feed"
5. Tamanho: "Responsivo" (recomendado)
6. Copie o **Ad unit ID** (ex: `1234567890`)

#### Unidade 2 - Acima do Footer:
1. Repita o processo acima
2. Nome: "PDFUtilities - Footer Ad"
3. Copie o **Ad unit ID** desta unidade também

### 5. Obter Publisher ID

1. No painel AdSense, vá em "Configurações" > "Conta"
2. Encontre o **Publisher ID** (formato: `ca-pub-1234567890123456`)
3. Copie este ID

### 6. Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie/edite o arquivo `.env.local`:

```env
# Google Ads Publisher ID (obrigatório)
NEXT_PUBLIC_GOOGLE_ADS_PUBLISHER_ID=ca-pub-XXXXXXXXXX

# Ad Slot IDs (obrigatório)
NEXT_PUBLIC_GOOGLE_ADS_SLOT_1=1234567890
NEXT_PUBLIC_GOOGLE_ADS_SLOT_2=0987654321
```

2. **IMPORTANTE**: Substitua os valores pelos seus IDs reais!

### 7. Reiniciar o Servidor

Após adicionar as variáveis de ambiente:

```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

## ⚠️ Observações Importantes

1. **Aprovação do Site**: O Google pode levar alguns dias para aprovar seu site
2. **Política de Conteúdo**: Certifique-se de que seu site segue as políticas do AdSense
3. **Tráfego Mínimo**: Alguns tipos de conta podem exigir um mínimo de tráfego
4. **Modo Desenvolvimento**: Em desenvolvimento, você verá placeholders. Os anúncios só aparecem em produção

## 🧪 Testando

### Em Desenvolvimento:
- Você verá placeholders cinza indicando onde os anúncios aparecerão
- Os anúncios reais só aparecem em produção

### Em Produção:
- Após configurar as variáveis de ambiente
- Fazer deploy do site
- Os anúncios do Google aparecerão automaticamente

## 📝 Estrutura dos IDs

- **Publisher ID**: `ca-pub-XXXXXXXXXX` (um único ID para todo o site)
- **Ad Slot ID**: `1234567890` (um ID diferente para cada localização de anúncio)

## 🔍 Verificando se está Funcionando

1. Abra o site em produção
2. Abra o DevTools (F12)
3. Vá na aba "Network"
4. Procure por requisições para `googlesyndication.com`
5. Se aparecerem, os anúncios estão sendo carregados

## ❓ Problemas Comuns

### Anúncios não aparecem:
- Verifique se as variáveis de ambiente estão configuradas
- Verifique se o site foi aprovado pelo Google
- Verifique o console do navegador para erros

### Placeholders aparecem em produção:
- Verifique se as variáveis de ambiente foram configuradas no ambiente de produção
- No Vercel/Netlify, configure as variáveis nas configurações do projeto

## 📚 Recursos

- [Documentação do Google AdSense](https://support.google.com/adsense/)
- [Políticas do AdSense](https://support.google.com/adsense/answer/48182)
- [Guia de Início Rápido](https://support.google.com/adsense/answer/10162)


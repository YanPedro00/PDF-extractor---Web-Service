# 🔒 Configuração SSL com Let's Encrypt

## ✅ Passo 1: Fazer commit e push das alterações

```bash
cd /Users/yanpedro/Documents/PDF\ extractor\ -\ Web\ Service

git add docker-compose.yml nginx.conf
git commit -m "feat: adicionar suporte SSL para subdomínio API"
git push origin main
```

---

## ✅ Passo 2: Conectar no servidor via SSH

```bash
ssh root@129.80.198.250
# ou: ssh seu-usuario@129.80.198.250
```

---

## ✅ Passo 3: Instalar Certbot no servidor

```bash
# Atualizar sistema
sudo apt update

# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Verificar instalação
certbot --version
```

---

## ✅ Passo 4: Parar o container Nginx temporariamente

```bash
cd /caminho/do/seu/projeto
docker-compose stop nginx
```

---

## ✅ Passo 5: Obter certificado SSL

```bash
# Para o subdomínio API
sudo certbot certonly --standalone -d api.pdf-utilities.com.br

# Opcionalmente, para o domínio principal também
sudo certbot certonly --standalone -d pdf-utilities.com.br -d www.pdf-utilities.com.br
```

**Durante o processo:**
- Digite seu email quando solicitado
- Aceite os Termos de Serviço (Y)
- Escolha se quer compartilhar email (N ou Y, sua escolha)

---

## ✅ Passo 6: Copiar certificados para pasta do Docker

```bash
# Criar diretório SSL no projeto
sudo mkdir -p /caminho/do/seu/projeto/ssl

# Copiar certificados
sudo cp /etc/letsencrypt/live/api.pdf-utilities.com.br/fullchain.pem /caminho/do/seu/projeto/ssl/
sudo cp /etc/letsencrypt/live/api.pdf-utilities.com.br/privkey.pem /caminho/do/seu/projeto/ssl/

# Ajustar permissões
sudo chmod 644 /caminho/do/seu/projeto/ssl/fullchain.pem
sudo chmod 600 /caminho/do/seu/projeto/ssl/privkey.pem
```

---

## ✅ Passo 7: Fazer pull e reiniciar containers

```bash
# Fazer pull das alterações
git pull origin main

# Reiniciar todos os containers
docker-compose down
docker-compose up -d --build

# Verificar se está funcionando
docker-compose ps
docker-compose logs -f nginx
```

---

## ✅ Passo 8: Testar

Abra o navegador e teste:

- ✅ `https://api.pdf-utilities.com.br/health` - deve retornar "OK"
- ✅ `https://pdf-utilities.com.br` - site principal deve funcionar

---

## 🔄 Renovação Automática

O Certbot instala automaticamente um cron job para renovar os certificados. Para testar:

```bash
# Teste de renovação (não renova de verdade)
sudo certbot renew --dry-run
```

Certificados Let's Encrypt duram 90 dias e renovam automaticamente a cada 60 dias.

---

## 🆘 Troubleshooting

### Erro: "Port 80 already in use"
```bash
# Parar nginx antes de rodar certbot
docker-compose stop nginx
sudo certbot certonly --standalone -d api.pdf-utilities.com.br
docker-compose up -d nginx
```

### Erro: "Connection refused" no navegador
```bash
# Verificar se nginx está rodando
docker-compose ps

# Ver logs
docker-compose logs nginx

# Testar configuração nginx
docker-compose exec nginx nginx -t
```

### Erro: "Certificate files not found"
```bash
# Verificar se os certificados foram copiados
ls -la ssl/
docker-compose exec nginx ls -la /etc/nginx/ssl/
```

---

## 📝 Resumo

1. ✅ Push das alterações
2. ✅ SSH no servidor  
3. ✅ Instalar Certbot
4. ✅ Parar nginx
5. ✅ Obter certificado
6. ✅ Copiar certificados
7. ✅ Pull e reiniciar (nginx.conf já está pronto!)
8. ✅ Testar

**Tempo estimado: 10-15 minutos** ⏱️


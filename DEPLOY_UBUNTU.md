# Guia de Deploy - Ubuntu 24.04 LTS

Deploy da aplicação PDF Utilities em Ubuntu 24.04 usando Docker e deploy automático via Git.

## Especificações da Instância

**Ubuntu 24.04 LTS (Canonical):**
- **CPUs:** Recomendado mínimo 2 vCPUs
- **RAM:** Recomendado mínimo 4 GB
- **Storage:** Mínimo 20 GB
- **OS:** Ubuntu 24.04 LTS (Noble Numbat)

## Arquitetura

```
Internet
    ↓
Nginx (porta 80/443)
    ↓
Next.js Container (porta 3000)
    ↓
APIs no Railway (temporário)
```

## Pré-requisitos

1. Instância Ubuntu 24.04 criada e em execução
2. Acesso SSH à instância
3. Repositório GitHub configurado
4. Branch `oracle-oci-deploy` criada

## Configuração Inicial (Uma Vez)

### 1. Conectar via SSH

```bash
ssh ubuntu@SEU_IP_PUBLICO -i caminho/para/sua-chave.pem
```

### 2. Executar Script de Setup

```bash
# Baixar o script de setup
curl -O https://raw.githubusercontent.com/YanPedro00/PDF-extractor---Web-Service/oracle-oci-deploy/setup-ubuntu.sh

# Dar permissão de execução
chmod +x setup-ubuntu.sh

# Executar
./setup-ubuntu.sh
```

O script irá:
- Atualizar o sistema
- Instalar Docker e Docker Compose
- Configurar firewall (UFW)
- Clonar o repositório
- Configurar webhook para auto-deploy
- Criar arquivos de configuração

### 3. Fazer Logout e Login Novamente

```bash
exit
ssh ubuntu@SEU_IP_PUBLICO -i caminho/para/sua-chave.pem
```

Isso é necessário para aplicar as permissões do Docker ao usuário `ubuntu`.

### 4. Configurar Variáveis de Ambiente

```bash
cd /home/ubuntu/pdf-utilities
nano .env
```

Edite e configure:
- `NEXT_PUBLIC_SITE_URL`: Seu IP público ou domínio

### 5. Primeiro Deploy Manual

```bash
cd /home/ubuntu/pdf-utilities
./deploy.sh
```

Aguarde o build e o start dos containers (pode levar 3-5 minutos na primeira vez).

### 6. Testar Aplicação

Abra no navegador:
```
http://SEU_IP_PUBLICO
```

Você deve ver a aplicação rodando.

## Deploy Automático via Git Push

### Configurar Webhook no GitHub

1. Vá em: `https://github.com/YanPedro00/PDF-extractor---Web-Service/settings/hooks`
2. Clique em "Add webhook"
3. Configure:
   - **Payload URL:** `http://SEU_IP_PUBLICO:9000/webhook`
   - **Content type:** `application/json`
   - **Secret:** (o mesmo que `WEBHOOK_SECRET` no .env)
   - **Events:** Just the push event
4. Clique em "Add webhook"

### Habilitar Listener na Instância

```bash
# Habilitar serviço
sudo systemctl enable github-webhook
sudo systemctl start github-webhook

# Verificar status
sudo systemctl status github-webhook

# Ver logs
sudo journalctl -u github-webhook -f
```

### Abrir Porta do Webhook no Firewall

```bash
sudo ufw allow 9000/tcp
sudo ufw reload
```

### Testar Deploy Automático

```bash
# No seu computador local
git add .
git commit -m "test: deploy automático"
git push origin oracle-oci-deploy
```

A instância receberá o webhook e iniciará o deploy automaticamente.

Verifique os logs:
```bash
sudo journalctl -u github-webhook -f
```

## Comandos Úteis

### Gerenciar Containers

```bash
# Ver status
docker compose ps

# Ver logs
docker compose logs -f

# Parar containers
docker compose down

# Iniciar containers
docker compose up -d

# Rebuild e reiniciar
docker compose up -d --build
```

### Monitorar Recursos

```bash
# Ver uso de CPU/RAM
docker stats

# Ver espaço em disco
df -h

# Ver uso de memória
free -h

# Ver processos
htop  # (instale com: sudo apt install htop)
```

### Firewall (UFW)

```bash
# Ver status
sudo ufw status

# Ver regras numeradas
sudo ufw status numbered

# Permitir porta
sudo ufw allow 8080/tcp

# Remover regra
sudo ufw delete <número>

# Desabilitar firewall (não recomendado)
sudo ufw disable
```

### Limpar Recursos Docker

```bash
# Remover containers parados
docker container prune -f

# Remover imagens não utilizadas
docker image prune -a -f

# Limpar tudo
docker system prune -a -f

# Ver uso de espaço
docker system df
```

### Logs

```bash
# Logs da aplicação
docker compose logs -f web

# Logs do Nginx
docker compose logs -f nginx

# Logs do webhook
sudo journalctl -u github-webhook -f

# Logs do Docker
sudo journalctl -u docker -f
```

## Configurar HTTPS (Let's Encrypt)

### 1. Obter Domínio

Configure um domínio (ex: seu-site.com) apontando para o IP público da instância.

### 2. Instalar Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 3. Obter Certificado SSL

```bash
# Parar Nginx temporariamente
docker compose down nginx

# Obter certificado
sudo certbot certonly --standalone -d seu-dominio.com -d www.seu-dominio.com

# Os certificados ficam em:
# /etc/letsencrypt/live/seu-dominio.com/fullchain.pem
# /etc/letsencrypt/live/seu-dominio.com/privkey.pem

# Iniciar Nginx novamente
docker compose up -d nginx
```

### 4. Configurar Nginx para HTTPS

Edite `nginx.conf` e descomente a seção do servidor HTTPS:
- Substitua `seu-dominio.com` pelo seu domínio
- Configure os caminhos dos certificados

### 5. Copiar Certificados para o Projeto

```bash
sudo mkdir -p /home/ubuntu/pdf-utilities/ssl
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem /home/ubuntu/pdf-utilities/ssl/
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem /home/ubuntu/pdf-utilities/ssl/
sudo chown -R ubuntu:ubuntu /home/ubuntu/pdf-utilities/ssl
```

### 6. Atualizar docker-compose.yml

Certifique-se de que a seção de volumes do Nginx inclui:
```yaml
volumes:
  - ./ssl:/etc/nginx/ssl:ro
```

### 7. Reiniciar Containers

```bash
cd /home/ubuntu/pdf-utilities
docker compose up -d
```

### 8. Renovação Automática

Certbot automaticamente configura um timer systemd para renovar os certificados.

Verificar status do timer:
```bash
sudo systemctl status certbot.timer
```

Testar renovação:
```bash
sudo certbot renew --dry-run
```

## Troubleshooting

### Aplicação não inicia

```bash
# Verificar logs
docker compose logs -f

# Verificar se Docker está rodando
sudo systemctl status docker

# Verificar se as portas estão abertas
sudo ufw status
sudo netstat -tuln | grep -E '80|443|3000'

# Rebuild forçado
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Erro de permissão Docker

```bash
# Verificar se usuário está no grupo docker
groups ubuntu

# Se não estiver, adicionar
sudo usermod -aG docker ubuntu

# Logout e login
exit
```

### Webhook não funciona

```bash
# Verificar status do serviço
sudo systemctl status github-webhook

# Verificar logs
sudo journalctl -u github-webhook -f

# Reiniciar serviço
sudo systemctl restart github-webhook

# Verificar porta
sudo netstat -tuln | grep 9000

# Verificar firewall
sudo ufw status | grep 9000
```

### Container consome muita memória

```bash
# Ver uso de recursos
docker stats

# Limpar cache
docker system prune -a -f

# Reiniciar container
docker compose restart web

# Ver logs de memória
dmesg | grep -i memory
```

### Erro "Cannot connect to Docker daemon"

```bash
# Iniciar Docker
sudo systemctl start docker

# Habilitar Docker no boot
sudo systemctl enable docker

# Verificar status
sudo systemctl status docker
```

## Segurança

### Firewall Recomendado (UFW)

```bash
# Permitir apenas portas necessárias
sudo ufw default deny incoming
sudo ufw default allow outgoing

sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 9000/tcp  # Webhook (opcional, pode limitar a IPs do GitHub)

sudo ufw enable
```

### SSH Hardening

```bash
# Editar configuração SSH
sudo nano /etc/ssh/sshd_config

# Desabilitar login root
PermitRootLogin no

# Desabilitar password authentication (use apenas chaves)
PasswordAuthentication no

# Reiniciar SSH
sudo systemctl restart sshd
```

### Atualizações Automáticas

```bash
# Instalar unattended-upgrades
sudo apt install unattended-upgrades

# Configurar
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

## Monitoramento

### Instalar ferramentas de monitoramento

```bash
# Htop (monitor interativo)
sudo apt install htop

# Netdata (dashboard web)
bash <(curl -Ss https://my-netdata.io/kickstart.sh)
# Acesse: http://SEU_IP:19999
```

### Verificar logs do sistema

```bash
# Logs do kernel
sudo dmesg

# Logs de autenticação
sudo tail -f /var/log/auth.log

# Logs do sistema
sudo journalctl -xe
```

## Backup

### Backup dos dados

```bash
# Backup do projeto
sudo tar -czf /home/ubuntu/pdf-utilities-backup-$(date +%Y%m%d).tar.gz /home/ubuntu/pdf-utilities

# Backup dos volumes Docker
docker run --rm -v pdf-utilities_data:/data -v /home/ubuntu/backups:/backup ubuntu tar -czf /backup/docker-volumes-$(date +%Y%m%d).tar.gz /data
```

### Restaurar backup

```bash
# Extrair backup
sudo tar -xzf pdf-utilities-backup-YYYYMMDD.tar.gz -C /
```

## Performance

### Otimizar Docker

```bash
# Limpar logs antigos
sudo truncate -s 0 /var/lib/docker/containers/**/*-json.log

# Configurar log rotation
sudo nano /etc/docker/daemon.json
```

Adicione:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

```bash
# Reiniciar Docker
sudo systemctl restart docker
```

## Migrar APIs para mesma instância (Futuro)

Quando quiser migrar as APIs do Railway para a mesma instância:

1. Adicionar serviços no `docker-compose.yml`
2. Abrir portas necessárias
3. Atualizar variáveis de ambiente
4. Deploy das APIs

## Custos Estimados

Dependendo do provedor (AWS, Azure, DigitalOcean, etc.):

- **2 vCPUs, 4 GB RAM:** ~$20-40/mês
- **4 vCPUs, 8 GB RAM:** ~$40-80/mês

**Opções gratuitas:**
- Oracle Cloud Always Free (4 OCPUs ARM, 24 GB RAM)
- AWS Free Tier (t2.micro, 1 ano)
- Google Cloud Free Tier ($300 créditos, 90 dias)

## Suporte

Em caso de problemas:

1. Verifique logs: `docker compose logs -f`
2. Verifique recursos: `docker stats`
3. Verifique firewall: `sudo ufw status`
4. Consulte documentação oficial:
   - [Docker Docs](https://docs.docker.com/)
   - [Ubuntu Server Guide](https://ubuntu.com/server/docs)
   - [Next.js Docs](https://nextjs.org/docs)

## Changelog

- **2026-01-09:** Setup inicial para Ubuntu 24.04
- Branch: `oracle-oci-deploy`


# Guia de Deploy - Oracle Cloud Infrastructure (OCI)

Deploy da aplicação PDF Utilities na Oracle Cloud usando Docker e deploy automático via Git.

## Especificações da Instância

**Oracle Cloud Free Tier:**
- **Compute:** VM.Standard.A1.Flex (ARM64)
- **CPUs:** 4 OCPUs
- **RAM:** 24 GB
- **Storage:** 200 GB Block Volume
- **OS:** Oracle Linux 9.6 (ARM64)
- **Custo:** GRÁTIS (Always Free)

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

1. Instância Oracle OCI criada e em execução
2. Acesso SSH à instância
3. Repositório GitHub configurado
4. Branch `oracle-oci-deploy` criada

## Configuração Inicial (Uma Vez)

### 1. Conectar via SSH

```bash
ssh opc@SEU_IP_PUBLICO -i caminho/para/sua-chave.pem
```

### 2. Executar Script de Setup

```bash
# Baixar o script de setup
curl -O https://raw.githubusercontent.com/seu-usuario/seu-repo/oracle-oci-deploy/setup-oci.sh

# Dar permissão de execução
chmod +x setup-oci.sh

# Executar
./setup-oci.sh
```

O script irá:
- Atualizar o sistema
- Instalar Docker e Docker Compose
- Configurar firewall
- Clonar o repositório
- Configurar webhook para auto-deploy
- Criar arquivos de configuração

### 3. Fazer Logout e Login Novamente

```bash
exit
ssh opc@SEU_IP_PUBLICO -i caminho/para/sua-chave.pem
```

Isso é necessário para aplicar as permissões do Docker ao usuário `opc`.

### 4. Configurar Variáveis de Ambiente

```bash
cd /home/opc/pdf-utilities
nano .env
```

Edite e configure:
- `NEXT_PUBLIC_SITE_URL`: Seu IP público ou domínio

### 5. Primeiro Deploy Manual

```bash
cd /home/opc/pdf-utilities
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

1. Vá em: `https://github.com/seu-usuario/seu-repo/settings/hooks`
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

### Abrir Porta do Webhook no Firewall OCI

1. No Console OCI, vá em: **Networking → Virtual Cloud Networks**
2. Clique na sua VCN
3. Clique em **Security Lists**
4. Edite a security list padrão
5. Adicione regra de entrada (Ingress Rule):
   - **Source CIDR:** `0.0.0.0/0` (ou IPs do GitHub: `192.30.252.0/22`, `185.199.108.0/22`, `140.82.112.0/20`)
   - **Destination Port:** `9000`
   - **Protocol:** TCP

### Testar Deploy Automático

```bash
# No seu computador local
git add .
git commit -m "test: deploy automático"
git push origin oracle-oci-deploy
```

A instância OCI receberá o webhook e iniciará o deploy automaticamente.

Verifique os logs na OCI:
```bash
sudo journalctl -u github-webhook -f
```

## Comandos Úteis

### Gerenciar Containers

```bash
# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Iniciar containers
docker-compose up -d

# Rebuild e reiniciar
docker-compose up -d --build
```

### Monitorar Recursos

```bash
# Ver uso de CPU/RAM
docker stats

# Ver espaço em disco
df -h

# Ver uso de memória
free -h
```

### Limpar Recursos Docker

```bash
# Remover containers parados
docker container prune -f

# Remover imagens não utilizadas
docker image prune -a -f

# Limpar tudo
docker system prune -a -f
```

### Logs

```bash
# Logs da aplicação
docker-compose logs -f web

# Logs do Nginx
docker-compose logs -f nginx

# Logs do webhook
sudo journalctl -u github-webhook -f
```

## Configurar HTTPS (Opcional)

### 1. Obter Domínio

Configure um domínio (ex: seu-site.com) apontando para o IP público da OCI.

### 2. Instalar Certbot

```bash
sudo dnf install -y certbot python3-certbot-nginx
```

### 3. Obter Certificado SSL

```bash
# Parar Nginx temporariamente
docker-compose down nginx

# Obter certificado
sudo certbot certonly --standalone -d seu-dominio.com

# Iniciar Nginx novamente
docker-compose up -d nginx
```

### 4. Configurar Nginx para HTTPS

Edite `nginx.conf` e descomente a seção do servidor HTTPS:
- Substitua `seu-dominio.com` pelo seu domínio
- Configure os caminhos dos certificados

### 5. Copiar Certificados para o Projeto

```bash
sudo mkdir -p /home/opc/pdf-utilities/ssl
sudo cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem /home/opc/pdf-utilities/ssl/
sudo cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem /home/opc/pdf-utilities/ssl/
sudo chown -R opc:opc /home/opc/pdf-utilities/ssl
```

### 6. Reiniciar Containers

```bash
cd /home/opc/pdf-utilities
docker-compose up -d
```

### 7. Renovação Automática

Certbot automaticamente configura um cronjob para renovar os certificados.

Teste a renovação:
```bash
sudo certbot renew --dry-run
```

## Troubleshooting

### Aplicação não inicia

```bash
# Verificar logs
docker-compose logs -f

# Verificar se as portas estão abertas
sudo firewall-cmd --list-all
sudo netstat -tuln | grep -E '80|443|3000'

# Rebuild forçado
docker-compose down
docker-compose build --no-cache
docker-compose up -d
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
```

### Erro de permissão Docker

```bash
# Adicionar usuário ao grupo docker novamente
sudo usermod -aG docker $USER

# Logout e login
exit
```

### Container consome muita memória

```bash
# Ver uso de recursos
docker stats

# Limpar cache
docker system prune -a -f

# Reiniciar container
docker-compose restart web
```

## Migrar APIs para OCI (Futuro)

Quando quiser migrar as APIs do Railway para a OCI:

1. Criar Dockerfiles para as APIs (já existem em `api/` e `tiff-to-pdf-api/`)
2. Adicionar serviços no `docker-compose.yml`
3. Atualizar variáveis de ambiente para apontar para `localhost` ou IPs internos
4. Abrir portas necessárias no firewall

## Custos

Com a configuração Free Tier (4 OCPUs, 24 GB RAM):

- **Compute:** R$ 0 (Always Free)
- **Storage:** R$ 0 (até 200 GB)
- **Bandwidth:** R$ 0 (até 10 TB/mês)

**Total:** R$ 0/mês

## Segurança

Recomendações adicionais:

1. **Firewall:** Mantenha apenas as portas necessárias abertas (80, 443, 9000, 22)
2. **SSH:** Use chaves SSH, desabilite password authentication
3. **Webhook Secret:** Use um secret forte (gere com `openssl rand -hex 32`)
4. **Atualizações:** Mantenha o sistema atualizado (`sudo dnf update -y`)
5. **Backups:** Configure backups regulares da instância no Console OCI

## Monitoramento

Configure alertas no Console OCI para:
- Uso de CPU > 80%
- Uso de RAM > 80%
- Espaço em disco < 20%

## Suporte

Em caso de problemas:

1. Verifique logs: `docker-compose logs -f`
2. Verifique recursos: `docker stats`
3. Consulte documentação oficial:
   - [Oracle Cloud Docs](https://docs.oracle.com/en-us/iaas/Content/home.htm)
   - [Docker Docs](https://docs.docker.com/)
   - [Next.js Docs](https://nextjs.org/docs)

## Changelog

- **2026-01-09:** Setup inicial para Oracle OCI com ARM64
- Branch: `oracle-oci-deploy`


# PDF Utilities - Deploy Oracle OCI

Branch dedicada para deploy na Oracle Cloud Infrastructure (OCI).

## Quick Start

### Na Instância OCI (Primeira Vez)

```bash
# 1. Conectar via SSH
ssh opc@SEU_IP_PUBLICO -i sua-chave.pem

# 2. Baixar e executar script de setup
curl -O https://raw.githubusercontent.com/seu-usuario/seu-repo/oracle-oci-deploy/setup-oci.sh
chmod +x setup-oci.sh
./setup-oci.sh

# 3. Logout e login novamente
exit
ssh opc@SEU_IP_PUBLICO -i sua-chave.pem

# 4. Configurar .env
cd /home/opc/pdf-utilities
nano .env  # Configure NEXT_PUBLIC_SITE_URL

# 5. Primeiro deploy
./deploy.sh
```

### Deploy Automático

Após configurar o webhook no GitHub:

```bash
# No seu computador local
git add .
git commit -m "feat: nova feature"
git push origin oracle-oci-deploy
```

A aplicação será automaticamente atualizada na OCI.

## Arquivos Importantes

- `Dockerfile` - Container da aplicação Next.js
- `docker-compose.yml` - Orquestração de containers
- `nginx.conf` - Configuração do Nginx (reverse proxy)
- `deploy.sh` - Script de deploy automático
- `setup-oci.sh` - Script de configuração inicial
- `webhook-listener.py` - Listener para deploy via webhook
- `env.production.template` - Template de variáveis de ambiente

## Documentação Completa

Veja [DEPLOY_OCI.md](./DEPLOY_OCI.md) para documentação detalhada.

## Especificações

- **OS:** Oracle Linux 9.6 (ARM64)
- **Compute:** 4 OCPUs, 24 GB RAM (Free Tier)
- **Docker:** Latest
- **Next.js:** Modo standalone

## Comandos Úteis

```bash
# Ver status
docker-compose ps

# Ver logs
docker-compose logs -f

# Reiniciar
docker-compose restart

# Rebuild
docker-compose up -d --build
```

## Suporte

Consulte [DEPLOY_OCI.md](./DEPLOY_OCI.md) para troubleshooting e configurações avançadas.


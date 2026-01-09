#!/bin/bash

################################################################################
# Script de Deploy Automático para Oracle OCI
# Uso: ./deploy.sh
################################################################################

set -e  # Sai em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Diretório do projeto
PROJECT_DIR="/home/ubuntu/pdf-utilities"
BRANCH="oracle-oci-deploy"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🚀 Iniciando Deploy Automático${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. Navegar para o diretório
cd "$PROJECT_DIR" || exit 1

# 2. Verificar se há mudanças locais não commitadas
if [[ -n $(git status -s) ]]; then
    echo -e "${YELLOW}⚠️  Há mudanças locais não commitadas. Fazendo stash...${NC}"
    git stash
fi

# 3. Fazer pull das últimas alterações
echo -e "${BLUE}📥 Baixando últimas alterações do GitHub...${NC}"
git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

# 4. Verificar se houve alterações
CURRENT_COMMIT=$(git rev-parse HEAD)
echo -e "${GREEN}✅ Commit atual: ${CURRENT_COMMIT:0:7}${NC}"

# 5. Parar containers antigos
echo -e "${BLUE}🛑 Parando containers antigos...${NC}"
docker-compose down || true

# 6. Remover imagens antigas para economizar espaço
echo -e "${BLUE}🧹 Limpando imagens antigas...${NC}"
docker image prune -f

# 7. Build e start dos containers
echo -e "${BLUE}🔨 Fazendo build da nova versão...${NC}"
docker-compose build --no-cache

echo -e "${BLUE}🚀 Iniciando containers...${NC}"
docker-compose up -d

# 8. Aguardar containers ficarem prontos
echo -e "${BLUE}⏳ Aguardando containers iniciarem...${NC}"
sleep 10

# 9. Verificar status dos containers
echo -e "${BLUE}📊 Status dos containers:${NC}"
docker-compose ps

# 10. Verificar logs
echo -e "${BLUE}📋 Últimos logs:${NC}"
docker-compose logs --tail=20

# 11. Health check
echo ""
echo -e "${BLUE}🏥 Verificando saúde da aplicação...${NC}"
sleep 5
if curl -f http://localhost:80/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Aplicação está saudável!${NC}"
else
    echo -e "${RED}❌ Aplicação não está respondendo!${NC}"
    echo -e "${YELLOW}Verificando logs de erro:${NC}"
    docker-compose logs --tail=50
    exit 1
fi

# 12. Limpar recursos não utilizados
echo -e "${BLUE}🧹 Limpando recursos Docker não utilizados...${NC}"
docker system prune -f

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Commit: ${CURRENT_COMMIT:0:7}${NC}"
echo -e "${GREEN}Aplicação disponível em: http://$(hostname -I | awk '{print $1}')${NC}"
echo ""


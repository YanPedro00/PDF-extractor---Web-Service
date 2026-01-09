#!/bin/bash

################################################################################
# Script de Configuração Inicial para Oracle OCI
# Sistema: Oracle Linux 9 (ARM64)
# Uso: Execute este script UMA VEZ na instância OCI nova
################################################################################

set -e  # Sai em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🔧 Configuração Inicial - Oracle OCI${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Verificar se está rodando como root
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}❌ Não execute este script como root!${NC}"
    echo -e "${YELLOW}Use: bash setup-oci.sh${NC}"
    exit 1
fi

# 1. Atualizar sistema
echo -e "${BLUE}📦 Atualizando sistema...${NC}"
sudo dnf update -y

# 2. Instalar dependências básicas
echo -e "${BLUE}📦 Instalando dependências básicas...${NC}"
sudo dnf install -y git curl wget vim firewalld

# 3. Instalar Docker
echo -e "${BLUE}🐳 Instalando Docker...${NC}"
sudo dnf config-manager --add-repo=https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io

# Iniciar e habilitar Docker
sudo systemctl start docker
sudo systemctl enable docker

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
echo -e "${GREEN}✅ Docker instalado! (Você precisará fazer logout/login para usar sem sudo)${NC}"

# 4. Instalar Docker Compose
echo -e "${BLUE}🐳 Instalando Docker Compose...${NC}"
DOCKER_COMPOSE_VERSION="v2.24.5"
sudo curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose

echo -e "${GREEN}✅ Docker Compose instalado!${NC}"
docker-compose --version

# 5. Configurar Firewall
echo -e "${BLUE}🔥 Configurando Firewall...${NC}"
sudo systemctl start firewalld
sudo systemctl enable firewalld

# Abrir portas HTTP e HTTPS
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-port=3000/tcp  # Next.js (para debug)
sudo firewall-cmd --reload

echo -e "${GREEN}✅ Firewall configurado!${NC}"

# 6. Configurar SELinux (Oracle Linux usa SELinux)
echo -e "${BLUE}🔒 Configurando SELinux para Docker...${NC}"
sudo setsebool -P container_manage_cgroup on

# 7. Clonar repositório
echo -e "${BLUE}📥 Clonando repositório...${NC}"
PROJECT_DIR="/home/opc/pdf-utilities"

if [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}⚠️  Diretório já existe. Pulando clone...${NC}"
else
    echo -e "${YELLOW}🔑 Você precisará configurar a autenticação do Git${NC}"
    echo -e "${YELLOW}Opções:${NC}"
    echo -e "${YELLOW}  1. HTTPS: Use Personal Access Token do GitHub${NC}"
    echo -e "${YELLOW}  2. SSH: Configure chave SSH (mais seguro)${NC}"
    echo ""
    
    read -p "Digite a URL do repositório (HTTPS ou SSH): " REPO_URL
    git clone "$REPO_URL" "$PROJECT_DIR"
    
    cd "$PROJECT_DIR"
    git checkout oracle-oci-deploy
fi

# 8. Criar arquivo .env
echo -e "${BLUE}📝 Configurando variáveis de ambiente...${NC}"
cd "$PROJECT_DIR"

if [ ! -f .env ]; then
    cat > .env << 'EOF'
# Variáveis de Ambiente - Oracle OCI

# URLs das APIs (Railway por enquanto)
NEXT_PUBLIC_API_URL=https://pdf-ocr-api-production.up.railway.app
NEXT_PUBLIC_TIFF_API_URL=https://tiff-to-pdf-api-production.up.railway.app

# URL do site (substitua pelo seu IP ou domínio)
NEXT_PUBLIC_SITE_URL=http://SEU_IP_AQUI

# Node
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
EOF
    
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edite o arquivo .env e configure NEXT_PUBLIC_SITE_URL${NC}"
    echo -e "${YELLOW}Use: nano $PROJECT_DIR/.env${NC}"
else
    echo -e "${GREEN}✅ Arquivo .env já existe${NC}"
fi

# 9. Configurar deploy automático via webhook
echo -e "${BLUE}🪝 Configurando webhook para auto-deploy...${NC}"

# Criar serviço systemd para webhook
sudo tee /etc/systemd/system/github-webhook.service > /dev/null << 'EOF'
[Unit]
Description=GitHub Webhook Listener
After=network.target docker.service

[Service]
Type=simple
User=opc
WorkingDirectory=/home/opc/pdf-utilities
ExecStart=/usr/bin/python3 /home/opc/pdf-utilities/webhook-listener.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Criar script Python para webhook
cat > "$PROJECT_DIR/webhook-listener.py" << 'EOF'
#!/usr/bin/env python3
"""
Webhook Listener para auto-deploy do GitHub
"""
import os
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import hmac
import hashlib

# Configurações
PORT = 9000
SECRET = os.getenv('WEBHOOK_SECRET', 'change-me-to-a-secure-secret')
DEPLOY_SCRIPT = '/home/opc/pdf-utilities/deploy.sh'

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != '/webhook':
            self.send_response(404)
            self.end_headers()
            return
        
        # Ler payload
        content_length = int(self.headers['Content-Length'])
        payload = self.rfile.read(content_length)
        
        # Verificar assinatura (opcional mas recomendado)
        signature = self.headers.get('X-Hub-Signature-256', '')
        if SECRET and signature:
            expected_signature = 'sha256=' + hmac.new(
                SECRET.encode(),
                payload,
                hashlib.sha256
            ).hexdigest()
            
            if not hmac.compare_digest(signature, expected_signature):
                self.send_response(401)
                self.end_headers()
                return
        
        # Parse payload
        try:
            data = json.loads(payload)
            branch = data.get('ref', '').split('/')[-1]
            
            # Só fazer deploy se for a branch correta
            if branch == 'oracle-oci-deploy':
                print(f"✅ Push detectado na branch {branch}. Iniciando deploy...")
                
                # Executar script de deploy
                subprocess.Popen(['/bin/bash', DEPLOY_SCRIPT])
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'status': 'success',
                    'message': 'Deploy iniciado'
                }).encode())
            else:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'status': 'ignored',
                    'message': f'Branch {branch} ignorada'
                }).encode())
        
        except Exception as e:
            print(f"❌ Erro: {e}")
            self.send_response(500)
            self.end_headers()

if __name__ == '__main__':
    server = HTTPServer(('0.0.0.0', PORT), WebhookHandler)
    print(f"🎧 Webhook listener rodando na porta {PORT}...")
    server.serve_forever()
EOF

chmod +x "$PROJECT_DIR/webhook-listener.py"

# Instalar Python se não existir
sudo dnf install -y python3

echo -e "${GREEN}✅ Webhook configurado!${NC}"
echo -e "${YELLOW}Para habilitar webhook, execute:${NC}"
echo -e "${YELLOW}  sudo systemctl enable github-webhook${NC}"
echo -e "${YELLOW}  sudo systemctl start github-webhook${NC}"

# 10. Tornar deploy.sh executável
chmod +x "$PROJECT_DIR/deploy.sh"

# 11. Resumo final
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Configuração Concluída!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}📋 Próximos Passos:${NC}"
echo ""
echo -e "${YELLOW}1. FAZER LOGOUT/LOGIN para aplicar grupo Docker:${NC}"
echo -e "   ${NC}exit${NC}"
echo ""
echo -e "${YELLOW}2. Editar .env com seu IP/domínio:${NC}"
echo -e "   ${NC}nano $PROJECT_DIR/.env${NC}"
echo ""
echo -e "${YELLOW}3. Fazer primeiro deploy manual:${NC}"
echo -e "   ${NC}cd $PROJECT_DIR${NC}"
echo -e "   ${NC}./deploy.sh${NC}"
echo ""
echo -e "${YELLOW}4. (Opcional) Configurar webhook no GitHub:${NC}"
echo -e "   ${NC}Veja: https://github.com/seu-usuario/seu-repo/settings/hooks${NC}"
echo -e "   ${NC}Payload URL: http://SEU_IP:9000/webhook${NC}"
echo -e "   ${NC}Content type: application/json${NC}"
echo ""
echo -e "${YELLOW}5. (Opcional) Habilitar webhook listener:${NC}"
echo -e "   ${NC}sudo systemctl enable github-webhook${NC}"
echo -e "   ${NC}sudo systemctl start github-webhook${NC}"
echo ""
echo -e "${GREEN}IP Público da Instância: $(curl -s ifconfig.me)${NC}"
echo ""


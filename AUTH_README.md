# 🔐 Sistema de Autenticação - PDF Utilities

## Visão Geral

Sistema de autenticação completo com NextAuth.js e SQLite para gerenciar usuários e funcionalidades admin.

---

## 🎯 Funcionalidades

### **Para Usuários Comuns:**
- ✅ Cadastro de conta
- ✅ Login com email/senha
- ✅ Sessão persistente (30 dias)
- ✅ Logout

### **Para Administradores:**
- ✅ Acesso à ferramenta "Tradutor Técnico" (oculta de usuários comuns)
- ✅ Badge especial no menu
- ✅ Mesmo sistema de login/cadastro

---

## 👤 Usuário Admin Padrão

**Criado automaticamente na primeira inicialização:**

```
Email: admin@pdf-utilities.com
Senha: Admin@2026!
```

⚠️ **IMPORTANTE:** Troque a senha após primeiro login em produção!

---

## 🗄️ Banco de Dados

### **SQLite:**
- Arquivo: `/home/ubuntu/pdf-utilities-data/users.db`
- Persiste entre rebuilds (volume mount)
- Backup automático recomendado

### **Tabelas:**

#### **users**
```sql
- id (INTEGER PRIMARY KEY)
- email (TEXT UNIQUE NOT NULL)
- password (TEXT NOT NULL) -- bcrypt hash
- name (TEXT)
- role (TEXT DEFAULT 'user') -- 'user' ou 'admin'
- created_at (DATETIME)
- updated_at (DATETIME)
```

---

## 🚀 Deployment

### **1. No servidor, criar diretório para dados:**

```bash
sudo mkdir -p /home/ubuntu/pdf-utilities-data
sudo chown -R ubuntu:ubuntu /home/ubuntu/pdf-utilities-data
```

### **2. Variáveis de ambiente (.env):**

```env
# Autenticação
NEXTAUTH_URL=https://pdf-utilities.com.br
NEXTAUTH_SECRET=seu-secret-super-seguro-aqui

# Banco de dados
DATABASE_PATH=/app/data/users.db
```

⚠️ **Gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### **3. Push e aguardar rebuild:**

```bash
git push origin oracle-oci-deploy
```

O webhook faz rebuild automaticamente!

---

## 🔒 Segurança

### **Implementado:**
- ✅ Senhas criptografadas com bcrypt (10 rounds)
- ✅ JWT para sessões (30 dias)
- ✅ HTTPS obrigatório
- ✅ Proteção de rotas admin
- ✅ Sanitização de inputs

### **Recomendações:**
- 🔐 Trocar senha admin padrão
- 🔐 Usar NEXTAUTH_SECRET forte
- 🔐 Backup regular do banco
- 🔐 Rate limiting nas rotas de auth (futuro)

---

## 📡 Rotas

### **Públicas:**
- `GET /auth/login` - Página de login
- `GET /auth/register` - Página de cadastro
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/[...nextauth]` - NextAuth handler

### **Protegidas (requer login):**
- `GET /tradutor-tecnico` - Ferramenta admin (só admin)

### **API NextAuth:**
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/session` - Verificar sessão
- `GET /api/auth/csrf` - Token CSRF

---

## 🧪 Testar Localmente

### **1. Instalar dependências:**
```bash
npm install
```

### **2. Rodar dev server:**
```bash
npm run dev
```

### **3. Acessar:**
- Site: http://localhost:3000
- Login: http://localhost:3000/auth/login
- Cadastro: http://localhost:3000/auth/register

### **4. Login como admin:**
```
Email: admin@pdf-utilities.com
Senha: Admin@2026!
```

### **5. Acessar ferramenta admin:**
- http://localhost:3000/tradutor-tecnico

---

## 🔧 Manutenção

### **Ver usuários no banco:**
```bash
sqlite3 /home/ubuntu/pdf-utilities-data/users.db "SELECT id, email, name, role FROM users;"
```

### **Promover usuário a admin:**
```bash
sqlite3 /home/ubuntu/pdf-utilities-data/users.db "UPDATE users SET role='admin' WHERE email='usuario@example.com';"
```

### **Deletar usuário:**
```bash
sqlite3 /home/ubuntu/pdf-utilities-data/users.db "DELETE FROM users WHERE email='usuario@example.com';"
```

### **Backup do banco:**
```bash
cp /home/ubuntu/pdf-utilities-data/users.db /home/ubuntu/backup-users-$(date +%Y%m%d).db
```

---

## 🐛 Troubleshooting

### **Problema: Não consegue fazer login**
```bash
# Verificar logs do container
docker-compose logs web

# Verificar se banco existe
ls -la /home/ubuntu/pdf-utilities-data/
```

### **Problema: Tradutor Técnico não aparece**
```bash
# Verificar role do usuário
sqlite3 /home/ubuntu/pdf-utilities-data/users.db "SELECT email, role FROM users WHERE email='seu-email@example.com';"

# Promover para admin
sqlite3 /home/ubuntu/pdf-utilities-data/users.db "UPDATE users SET role='admin' WHERE email='seu-email@example.com';"
```

### **Problema: Perdeu senha admin**
```bash
# Resetar senha admin (bcrypt hash de "Admin@2026!")
sqlite3 /home/ubuntu/pdf-utilities-data/users.db "UPDATE users SET password='\$2a\$10\$...' WHERE email='admin@pdf-utilities.com';"

# Ou deletar e deixar recriar
sqlite3 /home/ubuntu/pdf-utilities-data/users.db "DELETE FROM users WHERE email='admin@pdf-utilities.com';"
docker-compose restart web
```

---

## 📚 Tecnologias Usadas

- **NextAuth.js v4** - Autenticação
- **SQLite** - Banco de dados
- **better-sqlite3** - Driver SQLite
- **bcryptjs** - Criptografia de senhas
- **JWT** - Tokens de sessão

---

## 🎨 Interface

### **Login/Cadastro:**
- Design responsivo
- Validação de formulários
- Mensagens de erro claras
- Redirecionamento automático

### **Navbar:**
- Menu de usuário (desktop)
- Avatar com inicial do nome
- Badge "Admin" para administradores
- Botões Login/Cadastrar quando não logado

### **Tradutor Técnico:**
- Página exclusiva para admin
- Verificação de acesso
- Em desenvolvimento (vazia por enquanto)
- Ícone de cadeado no menu

---

**Última atualização:** Janeiro 2026


import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'
import fs from 'fs'

let db: Database.Database | null = null

function getDb(): Database.Database {
  if (db) return db

  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'users.db')
  
  // Garantir que o diretório existe
  const dbDir = path.dirname(dbPath)
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  db = new Database(dbPath)

  // Criar tabelas
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
  `)

  // Criar usuário admin padrão se não existir
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@pdf-utilities.com')

  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('Admin@2026!', 10)
    db.prepare(`
      INSERT INTO users (email, password, name, role)
      VALUES (?, ?, ?, ?)
    `).run('admin@pdf-utilities.com', hashedPassword, 'Administrador', 'admin')
    
    console.log('✅ Usuário admin padrão criado')
    console.log('   Email: admin@pdf-utilities.com')
    console.log('   Senha: Admin@2026!')
  }

  return db
}

export interface User {
  id: number
  email: string
  password: string
  name: string | null
  role: string
  created_at: string
  updated_at: string
}

export const userDb = {
  // Buscar usuário por email
  findByEmail(email: string): User | undefined {
    return getDb().prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined
  },

  // Buscar usuário por ID
  findById(id: number): User | undefined {
    return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id) as User | undefined
  },

  // Criar novo usuário
  create(email: string, password: string, name: string, role: string = 'user'): User {
    const hashedPassword = bcrypt.hashSync(password, 10)
    const result = getDb().prepare(`
      INSERT INTO users (email, password, name, role)
      VALUES (?, ?, ?, ?)
    `).run(email, hashedPassword, name, role)

    return this.findById(result.lastInsertRowid as number)!
  },

  // Verificar senha
  verifyPassword(user: User, password: string): boolean {
    return bcrypt.compareSync(password, user.password)
  },

  // Atualizar usuário
  update(id: number, data: Partial<Omit<User, 'id' | 'created_at'>>) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ')
    const values = [...Object.values(data), id]
    
    getDb().prepare(`
      UPDATE users 
      SET ${fields}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(...values)

    return this.findById(id)
  },

  // Listar todos os usuários (apenas para admin)
  listAll(): User[] {
    return getDb().prepare('SELECT * FROM users ORDER BY created_at DESC').all() as User[]
  },

  // Deletar usuário
  delete(id: number) {
    getDb().prepare('DELETE FROM users WHERE id = ?').run(id)
  }
}

export default getDb


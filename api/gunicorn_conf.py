#!/usr/bin/env python3
"""
Configuração do Gunicorn para VM com recursos abundantes

ESTRATÉGIA:
- 4 workers (processos) para aproveitar 4 OCPUs
- 4 threads por worker para processamento paralelo
- Com 24GB RAM, memória não é limitação

RECURSOS:
- VM: 4 OCPUs, 24GB RAM
- Workers: 4 × ~1.5GB = ~6GB
- Threads: 4 por worker = 16 conexões simultâneas
"""
import os
import multiprocessing

# Porta
port = os.environ.get('PORT', '8080')
bind = f"0.0.0.0:{port}"

# ============================================================================
# CONFIGURAÇÃO PARA ALTA PERFORMANCE
# ============================================================================
# 
# VM tem 4 OCPUs e 24GB RAM - podemos usar todos os recursos!
#
workers = 4  # 4 processos = 1 por OCPU

# Threads por worker (processamento paralelo)
threads = 4  # 4 threads × 4 workers = 16 conexões simultâneas

# Worker class: sync com threads
worker_class = 'gthread'  # Gunicorn com threads

# ============================================================================
# TIMEOUTS E LIMITES
# ============================================================================

# Timeout para requisições longas (OCR pode demorar)
timeout = 300  # 5 minutos (OCR de PDFs grandes pode demorar)

# Graceful timeout
graceful_timeout = 30

# Keep alive
keepalive = 5

# Max requests por worker antes de restart (libera memória)
max_requests = 100  # Reinicia worker após 100 requests
max_requests_jitter = 20  # Adiciona variação aleatória

# ============================================================================
# LOGGING
# ============================================================================

# Nível de log
loglevel = 'info'

# Access log
accesslog = '-'  # stdout
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Error log
errorlog = '-'  # stdout

# ============================================================================
# PERFORMANCE
# ============================================================================

# Pre-load app (carrega app antes de fazer fork, economiza memória)
preload_app = True

# Worker tmp directory (usar /dev/shm se disponível para speed)
worker_tmp_dir = '/dev/shm' if os.path.exists('/dev/shm') else None

# ============================================================================
# CALLBACKS (Opcional)
# ============================================================================

def on_starting(server):
    """Callback quando servidor inicia"""
    print("=" * 70)
    print("🚀 INICIANDO API OCR COM GUNICORN (TESSERACT ARM64 NATIVO)")
    print("=" * 70)
    print(f"📍 Bind: {bind}")
    print(f"👷 Workers: {workers} (processos)")
    print(f"🧵 Threads: {threads} por worker")
    print(f"⚡ Capacidade: {workers * threads} conexões simultâneas")
    print(f"💾 Memória esperada: ~{workers * 0.5:.1f}GB total (Tesseract é leve!)")
    print(f"🖥️  VM: 4 OCPUs ARM64, 24GB RAM")
    print(f"🔧 Arquitetura: ARM64 nativo (sem emulação)")
    print(f"📚 OCR Engine: Tesseract (rápido e estável)")
    print("=" * 70)

def on_exit(server):
    """Callback quando servidor para"""
    print("👋 Servidor parado")


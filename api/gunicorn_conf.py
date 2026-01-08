#!/usr/bin/env python3
"""
Configuração do Gunicorn OTIMIZADA para baixo consumo de memória

ESTRATÉGIA:
- 1 worker (processo) ao invés de múltiplos
- 2-4 threads por worker (compartilham memória)
- Reduz duplicação de memória em ~60-70%

COMPARAÇÃO:
- ANTES: 4 workers × 1.5GB = 6GB total
- DEPOIS: 1 worker × 1.5GB = 1.5GB total (4 threads compartilham)
"""
import os
import multiprocessing

# Porta (Railway usa PORT env var)
port = os.environ.get('PORT', '8080')
bind = f"0.0.0.0:{port}"

# ============================================================================
# OTIMIZAÇÃO DE MEMÓRIA: 1 WORKER + MÚLTIPLAS THREADS
# ============================================================================
# 
# Workers = processos separados (cada um com cópia completa da memória)
# Threads = threads dentro do mesmo processo (compartilham memória)
#
# 1 worker + 4 threads usa ~1.5GB
# 4 workers + 1 thread usa ~6GB
#
workers = 1  # APENAS 1 processo (economiza memória)

# Threads por worker (compartilham memória do processo)
# Railway: 2-4 threads é suficiente para tráfego moderado
threads = 2  # 2 threads compartilham os 1.5GB do worker

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
    print("🚀 INICIANDO API OCR COM GUNICORN (MODO BAIXA MEMÓRIA)")
    print("=" * 70)
    print(f"📍 Bind: {bind}")
    print(f"👷 Workers: {workers} (processos)")
    print(f"🧵 Threads: {threads} por worker")
    print(f"💾 Memória esperada: ~1.5GB total")
    print(f"⚡ Lazy loading OCR: Ativo (carrega sob demanda)")
    print(f"🔄 Auto-unload OCR: Ativo (libera após 5min inatividade)")
    print("=" * 70)

def on_exit(server):
    """Callback quando servidor para"""
    print("👋 Servidor parado")


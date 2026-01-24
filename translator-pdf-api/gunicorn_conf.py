"""
Configuração do Gunicorn para Translator API
"""
import multiprocessing
import os

# Bind
bind = f"0.0.0.0:{os.getenv('PORT', '8082')}"

# Workers
# Usar apenas 1 worker devido ao alto consumo de RAM do modelo
workers = 1
worker_class = "uvicorn.workers.UvicornWorker"

# Threads por worker
threads = 2

# Timeouts
timeout = 600  # 10 minutos (tradução pode demorar)
keepalive = 5
graceful_timeout = 30

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = "translator-api"

# Worker tmp directory
worker_tmp_dir = "/dev/shm"

# Limites
max_requests = 100  # Restart worker após N requests (liberar memória)
max_requests_jitter = 20

# Preload
preload_app = False  # Não preload devido ao modelo grande


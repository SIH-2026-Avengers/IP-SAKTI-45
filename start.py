import os
import sys
from pathlib import Path

# Force unbuffered standard output for real-time logs in Render
os.environ["PYTHONUNBUFFERED"] = "1"

# Ensure backend directory is in sys.path
root_dir = Path(__file__).resolve().parent
backend_dir = root_dir / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

import uvicorn

if __name__ == "__main__":
    port_env = os.getenv("PORT", "10000")
    try:
        port = int(port_env)
    except (ValueError, TypeError):
        port = 10000

    host = os.getenv("HOST", "0.0.0.0")
    print(f"[STARTUP] IP-SAKTI FastAPI Backend (root runner) binding to {host}:{port} ...", flush=True)

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        log_level="info",
        proxy_headers=True,
        forwarded_allow_ips="*"
    )

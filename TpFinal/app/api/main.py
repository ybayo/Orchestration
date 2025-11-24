from datetime import datetime, timezone
import os

from fastapi import FastAPI


APP_MESSAGE = os.getenv("APP_MESSAGE", "Bienvenue sur l'API DataPress POC")
APP_TOKEN = os.getenv("APP_TOKEN")
APP_ENV = os.getenv("APP_ENV", "local")

app = FastAPI(title="DataPress API POC")


def _token_preview() -> str | None:
    if not APP_TOKEN:
        return None
    visible = APP_TOKEN[:4]
    return f"{visible}***"


@app.get("/")
def root():
    """Endpoint principal pour vérifier le service."""
    return {
        "service": "api",
        "environment": APP_ENV,
        "message": APP_MESSAGE,
        "token_preview": _token_preview(),
        "timestamp": datetime.now(tz=timezone.utc).isoformat(),
    }


@app.get("/health")
def health():
    """Endpoint utilisé par les probes Kubernetes."""
    return {"status": "ok"}


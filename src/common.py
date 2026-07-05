"""Utilidades compartidas: rutas del repo, configuración y variables de entorno."""

import os
from pathlib import Path

import yaml
from dotenv import load_dotenv

REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_RAW = REPO_ROOT / "data" / "raw"
DATA_PROCESSED = REPO_ROOT / "data" / "processed"
DATA_EXTERNAL = REPO_ROOT / "data" / "external"
REPORTS = REPO_ROOT / "reports"


def load_config() -> dict:
    with open(REPO_ROOT / "config" / "soda_api_config.yaml", encoding="utf-8") as f:
        return yaml.safe_load(f)


def load_env() -> None:
    """Carga variables de entorno: .env del repo o .env.local del directorio padre."""
    for candidate in (REPO_ROOT / ".env", REPO_ROOT / ".env.local", REPO_ROOT.parent / ".env.local"):
        if candidate.exists():
            load_dotenv(candidate, override=False)


def database_url() -> str:
    load_env()
    url = os.environ.get("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL no está definida (revisar .env.local)")
    return url

"""Integración CUM ↔ Vitales por principio activo normalizado.

Hallazgo del EDA: la columna IUM del CUM está 100% vacía (la API ni la expone),
así que no existe llave directa entre las dos bases. El cruce viable es por
principio activo, con match en cascada:

    (a) exacto sobre texto normalizado
    (b) fuzzy con rapidfuzz token_sort_ratio >= UMBRAL (90)
    (c) sin match (queda registrado — evidencia honesta del % de integración)

Produce la tabla puente `match_principio_activo` y las métricas de cruce.
"""

import json
import unicodedata

import pandas as pd
from rapidfuzz import fuzz, process

from src.common import DATA_PROCESSED, REPORTS

UMBRAL_FUZZY = 90


def normalize_text(texto) -> str | None:
    """Normaliza para comparación: mayúsculas, sin tildes, sin espacios dobles."""
    if texto is None or (isinstance(texto, float) and pd.isna(texto)) or pd.isna(texto):
        return None
    s = str(texto).strip().upper()
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = " ".join(s.split())
    return s or None


def match_principios_activos(nombres_vitales: list[str], nombres_cum: list[str]) -> pd.DataFrame:
    """Cascada exacto -> fuzzy -> sin match. Devuelve la tabla puente."""
    cum_norm = {}
    for n in nombres_cum:
        nn = normalize_text(n)
        if nn:
            cum_norm.setdefault(nn, n)
    universo_cum = list(cum_norm.keys())

    filas = []
    for original in nombres_vitales:
        nv = normalize_text(original)
        if not nv:
            continue
        if nv in cum_norm:
            filas.append({"nombre_vitales": nv, "nombre_cum": nv, "metodo": "exacto", "score": 100.0})
            continue
        encontrado = process.extractOne(nv, universo_cum, scorer=fuzz.token_sort_ratio, score_cutoff=UMBRAL_FUZZY)
        if encontrado:
            filas.append({"nombre_vitales": nv, "nombre_cum": encontrado[0], "metodo": "fuzzy", "score": round(encontrado[1], 1)})
        else:
            filas.append({"nombre_vitales": nv, "nombre_cum": None, "metodo": "sin_match", "score": None})

    return pd.DataFrame(filas).drop_duplicates(subset=["nombre_vitales"])


def run(vitales_base: pd.DataFrame, principios_cum: pd.DataFrame) -> pd.DataFrame:
    """Ejecuta la integración y guarda tabla puente + métricas."""
    pa_vitales = pd.concat([
        vitales_base["principio_activo_1"],
        vitales_base.loc[~vitales_base["principio_activo_2"].isin(["NO APLICA"]), "principio_activo_2"],
    ]).dropna().unique().tolist()

    pa_cum = principios_cum["principioactivo"].dropna().unique().tolist()

    puente = match_principios_activos(pa_vitales, pa_cum)

    # Métricas por nombre único y ponderadas por nº de solicitudes
    total = len(puente)
    por_metodo = puente["metodo"].value_counts().to_dict()
    vitales_norm = vitales_base["principio_activo_1"].map(normalize_text)
    con_match = set(puente.loc[puente["metodo"] != "sin_match", "nombre_vitales"])
    filas_cruzan = vitales_norm.isin(con_match).mean()

    metricas = {
        "principios_activos_vitales": total,
        "match_exacto": por_metodo.get("exacto", 0),
        "match_fuzzy": por_metodo.get("fuzzy", 0),
        "sin_match": por_metodo.get("sin_match", 0),
        "pct_exacto": round(100 * por_metodo.get("exacto", 0) / total, 1),
        "pct_fuzzy": round(100 * por_metodo.get("fuzzy", 0) / total, 1),
        "pct_con_match": round(100 * (total - por_metodo.get("sin_match", 0)) / total, 1),
        "pct_filas_solicitudes_cruzan": round(100 * float(filas_cruzan), 1),
        "umbral_fuzzy": UMBRAL_FUZZY,
    }

    out = DATA_PROCESSED / "integracion"
    out.mkdir(parents=True, exist_ok=True)
    puente.to_csv(out / "match_principio_activo.csv", index=False, encoding="utf-8")
    REPORTS.mkdir(parents=True, exist_ok=True)
    with open(REPORTS / "metricas_integracion.json", "w", encoding="utf-8") as f:
        json.dump(metricas, f, ensure_ascii=False, indent=2)

    print(f"[integrate] {metricas}")
    return puente

"""Agente analista — genera explicaciones (aiInsight) y el reporte automatizado.

Las explicaciones son deterministas (plantilla sobre los factores del score):
gratis, reproducibles y sin riesgo de alucinación — decisión de interpretabilidad
documentada para el jurado. El reporte alimenta notebooks/05 y reports/.
"""

import json
from datetime import date

import pandas as pd

from src.common import DATA_PROCESSED, REPO_ROOT, REPORTS

PROMPTS = json.loads(
    (REPO_ROOT / "models" / "llm_rag" / "prompt_templates.json").read_text(encoding="utf-8")
)

_NOMBRES_FACTOR = {
    "frecuencia": "la frecuencia de solicitudes",
    "tendencia": "la tendencia reciente",
    "recencia": "lo reciente de la última solicitud",
    "amplitud": "la cantidad de solicitantes distintos",
    "urgencia": "la proporción de urgencias clínicas",
}


def generar_insight(principio_activo: str, mes: str, score: float, nivel: str,
                    tendencia: str, factores: dict | str) -> str:
    """aiInsight explicable a partir de los factores del score (sin LLM)."""
    if isinstance(factores, str):
        factores = json.loads(factores)

    pesos = factores.get("pesos", {})
    contribuciones = {
        k: pesos.get(k, 0) * factores.get(k, 0) for k in _NOMBRES_FACTOR
    }
    dominantes = sorted(contribuciones, key=contribuciones.get, reverse=True)[:2]
    detalle = "Los factores que más pesan en este score son " + " y ".join(
        _NOMBRES_FACTOR[f] for f in dominantes
    ) + "."

    tendencia_txt = {"subiendo": "con tendencia al alza", "bajando": "con tendencia a la baja"}.get(
        tendencia, "estable"
    )
    return PROMPTS["insight_template"].format(
        pa=principio_activo.title(),
        nivel=nivel.upper(),
        score=score,
        tendencia=tendencia_txt,
        solicitudes_12m=factores.get("solicitudes_12m", "?"),
        solicitantes_12m=factores.get("solicitantes_12m", "?"),
        meses_desde_ultima=factores.get("meses_desde_ultima", "?"),
        detalle_factores=detalle,
        mes=mes,
    )


def generar_reporte(scores: pd.DataFrame | None = None, top_n: int = 15) -> str:
    """Reporte automatizado en Markdown con el panorama de riesgo del mes."""
    if scores is None:
        scores = pd.read_csv(DATA_PROCESSED / "features" / "risk_scores.csv")

    mes = scores["mes"].iloc[0] if len(scores) else "?"
    conteo = scores["nivel"].value_counts().to_dict()

    lineas = [
        f"# Reporte automático de riesgo de desabastecimiento — corte {mes}",
        "",
        f"_Generado por MediWatch analyst_agent el {date.today().isoformat()}._",
        "",
        f"**Principios activos monitoreados:** {len(scores)}  ",
        f"**Distribución:** {conteo.get('critico', 0)} críticos · {conteo.get('alto', 0)} altos · "
        f"{conteo.get('medio', 0)} medios · {conteo.get('bajo', 0)} bajos",
        "",
        f"## Top {top_n} en riesgo",
        "",
        "| # | Principio activo | Score | Nivel | Tendencia | Explicación |",
        "|---|------------------|-------|-------|-----------|-------------|",
    ]
    for i, fila in scores.head(top_n).iterrows():
        insight = generar_insight(
            fila["principio_activo"], fila["mes"], fila["score"],
            fila["nivel"], fila["tendencia"], fila["factores"],
        )
        corto = insight.split(". ")[1] if ". " in insight else insight
        lineas.append(
            f"| {i + 1} | {fila['principio_activo']} | {fila['score']} | {fila['nivel']} "
            f"| {fila['tendencia']} | {corto} |"
        )

    lineas += [
        "",
        "## Metodología",
        "Score compuesto 0-100 (pesos en `config/risk_model_params.yaml`) sobre las autorizaciones",
        "de importación excepcional de INVIMA (Medicamentos Vitales No Disponibles). Validación",
        "predictiva: regresión logística con backtest temporal — ver `models/predictive/metrics.json`.",
    ]

    texto = "\n".join(lineas)
    REPORTS.mkdir(parents=True, exist_ok=True)
    (REPORTS / "reporte_riesgo_automatico.md").write_text(texto, encoding="utf-8")
    return texto


if __name__ == "__main__":
    print(generar_reporte()[:2000])

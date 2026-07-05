"""Pruebas de equidad y sesgo del score de riesgo.

Verifican que el score depende SOLO del comportamiento de las solicitudes
(frecuencia, tendencia, recencia, amplitud, urgencia) y no de atributos
arbitrarios del medicamento, y que no penaliza por defecto a grupos
minoritarios (medicamentos huérfanos, pocos solicitantes, poca historia).
"""

from pathlib import Path

import pandas as pd
import pytest

from src.features.build_features import construir_panel
from src.inference import calcular_scores

PROCESSED = Path(__file__).resolve().parents[2] / "data" / "processed"


def _panel(filas):
    df = pd.DataFrame(filas, columns=[
        "principio_activo_1", "mes_autorizacion", "tipo_solicitud",
        "solicitante_importador", "cantidad_solicitada_num",
    ])
    return construir_panel(df)


def test_invarianza_al_nombre():
    """Dos PAs con actividad idéntica deben tener exactamente el mismo score,
    sin importar el nombre (no hay sesgo por identidad)."""
    actividad = [(m, "VITAL NO DISPONIBLE", "IPS A", 10) for m in ["2025-01", "2025-03", "2025-06"]]
    filas = [("ZZZZ LARGO NOMBRE RARO", m, t, s, c) for m, t, s, c in actividad]
    filas += [("AAA", m, t, s, c) for m, t, s, c in actividad]
    scores = calcular_scores(_panel(filas)).set_index("principio_activo")
    assert scores.loc["ZZZZ LARGO NOMBRE RARO", "score"] == scores.loc["AAA", "score"]


def test_huerfano_un_solicitante_puede_ser_alto():
    """Un medicamento huérfano (1 solo solicitante) con solicitudes frecuentes y
    recientes NO debe quedar suprimido por tener poca amplitud."""
    filas = [("HUERFANO", f"2025-{m:02d}", "URGENCIA CLINICA", "IPS UNICA", 5) for m in range(1, 13)]
    filas += [("TRANQUILO", "2024-01", "VITAL NO DISPONIBLE", "IPS B", 5)]
    # completar malla hasta 2025-12
    filas += [("TRANQUILO", "2025-12", "VITAL NO DISPONIBLE", "IPS B", 0)]
    scores = calcular_scores(_panel(filas)).set_index("principio_activo")
    assert scores.loc["HUERFANO", "score"] >= 50, "frecuente y reciente debe ser al menos alto"


def test_poca_historia_no_es_critico_por_defecto():
    """Un PA que apenas aparece una vez, hace mucho, no puede salir crítico:
    el sistema no debe alarmar sin evidencia."""
    filas = [("NUEVO", "2024-01", "VITAL NO DISPONIBLE", "IPS A", 1)]
    filas += [("ACTIVO", f"2025-{m:02d}", "URGENCIA CLINICA", f"IPS {m}", 10) for m in range(6, 13)]
    scores = calcular_scores(_panel(filas)).set_index("principio_activo")
    assert scores.loc["NUEVO", "nivel"] in ("bajo", "medio")


def test_urgencia_influye_pero_no_domina():
    """La urgencia clínica pesa 0.10: dos PAs idénticos salvo el tipo de
    solicitud no pueden diferir más de 10 puntos."""
    filas = [("CONURGENCIA", f"2025-{m:02d}", "URGENCIA CLINICA", "IPS A", 5) for m in range(1, 7)]
    filas += [("SINURGENCIA", f"2025-{m:02d}", "VITAL NO DISPONIBLE", "IPS A", 5) for m in range(1, 7)]
    scores = calcular_scores(_panel(filas)).set_index("principio_activo")
    assert abs(scores.loc["CONURGENCIA", "score"] - scores.loc["SINURGENCIA", "score"]) <= 10.0


@pytest.mark.skipif(not (PROCESSED / "features" / "risk_scores.csv").exists(),
                    reason="requiere scores reales (correr src.inference)")
def test_distribucion_real_no_degenerada():
    """Sobre los datos reales: el score debe discriminar (no todos críticos ni
    todos bajos) — un sistema que alarma por todo es tan inútil como uno mudo."""
    scores = pd.read_csv(PROCESSED / "features" / "risk_scores.csv")
    proporciones = scores["nivel"].value_counts(normalize=True)
    assert proporciones.get("critico", 0) < 0.5, "más de la mitad crítico = alarmismo"
    assert scores["nivel"].nunique() >= 3, "el score debe usar varios niveles"

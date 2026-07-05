"""Test de integración: flujo crudo → limpio → tablas → match, con datos reales (fixtures)."""

from pathlib import Path

import pandas as pd

from src.data_pipeline.clean_cum import limpiar_dataset_cum, tablas_intermedias_cum
from src.data_pipeline.clean_vitales import (
    agregar_banderas,
    limpiar_base_medicamentos_vitales,
    tablas_intermedias_vitales,
)
from src.data_pipeline.integrate import match_principios_activos, normalize_text

FIXTURES = Path(__file__).resolve().parents[1] / "fixtures"


def test_flujo_completo_con_datos_reales():
    # 1. Limpieza CUM
    cum = limpiar_dataset_cum(pd.read_csv(FIXTURES / "cum_muestra.csv", low_memory=False))
    tablas_cum = tablas_intermedias_cum(cum)

    # 2. Limpieza Vitales
    vit = agregar_banderas(
        limpiar_base_medicamentos_vitales(pd.read_csv(FIXTURES / "vitales_muestra.csv"))
    )
    tablas_vit = tablas_intermedias_vitales(vit)

    # 3. Integración por principio activo
    pa_vitales = tablas_vit["solicitudes"]["principio_activo_1"].dropna().unique().tolist()
    pa_cum = tablas_cum["principios_activos_cum"]["principioactivo"].dropna().unique().tolist()
    puente = match_principios_activos(pa_vitales, pa_cum)

    # La tabla puente cubre todos los principios activos de la muestra Vitales
    esperados = {normalize_text(p) for p in pa_vitales if normalize_text(p)}
    assert set(puente["nombre_vitales"]) == esperados
    assert set(puente["metodo"]).issubset({"exacto", "fuzzy", "sin_match"})

    # Estructura de la tabla puente (contrato con load_supabase)
    assert list(puente.columns) == ["nombre_vitales", "nombre_cum", "metodo", "score"]

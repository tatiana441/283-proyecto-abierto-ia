"""Tests unitarios de la limpieza de Medicamentos Vitales (portada del notebook)."""

from pathlib import Path

import pandas as pd

from src.data_pipeline.clean_vitales import (
    agregar_banderas,
    limpiar_base_medicamentos_vitales,
    normalizar_nombre_columna,
    tablas_intermedias_vitales,
)
from src.data_pipeline.ingest import VITALES_API_TO_CSV

FIXTURES = Path(__file__).resolve().parents[1] / "fixtures"


def test_normalizar_nombre_columna():
    assert normalizar_nombre_columna("Fecha de autorización") == "fecha_de_autorizacion"
    assert normalizar_nombre_columna("Código Diagnostico CIE-10") == "codigo_diagnostico_cie_10"
    assert normalizar_nombre_columna("  Forma  Farmacéutica ") == "forma_farmaceutica"


def test_limpieza_fixture_real():
    df = pd.read_csv(FIXTURES / "vitales_muestra.csv")
    out = limpiar_base_medicamentos_vitales(df)

    for col in ["fecha_autorizacion", "tipo_solicitud", "principio_activo_1",
                "cantidad_solicitada_num", "fecha_autorizacion_limpia", "mes_autorizacion"]:
        assert col in out.columns, f"falta {col}"

    assert str(out["fecha_autorizacion_limpia"].dtype).startswith("datetime")
    assert out["anio_autorizacion"].dtype.name == "Int64"


def test_banderas():
    df = limpiar_base_medicamentos_vitales(pd.read_csv(FIXTURES / "vitales_muestra.csv"))
    out = agregar_banderas(df)
    for col in ["sin_ium", "sin_diagnostico", "codigo_cie10_valido", "tiene_segundo_principio_activo"]:
        assert out[col].isin([True, False]).all()


def test_tablas_intermedias():
    df = agregar_banderas(limpiar_base_medicamentos_vitales(pd.read_csv(FIXTURES / "vitales_muestra.csv")))
    tablas = tablas_intermedias_vitales(df)
    assert set(tablas) == {"medicamentos_vitales", "solicitudes", "diagnosticos"}
    assert len(tablas["solicitudes"]) > 0
    assert "principio_activo_1" in tablas["solicitudes"].columns


def test_mapeo_api_a_csv_produce_columnas_esperadas():
    """La API SODA expone slugs distintos al CSV; tras mapear y limpiar deben quedar los nombres canónicos."""
    api_cols = ["fecha_de_autorizaci_n", "tipo_de_solicitud", "solicitante_importador", "ium",
                "principio_activo1", "concentraci_n_delmedicamento1", "unidad_medida1",
                "principio_activo2", "concentraci_n_del_medicamento2", "unidad_medida2",
                "forma_farmac_utica", "nombre_comercial_", "cantidad_solicitada",
                "presentaci_n_comercial", "diagnostico_cie_1no_reporta", "c_digo_diagnostico_cie_10"]
    df = pd.DataFrame([["2024-01-01T00:00:00.000", "URGENCIA CLINICA", "IPS X", "IUM1",
                        "METOTREXATO", "50", "mg", "NO APLICA", None, None,
                        "TABLETA", "MEDX", "100", "CAJA", "LUPUS", "M32"]], columns=api_cols)
    df = df.rename(columns=VITALES_API_TO_CSV)
    out = limpiar_base_medicamentos_vitales(df)
    for col in ["fecha_autorizacion", "principio_activo_1", "forma_farmaceutica",
                "nombre_comercial", "codigo_diagnostico_cie10"]:
        assert col in out.columns, f"falta {col} tras el mapeo API→CSV"
    assert out.loc[0, "principio_activo_1"] == "METOTREXATO"

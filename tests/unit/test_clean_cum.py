"""Tests unitarios de las funciones de limpieza del CUM (portadas del notebook)."""

from pathlib import Path

import pandas as pd

from src.data_pipeline.clean_cum import (
    limpiar_dataset_cum,
    limpiar_fecha,
    limpiar_numero,
    limpiar_texto,
    tablas_intermedias_cum,
)

FIXTURES = Path(__file__).resolve().parents[1] / "fixtures"


def test_limpiar_texto_espacios_y_vacios():
    s = pd.Series(["  hola   mundo ", "", "nan", "None", "ok"])
    out = limpiar_texto(s)
    assert out[0] == "hola mundo"
    assert pd.isna(out[1]) and pd.isna(out[2]) and pd.isna(out[3])
    assert out[4] == "ok"


def test_limpiar_fecha_sentinelas():
    s = pd.Series(["2023-05-10", "1900-01-01", "9999-12-31", "3000-01-01", "no-fecha"])
    out = limpiar_fecha(s)
    assert out[0] == pd.Timestamp("2023-05-10")
    assert out[1:].isna().all()


def test_limpiar_numero_coma_decimal():
    s = pd.Series(["1,5", "2.75", "abc", None])
    out = limpiar_numero(s)
    assert out[0] == 1.5
    assert out[1] == 2.75
    assert pd.isna(out[2]) and pd.isna(out[3])


def test_limpiar_dataset_cum_fixture_real():
    df = pd.read_csv(FIXTURES / "cum_muestra.csv", low_memory=False)
    out = limpiar_dataset_cum(df)

    # llave cum = expedientecum + consecutivocum (sin separador, como el notebook)
    fila = out.iloc[0]
    assert fila["cum"] == f"{fila['expedientecum']}{fila['consecutivocum']}"
    # llave estándar para el cruce con precios regulados
    assert fila["cum_std"] == f"{fila['expedientecum']}-{fila['consecutivocum']}"

    assert "fechaexpedicion_limpia" in out.columns
    assert out["atc_valido"].isin([True, False]).all()


def test_tablas_intermedias_no_vacias():
    df = limpiar_dataset_cum(pd.read_csv(FIXTURES / "cum_muestra.csv", low_memory=False))
    tablas = tablas_intermedias_cum(df)
    assert set(tablas) == {"productos", "presentaciones", "principios_activos_cum", "roles"}
    for nombre, tabla in tablas.items():
        assert len(tabla) > 0, f"{nombre} vacía"

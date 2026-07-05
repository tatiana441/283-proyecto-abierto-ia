"""Tests del match en cascada exacto → fuzzy → sin match."""

from src.data_pipeline.integrate import UMBRAL_FUZZY, match_principios_activos, normalize_text


def test_normalize_text():
    assert normalize_text(" Ácido   Ascórbico ") == "ACIDO ASCORBICO"
    assert normalize_text("metotrexato") == "METOTREXATO"
    assert normalize_text(None) is None
    assert normalize_text("") is None


def test_match_exacto_ignora_tildes_y_mayusculas():
    puente = match_principios_activos(["Levotiroxina Sódica"], ["LEVOTIROXINA SODICA"])
    assert puente.iloc[0]["metodo"] == "exacto"
    assert puente.iloc[0]["score"] == 100.0


def test_match_fuzzy_variacion_leve():
    puente = match_principios_activos(["AMOXICILINA TRIHIDRATO"], ["AMOXICILINA TRIHIDRATADA", "IBUPROFENO"])
    fila = puente.iloc[0]
    assert fila["metodo"] == "fuzzy"
    assert fila["nombre_cum"] == "AMOXICILINA TRIHIDRATADA"
    assert fila["score"] >= UMBRAL_FUZZY


def test_sin_match_queda_registrado():
    puente = match_principios_activos(["SUSTANCIA INEXISTENTE XYZ"], ["METOTREXATO"])
    fila = puente.iloc[0]
    assert fila["metodo"] == "sin_match"
    assert fila["nombre_cum"] is None


def test_cascada_completa():
    vitales = ["Metotrexato", "AMOXICILINA TRIHIDRATO", "NOEXISTE 999"]
    cum = ["METOTREXATO", "AMOXICILINA TRIHIDRATADA"]
    puente = match_principios_activos(vitales, cum)
    metodos = dict(zip(puente["nombre_vitales"], puente["metodo"]))
    assert metodos["METOTREXATO"] == "exacto"
    assert metodos["AMOXICILINA TRIHIDRATO"] == "fuzzy"
    assert metodos["NOEXISTE 999"] == "sin_match"

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


def test_guardia_rechaza_numero_romano():
    """Factor XIII no debe cruzar con Factor VIII (moléculas distintas, >90% parecido)."""
    puente = match_principios_activos(["FACTOR XIII"], ["FACTOR VIII"])
    assert puente.iloc[0]["metodo"] == "sin_match"


def test_guardia_rechaza_isomero_griego():
    """Interferón alfa no debe cruzar con interferón beta."""
    puente = match_principios_activos(["INTERFERON ALFA 2B"], ["INTERFERON BETA 1A"])
    assert puente.iloc[0]["metodo"] == "sin_match"


def test_guardia_rechaza_prefijo_isomero():
    """Megestrol vs Nomegestrol: un prefijo cambia la molécula (score fuzzy 95)."""
    puente = match_principios_activos(["ACETATO DE MEGESTROL"], ["ACETATO DE NOMEGESTROL"])
    assert puente.iloc[0]["metodo"] == "sin_match"


def test_guardia_no_afecta_variaciones_legitimas():
    """El guardia no debe rechazar variaciones de escritura del mismo principio activo."""
    for vit, cum in [("NITISINONE", "NITISINONA"), ("MAGNESIO SULFATO", "SULFATO DE MAGNESIO")]:
        puente = match_principios_activos([vit], [cum])
        assert puente.iloc[0]["metodo"] == "fuzzy", f"{vit} debería cruzar con {cum}"

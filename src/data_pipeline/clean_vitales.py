"""Limpieza de Medicamentos Vitales No Disponibles (INVIMA).

Funciones portadas 1:1 desde notebooks/02_limpieza_transformacion_vitales.ipynb
(autoría del equipo), incluidas la deduplicación y las banderas de alerta que en
el notebook estaban en celdas posteriores.
"""

import re
import unicodedata

import pandas as pd

from src.common import DATA_PROCESSED


def normalizar_nombre_columna(col):
    """Convierte nombres de columnas a formato limpio tipo snake_case."""
    col = str(col).strip().lower()

    # Quitar acentos
    col = unicodedata.normalize("NFKD", col)
    col = "".join(c for c in col if not unicodedata.combining(c))

    # Reemplazos
    col = col.replace("/", "_")
    col = col.replace("-", "_")
    col = re.sub(r"[^a-z0-9_ ]", "", col)
    col = col.replace(" ", "_")
    col = re.sub(r"_+", "_", col).strip("_")

    return col


def limpiar_texto(serie):
    """Limpia espacios dobles, saltos de línea y textos vacíos."""
    return (
        serie.astype("string")
        .str.strip()
        .str.replace(r"\s+", " ", regex=True)
        .replace({"": pd.NA, "nan": pd.NA, "None": pd.NA})
    )


def limpiar_numero(serie):
    """Convierte números guardados como texto. Acepta coma decimal."""
    s = serie.astype("string").str.strip().str.replace(",", ".", regex=False)
    return pd.to_numeric(s, errors="coerce")


def limpiar_base_medicamentos_vitales(df):
    """Limpia la base de medicamentos vitales no disponibles."""
    df = df.copy()

    # 1. Normalizar nombres originales
    df.columns = [normalizar_nombre_columna(c) for c in df.columns]

    # 2. Renombrar columnas para hacerlas más claras
    renombres = {
        "fecha_de_autorizacion": "fecha_autorizacion",
        "tipo_de_solicitud": "tipo_solicitud",
        "solicitante_importador": "solicitante_importador",
        "principio_activo1": "principio_activo_1",
        "concentracion_delmedicamento1": "concentracion_medicamento_1",
        "unidad_medida1": "unidad_medida_1",
        "principio_activo2": "principio_activo_2",
        "concentracion_del_medicamento2": "concentracion_medicamento_2",
        "unidad_medida2": "unidad_medida_2",
        "forma_farmaceutica": "forma_farmaceutica",
        "nombre_comercial": "nombre_comercial",
        "cantidad_solicitada": "cantidad_solicitada",
        "presentacion_comercial": "presentacion_comercial",
        "diagnostico_cie_1no_reporta": "diagnostico_cie_descripcion",
        "codigo_diagnostico_cie_10": "codigo_diagnostico_cie10",
    }
    df = df.rename(columns=renombres)

    # 3. Limpiar textos (object en pandas 2 / str en pandas 3, según la fuente)
    columnas_texto = [c for c in df.columns if df[c].dtype == object or str(df[c].dtype) in ("string", "str")]
    for col in columnas_texto:
        df[col] = limpiar_texto(df[col])

    # 4. Convertir fecha de autorización
    df["fecha_autorizacion_limpia"] = pd.to_datetime(df["fecha_autorizacion"], errors="coerce")
    # Int64 anulable: con NaT presentes, .dt.year daría float y rompería el COPY a columna INT
    df["anio_autorizacion"] = df["fecha_autorizacion_limpia"].dt.year.astype("Int64")
    df["mes_autorizacion"] = df["fecha_autorizacion_limpia"].dt.to_period("M").astype("string")

    # 5. Convertir cantidad solicitada
    df["cantidad_solicitada_num"] = limpiar_numero(df["cantidad_solicitada"])

    # 6. Estandarizar unidades frecuentes
    reemplazos_unidades = {
        "mg/ml": "mg/mL",
        "mg/mL": "mg/mL",
        "mcg/ml": "mcg/mL",
        "µg/ml": "mcg/mL",
        "ug/ml": "mcg/mL",
        "µg/mL": "mcg/mL",
    }
    for col in ["unidad_medida_1", "unidad_medida_2"]:
        if col in df.columns:
            df[col] = df[col].replace(reemplazos_unidades)

    return df


def agregar_banderas(df_limpia):
    """Banderas de alerta del notebook (celda 7): sin IUM, sin diagnóstico, CIE-10, 2º principio activo."""
    df_limpia = df_limpia.copy()
    patron_cie10 = r"^[A-Z][0-9]{2}[A-Z0-9]?$"

    df_limpia["sin_ium"] = (
        df_limpia["ium"].isna()
        | df_limpia["ium"].eq("VARIOS IUM")
        | df_limpia["ium"].eq("SIN IUM POR SER FITOTERAPEUTICO")
    )
    df_limpia["sin_diagnostico"] = (
        df_limpia["diagnostico_cie_descripcion"].isna()
        | df_limpia["diagnostico_cie_descripcion"].eq("NO REPORTADO")
        | df_limpia["codigo_diagnostico_cie10"].isna()
        | df_limpia["codigo_diagnostico_cie10"].eq("NO REPORTADO")
    )
    df_limpia["codigo_cie10_valido"] = (
        df_limpia["codigo_diagnostico_cie10"].astype("string").str.match(patron_cie10).fillna(False)
    )
    df_limpia["tiene_segundo_principio_activo"] = (
        df_limpia["principio_activo_2"].notna()
        & ~df_limpia["principio_activo_2"].eq("NO APLICA")
    )
    return df_limpia


def tablas_intermedias_vitales(df_limpia):
    """Tablas intermedias del notebook: medicamentos, solicitudes, diagnósticos."""
    medicamentos = df_limpia[[
        "ium", "nombre_comercial", "forma_farmaceutica", "presentacion_comercial",
        "principio_activo_1", "concentracion_medicamento_1", "unidad_medida_1",
        "principio_activo_2", "concentracion_medicamento_2", "unidad_medida_2",
    ]].drop_duplicates().reset_index(drop=True)

    solicitudes = df_limpia[[
        "fecha_autorizacion_limpia", "anio_autorizacion", "mes_autorizacion",
        "tipo_solicitud", "solicitante_importador", "ium",
        "principio_activo_1", "cantidad_solicitada_num",
    ]].drop_duplicates().reset_index(drop=True)

    diagnosticos = df_limpia[[
        "ium", "diagnostico_cie_descripcion", "codigo_diagnostico_cie10",
        "sin_diagnostico", "codigo_cie10_valido",
    ]].drop_duplicates().reset_index(drop=True)

    return {
        "medicamentos_vitales": medicamentos,
        "solicitudes": solicitudes,
        "diagnosticos": diagnosticos,
    }


def run(df_raw: pd.DataFrame) -> dict[str, pd.DataFrame]:
    """Limpia Vitales crudo (dedup + banderas) y exporta a data/processed/vitales/."""
    df = limpiar_base_medicamentos_vitales(df_raw)
    df_limpia = df.drop_duplicates().reset_index(drop=True)
    eliminados = len(df) - len(df_limpia)
    df_limpia = agregar_banderas(df_limpia)
    tablas = tablas_intermedias_vitales(df_limpia)

    out = DATA_PROCESSED / "vitales"
    out.mkdir(parents=True, exist_ok=True)
    df_limpia.to_csv(out / "base_limpia.csv", index=False, encoding="utf-8")
    for nombre, tabla in tablas.items():
        tabla.to_csv(out / f"{nombre}.csv", index=False, encoding="utf-8")
        print(f"[clean_vitales] {nombre}: {len(tabla):,} filas")
    print(f"[clean_vitales] duplicados exactos eliminados: {eliminados:,}")

    tablas["base_limpia"] = df_limpia
    return tablas

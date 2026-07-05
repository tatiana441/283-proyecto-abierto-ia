"""Limpieza del dataset CUM (Código Único de Medicamentos Vigentes — INVIMA).

Funciones portadas 1:1 desde notebooks/02_limpieza_transformacion_cum.ipynb
(autoría del equipo). Única adición: la columna `cum_std` (expediente-consecutivo)
como llave estándar para cruzar con Precios Máximos regulados.
"""

import pandas as pd

from src.common import DATA_PROCESSED


def limpiar_texto(serie):
    """Limpia espacios, saltos de línea y textos vacíos."""
    return (
        serie.astype("string")
        .str.strip()
        .str.replace(r"\s+", " ", regex=True)
        .replace({"": pd.NA, "nan": pd.NA, "None": pd.NA})
    )


def limpiar_fecha(serie):
    """Convierte fechas a datetime y elimina fechas sentinela (1900, 2099, 3000, 9999)."""
    s = serie.astype("string").str.slice(0, 10)
    anio = pd.to_numeric(s.str.slice(0, 4), errors="coerce")
    s = s.mask(anio <= 1900)
    s = s.mask(anio >= 2099)
    return pd.to_datetime(s, errors="coerce")


def limpiar_numero(serie):
    """Convierte cantidades a número, aceptando coma decimal."""
    return pd.to_numeric(
        serie.astype("string").str.replace(",", ".", regex=False),
        errors="coerce",
    )


def limpiar_dataset_cum(df):
    """Aplica la limpieza principal al dataset CUM."""
    df = df.copy()

    # 1. Normalizar nombres de columnas
    df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

    # 2. Limpiar columnas de texto (object en pandas 2 / str en pandas 3, según la fuente)
    columnas_texto = [c for c in df.columns if df[c].dtype == object or str(df[c].dtype) in ("string", "str")]
    for col in columnas_texto:
        df[col] = limpiar_texto(df[col])

    # 3. Crear llave CUM
    df["cum"] = (
        df["expedientecum"].astype("string").str.strip()
        + df["consecutivocum"].astype("string").str.strip()
    )
    # Llave estándar expediente-consecutivo (formato de la base de precios regulados)
    df["cum_std"] = (
        df["expedientecum"].astype("string").str.strip()
        + "-"
        + df["consecutivocum"].astype("string").str.strip()
    )

    # 4. Limpiar fechas
    columnas_fecha = ["fechaexpedicion", "fechavencimiento", "fechaactivo", "fechainactivo"]
    for col in columnas_fecha:
        if col in df.columns:
            df[col + "_limpia"] = limpiar_fecha(df[col])
        else:
            # La API SODA no expone todas las fechas que trae el CSV manual
            df[col + "_limpia"] = pd.NaT

    # 5. Convertir cantidades
    for col in ["cantidadcum", "cantidad"]:
        if col in df.columns:
            df[col + "_num"] = limpiar_numero(df[col])

    # 6. Validar código ATC
    if "atc" in df.columns:
        patron_atc = r"^[A-Z]\d{2}[A-Z]{2}\d{2}$"
        df["atc_valido"] = df["atc"].astype("string").str.match(patron_atc)
        df["atc_valido"] = df["atc_valido"].fillna(False)

    # 7. Banderas de calidad
    df["sin_descripcion_comercial"] = df.get("descripcioncomercial", pd.Series(index=df.index)).isna()
    df["sin_unidad_referencia"] = df.get("unidadreferencia", pd.Series(index=df.index)).isna()
    df["sin_forma_farmaceutica"] = df.get("formafarmaceutica", pd.Series(index=df.index)).isna()

    if "estadocum" in df.columns and "fechainactivo_limpia" in df.columns:
        df["cum_inactivo_sin_fecha_inactivo"] = (
            df["estadocum"].eq("Inactivo") & df["fechainactivo_limpia"].isna()
        )

    return df


def tablas_intermedias_cum(df):
    """Genera las tablas intermedias del notebook: productos, presentaciones, principios activos, roles."""
    productos = df[[
        "expediente", "producto", "titular", "registrosanitario",
        "fechaexpedicion_limpia", "fechavencimiento_limpia", "estadoregistro",
    ]].drop_duplicates()

    presentaciones = df[[
        "cum", "cum_std", "expedientecum", "consecutivocum", "cantidadcum_num",
        "unidad", "descripcioncomercial", "estadocum",
        "fechaactivo_limpia", "fechainactivo_limpia",
        "muestramedica", "formafarmaceutica",
    ]].drop_duplicates()

    principios_activos = df[[
        "cum", "expediente", "principioactivo", "concentracion",
        "cantidad_num", "unidadreferencia", "atc", "descripcionatc", "atc_valido",
    ]].drop_duplicates()

    roles = df[["cum", "nombrerol", "tiporol", "modalidad"]].drop_duplicates()

    return {
        "productos": productos,
        "presentaciones": presentaciones,
        "principios_activos_cum": principios_activos,
        "roles": roles,
    }


def run(df_raw: pd.DataFrame) -> dict[str, pd.DataFrame]:
    """Limpia el CUM crudo y exporta las tablas a data/processed/cum/."""
    df = limpiar_dataset_cum(df_raw)
    tablas = tablas_intermedias_cum(df)

    out = DATA_PROCESSED / "cum"
    out.mkdir(parents=True, exist_ok=True)
    df.to_csv(out / "cum_base_limpia.csv", index=False, encoding="utf-8")
    for nombre, tabla in tablas.items():
        tabla.to_csv(out / f"{nombre}.csv", index=False, encoding="utf-8")
        print(f"[clean_cum] {nombre}: {len(tabla):,} filas")

    tablas["cum_base_limpia"] = df
    return tablas

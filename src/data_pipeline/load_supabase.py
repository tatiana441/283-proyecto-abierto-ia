"""Carga de las tablas procesadas a Supabase (Postgres).

- DDL idempotente: DROP + CREATE de las tablas que posee el pipeline.
- Carga masiva con COPY vía psycopg (157k+ filas; supabase-py sería lento).
- RLS: lectura pública (anon) en catálogos; chat_logs solo autenticado.
"""

import io

import pandas as pd
import psycopg

from src.common import database_url

DDL = """
DROP TABLE IF EXISTS productos CASCADE;
CREATE TABLE productos (
    expediente          BIGINT,
    producto            TEXT,
    titular             TEXT,
    registrosanitario   TEXT,
    fechaexpedicion     DATE,
    fechavencimiento    DATE,
    estadoregistro      TEXT
);

DROP TABLE IF EXISTS presentaciones CASCADE;
CREATE TABLE presentaciones (
    cum              TEXT,
    cum_std          TEXT,
    expedientecum    BIGINT,
    consecutivocum   INT,
    cantidadcum      DOUBLE PRECISION,
    unidad           TEXT,
    descripcioncomercial TEXT,
    estadocum        TEXT,
    fechaactivo      DATE,
    fechainactivo    DATE,
    muestramedica    TEXT,
    formafarmaceutica TEXT
);

DROP TABLE IF EXISTS principios_activos_cum CASCADE;
CREATE TABLE principios_activos_cum (
    cum              TEXT,
    expediente       BIGINT,
    principioactivo  TEXT,
    concentracion    TEXT,
    cantidad         DOUBLE PRECISION,
    unidadreferencia TEXT,
    atc              TEXT,
    descripcionatc   TEXT,
    atc_valido       BOOLEAN
);

DROP TABLE IF EXISTS medicamentos_vitales CASCADE;
CREATE TABLE medicamentos_vitales (
    ium                        TEXT,
    nombre_comercial           TEXT,
    forma_farmaceutica         TEXT,
    presentacion_comercial     TEXT,
    principio_activo_1         TEXT,
    concentracion_medicamento_1 TEXT,
    unidad_medida_1            TEXT,
    principio_activo_2         TEXT,
    concentracion_medicamento_2 TEXT,
    unidad_medida_2            TEXT
);

DROP TABLE IF EXISTS solicitudes CASCADE;
CREATE TABLE solicitudes (
    fecha_autorizacion   DATE,
    anio_autorizacion    INT,
    mes_autorizacion     TEXT,
    tipo_solicitud       TEXT,
    solicitante_importador TEXT,
    ium                  TEXT,
    principio_activo_1   TEXT,
    cantidad_solicitada  DOUBLE PRECISION
);

DROP TABLE IF EXISTS diagnosticos CASCADE;
CREATE TABLE diagnosticos (
    ium                        TEXT,
    diagnostico_cie_descripcion TEXT,
    codigo_diagnostico_cie10   TEXT,
    sin_diagnostico            BOOLEAN,
    codigo_cie10_valido        BOOLEAN
);

DROP TABLE IF EXISTS match_principio_activo CASCADE;
CREATE TABLE match_principio_activo (
    nombre_vitales TEXT,
    nombre_cum     TEXT,
    metodo         TEXT,
    score          DOUBLE PRECISION
);

DROP TABLE IF EXISTS precios_mensuales CASCADE;
CREATE TABLE precios_mensuales (
    mes             TEXT,
    expediente      BIGINT,
    tipo_reporte    TEXT,
    precio_promedio DOUBLE PRECISION,
    precio_minimo   DOUBLE PRECISION,
    precio_maximo   DOUBLE PRECISION,
    unidades        DOUBLE PRECISION,
    valor_total     DOUBLE PRECISION,
    n_registros     INT
);

DROP TABLE IF EXISTS precios_regulados CASCADE;
CREATE TABLE precios_regulados (
    cum                     TEXT,
    expediente              BIGINT,
    consecutivo             INT,
    id_mr                   TEXT,
    mercado_relevante       TEXT,
    medicamento             TEXT,
    cantidad_unidad_medida  DOUBLE PRECISION,
    unidad_de_medida        TEXT,
    pmax_institucional      DOUBLE PRECISION,
    pmax_comercial_mayorista DOUBLE PRECISION,
    pmax_comercial_final    DOUBLE PRECISION,
    margen_para_ips         DOUBLE PRECISION,
    circular                TEXT,
    fecha_inicio_vigencia   DATE
);

DROP TABLE IF EXISTS risk_scores CASCADE;
CREATE TABLE risk_scores (
    principio_activo TEXT,
    mes              TEXT,
    score            DOUBLE PRECISION,
    nivel            TEXT,
    tendencia        TEXT,
    factores         JSONB,
    calculado_en     TIMESTAMPTZ DEFAULT now()
);

DROP TABLE IF EXISTS chat_logs CASCADE;
CREATE TABLE chat_logs (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID,
    pregunta    TEXT,
    respuesta   TEXT,
    sources     JSONB,
    creado_en   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX ON productos (expediente);
CREATE INDEX ON presentaciones (expedientecum);
CREATE INDEX ON principios_activos_cum (expediente);
CREATE INDEX ON principios_activos_cum (principioactivo);
CREATE INDEX ON solicitudes (ium);
CREATE INDEX ON solicitudes (mes_autorizacion);
CREATE INDEX ON solicitudes (principio_activo_1);
CREATE INDEX ON precios_mensuales (expediente, mes);
CREATE INDEX ON precios_regulados (expediente);
CREATE INDEX ON match_principio_activo (nombre_vitales);
"""

CATALOGOS_PUBLICOS = [
    "productos", "presentaciones", "principios_activos_cum", "medicamentos_vitales",
    "solicitudes", "diagnosticos", "match_principio_activo",
    "precios_mensuales", "precios_regulados", "risk_scores",
]

# columnas de cada tabla en el orden del DDL -> columna del DataFrame procesado
MAPEOS = {
    "productos": {
        "csv": ("cum", "productos.csv"),
        "cols": {
            "expediente": "expediente", "producto": "producto", "titular": "titular",
            "registrosanitario": "registrosanitario", "fechaexpedicion": "fechaexpedicion_limpia",
            "fechavencimiento": "fechavencimiento_limpia", "estadoregistro": "estadoregistro",
        },
    },
    "presentaciones": {
        "csv": ("cum", "presentaciones.csv"),
        "cols": {
            "cum": "cum", "cum_std": "cum_std", "expedientecum": "expedientecum",
            "consecutivocum": "consecutivocum", "cantidadcum": "cantidadcum_num",
            "unidad": "unidad", "descripcioncomercial": "descripcioncomercial",
            "estadocum": "estadocum", "fechaactivo": "fechaactivo_limpia",
            "fechainactivo": "fechainactivo_limpia", "muestramedica": "muestramedica",
            "formafarmaceutica": "formafarmaceutica",
        },
    },
    "principios_activos_cum": {
        "csv": ("cum", "principios_activos_cum.csv"),
        "cols": {
            "cum": "cum", "expediente": "expediente", "principioactivo": "principioactivo",
            "concentracion": "concentracion", "cantidad": "cantidad_num",
            "unidadreferencia": "unidadreferencia", "atc": "atc",
            "descripcionatc": "descripcionatc", "atc_valido": "atc_valido",
        },
    },
    "medicamentos_vitales": {
        "csv": ("vitales", "medicamentos_vitales.csv"),
        "cols": {c: c for c in [
            "ium", "nombre_comercial", "forma_farmaceutica", "presentacion_comercial",
            "principio_activo_1", "concentracion_medicamento_1", "unidad_medida_1",
            "principio_activo_2", "concentracion_medicamento_2", "unidad_medida_2"]},
    },
    "solicitudes": {
        "csv": ("vitales", "solicitudes.csv"),
        "cols": {
            "fecha_autorizacion": "fecha_autorizacion_limpia", "anio_autorizacion": "anio_autorizacion",
            "mes_autorizacion": "mes_autorizacion", "tipo_solicitud": "tipo_solicitud",
            "solicitante_importador": "solicitante_importador", "ium": "ium",
            "principio_activo_1": "principio_activo_1", "cantidad_solicitada": "cantidad_solicitada_num",
        },
    },
    "diagnosticos": {
        "csv": ("vitales", "diagnosticos.csv"),
        "cols": {c: c for c in [
            "ium", "diagnostico_cie_descripcion", "codigo_diagnostico_cie10",
            "sin_diagnostico", "codigo_cie10_valido"]},
    },
    "match_principio_activo": {
        "csv": ("integracion", "match_principio_activo.csv"),
        "cols": {c: c for c in ["nombre_vitales", "nombre_cum", "metodo", "score"]},
    },
    "precios_mensuales": {
        "csv": ("precios", "precios_mensuales.csv"),
        "cols": {c: c for c in [
            "mes", "expediente", "tipo_reporte", "precio_promedio", "precio_minimo",
            "precio_maximo", "unidades", "valor_total", "n_registros"]},
    },
    "precios_regulados": {
        "csv": ("precios", "precios_regulados.csv"),
        "cols": {c: c for c in [
            "cum", "expediente", "consecutivo", "id_mr", "mercado_relevante", "medicamento",
            "cantidad_unidad_medida", "unidad_de_medida", "pmax_institucional",
            "pmax_comercial_mayorista", "pmax_comercial_final", "margen_para_ips",
            "circular", "fecha_inicio_vigencia"]},
    },
}


def _copy_dataframe(cur, tabla: str, df: pd.DataFrame, columnas: dict[str, str]) -> int:
    presentes = {dest: orig for dest, orig in columnas.items() if orig in df.columns}
    sub = df[list(presentes.values())].copy()
    sub.columns = list(presentes.keys())

    buf = io.StringIO()
    sub.to_csv(buf, index=False, header=False, na_rep="")
    buf.seek(0)

    cols_sql = ", ".join(presentes.keys())
    with cur.copy(f"COPY {tabla} ({cols_sql}) FROM STDIN WITH (FORMAT csv, NULL '')") as copy:
        copy.write(buf.getvalue())
    return len(sub)


def aplicar_rls(cur) -> None:
    for tabla in CATALOGOS_PUBLICOS:
        cur.execute(f"ALTER TABLE {tabla} ENABLE ROW LEVEL SECURITY;")
        cur.execute(f'DROP POLICY IF EXISTS "lectura_publica_{tabla}" ON {tabla};')
        cur.execute(
            f'CREATE POLICY "lectura_publica_{tabla}" ON {tabla} '
            f"FOR SELECT TO anon, authenticated USING (true);"
        )
        cur.execute(f"GRANT SELECT ON {tabla} TO anon, authenticated;")

    cur.execute("ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;")
    cur.execute('DROP POLICY IF EXISTS "chat_propio" ON chat_logs;')
    cur.execute(
        'CREATE POLICY "chat_propio" ON chat_logs FOR ALL TO authenticated '
        "USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());"
    )
    cur.execute("GRANT SELECT, INSERT ON chat_logs TO authenticated;")


def run(tablas: dict[str, pd.DataFrame]) -> None:
    """Crea el esquema y carga todas las tablas. `tablas` = {nombre_tabla: DataFrame}."""
    url = database_url()
    with psycopg.connect(url, connect_timeout=20) as conn:
        with conn.cursor() as cur:
            cur.execute(DDL)
            for tabla, spec in MAPEOS.items():
                df = tablas.get(tabla)
                if df is None or df.empty:
                    print(f"[load] {tabla}: sin datos, se omite")
                    continue
                n = _copy_dataframe(cur, tabla, df, spec["cols"])
                print(f"[load] {tabla}: {n:,} filas cargadas")
            aplicar_rls(cur)
        conn.commit()

        with conn.cursor() as cur:
            cur.execute("SELECT pg_size_pretty(pg_database_size(current_database()))")
            print(f"[load] tamaño BD tras la carga: {cur.fetchone()[0]}")

# Changelog — MediWatch

Registro cronológico de versiones y cambios.

## [0.1.0] — 2026-07-05 · Día 1

### Agregado
- Estructura del monorepo según el esqueleto del nivel avanzado del curso.
- `src/data_pipeline/ingest.py`: ingesta SODA paginada de 3 datasets de datos.gov.co (CUM `i7cb-raxc`, Vitales `sdmr-tfmf`, Precios Máximos `nauz-qkjw`) con fallback a CSV local.
- `src/data_pipeline/clean_cum.py` y `clean_vitales.py`: funciones de limpieza portadas 1:1 desde los notebooks del equipo (`notebooks/02_*`).
- `src/data_pipeline/clean_precios.py`: limpieza del SISMED compactado (parquet Spark del equipo, 3,7M filas) y de los precios máximos regulados; agregado mensual para carga.
- `src/data_pipeline/integrate.py`: integración CUM↔Vitales por principio activo normalizado con cascada exacto → fuzzy (rapidfuzz ≥ 90) → sin match; tabla puente y métricas de cruce.
- `src/data_pipeline/load_supabase.py`: DDL, carga masiva vía COPY (psycopg) y políticas RLS.
- `src/data_pipeline/run_all.py`: orquestador ingesta → limpieza → integración → carga.
- Tests unitarios y de integración (pytest) con fixtures de datos reales.
- Frontend React (prototipo del equipo) movido a `frontend/`.
- Notebooks de limpieza originales conservados como evidencia en `notebooks/`.
- Docs iniciales: planteamiento del problema y fuentes de datos.

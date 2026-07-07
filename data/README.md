# data/

Estructura de datos del pipeline (contenido **ignorado por git**: se regenera
completo con `python -m src.data_pipeline.run_all` en ~2 minutos):

- `raw/` — espejo crudo de la API SODA de datos.gov.co (CUM, Vitales, Precios regulados, Termómetro), con fecha en el nombre.
- `processed/` — tablas limpias e integradas listas para cargar a Supabase (cum/, vitales/, precios/, integracion/, features/).
- `external/` — SISMED compactado con Spark por el equipo (`sismed_parquet/`, 3,7M filas, no viaja al repo por tamaño).

Las muestras pequeñas para tests viven en `tests/fixtures/`.
No hay `vector_store/`: el asistente no usa embeddings — su retrieval es SQL
estructurada sobre Supabase (decisión documentada en docs/marco_metodologico.md).

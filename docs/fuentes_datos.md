# Fuentes de datos

Todos los datasets provienen del portal oficial de datos abiertos de Colombia (datos.gov.co) y se consumen vía API SODA, salvo el histórico SISMED que fue descargado y compactado por el equipo.

## 1. Código Único de Medicamentos Vigentes — CUM (INVIMA)

- **Resource ID:** `i7cb-raxc` · [API](https://www.datos.gov.co/resource/i7cb-raxc.json)
- **Filas:** ~157.146 (verificado 2026-07-05) · una fila por presentación × rol
- **Contenido:** registro sanitario, principio activo, ATC, forma farmacéutica, titular, estado del registro y del CUM.
- **Rol en MediWatch:** catálogo maestro de productos (9.721 productos únicos por expediente).
- **Nota técnica:** la API no expone la columna IUM (y en el CSV está 100% vacía) → no existe llave directa hacia Vitales.

## 2. Medicamentos Vitales No Disponibles (INVIMA)

- **Resource ID:** `sdmr-tfmf` · [API](https://www.datos.gov.co/resource/sdmr-tfmf.json)
- **Filas:** ~10.507 (verificado 2026-07-05; crece ~940 filas/mes — dataset vivo)
- **Contenido:** autorizaciones de importación excepcional con fecha, tipo de solicitud, solicitante, principio activo, cantidad y diagnóstico CIE-10.
- **Rol en MediWatch:** motor del score de riesgo (cada autorización es una señal de escasez).

## 3. SISMED — Precios de medicamentos (histórico compactado)

- **Origen:** SISMED (MinSalud), ~23 millones de registros transaccionales.
- **Procesamiento:** compactado por el equipo con **Apache Spark** a 3.685.617 filas (evidencia: estructura de part-files en `data/external/sismed_parquet/`).
- **Periodo:** 2017-01 a 2019-06 (30 meses) — **histórico de referencia, no precio actual** (limitación documentada).
- **Granularidad final servida:** Mes × ExpedienteCum × TipoReporte (~724.000 filas tras limpieza y agregación).
- **Rol en MediWatch:** serie histórica de precios observados; cruza directo con el CUM por expediente (64,8% del catálogo vigente).

## 4. Precios Máximos de Venta por CUM (CNPMDM)

- **Resource ID:** `nauz-qkjw` · [API](https://www.datos.gov.co/resource/nauz-qkjw.json)
- **Filas:** 38.636 — 99,9% de la **Circular 19 de 2024** (lista consolidada vigente).
- **Contenido:** precio máximo institucional y comercial por CUM, mercado relevante, margen IPS, circular y vigencia.
- **Rol en MediWatch:** precio techo regulado **vigente** por producto (cruza por expediente: 30,1% del catálogo, esperable porque la regulación solo cubre mercados intervenidos).

## Diagrama de relaciones

```
                 principio activo (cascada exacto→fuzzy≥90)
Vitales (riesgo) ──────────────────────────┐
                                           ▼
                              CUM vigentes (catálogo)
                                 ▲ expediente        ▲ expediente
                                 │ (directo)          │ (directo)
             SISMED 2017-19 ─────┘                    └───── Precios Máximos 2024
```

## Actualización

`python -m src.data_pipeline.run_all` re-ingesta los 3 datasets SODA en vivo (con fallback a snapshots CSV locales) — programado semanalmente vía GitHub Actions (día 4).

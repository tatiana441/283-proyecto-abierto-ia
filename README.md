# 💊 MediWatch

### Plataforma de IA para monitorear disponibilidad, riesgo de desabastecimiento y precios de medicamentos en Colombia

**Proyecto del reto de salud — "Datos al Ecosistema 2026: Inteligencia Artificial para Colombia" (Nivel Avanzado)**

---

## Problema abordado

El desabastecimiento de medicamentos vitales afecta a pacientes, IPS y tomadores de decisión en Colombia. La información oficial existe (INVIMA, MinSalud, CNPMDM) pero está fragmentada en datasets separados y sin llaves comunes, lo que impide anticipar riesgos y comparar precios.

## Justificación (valor público)

MediWatch integra 4 fuentes oficiales de datos.gov.co en una sola plataforma consultable por cualquier ciudadano, con un score de riesgo de desabastecimiento interpretable, precios de referencia y un asistente conversacional con trazabilidad a los registros originales.

## Datasets utilizados (4 — todos de datos.gov.co)

| # | Dataset | Resource ID | Filas | Uso |
|---|---------|-------------|-------|-----|
| 1 | Código Único de Medicamentos Vigentes (INVIMA) | `i7cb-raxc` | ~157.000 | Catálogo maestro |
| 2 | Medicamentos Vitales No Disponibles (INVIMA) | `sdmr-tfmf` | ~10.500 | Motor del score de riesgo |
| 3 | SISMED — precios (compactado con Spark de ~23M a 3,7M filas) | histórico 2017-2019 | 3.685.617 | Histórico de precios |
| 4 | Precios Máximos de Venta por CUM (CNPMDM, Circular 19/2024) | `nauz-qkjw` | ~38.600 | Precio techo vigente |

Datasets externos: no aplica.

## Variables seleccionadas

Ver [docs/diccionario_datos.md](docs/diccionario_datos.md) *(día 2)*.

## Tipo de análisis

Predictivo (clasificación) + descriptivo. **Modelo:** score compuesto interpretable 0–100 + regresión logística de validación con backtest temporal *(día 2)*.

## Resultados clave

- Integración CUM↔Vitales sin llave directa (IUM 100% vacío): match por principio activo normalizado en cascada exacto → fuzzy (rapidfuzz ≥ 90). Métricas en [reports/metricas_integracion.json](reports/metricas_integracion.json).
- Métricas del modelo (AUC, precision@20): *(día 2)*.

## Interpretación · Impacto potencial · Limitaciones

*(se completan en docs/conclusiones.md — día 4)*

## 🚀 Solución en Producción (Demo en Vivo)

- **Aplicación Web:** *(URL Railway — día 4)*
- **Documentación de la API (Swagger):** *(URL/docs — día 4)*

## Reproducir localmente

```bash
pip install -r requirements.txt
# credenciales en .env (ver .env.example)
python -m src.data_pipeline.run_all        # pipeline completo: ingesta → limpieza → integración → carga
python -m pytest tests/ -v                 # tests
```

## Enlaces de acceso

- [Descargar presentación (.PPTX)](RECURSOS/Presentacion.pptx) *(día 4)*
- [Ver presentación en línea (.PDF)](RECURSOS/presentacion.pdf) *(día 4)*

## Equipo

| Nombre | Rol |
|--------|-----|
| Tatiana | Data / Backend / Coordinación |
| Liliana Forero | Frontend / UI-UX |
| Integrante 3 | Data Engineering (compactación Spark SISMED) |

## Licencia

MIT — ver [LICENSE](LICENSE).

# Reporte automático de riesgo de desabastecimiento — corte 2026-04

_Generado por MediWatch analyst_agent el 2026-07-05._

**Principios activos monitoreados:** 591  
**Distribución:** 48 críticos · 107 altos · 436 medios · 0 bajos

## Top 15 en riesgo

| # | Principio activo | Score | Nivel | Tendencia | Explicación |
|---|------------------|-------|-------|-----------|-------------|
| 1 | EVINACUMAB | 93.8 | critico | subiendo | En los últimos 12 meses registró 3 solicitudes de importación excepcional de 3 solicitantes; la última fue hace 0 meses |
| 2 | VOSORITIDA | 93.6 | critico | subiendo | En los últimos 12 meses registró 85 solicitudes de importación excepcional de 39 solicitantes; la última fue hace 0 meses |
| 3 | IDEBENONA | 92.3 | critico | subiendo | En los últimos 12 meses registró 16 solicitudes de importación excepcional de 11 solicitantes; la última fue hace 0 meses |
| 4 | ESTIRIPENTOL | 92.0 | critico | subiendo | En los últimos 12 meses registró 9 solicitudes de importación excepcional de 9 solicitantes; la última fue hace 0 meses |
| 5 | LIDOCAINA CLORHIDRATO | 89.7 | critico | subiendo | En los últimos 12 meses registró 61 solicitudes de importación excepcional de 19 solicitantes; la última fue hace 0 meses |
| 6 | GOLODIRSEN | 89.7 | critico | subiendo | En los últimos 12 meses registró 7 solicitudes de importación excepcional de 7 solicitantes; la última fue hace 0 meses |
| 7 | AZTREONAM | 88.9 | critico | subiendo | En los últimos 12 meses registró 15 solicitudes de importación excepcional de 11 solicitantes; la última fue hace 0 meses |
| 8 | CASIMERSEN | 88.8 | critico | subiendo | En los últimos 12 meses registró 7 solicitudes de importación excepcional de 5 solicitantes; la última fue hace 0 meses |
| 9 | TEPOTINIB | 87.2 | critico | subiendo | En los últimos 12 meses registró 3 solicitudes de importación excepcional de 3 solicitantes; la última fue hace 1 meses |
| 10 | SEPIAPTERINA | 87.1 | critico | subiendo | En los últimos 12 meses registró 9 solicitudes de importación excepcional de 3 solicitantes; la última fue hace 0 meses |
| 11 | NOREPINEFRINA | 86.8 | critico | subiendo | En los últimos 12 meses registró 25 solicitudes de importación excepcional de 16 solicitantes; la última fue hace 0 meses |
| 12 | ACIDO QUENODEOXICOLICO | 86.6 | critico | subiendo | En los últimos 12 meses registró 6 solicitudes de importación excepcional de 6 solicitantes; la última fue hace 0 meses |
| 13 | UBIDECARENONA (UBIQUINOL LIPOSOMAL) | 84.9 | critico | subiendo | En los últimos 12 meses registró 4 solicitudes de importación excepcional de 4 solicitantes; la última fue hace 0 meses |
| 14 | FELBAMATO | 84.7 | critico | subiendo | En los últimos 12 meses registró 6 solicitudes de importación excepcional de 5 solicitantes; la última fue hace 1 meses |
| 15 | AMIVANTAMAB | 84.2 | critico | subiendo | En los últimos 12 meses registró 5 solicitudes de importación excepcional de 5 solicitantes; la última fue hace 1 meses |

## Metodología
Score compuesto 0-100 (pesos en `config/risk_model_params.yaml`) sobre las autorizaciones
de importación excepcional de INVIMA (Medicamentos Vitales No Disponibles). Validación
predictiva: regresión logística con backtest temporal — ver `models/predictive/metrics.json`.
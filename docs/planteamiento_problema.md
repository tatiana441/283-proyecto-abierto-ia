# Planteamiento del problema

## Contexto

Colombia registra de forma recurrente episodios de desabastecimiento de medicamentos vitales. Cuando un medicamento vital no está disponible en el país, el INVIMA autoriza importaciones excepcionales — cada autorización queda registrada en el dataset público *Medicamentos Vitales No Disponibles*. Ese registro es, en la práctica, una señal directa de escasez: si un principio activo acumula solicitudes de importación excepcional, es porque el mercado local no lo está supliendo.

## Problema

La información oficial está fragmentada en datasets sin llaves comunes:

- El catálogo de medicamentos (CUM, INVIMA) no comparte identificador con las autorizaciones de vitales no disponibles — la columna IUM del CUM está **100% vacía** (hallazgo verificado de nuestro EDA).
- Los precios observados (SISMED) y los precios máximos regulados (CNPMDM) usan otras llaves y periodicidades.
- Ningún ciudadano, IPS o tomador de decisión puede responder fácilmente: *¿qué riesgo hay de que este medicamento escasee? ¿cuánto debería costar?*

## Pregunta orientadora

¿Es posible anticipar el riesgo de desabastecimiento de un principio activo y ofrecer información de precios confiable, integrando únicamente datos abiertos oficiales, en una plataforma consultable en lenguaje natural?

## Usuarios objetivo

1. **Pacientes y cuidadores**: consultar disponibilidad, riesgo y precios de referencia.
2. **IPS y farmacias**: anticipar compras ante señales de riesgo.
3. **Tomadores de decisión** (MinSalud, INVIMA): priorizar gestión de abastecimiento.

## Alcance de la solución

- Score de riesgo de desabastecimiento **interpretable** (0–100) por principio activo, validado con un modelo predictivo (regresión logística, backtest temporal).
- Integración de 4 datasets oficiales con metodología documentada y métricas de cruce honestas.
- Asistente conversacional que responde **solo con datos recuperados** y cita sus fuentes.
- Aplicación web pública con actualización automática semanal desde datos.gov.co.

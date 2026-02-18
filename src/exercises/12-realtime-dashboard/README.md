# Nivel 12 — Real-Time Dashboard

## 🎯 Problema de Negocio

Un dashboard de monitoreo con métricas que se actualizan cada N segundos vía polling. El polling debe pausarse cuando el usuario cambia de pestaña y reanudarse al volver.

**Extendiendo el nivel anterior:**
El Nivel 11 hizo fetching puntual. Aquí los datos cambian con el tiempo — polling, pausa inteligente, y refetch on demand.

## 📋 Requisitos (definidos por los tests)

1. Los datos se refrescan automáticamente (polling).
2. Polling se pausa con `document.hidden`.
3. Polling se reanuda al volver a la pestaña.
4. Botón "Refrescar" fuerza re-consulta.
5. Cambio de intervalo de polling dinámico.
6. Múltiples endpoints combinados en el dashboard.

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="12-realtime-dashboard"`
2. Implementa `metricsApi.js` y `RealtimeDashboard.jsx`.

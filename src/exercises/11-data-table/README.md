# Nivel 11 — Async Data Table

## 🎯 Problema de Negocio

Una tabla de usuarios tipo admin panel con paginación server-side, ordenamiento por columnas, búsqueda, caché inteligente y actualización automática al editar.

**El desafío:**
Cada endpoint necesitaría manejo manual de loading/error/cache, sin contar la invalidación al mutar datos. La solución debe automatizar el ciclo de vida de las peticiones y la gestión de caché.

## 📋 Requisitos (definidos por los tests)

1. Query con params `{ page, sort, search }`.
2. Loading → datos → render.
3. Cambio de página con caché (no re-fetch si ya visitada).
4. Ordenamiento por columnas envía parámetro correcto.
5. Búsqueda filtra server-side.
6. Al editar un usuario, la caché se invalida automáticamente.
7. Error de red muestra estado de error.

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="11-data-table"`
2. Implementa `usersApi.js` y `DataTable.jsx`.

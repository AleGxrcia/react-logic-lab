# Nivel 13 — Virtualized List

## 🎯 Problema de Negocio

Un feed de 10,000+ artículos donde cada re-render innecesario causa jank visible. Necesita filtrado por búsqueda y callbacks estables para bookmark.

**El desafío:**
Sin optimización, el filtro recalcula 10K items en cada render. Las funciones de callback se recrean y fuerzan re-renders masivos. Cada item se re-renderiza aunque sus props no cambien. La solución debe eliminar cálculos y renders innecesarios.

## 📋 Requisitos (definidos por los tests)

1. Renderiza correctamente con una lista grande.
2. Filtrado por búsqueda funciona correctamente.
3. Los items no afectados por un cambio no se re-renderizan.
4. `onBookmark` mantiene referencia estable entre renders.
5. Lista filtrada no se recalcula si las dependencias no cambian.

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="13-virtualized-list"`
2. Implementa `VirtualizedList.jsx` y `ArticleItem.jsx`.

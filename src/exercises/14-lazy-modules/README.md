# Nivel 14 — Lazy Module System

## 🎯 Problema de Negocio

Una aplicación con módulos pesados (Dashboard, Reports, Analytics, Settings) que no debe cargar todos al inicio. Cada módulo se carga solo cuando el usuario navega a él, con loading skeletons y error recovery.

**El problema:** Si el bundle incluye todo, el Time to Interactive es inaceptable. La carga bajo demanda por ruta es la solución.

## 📋 Requisitos (definidos por los tests)

1. Los módulos se renderizan correctamente después de cargar.
2. Mientras un módulo carga, se muestra un fallback visual.
3. Si la carga falla (error de red), se captura el error y se muestra una UI de error.
4. Un botón de retry permite reintentar la carga fallida.
5. Múltiples rutas cargan independientemente.
6. Cada módulo solo se carga al navegar a su ruta (no antes).

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="14-lazy-modules"`
2. Implementa `LazyApp.jsx` y `ErrorBoundary.jsx`.

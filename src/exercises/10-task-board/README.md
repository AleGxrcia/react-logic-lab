# Nivel 10 — Task Board (Kanban)

## 🎯 Problema de Negocio

Un tablero Kanban con 3 columnas (To Do, In Progress, Done) que necesita:
- CRUD de tareas con operaciones asíncronas.
- Mover tareas entre columnas.
- Filtrado por prioridad.
- Loading/error states por operación.

**El desafío:**
El estado es normalizado (tareas por ID), tiene operaciones async con 3 estados cada una (pending/fulfilled/rejected), necesita derivación de datos eficiente, y múltiples componentes leen/escriben el mismo estado. Las soluciones de estado local se quedan cortas ante esta complejidad.

## 📋 Requisitos (definidos por los tests)

1. Acciones: addTask, moveTask, deleteTask, setFilter.
2. Operaciones async: pending → API → fulfilled/rejected.
3. Consultas derivadas: tareas por columna, tareas filtradas.
4. Integración: crear → To Do → mover → In Progress.
5. Loading states en operaciones async.
6. Error handling si la API falla.

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="10-task-board"`
2. Implementa `taskSlice.js` y `TaskBoard.jsx`.

// taskSlice.js
// 📌 Nivel 10 — Task Board (Redux Toolkit Slice)
//
// Implementa un slice con:
//
// State shape:
//   { items: [], filter: 'all', loading: false, error: null }
//
// Reducers:
//   - addTask({ id, title, column, priority })
//   - moveTask({ id, column })
//   - deleteTask(id)
//   - setFilter(priority) — 'all' | 'high' | 'medium' | 'low'
//
// Async Thunk:
//   - createTaskAsync({ title, column, priority })
//     → Hace fetch POST (puedes usar la URL que quieras, será mockeada)
//     → pending: loading = true
//     → fulfilled: agrega la tarea, loading = false
//     → rejected: error = message, loading = false
//
// Selectores (exportados):
//   - selectTasksByColumn(state, column) — filtra items por columna
//   - selectFilteredTasks(state) — filtra items por el filtro activo
//
// ¡Haz que los tests pasen!

import { createSlice } from '@reduxjs/toolkit'

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {},
    reducers: {},
})

export default taskSlice.reducer

// Exporta actions
export const { addTask, moveTask, deleteTask, setFilter } = taskSlice.actions

// Exporta thunk
export function createTaskAsync() { }

// Exporta selectores
export function selectTasksByColumn() { }
export function selectFilteredTasks() { }

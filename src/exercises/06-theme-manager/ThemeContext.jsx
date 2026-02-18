// ThemeContext.jsx
// 📌 Nivel 06 — Theme Manager (Context)
//
// Implementa el ThemeProvider que:
// - Crea un Context para el tema.
// - Maneja estado interno: theme ('light' | 'dark').
// - Al montar, lee de localStorage('theme') si existe.
// - Si no hay localStorage, lee prefers-color-scheme del SO.
// - Si ninguno existe, usa 'light' como default.
// - Persiste en localStorage cada vez que el tema cambie.
// - Proporciona { theme, toggleTheme } a sus hijos vía Context.
//
// Exporta: ThemeProvider, ThemeContext
//
// ¡Haz que los tests pasen!

import { createContext } from 'react'

export const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
    // Tu código aquí
    return null
}

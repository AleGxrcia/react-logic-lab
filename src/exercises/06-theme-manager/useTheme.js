// useTheme.js
// 📌 Nivel 06 — Theme Manager (Custom Hook)
//
// Implementa un custom hook que:
// - Consume el ThemeContext.
// - Lanza un error si se usa fuera de ThemeProvider.
// - Retorna { theme, toggleTheme }.
//
// ¡Haz que los tests pasen!

import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export function useTheme() {
	const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return {
    theme: context.theme,
    toggleTheme: context.toggleTheme
  }
}

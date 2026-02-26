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

import { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(() => {
		try {
			const stored = localStorage.getItem('theme');
			return stored 
				? stored
				: window.matchMedia('(prefers-color-scheme: dark)').matches 
					? 'dark' 
					: 'light';
		} catch (error) {
      console.error('Error reading localStorage:', error);
      return 'light';
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem('theme', theme)
		} catch (error) {
			console.error('Error saving to localStorage:', error);
		}
	}, [theme])
	
	const toggleTheme = () => {
		setTheme((prev) =>  (prev === 'light' ? 'dark' : 'light'));
	}

	const value = {
		theme,
		toggleTheme
	}

	return (
		<ThemeContext.Provider value={value}>
			{children}
		</ThemeContext.Provider>
	);
}

# Nivel 06 — Theme Manager

## 🎯 Problema de Negocio

Una aplicación necesita un sistema de temas (light/dark) accesible desde cualquier componente, sin importar su profundidad en el árbol. Pasar `theme` y `toggleTheme` como props a través de componentes intermedios que no los necesitan es **prop drilling** — un antipatrón.

**Requisitos del producto:**
- Cualquier componente puede leer el tema actual.
- Cualquier componente puede cambiar el tema.
- La preferencia persiste en `localStorage`.
- Si no hay preferencia guardada, se respeta la del sistema operativo.

## 📋 Requisitos (definidos por los tests)

1. `ThemeProvider` proporciona el contexto a sus hijos.
2. Tema por defecto es `light`.
3. `useTheme()` retorna `{ theme, toggleTheme }`.
4. `toggleTheme()` alterna entre `light` y `dark`.
5. El tema se persiste en `localStorage`.
6. Al montar, lee de `localStorage` si existe.
7. Si no hay localStorage, respeta `prefers-color-scheme`.
8. Componente anidado profundamente puede leer y cambiar el tema.

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="06-theme-manager"`
2. Implementa `ThemeContext.jsx` y `useTheme.js`.

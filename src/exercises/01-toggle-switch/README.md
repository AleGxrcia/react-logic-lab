# Nivel 01 — Toggle Switch

## 🎯 Problema de Negocio

Un panel de configuración necesita interruptores on/off para controlar funcionalidades como notificaciones, modo oscuro y visibilidad del perfil.

**Cada toggle:**
- Funciona de forma independiente.
- Su estado visual debe reflejar exactamente su estado lógico.
- Debe aceptar un estado inicial configurable desde fuera.

## 📋 Requisitos (definidos por los tests)

1. Renderiza con el estado `OFF` por defecto.
2. Al hacer clic, cambia entre `ON` y `OFF`.
3. Muestra el texto correcto según el estado actual.
4. Acepta una prop `initialState` para configurar el estado inicial.
5. Múltiples toggles en la misma vista son independientes entre sí.

## 🚀 Instrucciones

1. Ejecuta los tests: `npm run test:watch -- --filter="01-toggle-switch"`
2. Observa todos los tests en **rojo** 🔴.
3. Abre `ToggleSwitch.jsx` e implementa la solución.
4. Haz que todos los tests pasen **uno por uno** 🟢.
5. Refactoriza si es necesario 🔵.

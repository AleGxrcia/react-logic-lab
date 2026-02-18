# Nivel 09 — Protected Dashboard

## 🎯 Problema de Negocio

Una aplicación multi-página necesita rutas públicas y protegidas con redirecciones automáticas, layouts compartidos, y carga de datos pre-render.

**Rutas:**
- Públicas: `/login`, `/register`, `/404`
- Protegidas: `/dashboard`, `/profile`, `/settings`

**Reglas:**
- Sin sesión → redirige a `/login`.
- Con sesión en `/login` → redirige a `/dashboard`.
- Las rutas protegidas comparten un layout con sidebar.
- El dashboard pre-carga datos del usuario antes de renderizar.
- Si la carga de datos falla, muestra un error boundary.

## 📋 Requisitos (definidos por los tests)

1. Ruta protegida redirige a `/login` si no hay sesión.
2. `/login` redirige a `/dashboard` si hay sesión activa.
3. Layout compartido en rutas protegidas.
4. Los datos se cargan antes del render de la página.
5. Error en la carga de datos muestra una UI de error.
6. Navegación entre rutas protegidas funciona.

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="09-protected-dashboard"`
2. Implementa los componentes de routing.

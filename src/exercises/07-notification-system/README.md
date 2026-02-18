# Nivel 07 — Notification System (Toast)

## 🎯 Problema de Negocio

Un sistema de notificaciones toast que permita dispararlas desde cualquier parte de la app. Las notificaciones se apilan, se auto-descartan, y su UI es personalizable.

**El desafío:**
El sistema necesita componentes que se comunican implícitamente: el `Provider` maneja el queue, el `List` renderiza, cada `Notification` controla su propio dismiss. La API debe ser declarativa y extensible.

## 📋 Requisitos (definidos por los tests)

1. `useNotify()` expone `notify({ type, message })`.
2. Tipos soportados: `success`, `error`, `warning`, `info`.
3. Las notificaciones se auto-descartan tras N ms.
4. Click en cerrar elimina la notificación inmediatamente.
5. Máximo configurable de notificaciones visibles.
6. Attributes ARIA correctos por tipo.
7. Nuevas notificaciones aparecen arriba de la pila.

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="07-notification"`
2. Implementa `NotificationProvider.jsx`, `useNotify.js`, y los componentes asociados.

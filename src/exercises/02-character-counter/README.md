# Nivel 02 — Character Counter

## 🎯 Problema de Negocio

Un campo de texto para publicaciones (estilo tweet) necesita mostrar al usuario cuántos caracteres le quedan, con retroalimentación visual en tiempo real.

**Requisitos del producto:**
- Contador de caracteres restantes actualizado en tiempo real.
- Cambio visual cuando quedan pocos caracteres (warning amarillo).
- Cambio visual cuando se excede el límite (error rojo).
- Botón de envío deshabilitado si el texto está vacío o excede el límite.
- Notificación al componente padre cuando se alcanza el límite.

## 📋 Requisitos (definidos por los tests)

1. Muestra `maxLength` como caracteres restantes al inicio.
2. Al escribir, actualiza el contador en tiempo real.
3. Aplica clase `warning` cuando quedan ≤ 20% de caracteres.
4. Aplica clase `error` cuando se excede el límite.
5. El botón de envío está deshabilitado si el texto está vacío.
6. El botón de envío está deshabilitado si se excede el límite.
7. Dispara `onSubmit` con el texto actual al enviar.
8. Dispara `onLimitReached` cuando se excede el límite.

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="02-character-counter"`
2. Implementa `CharacterCounter.jsx` para pasar todos los tests.

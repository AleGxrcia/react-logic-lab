# Nivel 04 — Multi-Step Form

## 🎯 Problema de Negocio

Un formulario de registro de usuario tiene 3 pasos con validación por paso, navegación bidireccional y envío final. Manejar 8+ campos, el paso actual, errores por paso y el estado de envío con múltiples `useState` se vuelve inmanejable.

**Pasos del formulario:**
1. **Datos personales:** nombre, email
2. **Dirección:** calle, ciudad, código postal
3. **Confirmación:** resumen de todos los datos + checkbox de términos

## 📋 Requisitos (definidos por los tests)

1. Inicia en el paso 1.
2. "Siguiente" avanza al paso 2 solo si los campos del paso 1 son válidos.
3. "Anterior" regresa al paso anterior manteniendo los datos ya escritos.
4. Validación: muestra errores si los campos están vacíos al intentar avanzar.
5. Paso 3 muestra resumen de todos los campos.
6. Envío solo habilitado si el checkbox de términos está marcado.
7. `onSubmit` se llama con todos los datos al enviar.

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="04-multi-step-form"`
2. Implementa `MultiStepForm.jsx` para pasar todos los tests.

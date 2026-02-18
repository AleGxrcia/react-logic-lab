# Nivel 05 — Shopping Cart

## 🎯 Problema de Negocio

Una tienda online necesita un carrito de compras con lógica de cálculo compleja: cantidades, subtotales, impuestos y descuentos. Esta lógica debe ser **reutilizable** en múltiples vistas (página de productos, sidebar, checkout).

**¿Por qué no basta con la lógica dentro del componente?**
Porque la misma lógica del carrito se necesita en 3 componentes distintos. Copiar la lógica sería duplicación. La solución debe permitir reutilización real.

## 📋 Requisitos (definidos por los tests)

1. `addItem`: agrega un producto o incrementa cantidad si ya existe.
2. `removeItem`: elimina un producto completamente.
3. `updateQuantity`: actualiza cantidad; elimina si llega a 0.
4. `totals`: calcula subtotal, impuestos (21%) y total.
5. `applyDiscount`: acepta porcentaje o monto fijo, no permite doble descuento.
6. `clearCart`: vacía el carrito.
7. La lógica funciona de forma aislada (testeable con `renderHook`).

## 🚀 Instrucciones

1. `npm run test:watch -- --filter="05-shopping-cart"`
2. Implementa `useCart.js` y `ShoppingCart.jsx` para pasar todos los tests.

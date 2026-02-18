// useCart.js
// 📌 Nivel 05 — Shopping Cart (Custom Hook)
//
// Implementa un custom hook que encapsule toda la lógica del carrito:
//
// Debe retornar:
//   - items: array de { id, name, price, quantity }
//   - addItem(product): agrega producto o incrementa cantidad
//   - removeItem(id): elimina producto
//   - updateQuantity(id, quantity): actualiza cantidad, elimina si qty <= 0
//   - applyDiscount({ type, value }): type = 'percentage' | 'fixed', no permite doble descuento
//   - clearCart(): vacía el carrito
//   - totals: { subtotal, tax, discount, total }
//     - tax = 21% del (subtotal - discount)
//     - total = (subtotal - discount) + tax
//
// Usa useReducer internamente para manejar el estado.
//
// ¡Haz que los tests pasen!

export function useCart() {
    // Tu código aquí
}

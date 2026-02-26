// ShoppingCart.jsx
// 📌 Nivel 05 — Shopping Cart (Componente)
//
// Implementa un componente que use el hook useCart para:
// - Mostrar "Carrito vacío" si no hay items.
// - Listar items con nombre, precio y cantidad.
// - Tener un botón "Eliminar" por cada item.
// - Mostrar el total en un elemento con data-testid="cart-total".
//
// Props opcionales:
//   - initialItems: array de items para inicializar el carrito
//
// ¡Haz que los tests pasen!

import { useCart } from "./useCart"

export default function ShoppingCart({ initialItems = [] }) {
	const { items, totals, removeItem } = useCart(initialItems);

  if (items.length === 0) return <p>Carrito vacío</p>;

	return (
    <div>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <span>{item.name}</span>
            <span>{item.price}</span>
            <span>{item.quantity}</span>
            <button onClick={() => removeItem(item.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <span data-testid="cart-total">{totals.total}</span>
    </div>
  )
}

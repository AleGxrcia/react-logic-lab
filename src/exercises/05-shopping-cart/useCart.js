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

import { useReducer } from "react";

const initialState = {
	items: [],
	discount: null
};

function reducer(state, action) {
	switch (action.type) {
		case 'addItem':
			const existingItem = state.items.find(item => item.id === action.payload.id);
			if (existingItem) {
				return {
					...state,
					items: state.items.map(item => 
						item.id === action.payload.id
							? { ...item, quantity: item.quantity + 1 } 
							: item
					)
				};
			}
			return {
				...state,
				items: [...state.items, action.payload]
			}
		case 'removeItem':
			return {
				...state,
				items: state.items.filter(item => item.id !== action.payload)
			}
		case 'updateQuantity':
			return {
				...state,
				items: action.payload.quantity <= 0
					? state.items.filter(item => item.id !== action.payload.id)
					: state.items.map(item => 
						item.id === action.payload.id
							? { ...item, quantity: action.payload.quantity }
							: item
						)
			}
		case 'applyDiscount':
			if (state.discount) return state;
			return {
				...state,
				discount: action.payload
			}
		case 'clearCart':
			return initialState;
		default:
			return state;
	}
}

export function useCart(initialItems = []) {
	const [state, dispatch] = useReducer(reducer, {
		...initialState,
		items: initialItems
	});

	const subtotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

	const discountAmount = state.discount
		? state.discount.type === 'percentage'
			? subtotal * (state.discount.value / 100)
			: state.discount.value
		: 0

	const afterDiscount = Math.max(0, subtotal - discountAmount);
	const tax = afterDiscount * 0.21;
	const total = afterDiscount + tax;
	
	const totals = { subtotal, tax, discount: discountAmount, total }

	return {
		items: state.items,
		totals,
		addItem: (product) => dispatch({ type: 'addItem' , payload: { ...product, quantity: 1 } }),
		removeItem: (id) => dispatch({ type: 'removeItem', payload: id }),
		updateQuantity: (id, quantity) => dispatch({ type: 'updateQuantity', payload: { id, quantity } }),
		applyDiscount: (discount) => dispatch({ type: 'applyDiscount', payload: discount }),
		clearCart: () => dispatch({ type: 'clearCart' }),
	}
}

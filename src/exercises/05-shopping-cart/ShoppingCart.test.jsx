import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useCart } from './useCart'
import ShoppingCart from './ShoppingCart'

// =====================================================
// PARTE 1: Tests del Custom Hook (lógica aislada)
// =====================================================
describe('useCart (hook)', () => {
    const mockProduct = { id: 1, name: 'Laptop', price: 999.99 }
    const mockProduct2 = { id: 2, name: 'Mouse', price: 29.99 }

    it('starts with an empty cart', () => {
        const { result } = renderHook(() => useCart())
        expect(result.current.items).toEqual([])
        expect(result.current.totals.subtotal).toBe(0)
    })

    it('adds an item to the cart', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addItem(mockProduct)
        })

        expect(result.current.items).toHaveLength(1)
        expect(result.current.items[0]).toMatchObject({
            id: 1,
            name: 'Laptop',
            price: 999.99,
            quantity: 1,
        })
    })

    it('increments quantity if the item already exists', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addItem(mockProduct)
            result.current.addItem(mockProduct)
        })

        expect(result.current.items).toHaveLength(1)
        expect(result.current.items[0].quantity).toBe(2)
    })

    it('removes an item completely', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addItem(mockProduct)
            result.current.addItem(mockProduct2)
        })

        act(() => {
            result.current.removeItem(1)
        })

        expect(result.current.items).toHaveLength(1)
        expect(result.current.items[0].id).toBe(2)
    })

    it('updates item quantity', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addItem(mockProduct)
        })

        act(() => {
            result.current.updateQuantity(1, 5)
        })

        expect(result.current.items[0].quantity).toBe(5)
    })

    it('removes item when quantity is updated to 0', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addItem(mockProduct)
        })

        act(() => {
            result.current.updateQuantity(1, 0)
        })

        expect(result.current.items).toHaveLength(0)
    })

    it('calculates subtotal correctly', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addItem(mockProduct) // 999.99
            result.current.addItem(mockProduct2) // 29.99
            result.current.updateQuantity(1, 2) // 999.99 * 2
        })

        // 999.99 * 2 + 29.99 = 2029.97
        expect(result.current.totals.subtotal).toBeCloseTo(2029.97, 2)
    })

    it('calculates tax at 21%', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addItem({ id: 1, name: 'Item', price: 100 })
        })

        expect(result.current.totals.tax).toBeCloseTo(21, 2)
    })

    it('calculates total as subtotal + tax', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addItem({ id: 1, name: 'Item', price: 100 })
        })

        expect(result.current.totals.total).toBeCloseTo(121, 2)
    })

    it('applies a percentage discount', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addItem({ id: 1, name: 'Item', price: 100 })
        })

        act(() => {
            result.current.applyDiscount({ type: 'percentage', value: 10 })
        })

        // Subtotal 100, discount 10% = 90, tax 21% of 90 = 18.9, total = 108.9
        expect(result.current.totals.subtotal).toBeCloseTo(100, 2)
        expect(result.current.totals.discount).toBeCloseTo(10, 2)
        expect(result.current.totals.total).toBeCloseTo(108.9, 2)
    })

    it('applies a fixed amount discount', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addItem({ id: 1, name: 'Item', price: 100 })
        })

        act(() => {
            result.current.applyDiscount({ type: 'fixed', value: 15 })
        })

        // Subtotal 100, discount 15, net = 85, tax 21% of 85 = 17.85, total = 102.85
        expect(result.current.totals.discount).toBeCloseTo(15, 2)
        expect(result.current.totals.total).toBeCloseTo(102.85, 2)
    })

    it('does NOT allow applying a second discount', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addItem({ id: 1, name: 'Item', price: 100 })
        })

        act(() => {
            result.current.applyDiscount({ type: 'percentage', value: 10 })
        })

        act(() => {
            result.current.applyDiscount({ type: 'fixed', value: 20 })
        })

        // The second discount should be ignored
        expect(result.current.totals.discount).toBeCloseTo(10, 2)
    })

    it('clears the cart completely', () => {
        const { result } = renderHook(() => useCart())

        act(() => {
            result.current.addItem(mockProduct)
            result.current.addItem(mockProduct2)
        })

        act(() => {
            result.current.clearCart()
        })

        expect(result.current.items).toEqual([])
        expect(result.current.totals.subtotal).toBe(0)
    })
})

// =====================================================
// PARTE 2: Test de integración (hook + componente)
// =====================================================
describe('ShoppingCart (component)', () => {
    it('renders an empty cart message when no items', () => {
        render(<ShoppingCart />)
        expect(screen.getByText(/carrito vacío/i)).toBeInTheDocument()
    })

    it('displays items with name, price, and quantity', () => {
        render(<ShoppingCart initialItems={[
            { id: 1, name: 'Laptop', price: 999.99, quantity: 1 },
        ]} />)

        expect(screen.getByText('Laptop')).toBeInTheDocument()
        expect(screen.getByText(/999\.99/)).toBeInTheDocument()
    })

    it('removes an item when the remove button is clicked', async () => {
        const user = userEvent.setup()
        render(<ShoppingCart initialItems={[
            { id: 1, name: 'Laptop', price: 999.99, quantity: 1 },
        ]} />)

        await user.click(screen.getByRole('button', { name: /eliminar/i }))

        expect(screen.getByText(/carrito vacío/i)).toBeInTheDocument()
    })

    it('displays the total cost', () => {
        render(<ShoppingCart initialItems={[
            { id: 1, name: 'Item', price: 100, quantity: 2 },
        ]} />)

        // subtotal: 200, tax: 42, total: 242
        expect(screen.getByTestId('cart-total')).toHaveTextContent('242')
    })
})

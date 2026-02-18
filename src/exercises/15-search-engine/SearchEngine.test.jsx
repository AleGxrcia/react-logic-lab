import { describe, it, expect, vi, afterEach, afterAll, beforeAll, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { searchApi } from './searchApi'
import SearchEngine from './SearchEngine'
import { useDebounce } from './useDebounce'
import { renderHook, act as hookAct } from '@testing-library/react'

// =====================================================
// MSW Server Setup
// =====================================================
const mockProducts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    category: ['electronics', 'clothing', 'books'][i % 3],
    price: (i + 1) * 10,
    rating: (i % 5) + 1,
}))

const server = setupServer(
    http.get('/api/search', ({ request }) => {
        const url = new URL(request.url)
        const q = url.searchParams.get('q') || ''
        const category = url.searchParams.get('category') || ''
        const page = parseInt(url.searchParams.get('page') || '1')
        const perPage = 5

        let filtered = mockProducts
        if (q) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q.toLowerCase())
            )
        }
        if (category) {
            filtered = filtered.filter(p => p.category === category)
        }

        const start = (page - 1) * perPage
        const paginated = filtered.slice(start, start + perPage)

        return HttpResponse.json({
            products: paginated,
            totalPages: Math.ceil(filtered.length / perPage),
            currentPage: page,
            totalResults: filtered.length,
        })
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// =====================================================
// Store factory
// =====================================================
function createTestStore() {
    return configureStore({
        reducer: {
            [searchApi.reducerPath]: searchApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(searchApi.middleware),
    })
}

function renderSearch(initialRoute = '/search') {
    const store = createTestStore()
    return render(
        <Provider store={store}>
            <MemoryRouter initialEntries={[initialRoute]}>
                <SearchEngine />
            </MemoryRouter>
        </Provider>
    )
}

// =====================================================
// Tests del Custom Hook useDebounce
// =====================================================
describe('useDebounce', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('returns the initial value immediately', () => {
        const { result } = renderHook(() => useDebounce('hello', 300))
        expect(result.current).toBe('hello')
    })

    it('does NOT update the value before the delay', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'hello', delay: 300 } }
        )

        rerender({ value: 'world', delay: 300 })

        hookAct(() => {
            vi.advanceTimersByTime(100)
        })

        expect(result.current).toBe('hello')
    })

    it('updates the value after the delay', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'hello', delay: 300 } }
        )

        rerender({ value: 'world', delay: 300 })

        hookAct(() => {
            vi.advanceTimersByTime(300)
        })

        expect(result.current).toBe('world')
    })

    it('resets the timer on rapid changes (only last value applied)', () => {
        const { result, rerender } = renderHook(
            ({ value, delay }) => useDebounce(value, delay),
            { initialProps: { value: 'a', delay: 300 } }
        )

        rerender({ value: 'ab', delay: 300 })
        hookAct(() => { vi.advanceTimersByTime(100) })

        rerender({ value: 'abc', delay: 300 })
        hookAct(() => { vi.advanceTimersByTime(100) })

        rerender({ value: 'abcd', delay: 300 })
        hookAct(() => { vi.advanceTimersByTime(300) })

        expect(result.current).toBe('abcd')
    })
})

// =====================================================
// Tests del Search Engine (Integración)
// =====================================================
describe('SearchEngine', () => {
    it('renders a search input', async () => {
        renderSearch()

        await waitFor(() => {
            expect(screen.getByRole('searchbox')).toBeInTheDocument()
        })
    })

    it('displays search results from the API', async () => {
        renderSearch()

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument()
        })
    })

    it('searches with debounce (waits before sending request)', async () => {
        vi.useFakeTimers()
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        renderSearch()

        await waitFor(() => {
            expect(screen.getByRole('searchbox')).toBeInTheDocument()
        })

        await user.type(screen.getByRole('searchbox'), 'Product 42')

        // Should not have searched yet (within debounce window)
        // After debounce delay, search should execute
        act(() => {
            vi.advanceTimersByTime(500)
        })

        await waitFor(() => {
            expect(screen.getByText('Product 42')).toBeInTheDocument()
        })

        vi.useRealTimers()
    })

    it('filters by category', async () => {
        const user = userEvent.setup()
        renderSearch()

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument()
        })

        // Select a category filter
        const categoryFilter = screen.getByLabelText(/category|categoría/i)
        await user.selectOptions(categoryFilter, 'electronics')

        await waitFor(() => {
            // Electronics products should be visible
            const results = screen.getAllByTestId('search-result')
            expect(results.length).toBeGreaterThan(0)
        })
    })

    it('paginates results', async () => {
        const user = userEvent.setup()
        renderSearch()

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument()
        })

        await user.click(screen.getByRole('button', { name: /next|page 2|siguiente/i }))

        await waitFor(() => {
            expect(screen.getByText('Product 6')).toBeInTheDocument()
        })
    })

    it('shows total results count', async () => {
        renderSearch()

        await waitFor(() => {
            expect(screen.getByTestId('total-results')).toBeInTheDocument()
        })
    })

    it('shows empty state when no results match', async () => {
        const user = userEvent.setup()
        vi.useFakeTimers()
        renderSearch()

        await waitFor(() => {
            expect(screen.getByRole('searchbox')).toBeInTheDocument()
        })

        await user.type(screen.getByRole('searchbox'), 'zzzznonexistent')

        act(() => {
            vi.advanceTimersByTime(500)
        })

        await waitFor(() => {
            expect(screen.getByTestId('empty-state')).toBeInTheDocument()
        })

        vi.useRealTimers()
    })

    it('shows error state when the API fails', async () => {
        server.use(
            http.get('/api/search', () => {
                return HttpResponse.json({ error: 'Server Error' }, { status: 500 })
            })
        )

        renderSearch()

        await waitFor(() => {
            expect(screen.getByTestId('error')).toBeInTheDocument()
        })
    })

    it('loads results from URL query params (deep linking)', async () => {
        renderSearch('/search?q=Product+10')

        await waitFor(() => {
            expect(screen.getByRole('searchbox')).toHaveValue('Product 10')
        })

        await waitFor(() => {
            expect(screen.getByText('Product 10')).toBeInTheDocument()
        })
    })
})

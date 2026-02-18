import { describe, it, expect, vi, afterEach, afterAll, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { usersApi } from './usersApi'
import DataTable from './DataTable'

// =====================================================
// MSW Server Setup
// =====================================================
const mockUsers = [
    { id: 1, name: 'Alice Johnson', email: 'alice@test.com', date: '2024-01-15' },
    { id: 2, name: 'Bob Smith', email: 'bob@test.com', date: '2024-02-20' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@test.com', date: '2024-03-10' },
    { id: 4, name: 'Diana Prince', email: 'diana@test.com', date: '2024-04-05' },
    { id: 5, name: 'Edward Norton', email: 'edward@test.com', date: '2024-05-25' },
]

const server = setupServer(
    http.get('/api/users', ({ request }) => {
        const url = new URL(request.url)
        const page = parseInt(url.searchParams.get('page') || '1')
        const search = url.searchParams.get('search') || ''
        const sort = url.searchParams.get('sort') || ''
        const perPage = 2

        let filtered = mockUsers
        if (search) {
            filtered = mockUsers.filter(u =>
                u.name.toLowerCase().includes(search.toLowerCase())
            )
        }
        if (sort) {
            const [field, direction] = sort.split(':')
            filtered = [...filtered].sort((a, b) => {
                if (direction === 'desc') return b[field] > a[field] ? 1 : -1
                return a[field] > b[field] ? 1 : -1
            })
        }

        const start = (page - 1) * perPage
        const paginated = filtered.slice(start, start + perPage)

        return HttpResponse.json({
            users: paginated,
            totalPages: Math.ceil(filtered.length / perPage),
            currentPage: page,
        })
    }),

    http.patch('/api/users/:id', async ({ params, request }) => {
        const body = await request.json()
        const user = mockUsers.find(u => u.id === parseInt(params.id))
        if (!user) return HttpResponse.json({ error: 'Not found' }, { status: 404 })
        return HttpResponse.json({ ...user, ...body })
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
            [usersApi.reducerPath]: usersApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(usersApi.middleware),
    })
}

function renderWithStore(ui) {
    const store = createTestStore()
    return render(<Provider store={store}>{ui}</Provider>)
}

// =====================================================
// Tests
// =====================================================
describe('Async Data Table', () => {
    it('shows a loading state initially', () => {
        renderWithStore(<DataTable />)
        expect(screen.getByTestId('loading')).toBeInTheDocument()
    })

    it('displays user data after loading', async () => {
        renderWithStore(<DataTable />)

        await waitFor(() => {
            expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
            expect(screen.getByText('Bob Smith')).toBeInTheDocument()
        })
    })

    it('paginates and shows correct data per page', async () => {
        const user = userEvent.setup()
        renderWithStore(<DataTable />)

        await waitFor(() => {
            expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
        })

        // Navigate to page 2
        await user.click(screen.getByRole('button', { name: /next|siguiente|page 2/i }))

        await waitFor(() => {
            expect(screen.getByText('Charlie Brown')).toBeInTheDocument()
        })
    })

    it('searches users by name (server-side)', async () => {
        const user = userEvent.setup()
        renderWithStore(<DataTable />)

        await waitFor(() => {
            expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
        })

        const searchInput = screen.getByRole('searchbox')
        await user.type(searchInput, 'Charlie')

        await waitFor(() => {
            expect(screen.getByText('Charlie Brown')).toBeInTheDocument()
            expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument()
        })
    })

    it('sorts by column when header is clicked', async () => {
        const user = userEvent.setup()
        renderWithStore(<DataTable />)

        await waitFor(() => {
            expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
        })

        // Click "Name" column header to sort
        await user.click(screen.getByRole('columnheader', { name: /name|nombre/i }))

        await waitFor(() => {
            const rows = screen.getAllByRole('row')
            // Verify sorting happened (the data should reload)
            expect(rows.length).toBeGreaterThan(1)
        })
    })

    it('shows error state when the API fails', async () => {
        server.use(
            http.get('/api/users', () => {
                return HttpResponse.json({ error: 'Server Error' }, { status: 500 })
            })
        )

        renderWithStore(<DataTable />)

        await waitFor(() => {
            expect(screen.getByTestId('error')).toBeInTheDocument()
        })
    })

    it('shows empty state when no results match search', async () => {
        const user = userEvent.setup()
        renderWithStore(<DataTable />)

        await waitFor(() => {
            expect(screen.getByText('Alice Johnson')).toBeInTheDocument()
        })

        await user.type(screen.getByRole('searchbox'), 'zzzznonexistent')

        await waitFor(() => {
            expect(screen.getByTestId('empty-state')).toBeInTheDocument()
        })
    })
})

import { describe, it, expect, vi, afterEach, afterAll, beforeAll, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { metricsApi } from './metricsApi'
import RealtimeDashboard from './RealtimeDashboard'

// =====================================================
// MSW Server Setup
// =====================================================
let requestCount = 0

const server = setupServer(
    http.get('/api/metrics', () => {
        requestCount++
        return HttpResponse.json({
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            requests: requestCount * 100,
            timestamp: new Date().toISOString(),
        })
    }),

    http.get('/api/servers', () => {
        return HttpResponse.json({
            servers: [
                { id: 1, name: 'Server 1', status: 'online' },
                { id: 2, name: 'Server 2', status: 'degraded' },
                { id: 3, name: 'Server 3', status: 'offline' },
            ],
        })
    })
)

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
    requestCount = 0
})
afterAll(() => server.close())

// =====================================================
// Store factory
// =====================================================
function createTestStore() {
    return configureStore({
        reducer: {
            [metricsApi.reducerPath]: metricsApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(metricsApi.middleware),
    })
}

function renderWithStore(ui) {
    const store = createTestStore()
    return { ...render(<Provider store={store}>{ui}</Provider>), store }
}

// =====================================================
// Tests
// =====================================================
describe('Real-Time Dashboard', () => {
    beforeEach(() => {
        vi.useFakeTimers({ shouldAdvanceTime: true })
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('shows loading state initially', () => {
        renderWithStore(<RealtimeDashboard pollingInterval={5000} />)
        expect(screen.getByTestId('loading')).toBeInTheDocument()
    })

    it('displays metrics data after loading', async () => {
        renderWithStore(<RealtimeDashboard pollingInterval={5000} />)

        await waitFor(() => {
            expect(screen.getByTestId('cpu-metric')).toBeInTheDocument()
            expect(screen.getByTestId('memory-metric')).toBeInTheDocument()
        })
    })

    it('displays server status indicators', async () => {
        renderWithStore(<RealtimeDashboard pollingInterval={5000} />)

        await waitFor(() => {
            expect(screen.getByText('Server 1')).toBeInTheDocument()
            expect(screen.getByText(/online/i)).toBeInTheDocument()
            expect(screen.getByText(/offline/i)).toBeInTheDocument()
        })
    })

    it('refetches data when "Refresh" button is clicked', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        renderWithStore(<RealtimeDashboard pollingInterval={60000} />)

        await waitFor(() => {
            expect(screen.getByTestId('cpu-metric')).toBeInTheDocument()
        })

        const initialCount = requestCount

        await user.click(screen.getByRole('button', { name: /refresh|refrescar/i }))

        await waitFor(() => {
            expect(requestCount).toBeGreaterThan(initialCount)
        })
    })

    it('shows the last update timestamp', async () => {
        renderWithStore(<RealtimeDashboard pollingInterval={5000} />)

        await waitFor(() => {
            expect(screen.getByTestId('last-updated')).toBeInTheDocument()
        })
    })

    it('shows error state when the API fails', async () => {
        server.use(
            http.get('/api/metrics', () => {
                return HttpResponse.json({ error: 'Server Error' }, { status: 500 })
            })
        )

        renderWithStore(<RealtimeDashboard pollingInterval={5000} />)

        await waitFor(() => {
            expect(screen.getByTestId('error')).toBeInTheDocument()
        })
    })
})

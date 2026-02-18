import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LazyApp from './LazyApp'
import ErrorBoundary from './ErrorBoundary'
import { Suspense } from 'react'

describe('Lazy Module System', () => {
    // --- Suspense & Lazy Loading ---
    it('shows a loading fallback while a lazy component loads', async () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <LazyApp />
            </MemoryRouter>
        )

        // Should show the loading skeleton/spinner
        expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()

        // After the lazy module loads, it should show the content
        await waitFor(() => {
            expect(screen.getByTestId('dashboard-module')).toBeInTheDocument()
        })
    })

    it('loads the Reports module lazily', async () => {
        render(
            <MemoryRouter initialEntries={['/reports']}>
                <LazyApp />
            </MemoryRouter>
        )

        expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByTestId('reports-module')).toBeInTheDocument()
        })
    })

    it('loads the Analytics module lazily', async () => {
        render(
            <MemoryRouter initialEntries={['/analytics']}>
                <LazyApp />
            </MemoryRouter>
        )

        expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByTestId('analytics-module')).toBeInTheDocument()
        })
    })

    it('loads the Settings module lazily', async () => {
        render(
            <MemoryRouter initialEntries={['/settings']}>
                <LazyApp />
            </MemoryRouter>
        )

        expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByTestId('settings-module')).toBeInTheDocument()
        })
    })

    it('navigates between lazy-loaded routes', async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <LazyApp />
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(screen.getByTestId('dashboard-module')).toBeInTheDocument()
        })

        await user.click(screen.getByRole('link', { name: /reports/i }))

        await waitFor(() => {
            expect(screen.getByTestId('reports-module')).toBeInTheDocument()
        })
    })
})

describe('ErrorBoundary', () => {
    // Suppress React error output for error boundary tests
    let consoleSpy

    beforeEach(() => {
        consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
    })

    it('renders children when there is no error', () => {
        render(
            <ErrorBoundary>
                <div data-testid="child">Hello</div>
            </ErrorBoundary>
        )

        expect(screen.getByTestId('child')).toBeInTheDocument()
    })

    it('renders error UI when a child throws', () => {
        function ThrowingComponent() {
            throw new Error('Test error')
        }

        render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>
        )

        expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
        expect(screen.getByText(/something went wrong|algo salió mal/i)).toBeInTheDocument()

        consoleSpy.mockRestore()
    })

    it('has a retry button in error state', () => {
        function ThrowingComponent() {
            throw new Error('Test error')
        }

        render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>
        )

        expect(screen.getByRole('button', { name: /retry|reintentar/i })).toBeInTheDocument()

        consoleSpy.mockRestore()
    })

    it('resets the error state when retry is clicked', async () => {
        const user = userEvent.setup()
        let shouldThrow = true

        function ConditionallyThrowingComponent() {
            if (shouldThrow) {
                throw new Error('Test error')
            }
            return <div data-testid="recovered">Recovered!</div>
        }

        render(
            <ErrorBoundary>
                <ConditionallyThrowingComponent />
            </ErrorBoundary>
        )

        expect(screen.getByTestId('error-boundary')).toBeInTheDocument()

        // Stop throwing before retry
        shouldThrow = false

        await user.click(screen.getByRole('button', { name: /retry|reintentar/i }))

        expect(screen.getByTestId('recovered')).toBeInTheDocument()

        consoleSpy.mockRestore()
    })
})

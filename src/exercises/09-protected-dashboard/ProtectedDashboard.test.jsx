import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import AppRouter from './AppRouter'
import { AuthProvider } from './AuthContext'

// Helper to render with specific route and auth state
function renderWithRouter(initialRoute = '/', isAuthenticated = false) {
    return render(
        <MemoryRouter initialEntries={[initialRoute]}>
            <AuthProvider initialAuth={isAuthenticated}>
                <AppRouter />
            </AuthProvider>
        </MemoryRouter>
    )
}

describe('Protected Dashboard', () => {
    // --- Route Protection ---
    it('redirects to /login when accessing /dashboard without auth', async () => {
        renderWithRouter('/dashboard', false)

        await waitFor(() => {
            expect(screen.getByTestId('login-page')).toBeInTheDocument()
        })
    })

    it('redirects to /login when accessing /profile without auth', async () => {
        renderWithRouter('/profile', false)

        await waitFor(() => {
            expect(screen.getByTestId('login-page')).toBeInTheDocument()
        })
    })

    it('redirects to /login when accessing /settings without auth', async () => {
        renderWithRouter('/settings', false)

        await waitFor(() => {
            expect(screen.getByTestId('login-page')).toBeInTheDocument()
        })
    })

    // --- Authenticated Redirects ---
    it('redirects from /login to /dashboard when authenticated', async () => {
        renderWithRouter('/login', true)

        await waitFor(() => {
            expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
        })
    })

    // --- Accessing Protected Routes ---
    it('renders the dashboard when authenticated', async () => {
        renderWithRouter('/dashboard', true)

        await waitFor(() => {
            expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
        })
    })

    it('renders the profile page when authenticated', async () => {
        renderWithRouter('/profile', true)

        await waitFor(() => {
            expect(screen.getByTestId('profile-page')).toBeInTheDocument()
        })
    })

    it('renders the settings page when authenticated', async () => {
        renderWithRouter('/settings', true)

        await waitFor(() => {
            expect(screen.getByTestId('settings-page')).toBeInTheDocument()
        })
    })

    // --- Layout ---
    it('renders a shared sidebar/layout in protected routes', async () => {
        renderWithRouter('/dashboard', true)

        await waitFor(() => {
            expect(screen.getByTestId('sidebar')).toBeInTheDocument()
        })
    })

    it('does NOT render sidebar on public routes', () => {
        renderWithRouter('/login', false)
        expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
    })

    // --- Public Routes ---
    it('renders the login page at /login', () => {
        renderWithRouter('/login', false)
        expect(screen.getByTestId('login-page')).toBeInTheDocument()
    })

    it('renders the register page at /register', () => {
        renderWithRouter('/register', false)
        expect(screen.getByTestId('register-page')).toBeInTheDocument()
    })

    it('renders a 404 page for unknown routes', () => {
        renderWithRouter('/unknown-route', false)
        expect(screen.getByTestId('not-found-page')).toBeInTheDocument()
    })

    // --- Navigation ---
    it('navigates between protected routes', async () => {
        const user = userEvent.setup()
        renderWithRouter('/dashboard', true)

        await waitFor(() => {
            expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
        })

        const profileLink = screen.getByRole('link', { name: /profile/i })
        await user.click(profileLink)

        await waitFor(() => {
            expect(screen.getByTestId('profile-page')).toBeInTheDocument()
        })
    })

    // --- Login Flow ---
    it('allows login and redirects to dashboard', async () => {
        const user = userEvent.setup()
        renderWithRouter('/login', false)

        await user.type(screen.getByLabelText(/email/i), 'user@test.com')
        await user.type(screen.getByLabelText(/password/i), 'password123')
        await user.click(screen.getByRole('button', { name: /login|iniciar sesión/i }))

        await waitFor(() => {
            expect(screen.getByTestId('dashboard-page')).toBeInTheDocument()
        })
    })
})

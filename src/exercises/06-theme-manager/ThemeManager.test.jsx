import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ThemeProvider } from './ThemeContext'
import { useTheme } from './useTheme'

// Helper component to test context consumption
function ThemeConsumer() {
    const { theme, toggleTheme } = useTheme()
    return (
        <div>
            <span data-testid="theme-value">{theme}</span>
            <button onClick={toggleTheme}>Toggle Theme</button>
        </div>
    )
}

// Deeply nested component
function DeeplyNested() {
    const { theme, toggleTheme } = useTheme()
    return (
        <div>
            <span data-testid="nested-theme">{theme}</span>
            <button onClick={toggleTheme}>Nested Toggle</button>
        </div>
    )
}

function DeepTree() {
    return (
        <div>
            <div>
                <div>
                    <DeeplyNested />
                </div>
            </div>
        </div>
    )
}

describe('Theme Manager', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.restoreAllMocks()
    })

    it('provides "light" as the default theme', () => {
        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        )
        expect(screen.getByTestId('theme-value')).toHaveTextContent('light')
    })

    it('toggles theme from light to dark', async () => {
        const user = userEvent.setup()
        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        )

        await user.click(screen.getByRole('button', { name: /toggle theme/i }))
        expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
    })

    it('toggles back to light when clicked twice', async () => {
        const user = userEvent.setup()
        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        )

        await user.click(screen.getByRole('button', { name: /toggle theme/i }))
        await user.click(screen.getByRole('button', { name: /toggle theme/i }))
        expect(screen.getByTestId('theme-value')).toHaveTextContent('light')
    })

    it('persists the theme in localStorage', async () => {
        const user = userEvent.setup()
        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        )

        await user.click(screen.getByRole('button', { name: /toggle theme/i }))
        expect(localStorage.getItem('theme')).toBe('dark')
    })

    it('reads theme from localStorage on mount', () => {
        localStorage.setItem('theme', 'dark')

        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        )

        expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
    })

    it('respects prefers-color-scheme when no localStorage value exists', () => {
        // Mock matchMedia to simulate dark mode preference
        window.matchMedia = vi.fn().mockImplementation((query) => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        }))

        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        )

        expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
    })

    it('localStorage has priority over prefers-color-scheme', () => {
        localStorage.setItem('theme', 'light')

        window.matchMedia = vi.fn().mockImplementation((query) => ({
            matches: query === '(prefers-color-scheme: dark)',
            media: query,
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
        }))

        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        )

        expect(screen.getByTestId('theme-value')).toHaveTextContent('light')
    })

    it('deeply nested component can read and toggle the theme', async () => {
        const user = userEvent.setup()
        render(
            <ThemeProvider>
                <DeepTree />
            </ThemeProvider>
        )

        expect(screen.getByTestId('nested-theme')).toHaveTextContent('light')

        await user.click(screen.getByRole('button', { name: /nested toggle/i }))
        expect(screen.getByTestId('nested-theme')).toHaveTextContent('dark')
    })

    it('throws an error if useTheme is used outside ThemeProvider', () => {
        // Suppress React error output for this test
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })

        expect(() => render(<ThemeConsumer />)).toThrow()

        consoleSpy.mockRestore()
    })
})

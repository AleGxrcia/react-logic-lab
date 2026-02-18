import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NotificationProvider } from './NotificationProvider'
import { useNotify } from './useNotify'

// Test helper component
function NotifyTrigger({ type = 'success', message = 'Test notification' }) {
    const { notify } = useNotify()
    return (
        <button onClick={() => notify({ type, message })}>
            Trigger {type}
        </button>
    )
}

function TestApp({ maxNotifications = 5, autoDismissMs = 3000, children }) {
    return (
        <NotificationProvider maxNotifications={maxNotifications} autoDismissMs={autoDismissMs}>
            {children || <NotifyTrigger />}
        </NotificationProvider>
    )
}

describe('Notification System', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('renders without any notifications initially', () => {
        render(<TestApp />)
        expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it('shows a notification when notify() is called', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        render(<TestApp />)

        await user.click(screen.getByText(/trigger success/i))

        expect(screen.getByText('Test notification')).toBeInTheDocument()
    })

    it('displays the correct type via role/aria', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        render(
            <TestApp>
                <NotifyTrigger type="error" message="Something went wrong" />
            </TestApp>
        )

        await user.click(screen.getByText(/trigger error/i))

        const notification = screen.getByRole('alert')
        expect(notification).toBeInTheDocument()
        expect(notification).toHaveAttribute('data-type', 'error')
    })

    it('supports all four notification types', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        render(
            <TestApp>
                <NotifyTrigger type="success" message="Saved" />
                <NotifyTrigger type="error" message="Failed" />
                <NotifyTrigger type="warning" message="Careful" />
                <NotifyTrigger type="info" message="FYI" />
            </TestApp>
        )

        await user.click(screen.getByText(/trigger success/i))
        await user.click(screen.getByText(/trigger error/i))
        await user.click(screen.getByText(/trigger warning/i))
        await user.click(screen.getByText(/trigger info/i))

        expect(screen.getByText('Saved')).toBeInTheDocument()
        expect(screen.getByText('Failed')).toBeInTheDocument()
        expect(screen.getByText('Careful')).toBeInTheDocument()
        expect(screen.getByText('FYI')).toBeInTheDocument()
    })

    it('auto-dismisses notifications after the configured timeout', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        render(<TestApp autoDismissMs={2000} />)

        await user.click(screen.getByText(/trigger success/i))
        expect(screen.getByText('Test notification')).toBeInTheDocument()

        act(() => {
            vi.advanceTimersByTime(2100)
        })

        expect(screen.queryByText('Test notification')).not.toBeInTheDocument()
    })

    it('dismisses a notification immediately when close button is clicked', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        render(<TestApp />)

        await user.click(screen.getByText(/trigger success/i))
        expect(screen.getByText('Test notification')).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: /close|cerrar|dismiss/i }))
        expect(screen.queryByText('Test notification')).not.toBeInTheDocument()
    })

    it('limits visible notifications to maxNotifications', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        render(
            <TestApp maxNotifications={2}>
                <NotifyTrigger type="success" message="First" />
            </TestApp>
        )

        await user.click(screen.getByText(/trigger success/i))
        await user.click(screen.getByText(/trigger success/i))
        await user.click(screen.getByText(/trigger success/i))

        const alerts = screen.getAllByRole('alert')
        expect(alerts.length).toBeLessThanOrEqual(2)
    })

    it('new notifications appear at the top of the list', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        render(
            <TestApp>
                <NotifyTrigger type="success" message="First" />
                <NotifyTrigger type="error" message="Second" />
            </TestApp>
        )

        await user.click(screen.getByText(/trigger success/i))
        await user.click(screen.getByText(/trigger error/i))

        const alerts = screen.getAllByRole('alert')
        expect(alerts[0]).toHaveTextContent('Second')
        expect(alerts[1]).toHaveTextContent('First')
    })
})

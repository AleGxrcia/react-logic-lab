import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Timer from './Timer'

describe('Timer', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('shows 0 as the initial time', () => {
        render(<Timer />)
        expect(screen.getByTestId('time-display')).toHaveTextContent('0')
    })

    it('starts counting when Start is clicked', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        render(<Timer />)

        await user.click(screen.getByRole('button', { name: /start/i }))

        act(() => {
            vi.advanceTimersByTime(3000)
        })

        expect(screen.getByTestId('time-display')).toHaveTextContent('3')
    })

    it('pauses the timer without resetting', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        render(<Timer />)

        await user.click(screen.getByRole('button', { name: /start/i }))

        act(() => {
            vi.advanceTimersByTime(5000)
        })

        await user.click(screen.getByRole('button', { name: /pause/i }))

        act(() => {
            vi.advanceTimersByTime(3000) // more time passes, but timer is paused
        })

        expect(screen.getByTestId('time-display')).toHaveTextContent('5')
    })

    it('resumes from paused time when Start is clicked again', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        render(<Timer />)

        await user.click(screen.getByRole('button', { name: /start/i }))
        act(() => {
            vi.advanceTimersByTime(3000)
        })

        await user.click(screen.getByRole('button', { name: /pause/i }))
        await user.click(screen.getByRole('button', { name: /start/i }))

        act(() => {
            vi.advanceTimersByTime(2000)
        })

        expect(screen.getByTestId('time-display')).toHaveTextContent('5')
    })

    it('resets to 0 and stops the timer', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        render(<Timer />)

        await user.click(screen.getByRole('button', { name: /start/i }))
        act(() => {
            vi.advanceTimersByTime(5000)
        })

        await user.click(screen.getByRole('button', { name: /reset/i }))
        expect(screen.getByTestId('time-display')).toHaveTextContent('0')

        // Ensure it stays at 0 after reset
        act(() => {
            vi.advanceTimersByTime(3000)
        })
        expect(screen.getByTestId('time-display')).toHaveTextContent('0')
    })

    it('cleans up the interval on unmount (no memory leak)', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        const { unmount } = render(<Timer />)

        await user.click(screen.getByRole('button', { name: /start/i }))
        act(() => {
            vi.advanceTimersByTime(2000)
        })

        const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
        unmount()

        expect(clearIntervalSpy).toHaveBeenCalled()
        clearIntervalSpy.mockRestore()
    })

    it('does not create duplicate intervals on multiple Start clicks', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        render(<Timer />)

        await user.click(screen.getByRole('button', { name: /start/i }))
        await user.click(screen.getByRole('button', { name: /start/i }))
        await user.click(screen.getByRole('button', { name: /start/i }))

        act(() => {
            vi.advanceTimersByTime(1000)
        })

        // If duplicate intervals existed, the count would be 3 instead of 1
        expect(screen.getByTestId('time-display')).toHaveTextContent('1')
    })

    it('formats time display with minutes and seconds for larger values', async () => {
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
        render(<Timer />)

        await user.click(screen.getByRole('button', { name: /start/i }))
        act(() => {
            vi.advanceTimersByTime(65000) // 65 seconds = 1:05
        })

        expect(screen.getByTestId('time-display')).toHaveTextContent('1:05')
    })
})

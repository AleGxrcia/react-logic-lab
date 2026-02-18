import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import ToggleSwitch from './ToggleSwitch'

describe('ToggleSwitch', () => {
    it('renders with OFF state by default', () => {
        render(<ToggleSwitch />)
        expect(screen.getByText('OFF')).toBeInTheDocument()
        expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
    })

    it('toggles to ON when clicked', async () => {
        const user = userEvent.setup()
        render(<ToggleSwitch />)

        const button = screen.getByRole('button')
        await user.click(button)

        expect(screen.getByText('ON')).toBeInTheDocument()
        expect(button).toHaveAttribute('aria-pressed', 'true')
    })

    it('toggles back to OFF when clicked twice', async () => {
        const user = userEvent.setup()
        render(<ToggleSwitch />)

        const button = screen.getByRole('button')
        await user.click(button)
        await user.click(button)

        expect(screen.getByText('OFF')).toBeInTheDocument()
        expect(button).toHaveAttribute('aria-pressed', 'false')
    })

    it('accepts an initialState prop', () => {
        render(<ToggleSwitch initialState={true} />)
        expect(screen.getByText('ON')).toBeInTheDocument()
        expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
    })

    it('renders a label when provided', () => {
        render(<ToggleSwitch label="Dark Mode" />)
        expect(screen.getByText('Dark Mode')).toBeInTheDocument()
    })

    it('multiple toggles are independent', async () => {
        const user = userEvent.setup()
        render(
            <div>
                <ToggleSwitch label="Notifications" />
                <ToggleSwitch label="Dark Mode" />
            </div>
        )

        const buttons = screen.getAllByRole('button')
        await user.click(buttons[0])

        // First toggle is ON
        expect(buttons[0]).toHaveAttribute('aria-pressed', 'true')
        // Second toggle remains OFF
        expect(buttons[1]).toHaveAttribute('aria-pressed', 'false')
    })
})

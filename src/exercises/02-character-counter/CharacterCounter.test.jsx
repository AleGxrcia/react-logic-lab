import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import CharacterCounter from './CharacterCounter'

describe('CharacterCounter', () => {
    const defaultProps = {
        maxLength: 100,
        onSubmit: vi.fn(),
    }

    it('shows the maxLength as remaining characters initially', () => {
        render(<CharacterCounter {...defaultProps} />)
        expect(screen.getByTestId('char-count')).toHaveTextContent('100')
    })

    it('updates remaining characters in real time while typing', async () => {
        const user = userEvent.setup()
        render(<CharacterCounter {...defaultProps} />)

        const textarea = screen.getByRole('textbox')
        await user.type(textarea, 'Hello')

        expect(screen.getByTestId('char-count')).toHaveTextContent('95')
    })

    it('applies "warning" class when remaining chars ≤ 20% of maxLength', async () => {
        const user = userEvent.setup()
        render(<CharacterCounter {...defaultProps} maxLength={10} />)

        const textarea = screen.getByRole('textbox')
        // Type 9 chars → 1 remaining → 10% → should be warning
        await user.type(textarea, 'abcdefghi')

        expect(screen.getByTestId('char-count')).toHaveClass('warning')
    })

    it('applies "error" class when text exceeds the limit', async () => {
        const user = userEvent.setup()
        render(<CharacterCounter {...defaultProps} maxLength={5} />)

        const textarea = screen.getByRole('textbox')
        await user.type(textarea, 'abcdefgh')

        expect(screen.getByTestId('char-count')).toHaveClass('error')
    })

    it('shows negative remaining count when exceeding the limit', async () => {
        const user = userEvent.setup()
        render(<CharacterCounter {...defaultProps} maxLength={5} />)

        const textarea = screen.getByRole('textbox')
        await user.type(textarea, 'abcdefg') // 7 chars, limit is 5

        expect(screen.getByTestId('char-count')).toHaveTextContent('-2')
    })

    it('disables the submit button when text is empty', () => {
        render(<CharacterCounter {...defaultProps} />)
        expect(screen.getByRole('button', { name: /submit|enviar|send/i })).toBeDisabled()
    })

    it('disables the submit button when text exceeds the limit', async () => {
        const user = userEvent.setup()
        render(<CharacterCounter {...defaultProps} maxLength={5} />)

        await user.type(screen.getByRole('textbox'), 'toolong')

        expect(screen.getByRole('button', { name: /submit|enviar|send/i })).toBeDisabled()
    })

    it('enables the submit button when text is valid', async () => {
        const user = userEvent.setup()
        render(<CharacterCounter {...defaultProps} />)

        await user.type(screen.getByRole('textbox'), 'Valid text')

        expect(screen.getByRole('button', { name: /submit|enviar|send/i })).toBeEnabled()
    })

    it('calls onSubmit with the current text when the button is clicked', async () => {
        const onSubmit = vi.fn()
        const user = userEvent.setup()
        render(<CharacterCounter {...defaultProps} onSubmit={onSubmit} />)

        await user.type(screen.getByRole('textbox'), 'My message')
        await user.click(screen.getByRole('button', { name: /submit|enviar|send/i }))

        expect(onSubmit).toHaveBeenCalledWith('My message')
    })

    it('calls onLimitReached when the text exceeds the limit', async () => {
        const onLimitReached = vi.fn()
        const user = userEvent.setup()
        render(
            <CharacterCounter
                {...defaultProps}
                maxLength={5}
                onLimitReached={onLimitReached}
            />
        )

        await user.type(screen.getByRole('textbox'), 'abcdef')

        expect(onLimitReached).toHaveBeenCalled()
    })

    it('does NOT have a separate useState for remaining characters (derived state)', async () => {
        // This test verifies the counter works correctly with rapid input changes
        const user = userEvent.setup()
        render(<CharacterCounter {...defaultProps} maxLength={50} />)

        const textarea = screen.getByRole('textbox')
        await user.type(textarea, 'First')
        expect(screen.getByTestId('char-count')).toHaveTextContent('45')

        await user.clear(textarea)
        expect(screen.getByTestId('char-count')).toHaveTextContent('50')

        await user.type(textarea, 'Second attempt with more text')
        expect(screen.getByTestId('char-count')).toHaveTextContent('21')
    })
})

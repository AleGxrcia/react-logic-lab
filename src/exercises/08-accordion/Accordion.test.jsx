import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Accordion from './Accordion'

describe('Accordion', () => {
    const renderAccordion = (props = {}) => {
        return render(
            <Accordion {...props}>
                <Accordion.Item id="item-1">
                    <Accordion.Header>Section 1</Accordion.Header>
                    <Accordion.Panel>Content for section 1</Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item id="item-2">
                    <Accordion.Header>Section 2</Accordion.Header>
                    <Accordion.Panel>Content for section 2</Accordion.Panel>
                </Accordion.Item>
                <Accordion.Item id="item-3">
                    <Accordion.Header>Section 3</Accordion.Header>
                    <Accordion.Panel>Content for section 3</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        )
    }

    // --- Basic Behavior ---
    it('renders all headers', () => {
        renderAccordion()
        expect(screen.getByText('Section 1')).toBeInTheDocument()
        expect(screen.getByText('Section 2')).toBeInTheDocument()
        expect(screen.getByText('Section 3')).toBeInTheDocument()
    })

    it('panels are hidden by default', () => {
        renderAccordion()
        expect(screen.queryByText('Content for section 1')).not.toBeVisible()
        expect(screen.queryByText('Content for section 2')).not.toBeVisible()
    })

    it('opens a panel when its header is clicked', async () => {
        const user = userEvent.setup()
        renderAccordion()

        await user.click(screen.getByText('Section 1'))
        expect(screen.getByText('Content for section 1')).toBeVisible()
    })

    it('closes an open panel when its header is clicked again', async () => {
        const user = userEvent.setup()
        renderAccordion()

        await user.click(screen.getByText('Section 1'))
        await user.click(screen.getByText('Section 1'))
        expect(screen.queryByText('Content for section 1')).not.toBeVisible()
    })

    // --- Exclusive Mode (default) ---
    it('closes other panels when opening one (exclusive mode)', async () => {
        const user = userEvent.setup()
        renderAccordion()

        await user.click(screen.getByText('Section 1'))
        expect(screen.getByText('Content for section 1')).toBeVisible()

        await user.click(screen.getByText('Section 2'))
        expect(screen.getByText('Content for section 2')).toBeVisible()
        expect(screen.queryByText('Content for section 1')).not.toBeVisible()
    })

    // --- Multiple Mode ---
    it('allows multiple panels open simultaneously (allowMultiple)', async () => {
        const user = userEvent.setup()
        renderAccordion({ allowMultiple: true })

        await user.click(screen.getByText('Section 1'))
        await user.click(screen.getByText('Section 2'))

        expect(screen.getByText('Content for section 1')).toBeVisible()
        expect(screen.getByText('Content for section 2')).toBeVisible()
    })

    // --- ARIA ---
    it('sets aria-expanded on headers', async () => {
        const user = userEvent.setup()
        renderAccordion()

        const header = screen.getByText('Section 1')
        expect(header.closest('button')).toHaveAttribute('aria-expanded', 'false')

        await user.click(header)
        expect(header.closest('button')).toHaveAttribute('aria-expanded', 'true')
    })

    it('sets aria-controls and links header to panel', () => {
        renderAccordion()
        const header = screen.getByText('Section 1').closest('button')
        const controlsId = header.getAttribute('aria-controls')
        expect(controlsId).toBeTruthy()
        expect(document.getElementById(controlsId)).toBeInTheDocument()
    })

    // --- Keyboard Navigation ---
    it('toggles panel with Enter key', async () => {
        const user = userEvent.setup()
        renderAccordion()

        const header = screen.getByText('Section 1').closest('button')
        header.focus()
        await user.keyboard('{Enter}')

        expect(screen.getByText('Content for section 1')).toBeVisible()
    })

    it('toggles panel with Space key', async () => {
        const user = userEvent.setup()
        renderAccordion()

        const header = screen.getByText('Section 1').closest('button')
        header.focus()
        await user.keyboard(' ')

        expect(screen.getByText('Content for section 1')).toBeVisible()
    })

    it('navigates between headers with ArrowDown/ArrowUp', async () => {
        const user = userEvent.setup()
        renderAccordion()

        const headers = screen.getAllByRole('button')
        headers[0].focus()

        await user.keyboard('{ArrowDown}')
        expect(headers[1]).toHaveFocus()

        await user.keyboard('{ArrowDown}')
        expect(headers[2]).toHaveFocus()

        await user.keyboard('{ArrowUp}')
        expect(headers[1]).toHaveFocus()
    })

    // --- Render Props ---
    it('supports render prop in Header for custom rendering', async () => {
        const user = userEvent.setup()
        render(
            <Accordion>
                <Accordion.Item id="item-rp">
                    <Accordion.Header>
                        {({ isOpen }) => (
                            <span data-testid="custom-header">
                                {isOpen ? '▼ Open' : '▶ Closed'}
                            </span>
                        )}
                    </Accordion.Header>
                    <Accordion.Panel>Custom content</Accordion.Panel>
                </Accordion.Item>
            </Accordion>
        )

        expect(screen.getByTestId('custom-header')).toHaveTextContent('▶ Closed')

        await user.click(screen.getByTestId('custom-header'))
        expect(screen.getByTestId('custom-header')).toHaveTextContent('▼ Open')
    })
})

import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import MultiStepForm from './MultiStepForm'

describe('MultiStepForm', () => {
    const fillStep1 = async (user) => {
        await user.type(screen.getByLabelText(/nombre/i), 'Juan Pérez')
        await user.type(screen.getByLabelText(/email/i), 'juan@example.com')
    }

    const fillStep2 = async (user) => {
        await user.type(screen.getByLabelText(/calle/i), 'Av. Principal 123')
        await user.type(screen.getByLabelText(/ciudad/i), 'Madrid')
        await user.type(screen.getByLabelText(/código postal/i), '28001')
    }

    it('renders step 1 initially', () => {
        render(<MultiStepForm onSubmit={vi.fn()} />)
        expect(screen.getByText(/paso 1/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })

    it('shows step indicator (e.g. "Paso 1 de 3")', () => {
        render(<MultiStepForm onSubmit={vi.fn()} />)
        expect(screen.getByText(/paso 1 de 3/i)).toBeInTheDocument()
    })

    it('does NOT advance to step 2 if fields are empty', async () => {
        const user = userEvent.setup()
        render(<MultiStepForm onSubmit={vi.fn()} />)

        await user.click(screen.getByRole('button', { name: /siguiente/i }))

        // Still on step 1
        expect(screen.getByText(/paso 1/i)).toBeInTheDocument()
        // Shows error messages
        expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument()
        expect(screen.getByText(/email es requerido/i)).toBeInTheDocument()
    })

    it('advances to step 2 when step 1 fields are valid', async () => {
        const user = userEvent.setup()
        render(<MultiStepForm onSubmit={vi.fn()} />)

        await fillStep1(user)
        await user.click(screen.getByRole('button', { name: /siguiente/i }))

        expect(screen.getByText(/paso 2 de 3/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/calle/i)).toBeInTheDocument()
    })

    it('goes back to step 1 and preserves the data', async () => {
        const user = userEvent.setup()
        render(<MultiStepForm onSubmit={vi.fn()} />)

        await fillStep1(user)
        await user.click(screen.getByRole('button', { name: /siguiente/i }))
        await user.click(screen.getByRole('button', { name: /anterior/i }))

        expect(screen.getByText(/paso 1 de 3/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/nombre/i)).toHaveValue('Juan Pérez')
        expect(screen.getByLabelText(/email/i)).toHaveValue('juan@example.com')
    })

    it('does NOT advance from step 2 if fields are empty', async () => {
        const user = userEvent.setup()
        render(<MultiStepForm onSubmit={vi.fn()} />)

        await fillStep1(user)
        await user.click(screen.getByRole('button', { name: /siguiente/i }))
        await user.click(screen.getByRole('button', { name: /siguiente/i }))

        expect(screen.getByText(/paso 2 de 3/i)).toBeInTheDocument()
        expect(screen.getByText(/calle es requerido/i)).toBeInTheDocument()
    })

    it('reaches step 3 (confirmation) when steps 1 and 2 are valid', async () => {
        const user = userEvent.setup()
        render(<MultiStepForm onSubmit={vi.fn()} />)

        await fillStep1(user)
        await user.click(screen.getByRole('button', { name: /siguiente/i }))
        await fillStep2(user)
        await user.click(screen.getByRole('button', { name: /siguiente/i }))

        expect(screen.getByText(/paso 3 de 3/i)).toBeInTheDocument()
        // Summary of all fields
        expect(screen.getByText('Juan Pérez')).toBeInTheDocument()
        expect(screen.getByText('juan@example.com')).toBeInTheDocument()
        expect(screen.getByText('Av. Principal 123')).toBeInTheDocument()
        expect(screen.getByText('Madrid')).toBeInTheDocument()
        expect(screen.getByText('28001')).toBeInTheDocument()
    })

    it('disables submit button if terms checkbox is not checked', async () => {
        const user = userEvent.setup()
        render(<MultiStepForm onSubmit={vi.fn()} />)

        await fillStep1(user)
        await user.click(screen.getByRole('button', { name: /siguiente/i }))
        await fillStep2(user)
        await user.click(screen.getByRole('button', { name: /siguiente/i }))

        expect(screen.getByRole('button', { name: /enviar/i })).toBeDisabled()
    })

    it('calls onSubmit with all form data when submitted', async () => {
        const onSubmit = vi.fn()
        const user = userEvent.setup()
        render(<MultiStepForm onSubmit={onSubmit} />)

        await fillStep1(user)
        await user.click(screen.getByRole('button', { name: /siguiente/i }))
        await fillStep2(user)
        await user.click(screen.getByRole('button', { name: /siguiente/i }))

        await user.click(screen.getByLabelText(/acepto los términos/i))
        await user.click(screen.getByRole('button', { name: /enviar/i }))

        expect(onSubmit).toHaveBeenCalledWith({
            nombre: 'Juan Pérez',
            email: 'juan@example.com',
            calle: 'Av. Principal 123',
            ciudad: 'Madrid',
            codigoPostal: '28001',
        })
    })
})

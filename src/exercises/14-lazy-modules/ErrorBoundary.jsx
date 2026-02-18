// ErrorBoundary.jsx
// 📌 Nivel 14 — Error Boundary (Class Component)
//
// Implementa un Error Boundary que:
// - Captura errores de sus hijos vía componentDidCatch / getDerivedStateFromError.
// - En estado normal, renderiza {children}.
// - En estado de error, renderiza:
//   - Un contenedor con data-testid="error-boundary"
//   - Un mensaje: "Something went wrong" o "Algo salió mal"
//   - Un botón "Retry" / "Reintentar" que resetea el estado de error
//
// NOTA: Los Error Boundaries DEBEN ser class components en React.
//
// ¡Haz que los tests pasen!

import { Component } from 'react'

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    // Tu código aquí

    render() {
        return this.props.children
    }
}

// AuthContext.jsx
// 📌 Nivel 09 — Protected Dashboard (Auth Context)
//
// Implementa un AuthProvider que:
// - Maneja estado de autenticación { isAuthenticated, user }.
// - Proporciona login(email, password) y logout().
// - Acepta prop `initialAuth` para testing.
// - login() simplificado: acepta cualquier email/password y autentica.
//
// Exporta: AuthProvider, useAuth
//
// ¡Haz que los tests pasen!

import { createContext, useContext } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    // Tu código aquí
    return null
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}

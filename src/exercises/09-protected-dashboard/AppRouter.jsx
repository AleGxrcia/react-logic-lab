// AppRouter.jsx
// 📌 Nivel 09 — Protected Dashboard (Router)
//
// Implementa el router de la aplicación con:
//
// Rutas públicas:
//   - /login     → LoginPage (data-testid="login-page")
//   - /register  → RegisterPage (data-testid="register-page")
//   - *          → NotFoundPage (data-testid="not-found-page")
//
// Rutas protegidas (requieren autenticación):
//   - /dashboard → DashboardPage (data-testid="dashboard-page")
//   - /profile   → ProfilePage (data-testid="profile-page")
//   - /settings  → SettingsPage (data-testid="settings-page")
//
// Reglas:
//   - Si no autenticado → redirige a /login
//   - Si autenticado y en /login → redirige a /dashboard
//   - Rutas protegidas comparten un layout con sidebar (data-testid="sidebar")
//   - El sidebar debe contener links a las rutas protegidas
//
// Usa el AuthContext para verificar autenticación.
// Puedes definir todos los componentes de página como simples divs con testid.
//
// ¡Haz que los tests pasen!

export default function AppRouter() {
    // Tu código aquí
    return null
}

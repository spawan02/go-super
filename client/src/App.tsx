'use client'

import { useAuth } from './hooks/useAuth'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/AppRoute'
import { Toaster } from 'sonner'

function App() {
  const { user, loading, handleLogin, handleLogout } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <>
      <Router>
        <AppRoutes user={user} onLogin={handleLogin} onLogout={handleLogout} />
      </Router>
      <Toaster />
    </>
  )
}

export default App

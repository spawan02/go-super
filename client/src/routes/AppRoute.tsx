import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../components/Login'
import Register from '../components/Register'
import Dashboard from '../components/Dashboard'
import { User } from '../types'

interface Props {
  user: User | null
  onLogin: (user: User, token: string) => void
  onLogout: () => void
}

const AppRoutes = ({ user, onLogin, onLogout }: Props) => {
  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login onLogin={onLogin} />}
      />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route
        path="/dashboard"
        element={user ? <Dashboard user={user} onLogout={onLogout} /> : <Navigate to="/login" />}
      />
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
    </Routes>
  )
}

export default AppRoutes

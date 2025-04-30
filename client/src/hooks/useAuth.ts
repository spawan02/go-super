import { useEffect, useState } from "react"
import api from "../api/axios"
import { User } from "../types"
import { showLoginSuccess, showLogout } from "../utils/toastUtils"

interface getRoute {
    user: User
}
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const validateUser = async () => {
      try {
        const res = await api.get<getRoute>("/auth/validate")
        setUser(res.data.user)
      } catch (err) {
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    const token = localStorage.getItem("token")
    if (token) {
      validateUser()
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = (userData: User, token: string) => {
    localStorage.setItem("token", token)
    setUser(userData)
    showLoginSuccess(userData.email)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    showLogout()
  }

  return { user, loading, handleLogin, handleLogout }
}

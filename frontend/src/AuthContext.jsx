import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from './api'

const AuthContext = createContext(null)

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // true while we check a saved token against the server
  const [loading, setLoading] = useState(() => !!localStorage.getItem('token'))

  useEffect(() => {
    if (!localStorage.getItem('token')) return
    api.me()
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  // api.js fires this event when the server says the token is no longer valid
  useEffect(() => {
    const onLogout = () => {
      localStorage.removeItem('token')
      setUser(null)
    }
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password)
    localStorage.setItem('token', res.token)
    setUser(res.user)
    return res.user
  }, [])

  const register = useCallback(async (name, email, password) => {
    const res = await api.register(name, email, password)
    localStorage.setItem('token', res.token)
    setUser(res.user)
    return res.user
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
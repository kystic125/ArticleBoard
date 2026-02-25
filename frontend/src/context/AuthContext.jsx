import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [userId, setUserId] = useState(() => {
    const stored = localStorage.getItem('userId')
    return stored ? Number(stored) : null
  })
  const [role, setRole] = useState(() => localStorage.getItem('role'))

  const login = useCallback((tokenValue) => {
    const payload = decodeJwtPayload(tokenValue)
    const userIdValue = payload?.userId ?? null
    const roleValue = payload?.role ?? null
    localStorage.setItem('token', tokenValue)
    if (userIdValue !== null) {
      localStorage.setItem('userId', String(userIdValue))
    }
    if (roleValue !== null) {
      localStorage.setItem('role', roleValue)
    }
    setToken(tokenValue)
    setUserId(userIdValue)
    setRole(roleValue)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    setToken(null)
    setUserId(null)
    setRole(null)
  }, [])

  const isAuthenticated = Boolean(token)

  return (
    <AuthContext.Provider value={{ token, userId, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

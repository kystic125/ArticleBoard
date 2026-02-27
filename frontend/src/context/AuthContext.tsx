import { useMemo } from 'react'

import { useUserStore } from '@/stores/userStore'

type AuthContextValue = {
  token: string | null
  userId: number | null
  role: string | null
  isAuthenticated: boolean
  login: (accessToken: string) => void
  logout: () => void
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useAuth() {
  const token = useUserStore((state) => state.accessToken)
  const userId = useUserStore((state) => state.userId)
  const role = useUserStore((state) => state.role)
  const loginToStore = useUserStore((state) => state.login)
  const clearAuth = useUserStore((state) => state.clearAuth)

  return useMemo<AuthContextValue>(
    () => ({
      token,
      userId,
      role,
      isAuthenticated: Boolean(token),
      login: (accessToken: string) => loginToStore(accessToken),
      logout: clearAuth,
    }),
    [token, userId, role, loginToStore, clearAuth]
  )
}

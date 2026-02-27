import { create } from 'zustand'

type UserState = {
  accessToken: string | null
  userId: number | null
  role: string | null
  setAccessToken: (accessToken: string) => void
  login: (accessToken: string) => void
  clearAuth: () => void
}

function decodeJwtPayload(token: string): { userId?: number; role?: string } | null {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

function applyToken(accessToken: string) {
  const payload = decodeJwtPayload(accessToken)
  return {
    accessToken,
    userId: payload?.userId ?? null,
    role: payload?.role ?? null,
  }
}

export const useUserStore = create<UserState>((set) => ({
  accessToken: null,
  userId: null,
  role: null,
  setAccessToken: (accessToken) => set(() => applyToken(accessToken)),
  login: (accessToken) => set(() => applyToken(accessToken)),
  clearAuth: () =>
    set(() => ({
      accessToken: null,
      userId: null,
      role: null,
    })),
}))

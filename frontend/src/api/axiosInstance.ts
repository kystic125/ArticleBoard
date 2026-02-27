import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { useUserStore } from '@/stores/userStore'

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean }

const axiosInstance = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const token = useUserStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingRequests: Array<(newToken: string) => void> = []

function onRefreshed(newToken: string) {
  pendingRequests.forEach((callback) => callback(newToken))
  pendingRequests = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined
    const isAuthRequest =
      originalRequest?.url?.includes('/api/auth/login') ||
      originalRequest?.url?.includes('/api/auth/refresh')

    if (error.response?.status === 401 && !isAuthRequest && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(axiosInstance(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshResponse = await axiosInstance.post('/api/auth/refresh')

        const { accessToken } = refreshResponse.data as {
          accessToken: string
        }

        useUserStore.getState().setAccessToken(accessToken)

        onRefreshed(accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axiosInstance(originalRequest)
      } catch {
        clearAuthAndRedirect()
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

function clearAuthAndRedirect() {
  useUserStore.getState().clearAuth()
  window.location.href = '/login'
}

export default axiosInstance

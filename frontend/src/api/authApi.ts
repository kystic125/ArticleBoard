import axiosInstance from '@/api/axiosInstance'

export const login = (username: string, password: string) =>
  axiosInstance.post('/api/auth/login', { username, password })

export const register = (
  userName: string,
  userPassword: string,
  nickname: string,
  nicknameType: 'FIXED' | 'TEMPORARY'
) =>
  axiosInstance.post('/api/users/register', {
    userName,
    userPassword,
    nicknameType,
    nickname,
  })

export const logout = () => axiosInstance.post('/api/auth/logout')

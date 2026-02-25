import axiosInstance from './axiosInstance'

export const login = (username, password) =>
  axiosInstance.post('/api/auth/login', { username, password })

export const register = (userName, userPassword, nickname, nicknameType) =>
  axiosInstance.post('/api/users/register', {
    userName,
    userPassword,
    nicknameType,
    nickname,
  })

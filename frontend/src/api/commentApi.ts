import axiosInstance from '@/api/axiosInstance'

export const getComments = (articleId: string | number, page = 0, size = 20) =>
  axiosInstance.get('/api/comments', { params: { articleId, page, size } })

export const createComment = (articleId: string | number, content: string) =>
  axiosInstance.post('/api/comments', { content }, { params: { articleId } })

export const createReply = (commentId: string | number, content: string) =>
  axiosInstance.post(`/api/comments/${commentId}/reply`, { content })

export const updateComment = (commentId: string | number, content: string) =>
  axiosInstance.put(`/api/comments/${commentId}`, { content })

export const deleteComment = (commentId: string | number) =>
  axiosInstance.delete(`/api/comments/${commentId}`)

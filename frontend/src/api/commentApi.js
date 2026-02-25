import axiosInstance from './axiosInstance'

export const getComments = (articleId, page = 0, size = 20) =>
  axiosInstance.get('/api/comments', { params: { articleId, page, size } })

export const createComment = (articleId, content) =>
  axiosInstance.post('/api/comments', { content }, { params: { articleId } })

export const createReply = (commentId, content) =>
  axiosInstance.post(`/api/comments/${commentId}/reply`, { content })

export const updateComment = (commentId, content) =>
  axiosInstance.put(`/api/comments/${commentId}`, { content })

export const deleteComment = (commentId) =>
  axiosInstance.delete(`/api/comments/${commentId}`)

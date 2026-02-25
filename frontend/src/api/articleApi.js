import axiosInstance from './axiosInstance'

export const getArticleList = (page = 0, size = 10) =>
  axiosInstance.get('/api/articles', { params: { page, size } })

export const getArticle = (id) =>
  axiosInstance.get(`/api/articles/${id}`)

export const createArticle = (title, content, isNotice = false) =>
  axiosInstance.post('/api/articles', { title, content, isNotice })

export const updateArticle = (id, title, content, isNotice = false) =>
  axiosInstance.put(`/api/articles/${id}`, { title, content, isNotice })

export const deleteArticle = (id) =>
  axiosInstance.delete(`/api/articles/${id}`)

export const searchArticles = (type, keyword, page = 0, size = 10) =>
  axiosInstance.get('/api/articles/search', { params: { type, keyword, page, size } })

export const increaseViewCount = (id) =>
  axiosInstance.post(`/api/articles/${id}/view`)

export const toggleNotice = (id) =>
  axiosInstance.patch(`/api/articles/${id}/notice`)

export const bumpArticle = (id) =>
  axiosInstance.patch(`/api/articles/${id}/bump`)

export const resetPopular = (id) =>
  axiosInstance.patch(`/api/articles/${id}/unpopular`)

export const adminDeleteArticle = (id) =>
  axiosInstance.delete(`/api/articles/${id}/admin`)

export const toggleLike = (id) =>
  axiosInstance.post(`/api/articles/${id}/votes/like`)

export const toggleDislike = (id) =>
  axiosInstance.post(`/api/articles/${id}/votes/dislike`)

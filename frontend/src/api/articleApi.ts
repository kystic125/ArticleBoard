import axiosInstance from '@/api/axiosInstance'

export const getArticleList = (page = 0, size = 10) =>
  axiosInstance.get('/api/articles', { params: { page, size, sort: 'updatedAt,desc' } })

export const getArticle = (id: string | number) => axiosInstance.get(`/api/articles/${id}`)

export const createArticle = (title: string, content: string, isNotice = false) =>
  axiosInstance.post('/api/articles', { title, content, isNotice })

export const updateArticle = (id: string | number, title: string, content: string, isNotice = false) =>
  axiosInstance.put(`/api/articles/${id}`, { title, content, isNotice })

export const deleteArticle = (id: string | number) => axiosInstance.delete(`/api/articles/${id}`)

export const searchArticles = (type: string, keyword: string, page = 0, size = 10) =>
  axiosInstance.get('/api/articles/search', { params: { type, keyword, page, size, sort: 'updatedAt,desc' } })

export const increaseViewCount = (id: string | number) => axiosInstance.post(`/api/articles/${id}/view`)

export const toggleNotice = (id: string | number) => axiosInstance.patch(`/api/articles/${id}/notice`)

export const bumpArticle = (id: string | number) => axiosInstance.patch(`/api/articles/${id}/bump`)

export const resetPopular = (id: string | number) => axiosInstance.patch(`/api/articles/${id}/unpopular`)

export const adminDeleteArticle = (id: string | number) => axiosInstance.delete(`/api/articles/${id}/admin`)

export const toggleLike = (id: string | number) => axiosInstance.post(`/api/articles/${id}/votes/like`)

export const toggleDislike = (id: string | number) => axiosInstance.post(`/api/articles/${id}/votes/dislike`)

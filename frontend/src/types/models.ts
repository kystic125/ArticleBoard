export type Article = {
  articleId: number
  userId: number
  title: string
  content: string
  writer: string
  createdAt: string
  updatedAt?: string
  viewCount: number
  likeCount: number
  dislikeCount: number
  isNotice: boolean
  isPopular: boolean
}

export type Comment = {
  commentId: number
  userId: number
  articleId: number
  parentId: number | null
  rootId: number | null
  writer: string
  content: string
  isDeleted: boolean
  createdAt: string
}

export type PagedResponse<T> = {
  content: T[]
  number: number
  totalPages: number
}

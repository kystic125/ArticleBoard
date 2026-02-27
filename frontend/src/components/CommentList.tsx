import { useEffect, useMemo, useState } from 'react'

import { createComment, getComments } from '@/api/commentApi'
import CommentItem from '@/components/CommentItem'
import Pagination from '@/components/Pagination'
import { useAuth } from '@/context/AuthContext'
import type { Comment, PagedResponse } from '@/types/models'

type CommentListProps = {
  articleId: string
}

export default function CommentList({ articleId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [newComment, setNewComment] = useState('')
  const { isAuthenticated } = useAuth()

  const fetchComments = async (pageNum = 0) => {
    try {
      const res = await getComments(articleId, pageNum)
      const data = res.data as PagedResponse<Comment>
      setComments(data.content)
      setTotalPages(data.totalPages)
      setPage(data.number)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchComments(page)
  }, [page])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      await createComment(articleId, newComment)
      setNewComment('')
      fetchComments(0)
    } catch (err: any) {
      alert(err.response?.data?.message || '댓글 작성에 실패했습니다.')
    }
  }

  const writerMap: Record<number, string> = {}
  comments.forEach((c) => {
    writerMap[c.commentId] = c.writer
  })

  const roots = useMemo(() => comments.filter((c) => c.rootId === null), [comments])

  const repliesMap = useMemo(() => {
    const map: Record<number, Comment[]> = {}
    comments
      .filter((c) => c.rootId !== null)
      .forEach((reply) => {
        const rootId = reply.rootId as number
        if (!map[rootId]) map[rootId] = []
        map[rootId].push(reply)
      })
    return map
  }, [comments])

  return (
    <section className='card border border-base-300 bg-base-100 shadow-sm'>
      <div className='card-body gap-4 p-5 md:p-6'>
        <div className='flex flex-wrap items-center justify-between gap-2 border-b border-base-300 pb-3'>
          <h3 className='text-xl font-bold'>댓글</h3>
          <span className='badge badge-outline'>총 {comments.length}개</span>
        </div>

        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className='rounded-box border border-base-300 bg-base-200 p-3'>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className='textarea textarea-bordered textarea-primary w-full bg-base-100'
              placeholder='댓글을 입력하세요 (최대 150자)'
              rows={3}
              maxLength={150}
            />
            <div className='mt-2 flex items-center justify-between'>
              <span className='text-xs text-base-content/60'>{newComment.length}/150</span>
              <button type='submit' className='btn btn-primary btn-sm'>댓글 등록</button>
            </div>
          </form>
        ) : (
          <div className='alert alert-info py-2 text-sm'>로그인 후 댓글과 답글을 작성할 수 있습니다.</div>
        )}

        <div className='divide-y divide-base-300'>
          {roots.length === 0 ? (
            <p className='py-8 text-center text-base-content/60'>아직 댓글이 없습니다.</p>
          ) : (
            roots.map((comment) => (
              <CommentItem
                key={comment.commentId}
                comment={comment}
                replies={repliesMap[comment.commentId] || []}
                writerMap={writerMap}
                onRefresh={() => fetchComments(page)}
              />
            ))
          )}
        </div>

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  adminDeleteArticle,
  bumpArticle,
  deleteArticle,
  getArticle,
  increaseViewCount,
  resetPopular,
  toggleDislike,
  toggleLike,
  toggleNotice,
} from '@/api/articleApi'
import CommentList from '@/components/CommentList'
import { useAuth } from '@/context/AuthContext'
import type { Article } from '@/types/models'

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, userId, role } = useAuth()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const viewCountIncreased = useRef(false)

  const isManager = role === 'MANAGER'

  const fetchArticle = async () => {
    if (!id) return
    try {
      const res = await getArticle(id)
      setArticle(res.data as Article)
    } catch {
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!id) return
    if (!viewCountIncreased.current) {
      viewCountIncreased.current = true
      increaseViewCount(id).catch(() => undefined)
    }
    fetchArticle()
  }, [id])

  const handleDelete = async () => {
    if (!id || !window.confirm('삭제하시겠습니까?')) return
    try {
      await deleteArticle(id)
      navigate('/')
    } catch (err: any) {
      alert(err.response?.data?.message || '삭제에 실패했습니다.')
    }
  }

  const handleAdminDelete = async () => {
    if (!id || !window.confirm('삭제하시겠습니까?')) return
    try {
      await adminDeleteArticle(id)
      navigate('/')
    } catch (err: any) {
      alert(err.response?.data?.message || '삭제에 실패했습니다.')
    }
  }

  const handleToggleNotice = async () => {
    if (!id || !article) return
    const msg = article.isNotice ? '공지를 해제하시겠습니까?' : '공지로 등록하시겠습니까?'
    if (!window.confirm(msg)) return
    try {
      await toggleNotice(id)
      fetchArticle()
    } catch (err: any) {
      alert(err.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const handleBump = async () => {
    if (!id || !window.confirm('끌올하시겠습니까?')) return
    try {
      await bumpArticle(id)
      fetchArticle()
    } catch (err: any) {
      alert(err.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const handleResetPopular = async () => {
    if (!id || !window.confirm('인기글을 해제하시겠습니까?')) return
    try {
      await resetPopular(id)
      fetchArticle()
    } catch (err: any) {
      alert(err.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const handleLike = async () => {
    if (!id) return
    try {
      await toggleLike(id)
      fetchArticle()
    } catch (err: any) {
      alert(err.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const handleDislike = async () => {
    if (!id) return
    try {
      await toggleDislike(id)
      fetchArticle()
    } catch (err: any) {
      alert(err.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleString('ko-KR')
  }

  if (loading) {
    return (
      <div className='card border border-base-300 bg-base-100'>
        <div className='card-body items-center gap-3 py-16'>
          <span className='loading loading-dots loading-lg text-primary' />
          <p className='text-base-content/70'>게시글을 불러오는 중입니다.</p>
        </div>
      </div>
    )
  }

  if (!article || !id) return null

  const isOwner = isAuthenticated && userId === article.userId
  const isOther = isAuthenticated && !isOwner

  return (
    <div className='space-y-5'>
      <article className='card overflow-hidden border border-base-300 bg-base-100 shadow-sm'>
        <div className='card-body gap-5 p-6 md:p-8'>
          <header className='space-y-4 border-b border-base-300 pb-4'>
            <div className='flex flex-wrap items-start justify-between gap-3'>
              <div className='space-y-2'>
                <div className='flex flex-wrap items-center gap-2'>
                  {article.isNotice && <span className='badge badge-info'>공지</span>}
                  {article.isPopular && <span className='badge badge-warning'>인기</span>}
                </div>
                <h1 className='text-2xl font-black leading-tight md:text-3xl'>{article.title}</h1>
              </div>

              <div className='join join-vertical sm:join-horizontal'>
                {isOwner && (
                  <>
                    <button
                      onClick={() => navigate(`/articles/${id}/edit`)}
                      className='btn btn-sm join-item'
                      title='수정'
                      aria-label='수정'
                    >
                      ✏️
                    </button>
                    <button
                      onClick={handleDelete}
                      className='btn btn-error btn-sm btn-outline join-item'
                      title='삭제'
                      aria-label='삭제'
                    >
                      🗑️
                    </button>
                    {isManager && (
                      <button
                        onClick={handleToggleNotice}
                        className='btn btn-info btn-sm btn-outline join-item'
                        title={article.isNotice ? '공지 해제' : '공지 지정'}
                        aria-label={article.isNotice ? '공지 해제' : '공지 지정'}
                      >
                        {article.isNotice ? '📌' : '📍'}
                      </button>
                    )}
                  </>
                )}

                {isManager && isOther && (
                  <>
                    <button
                      onClick={handleBump}
                      className='btn btn-secondary btn-sm btn-outline join-item'
                      title='끌올'
                      aria-label='끌올'
                    >
                      ⬆️
                    </button>
                    <button
                      onClick={handleAdminDelete}
                      className='btn btn-error btn-sm btn-outline join-item'
                      title='강제 삭제'
                      aria-label='강제 삭제'
                    >
                      🚫
                    </button>
                    <button
                      onClick={handleToggleNotice}
                      className='btn btn-info btn-sm btn-outline join-item'
                      title={article.isNotice ? '공지 해제' : '공지 지정'}
                      aria-label={article.isNotice ? '공지 해제' : '공지 지정'}
                    >
                      {article.isNotice ? '📌' : '📍'}
                    </button>
                    {article.isPopular && (
                      <button
                        onClick={handleResetPopular}
                        className='btn btn-warning btn-sm btn-outline join-item'
                        title='인기 해제'
                        aria-label='인기 해제'
                      >
                        🔥
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className='grid gap-2 text-sm text-base-content/70 md:grid-cols-3'>
              <div className='rounded-box bg-base-200 px-3 py-2'>작성자: {article.writer}</div>
              <div className='rounded-box bg-base-200 px-3 py-2'>작성일: {formatDate(article.createdAt)}</div>
              <div className='rounded-box bg-base-200 px-3 py-2'>조회수: {article.viewCount}</div>
            </div>
          </header>

          <section className='prose max-w-none whitespace-pre-wrap leading-8 text-base-content'>
            {article.content}
          </section>

          <footer className='space-y-3 border-t border-base-300 pt-4'>
            <div className='mx-auto w-full max-w-xl'>
              <div className='join grid w-full grid-cols-2 rounded-xl border border-base-300 bg-base-200'>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login')
                      return
                    }
                    handleLike()
                  }}
                  className='btn join-item h-14 rounded-none border-0 bg-transparent text-base-content hover:bg-success/15'
                >
                  <span className='text-2xl leading-none'>👍</span>
                  <span className='ml-3 text-3xl font-black text-success'>{article.likeCount}</span>
                </button>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login')
                      return
                    }
                    handleDislike()
                  }}
                  className='btn join-item h-14 rounded-none border-l border-base-300 bg-transparent text-base-content hover:bg-error/15'
                >
                  <span className='text-2xl leading-none'>👎</span>
                  <span className='ml-3 text-3xl font-black text-error'>{article.dislikeCount}</span>
                </button>
              </div>
            </div>

            <div className='flex justify-end'>
              <button onClick={() => navigate('/')} className='btn btn-ghost btn-sm'>목록으로</button>
            </div>
          </footer>
        </div>
      </article>

      <CommentList articleId={id} />
    </div>
  )
}

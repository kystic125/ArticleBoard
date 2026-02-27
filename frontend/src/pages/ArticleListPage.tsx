import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getArticleList, searchArticles } from '@/api/articleApi'
import ArticleCard from '@/components/ArticleCard'
import Pagination from '@/components/Pagination'
import { useAuth } from '@/context/AuthContext'
import type { Article, PagedResponse } from '@/types/models'

const SEARCH_TYPES = [
  { value: 'title', label: '제목' },
  { value: 'content', label: '내용' },
  { value: 'title-content', label: '제목+내용' },
  { value: 'writer', label: '작성자' },
] as const

type SearchState = {
  type: string
  keyword: string
}

export default function ArticleListPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchType, setSearchType] = useState<string>('title')
  const [keyword, setKeyword] = useState('')
  const [activeSearch, setActiveSearch] = useState<SearchState | null>(null)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const fetchArticles = async (pageNum: number) => {
    setLoading(true)
    try {
      let res
      if (activeSearch) {
        res = await searchArticles(activeSearch.type, activeSearch.keyword, pageNum)
      } else {
        res = await getArticleList(pageNum)
      }
      const data = res.data as PagedResponse<Article>
      setArticles(data.content)
      setTotalPages(data.totalPages)
      setPage(data.number)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles(page)
  }, [page, activeSearch])

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!keyword.trim()) {
      setActiveSearch(null)
    } else {
      setActiveSearch({ type: searchType, keyword: keyword.trim() })
    }
    setPage(0)
  }

  const handleReset = () => {
    setKeyword('')
    setActiveSearch(null)
    setPage(0)
  }

  return (
    <div className='space-y-5'>
      <section className='hero overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm'>
        <div className='hero-content w-full p-6 md:p-8'>
          <div className='w-full space-y-5'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h1 className='text-2xl font-black tracking-tight md:text-3xl'>커뮤니티 보드</h1>
                <p className='text-sm text-base-content/70'>실시간으로 글을 읽고, 공감하고, 토론하세요.</p>
              </div>
              {isAuthenticated && (
                <button onClick={() => navigate('/articles/new')} className='btn btn-primary'>
                  새 글 작성
                </button>
              )}
            </div>

            <form onSubmit={handleSearch} className='grid gap-2 md:grid-cols-[170px_1fr_auto_auto]'>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className='select select-bordered w-full'
              >
                {SEARCH_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <input
                type='text'
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder='검색어를 입력하세요'
                className='input input-bordered w-full'
              />
              <button type='submit' className='btn btn-neutral'>검색</button>
              <button type='button' onClick={handleReset} className='btn btn-outline' disabled={!activeSearch && !keyword}>
                초기화
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className='card border border-base-300 bg-base-100 shadow-sm'>
        <div className='card-body p-0'>
          {loading ? (
            <div className='flex items-center justify-center gap-3 p-12 text-base-content/70'>
              <span className='loading loading-spinner loading-md text-primary' />
              로딩 중...
            </div>
          ) : articles.length === 0 ? (
            <div className='p-12 text-center'>
              <p className='text-base-content/60'>검색 조건에 맞는 게시글이 없습니다.</p>
            </div>
          ) : (
            articles.map((article) => <ArticleCard key={article.articleId} article={article} />)
          )}
        </div>
      </section>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

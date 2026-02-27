import { Link } from 'react-router-dom'

import type { Article } from '@/types/models'

type ArticleCardProps = {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { articleId, title, writer, createdAt, viewCount, likeCount, dislikeCount, isNotice, isPopular } = article

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  return (
    <article className='group border-b border-base-300 px-4 py-4 transition-colors hover:bg-base-200/70 md:px-6'>
      <div className='mb-2 flex flex-wrap items-center gap-2'>
        {isNotice && <span className='badge badge-info badge-sm'>공지</span>}
        {isPopular && <span className='badge badge-warning badge-sm'>인기</span>}
        <Link
          to={`/articles/${articleId}`}
          className='line-clamp-1 text-[1rem] font-semibold tracking-tight transition-colors group-hover:text-primary md:text-[1.05rem]'
        >
          {title}
        </Link>
      </div>

      <div className='flex flex-wrap items-center gap-2 text-xs text-base-content/70 md:text-sm'>
        <span className='badge badge-ghost badge-sm'>{writer}</span>
        <span>{formatDate(createdAt)}</span>
        <span>조회 {viewCount}</span>
        <span className='text-info'>👍 {likeCount}</span>
        <span className='text-error'>👎 {dislikeCount}</span>
      </div>
    </article>
  )
}

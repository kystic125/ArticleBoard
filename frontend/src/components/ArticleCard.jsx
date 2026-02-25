import { Link } from 'react-router-dom'

export default function ArticleCard({ article }) {
  const { articleId, title, writer, createdAt, viewCount, likeCount, dislikeCount, isNotice, isPopular } = article

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('ko-KR')
  }

  return (
    <div style={styles.card}>
      <div style={styles.main}>
        {isNotice && <span style={styles.noticeBadge}>공지</span>}
        {isPopular && <span style={styles.popularBadge}>인기</span>}
        <Link to={`/articles/${articleId}`} style={styles.title}>{title}</Link>
      </div>
      <div style={styles.meta}>
        <span>{writer}</span>
        <span>{formatDate(createdAt)}</span>
        <span>조회 {viewCount}</span>
        <span>👍 {likeCount}</span>
        <span>👎 {dislikeCount}</span>
      </div>
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: '#fff',
    padding: '14px 20px',
    borderBottom: '1px solid #eee',
  },
  main: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
  noticeBadge: {
    backgroundColor: '#1976d2',
    color: '#fff',
    fontSize: '0.75rem',
    padding: '2px 6px',
    borderRadius: '4px',
    flexShrink: 0,
  },
  popularBadge: {
    backgroundColor: '#f57c00',
    color: '#fff',
    fontSize: '0.75rem',
    padding: '2px 6px',
    borderRadius: '4px',
    flexShrink: 0,
  },
  title: {
    fontSize: '1rem',
    color: '#222',
    fontWeight: '500',
  },
  meta: {
    display: 'flex',
    gap: '16px',
    fontSize: '0.82rem',
    color: '#888',
  },
}

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  getArticle, increaseViewCount, deleteArticle, adminDeleteArticle,
  toggleLike, toggleDislike, toggleNotice, bumpArticle, resetPopular,
} from '../api/articleApi'
import { useAuth } from '../context/AuthContext'
import CommentList from '../components/CommentList'

export default function ArticleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, userId, role } = useAuth()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const viewCountIncreased = useRef(false)

  const isManager = role === 'MANAGER'

  const fetchArticle = async () => {
    try {
      const res = await getArticle(id)
      setArticle(res.data)
    } catch {
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!viewCountIncreased.current) {
      viewCountIncreased.current = true
      increaseViewCount(id).catch(() => {})
    }
    fetchArticle()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('삭제하시겠습니까?')) return
    try {
      await deleteArticle(id)
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.message || '삭제에 실패했습니다.')
    }
  }

  const handleAdminDelete = async () => {
    if (!window.confirm('삭제하시겠습니까?')) return
    try {
      await adminDeleteArticle(id)
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.message || '삭제에 실패했습니다.')
    }
  }

  const handleToggleNotice = async () => {
    const msg = article.isNotice ? '공지를 해제하시겠습니까?' : '공지로 등록하시겠습니까?'
    if (!window.confirm(msg)) return
    try {
      await toggleNotice(id)
      fetchArticle()
    } catch (err) {
      alert(err.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const handleBump = async () => {
    if (!window.confirm('끌올하시겠습니까?')) return
    try {
      await bumpArticle(id)
      fetchArticle()
    } catch (err) {
      alert(err.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const handleResetPopular = async () => {
    if (!window.confirm('인기글을 해제하시겠습니까?')) return
    try {
      await resetPopular(id)
      fetchArticle()
    } catch (err) {
      alert(err.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const handleLike = async () => {
    try {
      await toggleLike(id)
      fetchArticle()
    } catch (err) {
      alert(err.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const handleDislike = async () => {
    try {
      await toggleDislike(id)
      fetchArticle()
    } catch (err) {
      alert(err.response?.data?.message || '오류가 발생했습니다.')
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleString('ko-KR')
  }

  if (loading) return <div style={styles.center}>로딩 중...</div>
  if (!article) return null

  const isOwner = isAuthenticated && userId === article.userId
  const isOther = isAuthenticated && !isOwner

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.titleRow}>
            <div style={styles.titleLeft}>
              {article.isNotice && <span style={styles.noticeBadge}>공지</span>}
              <h1 style={styles.title}>{article.title}</h1>
            </div>

            {/* 버튼 영역 */}
            <div style={styles.actionBar}>
              {isOwner && (
                <>
                  <button onClick={() => navigate(`/articles/${id}/edit`)} style={styles.btn}>수정</button>
                  <button onClick={handleDelete} style={{ ...styles.btn, ...styles.btnDanger }}>삭제</button>
                  {isManager && (
                    <button onClick={handleToggleNotice} style={{ ...styles.btn, ...styles.btnManager }}>
                      {article.isNotice ? '공지 해제' : '공지'}
                    </button>
                  )}
                </>
              )}
              {isManager && isOther && (
                <>
                  <button onClick={handleBump} style={{ ...styles.btn, ...styles.btnManager }}>끌올</button>
                  <button onClick={handleAdminDelete} style={{ ...styles.btn, ...styles.btnDanger }}>삭제</button>
                  <button onClick={handleToggleNotice} style={{ ...styles.btn, ...styles.btnManager }}>
                    {article.isNotice ? '공지 해제' : '공지'}
                  </button>
                  {article.isPopular && (
                    <button onClick={handleResetPopular} style={{ ...styles.btn, ...styles.btnWarning }}>인기글해제</button>
                  )}
                </>
              )}
            </div>
          </div>

          <div style={styles.meta}>
            <span>{article.writer}</span>
            <span>{formatDate(article.createdAt)}</span>
            <span>조회 {article.viewCount}</span>
          </div>
        </div>

        <div style={styles.content}>{article.content}</div>

        <div style={styles.voteSection}>
          {isAuthenticated ? (
            <>
              <button onClick={handleLike} style={styles.likeButton}>
                👍 {article.likeCount}
              </button>
              <button onClick={handleDislike} style={styles.dislikeButton}>
                👎 {article.dislikeCount}
              </button>
            </>
          ) : (
            <div style={styles.voteCounts}>
              <span>👍 {article.likeCount}</span>
              <span>👎 {article.dislikeCount}</span>
            </div>
          )}
        </div>
      </div>

      <CommentList articleId={id} />

      <div style={styles.backLink}>
        <button onClick={() => navigate('/')} style={styles.backButton}>← 목록으로</button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    padding: '32px',
    marginBottom: '24px',
  },
  header: {
    borderBottom: '1px solid #eee',
    paddingBottom: '16px',
    marginBottom: '24px',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '8px',
  },
  titleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap',
    flex: 1,
  },
  noticeBadge: {
    backgroundColor: '#1976d2',
    color: '#fff',
    fontSize: '0.75rem',
    padding: '2px 8px',
    borderRadius: '4px',
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    color: '#222',
    fontWeight: '600',
  },
  actionBar: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
    flexShrink: 0,
  },
  btn: {
    padding: '5px 12px',
    backgroundColor: '#fff',
    color: '#555',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.82rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  btnDanger: {
    color: '#e53935',
    borderColor: '#e53935',
  },
  btnManager: {
    color: '#1976d2',
    borderColor: '#1976d2',
  },
  btnWarning: {
    color: '#f57c00',
    borderColor: '#f57c00',
  },
  meta: {
    display: 'flex',
    gap: '16px',
    fontSize: '0.85rem',
    color: '#888',
  },
  content: {
    whiteSpace: 'pre-wrap',
    lineHeight: '1.8',
    color: '#333',
    fontSize: '0.95rem',
    minHeight: '120px',
  },
  voteSection: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '32px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  likeButton: {
    padding: '10px 24px',
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    border: '1px solid #90caf9',
    borderRadius: '24px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  dislikeButton: {
    padding: '10px 24px',
    backgroundColor: '#fce4ec',
    color: '#c62828',
    border: '1px solid #ef9a9a',
    borderRadius: '24px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  voteCounts: {
    display: 'flex',
    gap: '24px',
    fontSize: '1rem',
    color: '#666',
  },
  backLink: {
    marginTop: '8px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    color: '#1976d2',
    fontSize: '0.9rem',
    padding: 0,
    cursor: 'pointer',
  },
  center: {
    textAlign: 'center',
    padding: '60px',
    color: '#888',
  },
}

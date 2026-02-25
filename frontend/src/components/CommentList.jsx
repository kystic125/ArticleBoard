import { useState, useEffect } from 'react'
import { getComments, createComment } from '../api/commentApi'
import { useAuth } from '../context/AuthContext'
import CommentItem from './CommentItem'
import Pagination from './Pagination'

export default function CommentList({ articleId }) {
  const [comments, setComments] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [newComment, setNewComment] = useState('')
  const { isAuthenticated } = useAuth()

  const fetchComments = async (pageNum = 0) => {
    try {
      const res = await getComments(articleId, pageNum)
      setComments(res.data.content)
      setTotalPages(res.data.totalPages)
      setPage(res.data.number)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchComments(page)
  }, [page])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      await createComment(articleId, newComment)
      setNewComment('')
      fetchComments(0)
    } catch (err) {
      alert(err.response?.data?.message || '댓글 작성에 실패했습니다.')
    }
  }

  // commentId → writer 맵 (replyTo 표시용)
  const writerMap = {}
  comments.forEach((c) => { writerMap[c.commentId] = c.writer })

  // rootId 기준으로 그룹핑 (parentId와 무관하게 같은 rootId를 가진 모든 댓글을 depth=1로 표시)
  const roots = comments.filter((c) => c.rootId === null)
  const repliesMap = {}
  comments
    .filter((c) => c.rootId !== null)
    .forEach((reply) => {
      if (!repliesMap[reply.rootId]) repliesMap[reply.rootId] = []
      repliesMap[reply.rootId].push(reply)
    })

  return (
    <div style={styles.container}>
      <h3 style={styles.heading}>댓글 {comments.length > 0 ? `(${comments.length})` : ''}</h3>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={styles.textarea}
            placeholder="댓글을 입력하세요 (최대 150자)"
            rows={3}
            maxLength={150}
          />
          <div style={styles.formFooter}>
            <span style={styles.charCount}>{newComment.length}/150</span>
            <button type="submit" style={styles.submitButton}>댓글 등록</button>
          </div>
        </form>
      )}

      <div>
        {roots.length === 0 ? (
          <p style={styles.empty}>댓글이 없습니다.</p>
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
  )
}

const styles = {
  container: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    padding: '24px 32px',
    marginBottom: '16px',
  },
  heading: {
    margin: '0 0 16px 0',
    fontSize: '1rem',
    color: '#333',
    borderBottom: '1px solid #eee',
    paddingBottom: '12px',
  },
  form: {
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
  },
  charCount: {
    fontSize: '0.8rem',
    color: '#aaa',
  },
  submitButton: {
    padding: '8px 16px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  empty: {
    textAlign: 'center',
    color: '#bbb',
    padding: '24px 0',
    fontSize: '0.9rem',
  },
}

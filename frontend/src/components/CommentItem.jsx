import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { updateComment, deleteComment, createReply } from '../api/commentApi'

export default function CommentItem({ comment, replies = [], writerMap = {}, onRefresh }) {
  const { isAuthenticated, userId } = useAuth()
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const isOwner = isAuthenticated && userId === comment.userId

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleString('ko-KR')
  }

  const handleUpdate = async () => {
    if (!editContent.trim()) return
    try {
      await updateComment(comment.commentId, editContent)
      setEditing(false)
      onRefresh()
    } catch (err) {
      alert(err.response?.data?.message || '수정에 실패했습니다.')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return
    try {
      await deleteComment(comment.commentId)
      onRefresh()
    } catch (err) {
      alert(err.response?.data?.message || '삭제에 실패했습니다.')
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    try {
      await createReply(comment.commentId, replyContent)
      setReplyContent('')
      setShowReplyForm(false)
      onRefresh()
    } catch (err) {
      alert(err.response?.data?.message || '답글 작성에 실패했습니다.')
    }
  }

  // 대댓글인 경우 parentId 대상의 writer를 replyTo로 표시
  const replyTo = comment.rootId !== null ? writerMap[comment.parentId] : null

  if (comment.isDeleted) {
    return (
      <div style={styles.item}>
        <p style={styles.deletedText}>삭제된 댓글입니다.</p>
        {replies.map((reply) => (
          <CommentItem key={reply.commentId} comment={reply} replies={[]} writerMap={writerMap} onRefresh={onRefresh} />
        ))}
      </div>
    )
  }

  return (
    <div style={styles.item}>
      <div style={styles.header}>
        <span style={styles.writer}>{comment.writer}</span>
        <span style={styles.date}>{formatDate(comment.createdAt)}</span>
        {isOwner && !editing && (
          <div style={styles.actions}>
            <button onClick={() => setEditing(true)} style={styles.actionBtn}>수정</button>
            <button onClick={handleDelete} style={{ ...styles.actionBtn, color: '#e53935' }}>삭제</button>
          </div>
        )}
      </div>

      {editing ? (
        <div style={styles.editArea}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={styles.textarea}
            rows={3}
            maxLength={150}
          />
          <div style={styles.editActions}>
            <button onClick={() => setEditing(false)} style={styles.cancelBtn}>취소</button>
            <button onClick={handleUpdate} style={styles.saveBtn}>저장</button>
          </div>
        </div>
      ) : (
        <p
          style={{ ...styles.content, ...(isAuthenticated ? styles.contentClickable : {}) }}
          onClick={isAuthenticated && !editing ? () => setShowReplyForm((prev) => !prev) : undefined}
        >
          {replyTo && <span style={styles.replyTo}>@{replyTo} </span>}
          {comment.content}
        </p>
      )}

      {showReplyForm && (
        <form onSubmit={handleReply} style={styles.replyForm}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            style={styles.textarea}
            placeholder="답글을 입력하세요 (최대 150자)"
            rows={2}
            maxLength={150}
            required
          />
          <div style={styles.replyFormActions}>
            <button type="button" onClick={() => setShowReplyForm(false)} style={styles.cancelBtn}>취소</button>
            <button type="submit" style={styles.saveBtn}>답글 등록</button>
          </div>
        </form>
      )}

      {replies.length > 0 && (
        <div style={styles.replies}>
          {replies.map((reply) => (
            <CommentItem key={reply.commentId} comment={reply} replies={[]} writerMap={writerMap} onRefresh={onRefresh} />
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  item: {
    padding: '14px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px',
  },
  writer: {
    fontWeight: '600',
    fontSize: '0.9rem',
    color: '#333',
  },
  date: {
    fontSize: '0.8rem',
    color: '#aaa',
  },
  actions: {
    marginLeft: 'auto',
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    fontSize: '0.8rem',
    padding: 0,
    cursor: 'pointer',
  },
  content: {
    margin: '0 0 8px 0',
    fontSize: '0.92rem',
    color: '#444',
    whiteSpace: 'pre-wrap',
  },
  contentClickable: {
    cursor: 'pointer',
  },
  replyTo: {
    color: '#999',
    fontSize: '0.88rem',
    marginRight: '2px',
  },
  deletedText: {
    margin: '0 0 8px 0',
    fontSize: '0.9rem',
    color: '#bbb',
    fontStyle: 'italic',
  },
  editArea: {
    marginBottom: '8px',
  },
  textarea: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.9rem',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  editActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '6px',
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    padding: '6px 12px',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.85rem',
    color: '#555',
  },
  saveBtn: {
    padding: '6px 14px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.85rem',
  },
  replyForm: {
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  replyFormActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  replies: {
    paddingLeft: '24px',
    borderLeft: '2px solid #e3f2fd',
    marginTop: '8px',
  },
}

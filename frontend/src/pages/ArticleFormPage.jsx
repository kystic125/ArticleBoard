import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getArticle, createArticle, updateArticle } from '../api/articleApi'
import { useAuth } from '../context/AuthContext'

export default function ArticleFormPage() {
  const { role } = useAuth()
  const isManager = role === 'MANAGER'
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({ title: '', content: '', isNotice: false })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getArticle(id)
        .then((res) => {
          const { title, content, isNotice } = res.data
          setForm({ title, content, isNotice: isNotice ?? false })
        })
        .catch(() => navigate('/'))
    }
  }, [id, isEdit, navigate])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) {
        await updateArticle(id, form.title, form.content, form.isNotice)
        navigate(`/articles/${id}`)
      } else {
        const res = await createArticle(form.title, form.content, form.isNotice)
        navigate(`/articles/${res.data}`)
      }
    } catch (err) {
      const msg = err.response?.data?.message || '저장에 실패했습니다.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isEdit ? '게시글 수정' : '게시글 작성'}</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>제목</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              style={styles.input}
              placeholder="제목을 입력하세요 (최대 100자)"
              maxLength={100}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>내용</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              style={styles.textarea}
              placeholder="내용을 입력하세요 (최대 5000자)"
              maxLength={5000}
              rows={15}
              required
            />
          </div>
          {isManager && (
            <div style={styles.checkboxField}>
              <input
                type="checkbox"
                name="isNotice"
                id="isNotice"
                checked={form.isNotice}
                onChange={handleChange}
              />
              <label htmlFor="isNotice" style={styles.checkboxLabel}>공지글로 등록</label>
            </div>
          )}
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.actions}>
            <button type="button" onClick={() => navigate(-1)} style={styles.cancelButton}>
              취소
            </button>
            <button type="submit" disabled={loading} style={styles.submitButton}>
              {loading ? '저장 중...' : isEdit ? '수정하기' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  title: {
    marginTop: 0,
    marginBottom: '24px',
    fontSize: '1.3rem',
    color: '#333',
  },
  field: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95rem',
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95rem',
    resize: 'vertical',
    lineHeight: '1.6',
  },
  checkboxField: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
  },
  checkboxLabel: {
    fontSize: '0.9rem',
    color: '#555',
  },
  error: {
    color: '#e53935',
    fontSize: '0.85rem',
    marginBottom: '12px',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#fff',
    color: '#555',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.95rem',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.95rem',
  },
}

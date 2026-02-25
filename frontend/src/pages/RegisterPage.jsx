import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerApi } from '../api/authApi'

export default function RegisterPage() {
  const [form, setForm] = useState({
    userName: '',
    userPassword: '',
    nickname: '',
    nicknameType: 'FIXED',
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await registerApi(form.userName, form.userPassword, form.nickname, form.nicknameType)
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || '회원가입에 실패했습니다.'
      setError(msg)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>아이디</label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              style={styles.input}
              placeholder="최대 20자"
              maxLength={20}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>비밀번호</label>
            <input
              type="password"
              name="userPassword"
              value={form.userPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>닉네임</label>
            <input
              type="text"
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              style={styles.input}
              placeholder="최대 10자"
              maxLength={10}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>닉네임 유형</label>
            <select
              name="nicknameType"
              value={form.nicknameType}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="FIXED">고정 닉네임</option>
              <option value="TEMPORARY">임시 닉네임</option>
            </select>
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.submitButton}>가입하기</button>
        </form>
        <p style={styles.footer}>
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '360px',
  },
  title: {
    marginBottom: '24px',
    textAlign: 'center',
    fontSize: '1.4rem',
    color: '#333',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '0.9rem',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
  },
  error: {
    color: '#e53935',
    fontSize: '0.85rem',
    marginBottom: '12px',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#388e3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '8px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '0.9rem',
    color: '#666',
  },
}

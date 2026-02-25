import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <span onClick={() => { window.location.href = '/' }} style={{ ...styles.brand, cursor: 'pointer' }}>ArticleBoard</span>
      <div style={styles.links}>
        {isAuthenticated ? (
          <>
            <Link to="/articles/new" style={styles.link}>글쓰기</Link>
            <button onClick={handleLogout} style={styles.button}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>로그인</Link>
            <Link to="/register" style={styles.link}>회원가입</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
    textDecoration: 'none',
    color: '#333',
  },
  links: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  link: {
    textDecoration: 'none',
    color: '#555',
    fontSize: '0.9rem',
  },
  button: {
    background: 'none',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '4px 12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    color: '#555',
  },
}

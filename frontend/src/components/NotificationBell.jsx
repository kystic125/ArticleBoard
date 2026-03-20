import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useNotification from '../hooks/useNotification'

export default function NotificationBell() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { notifications, unreadCount, hasMore, loading, fetchMore, markAllRead } =
    useNotification(token)

  // 드롭다운 바깥 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleNotificationClick = (notification) => {
    setOpen(false)
    navigate(`/articles/${notification.articleId}`)
  }

  const handleReadAll = async (e) => {
    e.stopPropagation()
    await markAllRead()
  }

  return (
    <div style={styles.wrapper} ref={dropdownRef}>
      <button style={styles.bellButton} onClick={() => setOpen((prev) => !prev)}>
        <span style={styles.bellIcon}>🔔</span>
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <span style={styles.dropdownTitle}>알림</span>
            {unreadCount > 0 && (
              <button style={styles.readAllButton} onClick={handleReadAll}>
                전체 읽음
              </button>
            )}
          </div>

          <div style={styles.list}>
            {notifications.length === 0 ? (
              <div style={styles.empty}>알림이 없습니다.</div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.notificationId}
                  style={{ ...styles.item, ...(n.read ? styles.itemRead : styles.itemUnread) }}
                  onClick={() => handleNotificationClick(n)}
                >
                  <div style={styles.itemMessage}>{n.message}</div>
                  {n.content && <div style={styles.itemContent}>{n.content}</div>}
                  <div style={styles.itemTime}>{formatTime(n.createdAt)}</div>
                </div>
              ))
            )}

            {hasMore && (
              <button style={styles.moreButton} onClick={fetchMore} disabled={loading}>
                {loading ? '로딩 중...' : '더보기'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function formatTime(isoString) {
  if (!isoString) return ''
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

const styles = {
  wrapper: {
    position: 'relative',
  },
  bellButton: {
    position: 'relative',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
  },
  bellIcon: {
    fontSize: '1.3rem',
  },
  badge: {
    position: 'absolute',
    top: '-2px',
    right: '-4px',
    background: '#e53e3e',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 'bold',
    borderRadius: '999px',
    padding: '1px 5px',
    lineHeight: '1.4',
    minWidth: '16px',
    textAlign: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    width: '320px',
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    zIndex: 200,
    overflow: 'hidden',
  },
  dropdownHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
  },
  dropdownTitle: {
    fontWeight: 'bold',
    fontSize: '0.95rem',
    color: '#222',
  },
  readAllButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8rem',
    color: '#888',
    padding: 0,
  },
  list: {
    maxHeight: '360px',
    overflowY: 'auto',
  },
  empty: {
    padding: '24px 16px',
    textAlign: 'center',
    color: '#aaa',
    fontSize: '0.85rem',
  },
  item: {
    padding: '12px 16px',
    cursor: 'pointer',
    borderBottom: '1px solid #f5f5f5',
  },
  itemUnread: {
    background: '#f0f7ff',
  },
  itemRead: {
    background: '#fff',
  },
  itemMessage: {
    fontSize: '0.85rem',
    color: '#333',
    marginBottom: '2px',
  },
  itemContent: {
    fontSize: '0.8rem',
    color: '#888',
    marginBottom: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  itemTime: {
    fontSize: '0.75rem',
    color: '#bbb',
  },
  moreButton: {
    width: '100%',
    padding: '10px',
    background: 'none',
    border: 'none',
    borderTop: '1px solid #f0f0f0',
    cursor: 'pointer',
    fontSize: '0.85rem',
    color: '#555',
  },
}

import { useState, useEffect, useCallback, useRef } from 'react'
import { subscribeSSE, getNotifications, getUnreadCount, readAll } from '../api/notificationApi'

export default function useNotification(token) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [cursor, setCursor] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const unsubscribeRef = useRef(null)

  const fetchInitial = useCallback(async () => {
    if (!token) return
    try {
      const [listRes, countRes] = await Promise.all([
        getNotifications(null),
        getUnreadCount(),
      ])
      setNotifications(listRes.notifications ?? [])
      setCursor(listRes.nextCursor ?? null)
      setHasMore(listRes.hasMore ?? false)
      setUnreadCount(countRes.unreadCount ?? 0)
    } catch {
      // 인증 오류 등 무시
    }
  }, [token])

  const fetchMore = useCallback(async () => {
    if (!token || !hasMore || loading) return
    setLoading(true)
    try {
      const res = await getNotifications(cursor)
      setNotifications((prev) => [...prev, ...(res.notifications ?? [])])
      setCursor(res.nextCursor ?? null)
      setHasMore(res.hasMore ?? false)
    } finally {
      setLoading(false)
    }
  }, [token, cursor, hasMore, loading])

  const markAllRead = useCallback(async () => {
    if (!token) return
    setUnreadCount(0)
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    readAll().catch(() => {})
  }, [token])

  // SSE 구독
  useEffect(() => {
    if (!token) {
      setNotifications([])
      setUnreadCount(0)
      setCursor(null)
      setHasMore(false)
      return
    }

    fetchInitial()

    const unsubscribe = subscribeSSE(
      token,
      (notification) => {
        setNotifications((prev) => [notification, ...prev])
        setUnreadCount((prev) => prev + 1)
      },
      () => {}, // 에러 무시 (재연결 로직 미포함)
    )
    unsubscribeRef.current = unsubscribe

    return () => {
      unsubscribeRef.current?.()
      unsubscribeRef.current = null
    }
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  return { notifications, unreadCount, hasMore, loading, fetchMore, markAllRead }
}

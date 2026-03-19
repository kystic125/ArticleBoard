import axiosInstance from './axiosInstance'

export function subscribeSSE(token, onMessage, onError) {
  const controller = new AbortController()

  fetch('/api/notifications/subscribe', {
    headers: { Authorization: `Bearer ${token}` },
    signal: controller.signal,
  }).then(async (res) => {
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()
      for (const line of lines) {
        if (line.startsWith('data:')) {
          const data = line.slice(5).trim()
          if (data && data !== 'heartbeat') {
            try { onMessage(JSON.parse(data)) } catch { onMessage(data) }
          }
        }
      }
    }
  }).catch((err) => {
    if (err.name !== 'AbortError') onError?.(err)
  })

  return () => controller.abort()
}

export async function getNotifications(cursor) {
  const params = {}
  if (cursor) params.cursor = cursor
  const res = await axiosInstance.get('/api/notifications', { params })
  return res.data
}

export async function getUnreadCount() {
  const res = await axiosInstance.get('/api/notifications/unread-count')
  return res.data
}

export async function readAll() {
  await axiosInstance.patch('/api/notifications/read-all')
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { WSEvent } from '@/types'

type Status = 'connecting' | 'connected' | 'disconnected'

type UseWebSocketOptions = {
  url?: string
  onMessage: (event: WSEvent) => void
}

const MAX_BACKOFF = 30_000

export function useWebSocket({ url, onMessage }: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimerRef = useRef<number | null>(null)
  const attemptsRef = useRef(0)
  const closedByUserRef = useRef(false)
  const onMessageRef = useRef(onMessage)
  const [status, setStatus] = useState<Status>('connecting')

  onMessageRef.current = onMessage

  const cleanupSocket = useCallback(() => {
    if (!wsRef.current) return

    wsRef.current.onopen = null
    wsRef.current.onclose = null
    wsRef.current.onerror = null
    wsRef.current.onmessage = null
    wsRef.current.close()
    wsRef.current = null
  }, [])

  const clearReconnectTimer = useCallback(() => {
    if (reconnectTimerRef.current !== null) {
      window.clearTimeout(reconnectTimerRef.current)
      reconnectTimerRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (!url || closedByUserRef.current) {
      setStatus('disconnected')
      return
    }

    setStatus('connecting')
    const ws = new WebSocket(url)
    wsRef.current = ws

    const handleOpen = () => {
      attemptsRef.current = 0
      setStatus('connected')
    }

    const handleClose = () => {
      ws.onopen = null
      ws.onclose = null
      ws.onerror = null
      ws.onmessage = null

      if (wsRef.current === ws) {
        wsRef.current = null
      }

      if (closedByUserRef.current) {
        setStatus('disconnected')
        return
      }

      setStatus('connecting')
      const delay = Math.min(2 ** attemptsRef.current * 1000, MAX_BACKOFF)
      attemptsRef.current += 1
      clearReconnectTimer()
      reconnectTimerRef.current = window.setTimeout(() => {
        connect()
      }, delay)
    }

    const handleMessage = (event: MessageEvent<string>) => {
      try {
        const parsed = JSON.parse(event.data) as WSEvent
        onMessageRef.current(parsed)
      } catch {
        // Ignore malformed websocket messages.
      }
    }

    const handleError = () => {
      ws.close()
    }

    ws.onopen = handleOpen
    ws.onclose = handleClose
    ws.onerror = handleError
    ws.onmessage = handleMessage
  }, [clearReconnectTimer, url])

  useEffect(() => {
    closedByUserRef.current = false
    connect()

    return () => {
      closedByUserRef.current = true
      clearReconnectTimer()
      cleanupSocket()
      setStatus('disconnected')
    }
  }, [cleanupSocket, clearReconnectTimer, connect])

  const send = useCallback((data: unknown) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return
    wsRef.current.send(JSON.stringify(data))
  }, [])

  const close = useCallback(() => {
    closedByUserRef.current = true
    clearReconnectTimer()
    cleanupSocket()
    setStatus('disconnected')
  }, [cleanupSocket, clearReconnectTimer])

  return { status, send, close }
}

'use client'

import { useCallback, useEffect, useReducer } from 'react'
import { FEED_LIMIT, WS_URL } from '@/lib/constants'
import { useWebSocket } from '@/hooks/useWebSocket'
import type { SessionAlert, WSEvent } from '@/types'

type Action = { type: 'ADD'; item: SessionAlert } | { type: 'CLEAR' }

function reducer(state: SessionAlert[], action: Action): SessionAlert[] {
  if (action.type === 'ADD') {
    return [action.item, ...state].slice(0, FEED_LIMIT)
  }

  return []
}

export function useLiveFeed(initialData: SessionAlert[] = []) {
  const [feed, dispatch] = useReducer(reducer, initialData)

  const onMessage = useCallback((event: WSEvent) => {
    if (event.type === 'session_scored' || event.type === 'alert_created') {
      dispatch({ type: 'ADD', item: event.payload as SessionAlert })
    }
  }, [])

  const { status, send, close } = useWebSocket({ url: WS_URL, onMessage })

  useEffect(() => {
    return () => close()
  }, [close])

  const clear = useCallback(() => dispatch({ type: 'CLEAR' }), [])

  return {
    feed,
    status,
    clear,
    send,
  }
}

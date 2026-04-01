'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Moon, Settings, Sun } from 'lucide-react'
import { LiveDot } from '@/components/shared/LiveDot'
import { Button } from '@/components/ui/button'
import { WS_URL } from '@/lib/constants'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useTheme } from '@/hooks/useTheme'

function ConnectionPill({ status }: { status: 'connecting' | 'connected' | 'disconnected' }) {
  const tone =
    status === 'connected'
      ? 'bg-green-500/10 text-green-300'
      : status === 'connecting'
        ? 'bg-amber-500/10 text-amber-300'
        : 'bg-red-500/10 text-red-300'

  const text = status === 'connected' ? 'LIVE' : status === 'connecting' ? 'RECONNECTING...' : 'OFFLINE'
  const dotStatus = status === 'connected' ? 'connected' : status === 'connecting' ? 'reconnecting' : 'disconnected'

  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${tone}`}>
      <LiveDot status={dotStatus} />
      <span>{text}</span>
    </div>
  )
}

export function TopBar() {
  const [lastUpdated, setLastUpdated] = useState(() => new Date())
  const { theme, toggleTheme } = useTheme()
  const onMessage = useCallback(() => {}, [])
  const { status, close } = useWebSocket({ url: WS_URL, onMessage })

  useEffect(() => {
    const id = window.setInterval(() => setLastUpdated(new Date()), 5000)
    return () => {
      window.clearInterval(id)
      close()
    }
  }, [close])

  const stamp = useMemo(
    () =>
      lastUpdated.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    [lastUpdated],
  )

  return (
    <header className='sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-base/90 px-4 backdrop-blur'>
      <div>
        <h1 className='font-mono text-base font-semibold text-accent'>XTI-SOC</h1>
        <p className='text-sm text-muted'>Security Operations Center</p>
      </div>
      <ConnectionPill status={status} />
      <div className='flex items-center gap-3'>
        <span className='text-xs text-muted'>Last updated {stamp}</span>
        <Button variant='ghost' size='icon' aria-label='Toggle theme' onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className='h-4 w-4' /> : <Moon className='h-4 w-4' />}
        </Button>
        <Button variant='ghost' size='icon' aria-label='Open settings'>
          <Settings className='h-4 w-4' />
        </Button>
      </div>
    </header>
  )
}

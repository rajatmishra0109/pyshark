import { cn } from '@/lib/utils'

type LiveStatus = 'connected' | 'reconnecting' | 'disconnected'

const classes: Record<LiveStatus, string> = {
  connected: 'bg-[var(--severity-low)] animate-pulse-dot',
  reconnecting: 'bg-[var(--severity-medium)] animate-[pulse-dot_0.8s_cubic-bezier(0.4,0,0.6,1)_infinite]',
  disconnected: 'bg-[var(--severity-high)]',
}

export function LiveDot({ status }: { status: LiveStatus }) {
  return <span aria-hidden='true' className={cn('inline-block h-2 w-2 rounded-full', classes[status])} />
}

'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useLiveFeed } from '@/hooks/useLiveFeed'
import { SEVERITY_COLORS } from '@/lib/constants'
import { formatRelativeTime } from '@/lib/utils'
import type { SessionAlert } from '@/types'
import { ProtocolBadge } from '@/components/shared/ProtocolBadge'
import { EmptyState } from '@/components/shared/EmptyState'

export function LiveFeed({ initialData = [] }: { initialData?: SessionAlert[] }) {
  const { feed } = useLiveFeed(initialData)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    containerRef.current.scrollTop = 0
  }, [feed])

  const rows = useMemo(() => feed.slice(0, 100), [feed])

  if (rows.length === 0) {
    return (
      <div className='flex h-[420px] items-center justify-center rounded-xl border border-border bg-surface'>
        <EmptyState title='No sessions yet' description='Waiting for traffic...' />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      role='log'
      aria-live='polite'
      aria-atomic='false'
      className='h-[420px] overflow-y-auto rounded-xl border border-border bg-surface'
    >
      <div className='divide-y divide-border'>
        {rows.map((row) => {
          const color = SEVERITY_COLORS[row.risk.severity]
          return (
            <article
              key={row.id}
              className={`animate-slide-in p-3 ${
                row.risk.severity === 'Critical' ? 'border-l-2 border-[var(--severity-critical)] bg-[color:var(--severity-crit-bg)]/30' : ''
              }`}
            >
              <div className='flex items-center gap-3'>
                <span className='h-[5px] w-[5px] rounded-full' style={{ backgroundColor: color }} />
                <span className='font-mono text-xs text-primary'>
                  {row.src_ip} → {row.dst_ip}
                </span>
                <ProtocolBadge protocol={row.protocol} />
                <div className='h-1.5 w-16 rounded bg-elevated'>
                  <div
                    className='h-1.5 rounded'
                    style={{ width: `${row.risk.score}%`, backgroundColor: color }}
                  />
                </div>
                <span className='font-mono text-xs text-muted'>{row.risk.score}</span>
                <span className='text-[10px] text-subtle'>{formatRelativeTime(row.timestamp)}</span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

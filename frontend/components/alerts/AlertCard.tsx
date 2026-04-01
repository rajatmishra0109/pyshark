import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { ProtocolBadge } from '@/components/shared/ProtocolBadge'
import { formatRelativeTime, maskIP } from '@/lib/utils'
import { SEVERITY_COLORS } from '@/lib/constants'
import type { SessionAlert } from '@/types'

function AlertCardBase({ alert }: { alert: SessionAlert }) {
  const title = `SYN Flood detected from ${maskIP(alert.src_ip)}`
  const color = SEVERITY_COLORS[alert.risk.severity]

  return (
    <article
      role='article'
      className={`relative rounded-xl border border-border bg-surface p-4 ${
        alert.risk.severity === 'Critical' ? 'animate-[crit-pulse_2.2s_ease-in-out_infinite]' : ''
      }`}
    >
      <div className='absolute inset-y-0 left-0 w-1 rounded-l-none' style={{ backgroundColor: color }} />
      <div className='ml-2 flex items-start justify-between gap-3'>
        <div>
          <h3 className='text-sm font-semibold text-primary'>{title}</h3>
          <div className='mt-1 flex items-center gap-2 text-xs text-muted'>
            <span className='font-mono'>
              {alert.src_ip} → {alert.dst_ip}
            </span>
            <ProtocolBadge protocol={alert.protocol} />
            <span>Risk {alert.risk.score}</span>
          </div>
          <p className='mt-1 text-[11px] text-subtle' title={new Date(alert.timestamp).toISOString()}>
            {formatRelativeTime(alert.timestamp)}
          </p>
        </div>
        <div className='flex flex-col items-end gap-2'>
          <span
            className='rounded-full px-2 py-1 text-sm font-bold'
            style={{ backgroundColor: `${color}22`, color }}
          >
            {alert.risk.score}
          </span>
          <Button variant='ghost' size='sm'>
            View Session
          </Button>
        </div>
      </div>
    </article>
  )
}

export const AlertCard = memo(AlertCardBase)

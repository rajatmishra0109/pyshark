'use client'

import { useMemo, useState } from 'react'
import { AlertCard } from '@/components/alerts/AlertCard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { SessionAlert, Severity } from '@/types'

const HOURS = [1, 6, 24, 168] as const

export function AlertFeed({ initialData }: { initialData: SessionAlert[] }) {
  const [severity, setSeverity] = useState<Severity | 'All'>('All')
  const [hours, setHours] = useState<(typeof HOURS)[number]>(24)

  const filtered = useMemo(() => {
    const now = Date.now()
    return initialData.filter((alert) => {
      const bySeverity = severity === 'All' ? true : alert.risk.severity === severity
      const byTime = now - new Date(alert.timestamp).getTime() <= hours * 60 * 60 * 1000
      return bySeverity && byTime
    })
  }, [hours, initialData, severity])

  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface p-3'>
        {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((item) => (
          <Button key={item} variant={severity === item ? 'default' : 'ghost'} size='sm' onClick={() => setSeverity(item)}>
            {item}
          </Button>
        ))}
        {HOURS.map((h) => (
          <Button key={h} variant={hours === h ? 'default' : 'ghost'} size='sm' onClick={() => setHours(h)}>
            {h === 168 ? '7d' : `Last ${h}h`}
          </Button>
        ))}
        <Badge className='ml-auto bg-elevated text-muted'>{filtered.length} alerts</Badge>
      </div>
      <div className='space-y-3'>
        {filtered.map((alert) => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  )
}

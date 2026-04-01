'use client'

import dynamic from 'next/dynamic'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ProtocolBadge } from '@/components/shared/ProtocolBadge'
import { RiskGauge } from '@/components/shared/RiskGauge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { formatBytes, formatDuration, formatRelativeTime } from '@/lib/utils'
import type { SessionAlert } from '@/types'

const ShapChart = dynamic(() => import('@/components/sessions/ShapChart'), {
  ssr: false,
})

export function SessionDrawer({
  selected,
  open,
  onOpenChange,
}: {
  selected: SessionAlert | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!selected) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className='font-mono text-sm'>
            {selected.src_ip} → {selected.dst_ip}
          </SheetTitle>
          <div className='flex items-center justify-between'>
            <ProtocolBadge protocol={selected.protocol} />
            <div className='flex items-center gap-2'>
              <RiskGauge score={selected.risk.score} size={80} />
              <SeverityBadge severity={selected.risk.severity} />
            </div>
          </div>
        </SheetHeader>

        <Separator className='my-3' />
        <section>
          <h3 className='text-xs font-semibold text-primary'>Why was this flagged?</h3>
          <ShapChart data={selected.shap} />
        </section>

        <Separator className='my-3' />
        <section>
          <h3 className='text-xs font-semibold text-primary'>Threat Intelligence</h3>
          {selected.cti ? (
            <div className='space-y-2 text-xs'>
              <p className='text-2xl font-bold text-primary'>{selected.cti.abuse_confidence}</p>
              <div className='h-2 rounded bg-elevated'>
                <div className='h-2 rounded bg-[var(--severity-high)]' style={{ width: `${selected.cti.abuse_confidence}%` }} />
              </div>
              <p>Country: {selected.cti.country_code}</p>
              <p className='text-muted'>ISP: {selected.cti.isp}</p>
              <p className='inline-flex rounded-full bg-elevated px-2 py-1'>{selected.cti.usage_type}</p>
              <p className='text-muted'>
                Last reported:{' '}
                {selected.cti.last_reported ? formatRelativeTime(selected.cti.last_reported) : 'Unknown'}
              </p>
            </div>
          ) : (
            <p className='text-xs text-muted'>Private IP - no CTI available</p>
          )}
        </section>

        <Separator className='my-3' />
        <section>
          <h3 className='text-xs font-semibold text-primary'>Session statistics</h3>
          <div className='mt-2 grid grid-cols-2 gap-2 text-xs'>
            <div className='rounded bg-elevated p-2'>Duration: {formatDuration(selected.duration)}</div>
            <div className='rounded bg-elevated p-2'>Packets: {selected.packet_count}</div>
            <div className='rounded bg-elevated p-2'>Bytes: {formatBytes(selected.total_bytes)}</div>
            <div className='rounded bg-elevated p-2'>Packet rate: {(selected.packet_count / Math.max(selected.duration, 0.1)).toFixed(1)}/s</div>
            <div className='rounded bg-elevated p-2'>Syn rate: 0.00</div>
            <div className='rounded bg-elevated p-2'>Rst rate: 0.00</div>
            <div className='rounded bg-elevated p-2'>Avg packet size: {(selected.total_bytes / Math.max(selected.packet_count, 1)).toFixed(1)} B</div>
            <div className='rounded bg-elevated p-2'>Std IAT: 0.00</div>
          </div>
        </section>

        <Separator className='my-3' />
        <section>
          <h3 className='text-xs font-semibold text-primary'>ML probabilities</h3>
          {(['Normal', 'Suspicious', 'Malicious'] as const).map((label) => {
            const value = selected.ml.probabilities[label]
            const color =
              label === 'Normal' ? 'var(--severity-low)' : label === 'Suspicious' ? 'var(--severity-medium)' : 'var(--severity-high)'
            return (
              <div key={label} className='mt-2 text-xs'>
                <div className='mb-1 flex justify-between'>
                  <span>{label}</span>
                  <span>{Math.round(value * 100)}%</span>
                </div>
                <div className='h-2 rounded bg-elevated'>
                  <div className='h-2 rounded' style={{ width: `${value * 100}%`, backgroundColor: color }} />
                </div>
              </div>
            )
          })}
        </section>
      </SheetContent>
    </Sheet>
  )
}

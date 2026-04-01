'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState, useTransition } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { ProtocolBadge } from '@/components/shared/ProtocolBadge'
import { SeverityBadge } from '@/components/shared/SeverityBadge'
import { Button } from '@/components/ui/button'
import { formatBytes, formatDuration } from '@/lib/utils'
import type { Protocol, SessionAlert, Severity } from '@/types'

const SessionDrawer = dynamic(
  () => import('@/components/sessions/SessionDrawer').then((m) => m.SessionDrawer),
  { ssr: false },
)

type SortKey = 'timestamp' | 'src_ip' | 'dst_ip' | 'duration' | 'packet_count' | 'total_bytes' | 'risk'

export function SessionTable({ initialData, total }: { initialData: SessionAlert[]; total: number }) {
  const [sortKey, setSortKey] = useState<SortKey>('timestamp')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [selected, setSelected] = useState<SessionAlert | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '50')

  const sorted = useMemo(() => {
    const data = [...initialData]
    data.sort((a, b) => {
      const aValue = sortKey === 'risk' ? a.risk.score : (a[sortKey as keyof SessionAlert] as number | string)
      const bValue = sortKey === 'risk' ? b.risk.score : (b[sortKey as keyof SessionAlert] as number | string)
      if (aValue < bValue) return sortDir === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return data
  }, [initialData, sortDir, sortKey])

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    startTransition(() => router.replace(`${pathname}?${params.toString()}`))
  }

  const debounceSearch = (() => {
    let timer: number | undefined
    return (value: string) => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setParam('search', value), 300)
    }
  })()

  const setSort = (next: SortKey) => {
    if (next === sortKey) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(next)
    setSortDir('asc')
  }

  const sortIcon = (col: SortKey) =>
    sortKey === col ? (sortDir === 'asc' ? <ChevronUp className='h-3 w-3' /> : <ChevronDown className='h-3 w-3' />) : null

  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface p-3'>
        <input
          aria-label='Search sessions by IP'
          className='h-9 rounded-md border border-border bg-base px-3 text-sm text-primary outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'
          placeholder='Search src/dst IP'
          defaultValue={searchParams.get('search') ?? ''}
          onChange={(e) => debounceSearch(e.target.value)}
        />
        {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((item) => (
          <Button
            key={item}
            variant='ghost'
            size='sm'
            onClick={() => setParam('severity', item === 'All' ? '' : (item as Severity))}
          >
            {item}
          </Button>
        ))}
        {(['All', 'TCP', 'UDP', 'ICMP'] as const).map((item) => (
          <Button
            key={item}
            variant='ghost'
            size='sm'
            onClick={() => setParam('protocol', item === 'All' ? '' : (item as Protocol))}
          >
            {item}
          </Button>
        ))}
      </div>

      <div className='overflow-x-auto rounded-xl border border-border bg-surface'>
        <table className='w-full text-left text-xs'>
          <thead>
            <tr className='border-b border-border text-muted'>
              <th scope='col' className='px-3 py-2'>
                <button className='inline-flex items-center gap-1' onClick={() => setSort('timestamp')}>Time {sortIcon('timestamp')}</button>
              </th>
              <th scope='col' className='px-3 py-2'><button className='inline-flex items-center gap-1' onClick={() => setSort('src_ip')}>Src IP {sortIcon('src_ip')}</button></th>
              <th scope='col' className='px-3 py-2'><button className='inline-flex items-center gap-1' onClick={() => setSort('dst_ip')}>Dst IP {sortIcon('dst_ip')}</button></th>
              <th scope='col' className='px-3 py-2'>Protocol</th>
              <th scope='col' className='px-3 py-2'><button className='inline-flex items-center gap-1' onClick={() => setSort('duration')}>Duration {sortIcon('duration')}</button></th>
              <th scope='col' className='px-3 py-2'><button className='inline-flex items-center gap-1' onClick={() => setSort('packet_count')}>Packets {sortIcon('packet_count')}</button></th>
              <th scope='col' className='px-3 py-2'><button className='inline-flex items-center gap-1' onClick={() => setSort('total_bytes')}>Bytes {sortIcon('total_bytes')}</button></th>
              <th scope='col' className='px-3 py-2'>Label</th>
              <th scope='col' className='px-3 py-2'><button className='inline-flex items-center gap-1' onClick={() => setSort('risk')}>Risk {sortIcon('risk')}</button></th>
              <th scope='col' className='px-3 py-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.id}
                className='cursor-pointer border-t border-border hover:bg-elevated'
                onClick={() => {
                  setSelected(row)
                  setDrawerOpen(true)
                }}
              >
                <td className='px-3 py-2'>{new Date(row.timestamp).toLocaleTimeString()}</td>
                <td className='px-3 py-2 font-mono'>{row.src_ip}</td>
                <td className='px-3 py-2 font-mono'>{row.dst_ip}</td>
                <td className='px-3 py-2'><ProtocolBadge protocol={row.protocol} /></td>
                <td className='px-3 py-2'>{formatDuration(row.duration)}</td>
                <td className='px-3 py-2'>{row.packet_count}</td>
                <td className='px-3 py-2'>{formatBytes(row.total_bytes)}</td>
                <td className='px-3 py-2'>{row.ml.label}</td>
                <td className='px-3 py-2'>{row.risk.score}</td>
                <td className='px-3 py-2'>
                  <Button variant='ghost' size='sm'>Inspect</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex items-center justify-between text-xs text-muted'>
        <div>Showing {from}-{to} of {total}</div>
        <div className='flex gap-2'>
          <Button variant='ghost' size='sm' disabled={page <= 1 || isPending} onClick={() => setParam('page', String(Math.max(1, page - 1)))}>Prev</Button>
          <Button variant='ghost' size='sm' disabled={to >= total || isPending} onClick={() => setParam('page', String(page + 1))}>Next</Button>
        </div>
      </div>

      <SessionDrawer selected={selected} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  )
}

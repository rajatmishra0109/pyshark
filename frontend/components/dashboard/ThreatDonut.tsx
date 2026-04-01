'use client'

import { useMemo } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { DashboardStats } from '@/types'

const COLORS = ['var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

export default function ThreatDonut({ breakdown }: { breakdown: DashboardStats['threat_breakdown'] }) {
  const data = useMemo(
    () => [
      { name: 'Normal', value: breakdown.Normal ?? 0 },
      { name: 'Suspicious', value: breakdown.Suspicious ?? 0 },
      { name: 'Malicious', value: breakdown.Malicious ?? 0 },
    ],
    [breakdown],
  )

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className='rounded-xl border border-border bg-surface p-4'>
      <ResponsiveContainer width='100%' height={200}>
        <PieChart>
          <Pie data={data} dataKey='value' nameKey='name' innerRadius={55} outerRadius={80}>
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              fontSize: '12px',
            }}
          />
          <Legend verticalAlign='bottom' wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className='-mt-28 flex h-0 flex-col items-center justify-center pointer-events-none'>
        <span className='text-xl font-bold text-primary'>{total}</span>
        <span className='text-xs text-muted'>sessions</span>
      </div>
    </div>
  )
}

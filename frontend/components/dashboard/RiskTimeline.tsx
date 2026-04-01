'use client'

import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Point = { time: string; score: number }

export default function RiskTimeline({ points }: { points: Point[] }) {
  const data = useMemo(() => points, [points])

  return (
    <div className='rounded-xl border border-border bg-surface p-4'>
      <ResponsiveContainer width='100%' height={240}>
        <AreaChart data={data}>
          <XAxis dataKey='time' interval={4} tick={{ fontSize: 10 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} width={28} />
          <Tooltip
            contentStyle={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: '0.5rem',
              fontSize: '12px',
            }}
          />
          <Area
            type='monotone'
            dataKey='score'
            stroke='var(--chart-1)'
            strokeWidth={1.5}
            fill='var(--chart-1)'
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

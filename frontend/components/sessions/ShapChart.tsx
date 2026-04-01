'use client'

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import type { SessionAlert } from '@/types'

export default function ShapChart({ data }: { data: SessionAlert['shap'] }) {
  const top = data.slice(0, 5)

  return (
    <div className='h-[140px]'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart data={top} layout='vertical' margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
          <XAxis type='number' hide />
          <YAxis dataKey='feature' type='category' width={110} tick={{ fontSize: 11 }} />
          <Bar dataKey='impact' radius={[2, 2, 2, 2]}>
            {top.map((entry) => (
              <Cell key={entry.feature} fill={entry.impact >= 0 ? 'var(--severity-high)' : 'var(--severity-low)'} />
            ))}
            <LabelList
              dataKey='impact'
              position='right'
              formatter={(value) => Number(value ?? 0).toFixed(2)}
              className='text-[10px]'
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

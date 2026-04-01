import { TrendingDown, TrendingUp } from 'lucide-react'
import { RiskGauge } from '@/components/shared/RiskGauge'
import type { DashboardStats } from '@/types'

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1)
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100
      const y = 40 - (value / max) * 36
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg viewBox='0 0 100 40' className='mt-2 h-10 w-full'>
      <polyline fill='none' stroke='var(--chart-1)' strokeWidth='2' points={points} />
    </svg>
  )
}

export function StatsRow({ stats }: { stats: DashboardStats }) {
  const trendUp = stats.malicious_ips > stats.alerts_today / 2
  const sparklineValues = Array.from({ length: 10 }, (_, i) => Math.max(1, stats.total_sessions - i * 7)).reverse()

  return (
    <section className='grid grid-cols-1 gap-4 lg:grid-cols-4'>
      <article className='rounded-xl border border-border border-l-[2px] border-l-[var(--chart-1)] bg-surface p-4'>
        <p className='text-3xl font-bold text-primary'>{stats.total_sessions.toLocaleString()}</p>
        <p className='text-sm text-muted'>Total sessions</p>
        <Sparkline values={sparklineValues} />
      </article>
      <article className='rounded-xl border border-border border-l-[2px] border-l-[var(--chart-5)] bg-surface p-4'>
        <div className='flex items-center gap-2'>
          <p className='text-3xl font-bold text-primary'>{stats.alerts_today.toLocaleString()}</p>
          {stats.alerts_today > 10 ? (
            <span className='rounded-full bg-red-900 px-2 py-0.5 text-[10px] font-semibold text-red-300'>ALERT</span>
          ) : null}
        </div>
        <p className='text-sm text-muted'>Active alerts</p>
      </article>
      <article className='rounded-xl border border-border border-l-[2px] border-l-[var(--chart-4)] bg-surface p-4'>
        <div className='flex items-center gap-2'>
          <p className='text-3xl font-bold text-primary'>{stats.malicious_ips.toLocaleString()}</p>
          {trendUp ? <TrendingUp className='h-4 w-4 text-red-400' /> : <TrendingDown className='h-4 w-4 text-green-400' />}
        </div>
        <p className='text-sm text-muted'>Malicious IPs</p>
      </article>
      <article className='rounded-xl border border-border border-l-[2px] border-l-[var(--chart-2)] bg-surface p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <p className='text-3xl font-bold text-primary'>{Math.round(stats.avg_risk_score)}</p>
            <p className='text-sm text-muted'>Avg risk score</p>
          </div>
          <RiskGauge score={stats.avg_risk_score} />
        </div>
      </article>
    </section>
  )
}

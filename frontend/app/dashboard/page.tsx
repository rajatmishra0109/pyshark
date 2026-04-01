import dynamic from 'next/dynamic'
import { getStats } from '@/lib/api'
import { PageShell } from '@/components/layout/PageShell'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { LiveFeed } from '@/components/dashboard/LiveFeed'
import { TopThreats } from '@/components/dashboard/TopThreats'
import { SkeletonCard } from '@/components/shared/SkeletonCard'

const ThreatDonut = dynamic(() => import('@/components/dashboard/ThreatDonut'), {
  loading: () => <SkeletonCard className='h-[200px]' />,
  ssr: false,
})

const RiskTimeline = dynamic(() => import('@/components/dashboard/RiskTimeline'), {
  loading: () => <SkeletonCard className='h-[240px]' />,
  ssr: false,
})

function buildTimeline(avg: number) {
  const now = new Date()
  return Array.from({ length: 30 }, (_, i) => {
    const at = new Date(now.getTime() - (29 - i) * 60_000)
    return {
      time: at.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: Math.max(0, Math.min(100, Math.round(avg + Math.sin(i / 3) * 12))),
    }
  })
}

export default async function DashboardPage() {
  const stats = await getStats()
  const timeline = buildTimeline(stats.avg_risk_score)

  return (
    <PageShell>
      <div className='space-y-4'>
        <StatsRow stats={stats} />
        <section className='grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]'>
          <LiveFeed />
          <div className='space-y-4'>
            <ThreatDonut breakdown={stats.threat_breakdown} />
            <RiskTimeline points={timeline} />
          </div>
        </section>
        <TopThreats threats={stats.top_threats} />
      </div>
    </PageShell>
  )
}

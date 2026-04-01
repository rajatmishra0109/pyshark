'use client'

import dynamic from 'next/dynamic'
import { PageShell } from '@/components/layout/PageShell'
import { SkeletonCard } from '@/components/shared/SkeletonCard'

const ThreatMap = dynamic(() => import('@/components/threat-map/ThreatMap'), {
  loading: () => <SkeletonCard className='h-[580px]' />,
  ssr: false,
})

export default function ThreatMapPage() {
  return (
    <PageShell>
      <ThreatMap />
    </PageShell>
  )
}

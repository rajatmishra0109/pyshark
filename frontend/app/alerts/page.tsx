import { getAlerts } from '@/lib/api'
import { PageShell } from '@/components/layout/PageShell'
import { AlertFeed } from '@/components/alerts/AlertFeed'

export default async function AlertsPage() {
  const alerts = await getAlerts({ hours: 24 })

  return (
    <PageShell>
      <AlertFeed initialData={alerts} />
    </PageShell>
  )
}

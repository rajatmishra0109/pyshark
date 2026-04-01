import { getSessions } from '@/lib/api'
import { PageShell } from '@/components/layout/PageShell'
import { SessionTable } from '@/components/sessions/SessionTable'

export default async function SessionsPage() {
  const initial = await getSessions({ page: 1, limit: 50 })

  return (
    <PageShell>
      <SessionTable initialData={initial.data} total={initial.total} />
    </PageShell>
  )
}

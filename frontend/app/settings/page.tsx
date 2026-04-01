import { PageShell } from '@/components/layout/PageShell'

export default function SettingsPage() {
  return (
    <PageShell>
      <div className='rounded-xl border border-border bg-surface p-6'>
        <h2 className='font-mono text-lg font-semibold text-primary'>Settings</h2>
        <p className='mt-2 text-sm text-muted'>SOC system configuration panel.</p>
      </div>
    </PageShell>
  )
}

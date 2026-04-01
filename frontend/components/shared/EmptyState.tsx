import type { ComponentType, ReactNode } from 'react'
import { ShieldOff } from 'lucide-react'

type EmptyStateProps = {
  icon?: ComponentType<{ className?: string }>
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon = ShieldOff, title, description, action }: EmptyStateProps) {
  return (
    <div className='flex min-h-40 flex-col items-center justify-center rounded-xl border border-border bg-surface p-6 text-center'>
      <Icon className='mb-3 h-6 w-6 text-muted' />
      <h3 className='text-sm font-semibold text-primary'>{title}</h3>
      <p className='mt-1 text-xs text-muted'>{description}</p>
      {action ? <div className='mt-4'>{action}</div> : null}
    </div>
  )
}

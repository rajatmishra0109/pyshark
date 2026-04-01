import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Severity } from '@/types'

const styles: Record<Severity, string> = {
  Low: 'bg-[var(--severity-low-bg)] text-[var(--severity-low)]',
  Medium: 'bg-[var(--severity-medium-bg)] text-[var(--severity-medium)]',
  High: 'bg-[var(--severity-high-bg)] text-[var(--severity-high)]',
  Critical: 'bg-[var(--severity-crit-bg)] text-[var(--severity-critical)]',
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge
      aria-label={`Severity: ${severity}`}
      className={cn('uppercase tracking-wider font-medium', styles[severity])}
    >
      {severity}
    </Badge>
  )
}

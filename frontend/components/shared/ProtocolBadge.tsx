import { Badge } from '@/components/ui/badge'
import type { Protocol } from '@/types'

const styles: Record<Protocol, string> = {
  TCP: 'bg-blue-950 text-blue-400',
  UDP: 'bg-cyan-950 text-cyan-400',
  ICMP: 'bg-amber-950 text-amber-400',
  OTHER: 'bg-slate-900 text-slate-400',
}

export function ProtocolBadge({ protocol }: { protocol: Protocol }) {
  return <Badge className={styles[protocol]}>{protocol}</Badge>
}

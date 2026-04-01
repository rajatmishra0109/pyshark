import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

export function SkeletonCard({ className }: { className?: string }) {
  return <Skeleton className={cn('h-40 w-full rounded-xl border border-border', className)} />
}

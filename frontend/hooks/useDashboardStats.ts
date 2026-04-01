'use client'

import useSWR from 'swr'
import { getStats } from '@/lib/api'
import type { DashboardStats } from '@/types'

export function useDashboardStats(initialData?: DashboardStats) {
  return useSWR<DashboardStats>('dashboard-stats', getStats, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
    fallbackData: initialData,
  })
}

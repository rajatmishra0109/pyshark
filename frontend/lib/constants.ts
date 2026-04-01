import type { Protocol, Severity } from '@/types'

export const SEVERITY_COLORS: Record<Severity, string> = {
  Low: 'var(--severity-low)',
  Medium: 'var(--severity-medium)',
  High: 'var(--severity-high)',
  Critical: 'var(--severity-critical)',
}

export const SEVERITY_BG: Record<Severity, string> = {
  Low: 'var(--severity-low-bg)',
  Medium: 'var(--severity-medium-bg)',
  High: 'var(--severity-high-bg)',
  Critical: 'var(--severity-crit-bg)',
}

export const PROTOCOL_COLORS: Record<Protocol, string> = {
  TCP: '#3b82f6',
  UDP: '#06b6d4',
  ICMP: '#f59e0b',
  OTHER: '#64748b',
}

export const RISK_THRESHOLDS = {
  ALERT: 60,
  CRITICAL: 80,
} as const

const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:8000'
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL?.replace(/\/$/, '') || `${apiBase.replace(/^http/, 'ws')}/ws`
export const FEED_LIMIT = 100
export const SESSION_TIMEOUT = 60_000

import type {
  DashboardStats,
  Protocol,
  SessionAlert,
  SessionListResponse,
  Severity,
} from '@/types'

const configuredBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '')
const BASE = configuredBase || 'http://localhost:8000'

type APIError = {
  status: number
  message: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10_000)

  try {
    const res = await fetch(`${BASE}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      let message = `Request failed with status ${res.status}`
      try {
        const body = (await res.json()) as { message?: string }
        if (body.message) message = body.message
      } catch {
        const text = await res.text()
        if (text) message = text
      }

      throw { status: res.status, message } as APIError
    }

    return (await res.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

export async function getStats(): Promise<DashboardStats> {
  return request<DashboardStats>('/stats')
}

export async function getSessions(params: {
  page: number
  limit: number
  severity?: Severity
  protocol?: Protocol
  search?: string
}): Promise<SessionListResponse> {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  })

  if (params.severity) query.set('severity', params.severity)
  if (params.protocol) query.set('protocol', params.protocol)
  if (params.search) query.set('search', params.search)

  return request<SessionListResponse>(`/sessions?${query.toString()}`)
}

export async function getSession(id: string): Promise<SessionAlert> {
  return request<SessionAlert>(`/sessions/${id}`)
}

export async function getAlerts(params: {
  severity?: Severity
  hours?: number
}): Promise<SessionAlert[]> {
  const query = new URLSearchParams()
  if (params.severity) query.set('severity', params.severity)
  if (params.hours) query.set('hours', String(params.hours))

  const suffix = query.toString()
  return request<SessionAlert[]>(`/alerts${suffix ? `?${suffix}` : ''}`)
}

export async function getTopThreats(): Promise<DashboardStats['top_threats']> {
  return request<DashboardStats['top_threats']>('/threats/top')
}

import { NextRequest, NextResponse } from 'next/server'
import { MOCK_SESSIONS } from '@/lib/mock-data'
import type { Protocol, Severity } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Number(searchParams.get('limit') ?? '50')
  const severity = searchParams.get('severity') as Severity | null
  const protocol = searchParams.get('protocol') as Protocol | null
  const search = (searchParams.get('search') ?? '').toLowerCase()

  let filtered = MOCK_SESSIONS
  if (severity) filtered = filtered.filter((s) => s.risk.severity === severity)
  if (protocol) filtered = filtered.filter((s) => s.protocol === protocol)
  if (search) {
    filtered = filtered.filter(
      (s) => s.src_ip.toLowerCase().includes(search) || s.dst_ip.toLowerCase().includes(search),
    )
  }

  const total = filtered.length
  const start = (page - 1) * limit
  const data = filtered.slice(start, start + limit)

  return NextResponse.json({ data, total, page })
}

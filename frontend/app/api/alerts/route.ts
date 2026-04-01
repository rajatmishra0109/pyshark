import { NextRequest, NextResponse } from 'next/server'
import { MOCK_SESSIONS } from '@/lib/mock-data'
import type { Severity } from '@/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const severity = searchParams.get('severity') as Severity | null
  const hours = Number(searchParams.get('hours') ?? '24')
  const cutoff = Date.now() - hours * 60 * 60 * 1000

  let data = MOCK_SESSIONS.filter(
    (s) => s.risk.score >= 60 && new Date(s.timestamp).getTime() >= cutoff,
  )

  if (severity) data = data.filter((s) => s.risk.severity === severity)

  return NextResponse.json(data)
}

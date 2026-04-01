import { NextResponse } from 'next/server'
import { buildStats, MOCK_SESSIONS } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json(buildStats(MOCK_SESSIONS).top_threats)
}

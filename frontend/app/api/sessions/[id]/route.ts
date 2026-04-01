import { NextResponse } from 'next/server'
import { MOCK_SESSIONS } from '@/lib/mock-data'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const found = MOCK_SESSIONS.find((s) => s.id === params.id)
  if (!found) {
    return NextResponse.json({ message: 'Session not found' }, { status: 404 })
  }
  return NextResponse.json(found)
}

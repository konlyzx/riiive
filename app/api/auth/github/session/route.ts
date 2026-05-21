import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const raw = req.cookies.get(SESSION_COOKIE)?.value
  if (!raw) return NextResponse.json(null)
  try {
    const data = JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'))
    const { accessToken: _at, ...safe } = data
    return NextResponse.json(safe)
  } catch {
    return NextResponse.json(null)
  }
}

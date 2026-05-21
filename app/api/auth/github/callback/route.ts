import { NextRequest, NextResponse } from 'next/server'
import { encodeSession, SESSION_COOKIE } from '@/lib/auth'

const GH_OAUTH = 'https://github.com/login/oauth'
const GH_API   = 'https://api.github.com'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const code        = searchParams.get('code')
  const state       = searchParams.get('state')
  const storedState = req.cookies.get('gh_oauth_state')?.value

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(new URL('/analyze?error=oauth', req.url))
  }

  const tokenRes = await fetch(`${GH_OAUTH}/access_token`, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code,
      redirect_uri: `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/api/auth/github/callback`,
    }),
  })

  const tokenData = await tokenRes.json()
  const accessToken: string = tokenData.access_token
  if (!accessToken) {
    return NextResponse.redirect(new URL('/analyze?error=token', req.url))
  }

  const userRes = await fetch(`${GH_API}/user`, {
    headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/vnd.github+json' },
  })
  const user = await userRes.json()

  const session = encodeSession({
    accessToken,
    login:  user.login ?? '',
    name:   user.name ?? user.login ?? null,
    avatar: user.avatar_url ?? null,
  })

  const rawRedirect = req.cookies.get('gh_redirect')?.value ?? '/analyze'
  const redirectTo  = rawRedirect.startsWith('/') ? rawRedirect : '/analyze'

  const res = NextResponse.redirect(new URL(redirectTo, req.url))
  res.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    maxAge:   60 * 60 * 24 * 7,
    path:     '/',
    sameSite: 'lax',
  })
  res.cookies.delete('gh_oauth_state')
  res.cookies.delete('gh_redirect')
  return res
}

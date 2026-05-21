import { NextRequest, NextResponse } from 'next/server'

const GH_OAUTH = 'https://github.com/login/oauth'

export async function GET(req: NextRequest) {
  const state = crypto.randomUUID()
  const params = new URLSearchParams({
    client_id:    process.env.GITHUB_CLIENT_ID!,
    redirect_uri: `${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/api/auth/github/callback`,
    scope:        'read:user repo',
    state,
  })
  const res = NextResponse.redirect(`${GH_OAUTH}/authorize?${params}`)
  res.cookies.set('gh_oauth_state', state, { httpOnly: true, maxAge: 600, path: '/' })
  return res
}

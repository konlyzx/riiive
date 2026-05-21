import { cookies } from 'next/headers'

export interface RiiiveSession {
  accessToken: string
  login: string
  name: string | null
  avatar: string | null
}

const COOKIE_NAME = 'riiive_gh_token'
const SESSION_COOKIE = 'riiive_session'

export async function getSession(): Promise<RiiiveSession | null> {
  const jar = await cookies()
  const raw = jar.get(SESSION_COOKIE)?.value
  if (!raw) return null
  try {
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8')) as RiiiveSession
  } catch {
    return null
  }
}

export function encodeSession(session: RiiiveSession): string {
  return Buffer.from(JSON.stringify(session)).toString('base64')
}

export { COOKIE_NAME, SESSION_COOKIE }

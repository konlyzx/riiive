'use client'

import { useEffect, useState } from 'react'

export interface ClientSession {
  login: string
  name: string | null
  avatar: string | null
}

export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated'

export function useGitHubSession() {
  const [session, setSession] = useState<ClientSession | null>(null)
  const [status, setStatus] = useState<SessionStatus>('loading')

  useEffect(() => {
    fetch('/api/auth/github/session')
      .then(r => r.json())
      .then(data => {
        if (data?.login) {
          setSession(data)
          setStatus('authenticated')
        } else {
          setStatus('unauthenticated')
        }
      })
      .catch(() => setStatus('unauthenticated'))
  }, [])

  return { session, status }
}

export function signInWithGitHub(redirectTo?: string) {
  if (redirectTo) {
    document.cookie = `gh_redirect=${encodeURIComponent(redirectTo)};path=/;max-age=600`
  }
  // Use assign() outside React's scheduler to avoid AbortError on navigation transitions
  setTimeout(() => { window.location.assign('/api/auth/github/signin') }, 0)
}

export function signOut() {
  window.location.href = '/api/auth/github/signout'
}

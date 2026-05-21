'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function AgentRedirect() {
  const params = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const repoUrl = params.get('repo') ?? ''
    const match = repoUrl.replace(/^https?:\/\//, '').match(/github\.com\/([^/]+)\/([^/]+)/)
    if (match) {
      router.replace(`/agent/${match[1]}/${match[2]}`)
    } else {
      router.replace('/')
    }
  }, [params, router])

  return null
}

export default function AgentPage() {
  return (
    <Suspense fallback={null}>
      <AgentRedirect />
    </Suspense>
  )
}

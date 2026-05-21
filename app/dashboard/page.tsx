'use client'

import { useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'

function DashboardRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/')
  }, [router])
  return null
}

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardRedirect />
    </Suspense>
  )
}

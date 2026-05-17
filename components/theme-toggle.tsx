'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './theme-provider'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isDark = theme === 'dark'

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? 'light' : 'dark'

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const supportsViewTransitions =
      typeof document !== 'undefined' &&
      typeof document.startViewTransition === 'function'

    if (!supportsViewTransitions || prefersReducedMotion) {
      setTheme(next)
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const radius = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    )

    const root = document.documentElement
    root.style.setProperty('--theme-cx', `${cx}px`)
    root.style.setProperty('--theme-cy', `${cy}px`)
    root.style.setProperty('--theme-r', `${radius}px`)
    root.dataset.themeAnim = '1'

    const transition = document.startViewTransition(() => {
      setTheme(next)
    })

    transition.finished.finally(() => {
      delete root.dataset.themeAnim
    })
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      className="relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:bg-foreground/5 hover:ring-1 hover:ring-foreground/80"
      suppressHydrationWarning
    >
      <span aria-hidden="true" className="relative h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 text-foreground transition-all duration-300 ${
            !isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 text-foreground transition-all duration-300 ${
            isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
      </span>
    </button>
  )
}

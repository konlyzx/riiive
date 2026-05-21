'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const EXAMPLES = [
  'github.com/brittanychiang/brittanychiang.com',
  'github.com/leerob/leerob.io',
]

const FONT_BODY = 'Roboto, -apple-system, sans-serif'

export function PortfolioInput() {
  const router   = useRouter()
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAnalyze = (targetUrl = url) => {
    const trimmed = targetUrl.trim()
    if (!trimmed) {
      setError('Paste your GitHub repo URL')
      inputRef.current?.focus()
      return
    }

    const isGitHub = /github\.com\/.+\/.+/.test(trimmed)
    if (!isGitHub) {
      setError('Must be a github.com repository URL')
      return
    }

    const match = trimmed.replace(/^https?:\/\//, '').match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) { setError('Could not parse repository URL'); return }

    setError('')
    router.push(`/agent/${match[1]}/${match[2]}`)
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div
          className={`flex items-center gap-0 border rounded-xl overflow-hidden transition-all duration-300 ${
            error ? 'border-red-500/50' : 'border-white/15 focus-within:border-white/35'
          } bg-white/5 backdrop-blur-sm`}
        >
          <div className="pl-4 pr-2 flex items-center text-white/30">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <input
            ref={inputRef}
            id="portfolio-url"
            type="url"
            placeholder="github.com/username/portfolio"
            value={url}
            onChange={e => { setUrl(e.target.value); if (error) setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent py-3 text-sm text-white placeholder:text-white/25 outline-none"
            style={{ fontFamily: FONT_BODY }}
            aria-label="GitHub repository URL"
            aria-describedby={error ? 'url-error' : undefined}
          />
          <button
            onClick={() => handleAnalyze()}
            disabled={!url.trim()}
            className="m-1.5 flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-black text-sm font-medium transition-all duration-200 hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer"
            style={{ fontFamily: FONT_BODY }}
          >
            Analyze
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M647 616H160v-80h487L423 312l57-56 360 360-360 360-57-56 224-224Z"/>
            </svg>
          </button>
        </div>

        {error && (
          <p id="url-error" className="text-xs text-red-400 px-1" style={{ fontFamily: FONT_BODY }}>
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-[11px] uppercase tracking-widest text-white/30" style={{ fontFamily: FONT_BODY }}>
          Try:
        </span>
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            onClick={() => handleAnalyze(ex)}
            className="text-[11px] text-white/40 hover:text-white/70 transition-colors underline underline-offset-2"
            style={{ fontFamily: FONT_BODY }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}

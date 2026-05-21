'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGitHubSession, signInWithGitHub } from '@/lib/use-session'

const FONT_BODY = 'Roboto, -apple-system, sans-serif'
const FONT_HEAD = '"Plus Jakarta Sans", -apple-system, Roboto, sans-serif'

export default function AnalyzePage() {
  const { session, status } = useGitHubSession()
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  function handleSubmit() {
    const trimmed = url.trim()
    if (!trimmed) { setError('Paste your GitHub repo URL'); return }

    const isGitHub = /github\.com\/.+\/.+/.test(trimmed)
    if (!isGitHub) { setError('Must be a github.com repository URL'); return }

    setError('')
    const encoded = encodeURIComponent(trimmed)
    router.push(`/agent?repo=${encoded}`)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">

      <div className="w-full max-w-xl flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <a href="/" className="text-[#505050] text-xs tracking-widest uppercase hover:text-white transition-colors" style={{ fontFamily: FONT_BODY }}>
            ← Riiive
          </a>
          <h1
            className="text-3xl font-[650] tracking-tight text-white"
            style={{ fontFamily: FONT_HEAD }}
          >
            Analyze your portfolio
          </h1>
          <p className="text-sm text-[#838383]" style={{ fontFamily: FONT_BODY }}>
            Paste your GitHub repository URL. Riiive reads your source code and gives
            brutally honest feedback — then offers to fix it automatically.
          </p>
        </div>

        {/* Auth gate */}
        {status === 'loading' ? (
          <div className="h-12 bg-white/5 rounded-xl animate-pulse" />
        ) : !session ? (
          <div className="flex flex-col gap-4 p-6 border border-white/10 rounded-xl bg-white/[0.02]">
            <p className="text-sm text-[#838383]" style={{ fontFamily: FONT_BODY }}>
              Connect your GitHub account so Riiive can read your repo and — if you want —
              push improvements as a Pull Request.
            </p>
            <button
              onClick={() => signInWithGitHub()}
              className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors w-fit"
              style={{ fontFamily: FONT_BODY }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Connect GitHub
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Connected badge */}
            <div className="flex items-center gap-2 text-xs text-[#505050]" style={{ fontFamily: FONT_BODY }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Connected as <span className="text-white">{session!.name ?? session!.login}</span>
            </div>

            {/* URL input */}
            <div className={`flex items-center border rounded-xl overflow-hidden transition-all ${error ? 'border-red-500/40' : 'border-white/10 focus-within:border-white/25'} bg-white/[0.03]`}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-4 text-[#505050] shrink-0">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              <input
                type="url"
                value={url}
                onChange={e => { setUrl(e.target.value); if (error) setError('') }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="github.com/username/portfolio"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent px-3 py-3.5 text-sm text-white placeholder:text-white/20 outline-none"
                style={{ fontFamily: FONT_BODY }}
              />
              <button
                onClick={handleSubmit}
                className="m-1.5 px-5 py-2 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors shrink-0"
                style={{ fontFamily: FONT_BODY }}
              >
                Analyze
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 px-1" style={{ fontFamily: FONT_BODY }}>{error}</p>
            )}

            <p className="text-xs text-[#444]" style={{ fontFamily: FONT_BODY }}>
              Only reads your code. Improvements require your approval via Pull Request.
            </p>
          </div>
        )}

        {/* How it works */}
        <div className="grid grid-cols-3 gap-px bg-white/[0.06] rounded-xl overflow-hidden text-center">
          {[
            { step: '01', text: 'Reads your source code' },
            { step: '02', text: 'AI gives honest feedback' },
            { step: '03', text: 'Fixes via Pull Request' },
          ].map(({ step, text }) => (
            <div key={step} className="bg-black px-4 py-5 flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-[#444]" style={{ fontFamily: FONT_BODY }}>{step}</span>
              <span className="text-xs text-[#838383]" style={{ fontFamily: FONT_BODY }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

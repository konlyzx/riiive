'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { PortfolioInput } from '@/components/portfolio-input'
import { AnalysisResults } from '@/components/analysis-results'
import { ThemeToggle } from '@/components/theme-toggle'
import { NavigationDrawer } from '@/components/navigation-drawer'
import { ShaderFlow } from '@/components/shaders/shader-flow'
import { SiteFrame } from '@/components/decorative-elements'
import { AnalysisResult } from '@/types/analysis'
import WallOfFeatures from '@/components/wall-of-features'

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isNavOpen, setIsNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white overflow-auto">
      <SiteFrame />

      <ShaderFlow
        className="absolute inset-0 z-0"
        flowSpeed={[0, 0.1]}
        iterations={10}
        scale={6}
        brightness={3}
        colorLowA={[0.08, 0.08, 0.08]}
        colorHighA={[0.25, 0.25, 0.25]}
        fadeRx={1.4}
        fadeRy={0.6}
        fadeCx={0.5}
        fadeCy={0.1}
      />

      <div className="relative z-10">
        <header className="fixed top-6 right-6 z-50" role="banner">
          <div className="flex items-center gap-1 rounded-full border border-white/20 bg-black/80 backdrop-blur-sm p-1.5 shadow-sm">
            <a href="/" className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 bg-white/10 text-white hover:bg-white/15 cursor-pointer" aria-current="page">
              Home
            </a>
            <ThemeToggle />
            <div className="relative w-8 h-8 flex items-center justify-center">
            </div>
            <button
              onClick={() => setIsNavOpen(true)}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 bg-white/10 text-white hover:bg-white/15 cursor-pointer"
              aria-label="Open navigation menu"
            >
              Menu
            </button>
          </div>
        </header>

        {!analysisResult ? (
          <main
            className="flex flex-col justify-between"
            style={{ height: '100vh' }}
            role="main"
          >
            <div className="relative flex-1 overflow-hidden">
              <h1
                className="absolute leading-none select-none whitespace-nowrap uppercase"
                style={{
                  fontFamily: 'Anton, sans-serif',
                  fontSize: 'clamp(8rem, 25vw, 30rem)',
                  top: '32%',
                  left: 0,
                  transform: 'translateY(-55%)',
                  letterSpacing: '0.02em',
                }}
              >
                Riiive
              </h1>

              {/* Large Panchang description below h1 */}
              <div className="absolute left-6" style={{ top: '55%' }}>
                <p
                  className="text-white/80 uppercase leading-none"
                  style={{ fontFamily: 'Panchang, sans-serif', fontWeight: 600, fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', letterSpacing: '-0.01em' }}
                >
                  Fix Your Portfolio
                </p>
                <p
                  className="text-white/40 uppercase mt-2"
                  style={{ fontFamily: 'Panchang, sans-serif', fontWeight: 300, fontSize: 'clamp(0.7rem, 1.2vw, 1rem)', letterSpacing: '0.04em' }}
                >
                  AI-powered analysis & honest feedback
                </p>
              </div>

              {/* Bottom buttons — exact lenis.dev style with Riiive colors */}
              <div className="absolute bottom-0 left-6 pb-4 flex items-center gap-3">
                <a
                  href="/showcase"
                  style={{
                    margin: '0px',
                    padding: '0px',
                    boxSizing: 'border-box',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    fontWeight: 900,
                    fontFamily: '"Roboto",sans-serif',
                    gridTemplateColumns: '3.33vw 1fr',
                    userSelect: 'none',
                    textTransform: 'uppercase',
                    color: '#efefef',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    lineHeight: '200%',
                    display: 'flex',
                    position: 'relative',
                    fontSize: '0.972222vw',
                    textAlign: 'end',
                    transition: 'transform 1.85s cubic-bezier(.19,1,.22,1),opacity 2.05s cubic-bezier(.19,1,.22,1)',
                    opacity: 1,
                    transform: 'translate(0px, 0px)',
                  }}
                >
                  <span
                    style={{
                      margin: '0px',
                      boxSizing: 'border-box',
                      aspectRatio: '1 / 1',
                      zIndex: 10,
                      backgroundColor: 'rgba(239,239,239,0.1)',
                      borderRadius: '50%',
                      display: 'flex',
                      padding: '0.83333vw',
                      width: '3.33vw',
                    }}
                  >
                    <svg viewBox="0 0 1024 1024" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="#ffff" /></svg>
                  </span>
                  <span
                    style={{
                      margin: '0px',
                      padding: '0px',
                      boxSizing: 'border-box',
                      zIndex: 10,
                      flexGrow: 1,
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        marginLeft: '-25px',
                        boxSizing: 'border-box',
                        justifyContent: 'center',
                        alignItems: 'center bottom',
                        height: '100%',
                        display: 'flex',
                        padding: '0px 1.66667vw',
                        transition: 'transform .6s cubic-bezier(.19,1,.22,1),opacity .6s cubic-bezier(.19,1,.22,1)',
                        transformOrigin: 'center bottom',
                        position: 'relative',
                        transform: 'scaleY(1)',
                      }}
                    >
                      Github
                    </span>
                    <span
                      aria-hidden="true"
                      style={{
                        marginLeft: '-25px',
                        boxSizing: 'border-box',
                        justifyContent: 'center',
                        alignItems: 'center bottom',
                        height: '100%',
                        display: 'flex',
                        padding: '0px 1.66667vw',
                        transition: 'transform .6s cubic-bezier(.19,1,.22,1),opacity .4s cubic-bezier(.19,1,.22,1)',
                        transformOrigin: 'center top',
                        opacity: 0,
                        width: '100%',
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                        transform: 'scaleY(0)',
                      }}
                    >
                      showcase
                    </span>
                  </span>
                </a>
              </div>
              <div className="absolute bottom-0 right-6 text-right pb-4">
                <p
                  className="uppercase"
                  style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(0.85rem, 2vw, 1.6rem)', letterSpacing: '0.05em' }}
                >
                  Fix Your Portfolio
                </p>
              </div>
            </div>
          </main>
        ) : (
          <main className="px-6 py-12 max-w-4xl mx-auto" role="main">
            <AnalysisResults
              result={analysisResult}
              onReset={() => setAnalysisResult(null)}
            />
          </main>
        )}

        <WallOfFeatures />
      </div>
      <NavigationDrawer isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </div>
  )
}

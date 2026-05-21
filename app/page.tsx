'use client'

import { useState } from 'react'
import { useTheme } from '@/components/theme-provider'
import { PortfolioInput } from '@/components/portfolio-input'
import { ThemeToggle } from '@/components/theme-toggle'
import { NavigationDrawer } from '@/components/navigation-drawer'
import { ShaderFlow } from '@/components/shaders/shader-flow'
import { SiteFrame } from '@/components/decorative-elements'
import WallOfFeatures from '@/components/wall-of-features'
import FeatureHighlights from '@/components/feature-highlights'
import HowItWorks from '@/components/sections/how-it-works'
import StatsSection from '@/components/sections/stats-section'
import ScoringSection from '@/components/sections/scoring-section'
import RoastSection from '@/components/sections/roast-section'
import CTASection from '@/components/sections/cta-section'

export default function Home() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="min-h-screen bg-background text-foreground overflow-auto">
      <SiteFrame />

      <ShaderFlow
        className="absolute inset-0 z-0"
        flowSpeed={[0, 0.1]}
        iterations={10}
        scale={6}
        brightness={3}
        colorLowA={isDark ? [0.08, 0.08, 0.08] : [0.85, 0.85, 0.85]}
        colorHighA={isDark ? [0.25, 0.25, 0.25] : [1.0, 1.0, 1.0]}
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

        <main
            className="flex flex-col"
            style={{ minHeight: '100vh' }}
            role="main"
          >
            {/* Hero */}
            <div className="relative flex-1 overflow-hidden" style={{ height: '100vh' }}>
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

              {/* Subtitle */}
              <div className="absolute left-6" style={{ top: '55%' }}>
                <p
                  className="text-white/80 uppercase leading-none"
                  style={{ fontFamily: 'Panchang, sans-serif', fontWeight: 600, fontSize: 'clamp(1.5rem, 4vw, 3.5rem)', letterSpacing: '-0.01em' }}
                >
                  Fix Your Portfolio
                </p>
                <p
                  className="text-white/40 uppercase mt-2"
                  style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300, fontSize: 'clamp(0.7rem, 1.2vw, 1rem)', letterSpacing: '0.04em' }}
                >
                  Paste your GitHub repo — AI reads the code & roasts it
                </p>
              </div>

              {/* Input anchored above bottom */}
              <div className="absolute bottom-0 left-0 right-0 pb-10 px-6 flex flex-col items-start gap-4">
                <PortfolioInput />
              </div>
            </div>
          </main>

        <FeatureHighlights />
        <StatsSection />
        <HowItWorks />
        <ScoringSection />
        <RoastSection />
        <WallOfFeatures />
        <CTASection />
      </div>
      <NavigationDrawer isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />
    </div>
  )
}

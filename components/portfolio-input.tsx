'use client'

import { useState } from 'react'
import { Link2, Loader2, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card } from './ui/card'
import { analyzePortfolio } from '@/app/actions/analyze'
import { AnalysisResult } from '@/types/analysis'

interface PortfolioInputProps {
  onAnalysisComplete: (result: AnalysisResult) => void
  compact?: boolean
}

export function PortfolioInput({ onAnalysisComplete, compact }: PortfolioInputProps) {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'url' | 'screenshot'>('url')

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    setError('')
    setIsAnalyzing(true)

    try {
      const result = await analyzePortfolio(url)
      onAnalysisComplete(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isAnalyzing) {
      handleAnalyze()
    }
  }

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <Input
          id="portfolio-url-compact"
          type="url"
          placeholder="https://yourportfolio.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isAnalyzing}
          aria-label="Portfolio URL"
          className="w-72 bg-white/5 border-white/20 text-white placeholder:text-white/30 focus:border-white/40 h-10"
        />
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !url.trim()}
          className="h-10 px-6 border border-white/30 bg-white/10 text-white uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors disabled:opacity-40 flex items-center gap-2"
          style={{ fontFamily: 'Roboto, sans-serif', fontWeight: 300 }}
        >
          {isAnalyzing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {isAnalyzing ? 'Analyzing' : 'Analyze →'}
        </button>
        {error && <span className="text-red-400 text-xs">{error}</span>}
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="p-8 border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="space-y-4">
          <div className="space-y-3">
            <label htmlFor="portfolio-url" className="mb-2 block text-sm font-medium tracking-tight text-white/80">
              Portfolio URL
            </label>
            <div className="flex gap-3">
              <Input
                id="portfolio-url"
                type="url"
                placeholder="https://yourportfolio.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isAnalyzing}
                className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
              />
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !url.trim()}
                className="gap-2 min-w-[120px] bg-white text-black hover:bg-white/90"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="text-[13px] tracking-tight text-white/50">
            We&apos;ll analyze your portfolio&apos;s design, performance, accessibility, and more.
          </div>
        </div>
      </Card>

      <div className="text-center text-sm text-white/40 uppercase tracking-widest text-xs">
        Try example:&nbsp;
        <button
          onClick={() => setUrl('https://github.com')}
          className="underline hover:text-white transition-colors"
        >
          github.com
        </button>
      </div>
    </div>
  )
}

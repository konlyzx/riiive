'use client'

import { useState, useCallback } from 'react'
import { analyzePortfolio } from '@/app/actions/analyze'
import { AnalysisResult } from '@/types/analysis'

const STORAGE_KEY = 'riiive:analysis-history'
const MAX_HISTORY = 20

export function useAnalysis() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback(async (url: string) => {
    setError(null)
    setIsAnalyzing(true)

    try {
      const res = await analyzePortfolio(url)
      setResult(res)
      saveToHistory(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed. Try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
  }, [])

  return { result, isAnalyzing, error, analyze, reset }
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

function saveToHistory(result: AnalysisResult) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const history: AnalysisResult[] = raw ? JSON.parse(raw) : []
    const updated = [result, ...history.filter(r => r.url !== result.url)].slice(0, MAX_HISTORY)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // Storage quota exceeded or unavailable
  }
}

export function getAnalysisHistory(): AnalysisResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function clearAnalysisHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

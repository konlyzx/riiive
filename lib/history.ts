import { AnalysisResult } from '@/types/analysis'

const STORAGE_KEY = 'riiive:analysis-history'
const MAX_HISTORY = 20

export function saveToHistory(result: AnalysisResult): void {
  if (typeof window === 'undefined') return
  try {
    const raw     = localStorage.getItem(STORAGE_KEY)
    const history: AnalysisResult[] = raw ? JSON.parse(raw) : []
    const updated = [result, ...history.filter(r => r.url !== result.url)].slice(0, MAX_HISTORY)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // quota exceeded or SSR
  }
}

export function getHistory(): AnalysisResult[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function clearHistory(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

'use server'

import { analyzePortfolioUrl } from '@/lib/analyzer'
import { generateAIFeedback } from '@/lib/ai-feedback'
import { AnalysisResult } from '@/types/analysis'

export async function analyzePortfolio(url: string): Promise<AnalysisResult> {
  try {
    if (!url || !isValidUrl(url)) {
      throw new Error('Invalid URL provided')
    }

    const { scores, issues, html } = await analyzePortfolioUrl(url)
    
    const { aiFeedback, templates } = await generateAIFeedback(scores, issues, html)

    const result: AnalysisResult = {
      id: generateId(),
      url,
      scores,
      issues,
      aiFeedback,
      templateRecommendations: templates,
      analyzedAt: new Date(),
    }

    return result
  } catch (error) {
    throw new Error(
      `Failed to analyze portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

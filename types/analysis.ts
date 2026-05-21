export interface AnalysisScore {
  overall: number
  performance: number
  accessibility: number
  design: number
  content: number
  responsiveness: number
  seo: number
}

export interface AnalysisIssue {
  category: 'critical' | 'warning' | 'suggestion'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  fix?: string
}

export interface AIFeedback {
  roast: string
  recruiterFeedback: string
  improvements: string[]
  positives: string[]
}

export interface TemplateRecommendation {
  name: string
  style: string
  reason: string
  preview?: string
}

export interface AnalysisResult {
  id: string
  url?: string
  scores: AnalysisScore
  issues: AnalysisIssue[]
  aiFeedback: AIFeedback
  templateRecommendations: TemplateRecommendation[]
  analyzedAt: Date
}

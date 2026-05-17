'use client'

import { AnalysisResult } from '@/types/analysis'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Progress } from './ui/progress'
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Briefcase,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Share2
} from 'lucide-react'
import { Button } from './ui/button'

interface AnalysisResultsProps {
  result: AnalysisResult
  onReset: () => void
}

export function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreGrade = (score: number) => {
    if (score >= 90) return 'A+'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    if (score >= 50) return 'D'
    return 'F'
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Analysis Complete</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-1">
            {result.url}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button onClick={onReset} variant="outline">
            Analyze Another
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 border-2">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-7xl font-bold ${getScoreColor(result.scores.overall)}`}>
              {result.scores.overall}
            </div>
            <div className="text-3xl font-semibold text-neutral-400 mt-2">
              {getScoreGrade(result.scores.overall)}
            </div>
            <Progress value={result.scores.overall} className="mt-6" />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Performance', score: result.scores.performance },
              { label: 'Accessibility', score: result.scores.accessibility },
              { label: 'Design', score: result.scores.design },
              { label: 'Content', score: result.scores.content },
              { label: 'Responsiveness', score: result.scores.responsiveness },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className={`text-sm font-bold ${getScoreColor(item.score)}`}>
                    {item.score}/100
                  </span>
                </div>
                <Progress value={item.score} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <Flame className="h-5 w-5" />
              The Roast
            </CardTitle>
            <CardDescription>Honest feedback, no sugar coating</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {result.aiFeedback.roast}
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <Briefcase className="h-5 w-5" />
              Recruiter Perspective
            </CardTitle>
            <CardDescription>What hiring managers think</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {result.aiFeedback.recruiterFeedback}
            </p>
          </CardContent>
        </Card>
      </div>

      {result.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Issues Found
            </CardTitle>
            <CardDescription>
              {result.issues.length} issue{result.issues.length !== 1 ? 's' : ''} detected
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {result.issues.map((issue, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900"
              >
                {issue.category === 'critical' && (
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                )}
                {issue.category === 'warning' && (
                  <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                )}
                {issue.category === 'suggestion' && (
                  <Lightbulb className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{issue.title}</h4>
                    <Badge variant={issue.impact === 'high' ? 'destructive' : 'secondary'}>
                      {issue.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    {issue.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <Sparkles className="h-5 w-5" />
              What&apos;s Working
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.aiFeedback.positives.map((positive, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-300">{positive}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-purple-200 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
              <Lightbulb className="h-5 w-5" />
              Improvements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.aiFeedback.improvements.map((improvement, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-700 dark:text-neutral-300">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {result.templateRecommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Templates</CardTitle>
            <CardDescription>
              Templates that might work well for your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.templateRecommendations.map((template, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors"
                >
                  <h4 className="font-semibold mb-1">{template.name}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                    {template.style}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    {template.reason}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

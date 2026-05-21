'use client'

import { AnalysisResult } from '@/types/analysis'
import {
  AlertCircle, AlertTriangle, CheckCircle2, Flame,
  Briefcase, Lightbulb, Sparkles, TrendingUp, ArrowLeft,
  Gauge, Eye, PenTool, FileText, Smartphone, Search
} from 'lucide-react'

interface AnalysisResultsProps {
  result: AnalysisResult
  onReset: () => void
}

const FONT_BODY    = 'Roboto, -apple-system, sans-serif'
const FONT_HEADING = '"Plus Jakarta Sans", -apple-system, Roboto, Helvetica, sans-serif'

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 60) return 'text-amber-400'
  return 'text-red-400'
}

function scoreLabel(score: number) {
  if (score >= 90) return 'Excellent'
  if (score >= 80) return 'Good'
  if (score >= 70) return 'Fair'
  if (score >= 60) return 'Needs work'
  return 'Poor'
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-emerald-400' : score >= 60 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="h-[2px] w-full bg-white/10 overflow-hidden rounded-full">
      <div
        className={`h-full ${color} transition-all duration-700`}
        style={{ width: `${score}%` }}
      />
    </div>
  )
}

const SCORE_DIMENSIONS = [
  { key: 'performance',    label: 'Performance',    Icon: Gauge },
  { key: 'accessibility',  label: 'Accessibility',  Icon: Eye },
  { key: 'design',         label: 'Design',         Icon: PenTool },
  { key: 'content',        label: 'Content',        Icon: FileText },
  { key: 'responsiveness', label: 'Responsiveness', Icon: Smartphone },
  { key: 'seo',            label: 'SEO',            Icon: Search },
] as const

export function AnalysisResults({ result, onReset }: AnalysisResultsProps) {
  const critical   = result.issues.filter(i => i.category === 'critical')
  const warnings   = result.issues.filter(i => i.category === 'warning')
  const suggestions = result.issues.filter(i => i.category === 'suggestion')

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-4 flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors mb-3"
            style={{ fontFamily: FONT_BODY }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            New analysis
          </button>
          <h2
            className="text-2xl md:text-3xl font-[650] tracking-tight text-white"
            style={{ fontFamily: FONT_HEADING }}
          >
            Analysis Complete
          </h2>
          {result.url && (
            <p className="text-sm text-white/40 mt-1 truncate max-w-sm" style={{ fontFamily: FONT_BODY }}>
              {result.url}
            </p>
          )}
        </div>

        <div className="text-right">
          <div className={`text-6xl font-bold tabular-nums ${scoreColor(result.scores.overall)}`}
            style={{ fontFamily: FONT_HEADING }}>
            {result.scores.overall}
          </div>
          <div className="text-xs text-white/40 uppercase tracking-widest mt-1" style={{ fontFamily: FONT_BODY }}>
            {scoreLabel(result.scores.overall)}
          </div>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">
        {SCORE_DIMENSIONS.map(({ key, label, Icon }) => {
          const score = result.scores[key]
          return (
            <div key={key} className="bg-[#0a0a0a] p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-white/30" strokeWidth={1.5} />
                  <span className="text-sm text-white/60" style={{ fontFamily: FONT_BODY }}>{label}</span>
                </div>
                <span className={`text-sm font-semibold tabular-nums ${scoreColor(score)}`}
                  style={{ fontFamily: FONT_BODY }}>
                  {score}
                </span>
              </div>
              <ScoreBar score={score} />
            </div>
          )
        })}
      </div>

      {/* Roast + Recruiter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
        <div className="bg-[#0a0a0a] p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-white/40" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-widest text-white/40" style={{ fontFamily: FONT_BODY }}>The Roast</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed" style={{ fontFamily: FONT_BODY }}>
            {result.aiFeedback.roast}
          </p>
        </div>
        <div className="bg-[#0a0a0a] p-6 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-white/40" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-widest text-white/40" style={{ fontFamily: FONT_BODY }}>Recruiter View</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed" style={{ fontFamily: FONT_BODY }}>
            {result.aiFeedback.recruiterFeedback}
          </p>
        </div>
      </div>

      {/* Issues */}
      {result.issues.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-white" style={{ fontFamily: FONT_HEADING }}>
            {result.issues.length} Issue{result.issues.length !== 1 ? 's' : ''} Found
          </h3>
          <div className="flex flex-col gap-px bg-white/10">
            {[...critical, ...warnings, ...suggestions].map((issue, idx) => (
              <div key={idx} className="bg-[#0a0a0a] p-5 flex gap-4">
                <div className="mt-0.5 shrink-0">
                  {issue.category === 'critical' && <AlertCircle className="w-4 h-4 text-red-400" />}
                  {issue.category === 'warning'  && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {issue.category === 'suggestion' && <Lightbulb className="w-4 h-4 text-white/40" />}
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white" style={{ fontFamily: FONT_BODY }}>
                      {issue.title}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                        issue.impact === 'high'
                          ? 'border-red-500/30 text-red-400'
                          : issue.impact === 'medium'
                          ? 'border-amber-500/30 text-amber-400'
                          : 'border-white/15 text-white/40'
                      }`}
                      style={{ fontFamily: FONT_BODY }}
                    >
                      {issue.impact}
                    </span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed" style={{ fontFamily: FONT_BODY }}>
                    {issue.description}
                  </p>
                  {issue.fix && (
                    <p className="text-xs text-white/35 leading-relaxed border-l border-white/10 pl-3 mt-1"
                      style={{ fontFamily: FONT_BODY }}>
                      <span className="text-white/50 font-medium">Fix: </span>{issue.fix}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Positives + Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
        <div className="bg-[#0a0a0a] p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-white/40" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-widest text-white/40" style={{ fontFamily: FONT_BODY }}>
              What&apos;s Working
            </span>
          </div>
          <ul className="flex flex-col gap-2.5">
            {result.aiFeedback.positives.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="text-sm text-white/60 leading-relaxed" style={{ fontFamily: FONT_BODY }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#0a0a0a] p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-white/40" strokeWidth={1.5} />
            <span className="text-xs uppercase tracking-widest text-white/40" style={{ fontFamily: FONT_BODY }}>
              Top Improvements
            </span>
          </div>
          <ul className="flex flex-col gap-2.5">
            {result.aiFeedback.improvements.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <ArrowLeft className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 rotate-180" strokeWidth={1.5} />
                <span className="text-sm text-white/60 leading-relaxed" style={{ fontFamily: FONT_BODY }}>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Template recommendations */}
      {result.templateRecommendations.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-base font-semibold text-white" style={{ fontFamily: FONT_HEADING }}>
            Recommended Directions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
            {result.templateRecommendations.map((t, i) => (
              <div key={i} className="bg-[#0a0a0a] p-5 flex flex-col gap-2">
                <span className="text-sm font-medium text-white" style={{ fontFamily: FONT_BODY }}>{t.name}</span>
                <span className="text-xs text-white/30 uppercase tracking-wider" style={{ fontFamily: FONT_BODY }}>{t.style}</span>
                <p className="text-sm text-white/50 leading-relaxed" style={{ fontFamily: FONT_BODY }}>{t.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

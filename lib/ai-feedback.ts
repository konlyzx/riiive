import { AIFeedback, AnalysisScore, AnalysisIssue, TemplateRecommendation } from '@/types/analysis'

export async function generateAIFeedback(
  scores: AnalysisScore,
  issues: AnalysisIssue[],
  html: string
): Promise<{ aiFeedback: AIFeedback; templates: TemplateRecommendation[] }> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    return {
      aiFeedback: generateFallbackFeedback(scores, issues),
      templates: generateTemplateRecommendations(scores),
    }
  }

  try {
    const prompt = buildPrompt(scores, issues, html)
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a witty portfolio critic who provides honest, funny, and actionable feedback. Be direct but helpful.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      throw new Error('AI request failed')
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content || ''
    
    const aiFeedback = parseAIResponse(content, scores)
    const templates = generateTemplateRecommendations(scores)

    return { aiFeedback, templates }
  } catch (error) {
    console.error('AI feedback error:', error)
    return {
      aiFeedback: generateFallbackFeedback(scores, issues),
      templates: generateTemplateRecommendations(scores),
    }
  }
}

function buildPrompt(scores: AnalysisScore, issues: AnalysisIssue[], html: string): string {
  const snippet = html.substring(0, 2000)
  
  return `Analyze this portfolio and provide feedback in this exact JSON format:
{
  "roast": "A funny but constructive roast (2-3 sentences)",
  "recruiterFeedback": "What a recruiter would think (2-3 sentences)",
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "positives": ["positive 1", "positive 2"]
}

Scores: Overall ${scores.overall}/100, Performance ${scores.performance}/100, Accessibility ${scores.accessibility}/100, Design ${scores.design}/100

Issues found: ${issues.map(i => i.title).join(', ')}

HTML snippet: ${snippet}

Be witty, honest, and helpful. Focus on actionable feedback.`
}

function parseAIResponse(content: string, scores: AnalysisScore): AIFeedback {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        roast: parsed.roast || '',
        recruiterFeedback: parsed.recruiterFeedback || '',
        improvements: parsed.improvements || [],
        positives: parsed.positives || [],
      }
    }
  } catch (e) {
    console.error('Failed to parse AI response:', e)
  }

  return generateFallbackFeedback(scores, [])
}

function generateFallbackFeedback(scores: AnalysisScore, issues: AnalysisIssue[]): AIFeedback {
  const roasts = [
    "Your portfolio loads slower than a dial-up modem in 1999. Time to optimize those images!",
    "I've seen MySpace pages with better accessibility. Let's add some alt text, shall we?",
    "This design screams 'I discovered CSS yesterday.' But hey, we all start somewhere!",
    "Your portfolio is like a book with no chapters. Add some structure and hierarchy!",
    "Mobile users are crying. Add a viewport meta tag before they all leave!",
  ]

  const recruiterFeedback = [
    "A recruiter would spend 6 seconds here before moving on. Make those seconds count with better visual hierarchy.",
    "Hiring managers want to see your work fast. This portfolio makes them work too hard to find it.",
    "First impressions matter. This needs more polish to stand out in a competitive market.",
    "Recruiters check portfolios on their phones. This one isn't mobile-friendly enough.",
    "The content is there, but the presentation needs work to catch a recruiter's attention.",
  ]

  const improvements = []
  const positives = []

  if (scores.performance < 70) {
    improvements.push("Optimize images and reduce page size for faster loading")
  }
  if (scores.accessibility < 70) {
    improvements.push("Add alt text to images and improve semantic HTML")
  }
  if (scores.design < 70) {
    improvements.push("Improve visual hierarchy with better typography and spacing")
  }
  if (scores.responsiveness < 70) {
    improvements.push("Add viewport meta tag and make design mobile-responsive")
  }

  if (scores.overall >= 80) {
    positives.push("Strong overall foundation")
  }
  if (scores.performance >= 80) {
    positives.push("Great performance optimization")
  }
  if (scores.accessibility >= 80) {
    positives.push("Excellent accessibility practices")
  }

  if (positives.length === 0) {
    positives.push("You took the first step by getting feedback!")
  }

  const roast = roasts[Math.floor(Math.random() * roasts.length)]
  const recruiter = recruiterFeedback[Math.floor(Math.random() * recruiterFeedback.length)]

  return {
    roast,
    recruiterFeedback: recruiter,
    improvements: improvements.slice(0, 4),
    positives: positives.slice(0, 3),
  }
}

function generateTemplateRecommendations(scores: AnalysisScore): TemplateRecommendation[] {
  const templates: TemplateRecommendation[] = []

  if (scores.design < 70) {
    templates.push({
      name: "Minimal Portfolio",
      style: "Clean, typography-focused design",
      reason: "Your current design needs simplification. This template emphasizes content over decoration.",
    })
  }

  if (scores.accessibility < 70) {
    templates.push({
      name: "Accessible Pro",
      style: "WCAG AAA compliant, high contrast",
      reason: "Built with accessibility first. Every element is keyboard navigable and screen-reader friendly.",
    })
  }

  if (scores.performance < 70) {
    templates.push({
      name: "Speed Demon",
      style: "Lightweight, optimized for performance",
      reason: "Under 50KB total size. Loads in under 1 second on 3G. Perfect for performance-conscious developers.",
    })
  }

  templates.push({
    name: "Modern SaaS",
    style: "Glassmorphism, gradients, animations",
    reason: "Trending design that works great for developers targeting startup roles.",
  })

  return templates.slice(0, 3)
}

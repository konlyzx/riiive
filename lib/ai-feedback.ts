import { AIFeedback, AnalysisScore, AnalysisIssue, TemplateRecommendation } from '@/types/analysis'

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'
const NVIDIA_MODEL   = 'google/gemma-3n-e2b-it'

export async function generateAIFeedback(
  scores: AnalysisScore,
  issues: AnalysisIssue[],
  html: string
): Promise<{ aiFeedback: AIFeedback; templates: TemplateRecommendation[] }> {
  const apiKey = process.env.NVIDIA_API_KEY

  if (!apiKey) {
    return {
      aiFeedback: generateFallbackFeedback(scores, issues),
      templates: generateTemplateRecommendations(scores),
    }
  }

  try {
    const content = await callNvidiaGemma(apiKey, buildPrompt(scores, issues, html))
    return {
      aiFeedback: parseAIResponse(content, scores, issues),
      templates: generateTemplateRecommendations(scores),
    }
  } catch (error) {
    console.error('[Gemma] AI feedback error:', error)
    return {
      aiFeedback: generateFallbackFeedback(scores, issues),
      templates: generateTemplateRecommendations(scores),
    }
  }
}

// ─── NVIDIA Gemma (streaming) ─────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a senior hiring manager and portfolio expert who has reviewed thousands of developer portfolios. You know exactly what makes a portfolio get hired vs discarded in the first 6 seconds.

WHAT MAKES A PERFECT DEVELOPER PORTFOLIO (your knowledge base):

FIRST IMPRESSION (above the fold):
- Clear value proposition in ONE sentence: who you are, what you do, who you help
- Professional photo (optional but increases trust 40%)
- Immediate CTA: contact button or email visible without scrolling
- Load time under 2s — recruiters close slow sites immediately
- No splash screens, loading animations or unnecessary intros

PROJECTS (most critical section):
- 3-5 real projects, not tutorials or clones
- Each project needs: live demo link, GitHub link, what problem it solves, your specific role
- Include measurable results: "reduced load time by 40%", "500+ users"
- Tech stack listed per project, not just in a global skills section
- Screenshots or video demos — recruiters rarely click links to check

ABOUT / BIO:
- 2-3 sentences max: current role/status, main skills, what you're looking for
- Avoid buzzwords: "passionate", "ninja", "rockstar", "guru"
- Specific > vague: "3 years building React SPAs" > "experienced developer"
- Include location and availability for work

CONTACT:
- Email must be visible (mailto link, not just a form)
- LinkedIn and GitHub always expected
- Response time expectation ("reply within 24h") builds trust

TECHNICAL (what kills portfolios):
- No viewport meta = instant fail on mobile (60% of recruiter traffic)
- Missing alt text = accessibility red flag, signals low quality code
- No HTTPS = security warning in browsers
- Broken links = careless developer signal
- No meta description = looks bad when shared on LinkedIn/Slack
- No OG image = plain link preview when shared

DESIGN:
- One accent color maximum
- Consistent spacing (8px grid)
- Dark mode support preferred in 2024+
- Font: one for headings, one for body, max 2 fonts total
- Readable contrast ratio minimum 4.5:1

SEO / DISCOVERABILITY:
- Page title: "John Doe - Frontend Developer" format
- Meta description: skills + location + availability
- Canonical URL set
- Structured data (Person schema) for Google

WHAT GETS PORTFOLIOS DISCARDED:
1. Skills section with 50+ technologies but no proof of using them
2. "Under construction" sections
3. Last updated 2+ years ago
4. Generic template without customization
5. No real projects, only todo apps and weather apps
6. Spelling/grammar errors
7. No contact info or only a contact form

Return ONLY valid JSON, no markdown fences, no extra text.`

async function callNvidiaGemma(apiKey: string, userPrompt: string): Promise<string> {
  const response = await fetch(NVIDIA_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'text/event-stream',
    },
    body: JSON.stringify({
      model: NVIDIA_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 700,
      temperature: 0.25,
      top_p: 0.70,
      frequency_penalty: 0.10,
      presence_penalty: 0.00,
      stream: true,
    }),
  })

  if (!response.ok || !response.body) {
    throw new Error(`NVIDIA API error: ${response.status} ${response.statusText}`)
  }

  const reader  = response.body.getReader()
  const decoder = new TextDecoder()
  let accumulated = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })

    for (const line of chunk.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed === 'data: [DONE]') continue
      if (!trimmed.startsWith('data: ')) continue

      try {
        const parsed = JSON.parse(trimmed.slice(6))
        const delta  = parsed.choices?.[0]?.delta?.content
        if (delta) accumulated += delta
      } catch {
        // skip malformed SSE lines
      }
    }
  }

  return accumulated.trim()
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

function buildPrompt(scores: AnalysisScore, issues: AnalysisIssue[], html: string): string {
  const issueList = issues.slice(0, 8).map(i => `- [${i.category.toUpperCase()}] ${i.title}: ${i.description}`).join('\n')

  // Extract meaningful text content from HTML for context
  const textContent = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1200)

  const title = (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || 'Not found'
  const metaDesc = (html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) || [])[1] || 'Not found'
  const h1 = (html.match(/<h1[^>]*>([^<]+)<\/h1>/i) || [])[1]?.replace(/<[^>]+>/g, '').trim() || 'Not found'
  const hasContact = /mailto:|linkedin\.com|github\.com/i.test(html)
  const projectCount = (html.match(/href=["'][^"']*(?:github\.com|live|demo|project)[^"']*["']/gi) || []).length
  const imgCount = (html.match(/<img[^>]*>/gi) || []).length
  const imgNoAlt = (html.match(/<img[^>]*>/gi) || []).filter(i => !/alt\s*=/i.test(i)).length

  return `Analyze this developer portfolio and give expert feedback based on what makes portfolios get hired.

SCORES (out of 100):
Overall: ${scores.overall} | Performance: ${scores.performance} | Accessibility: ${scores.accessibility} | Design: ${scores.design} | Content: ${scores.content} | Responsiveness: ${scores.responsiveness} | SEO: ${scores.seo ?? 'N/A'}

DETECTED ISSUES:
${issueList || 'None'}

KEY METADATA:
- Page title: ${title}
- Meta description: ${metaDesc}
- H1 heading: ${h1}
- Has contact info (email/LinkedIn/GitHub): ${hasContact ? 'Yes' : 'NO - CRITICAL'}
- Project/demo links found: ${projectCount}
- Images: ${imgCount} total, ${imgNoAlt} missing alt text

VISIBLE TEXT CONTENT:
${textContent}

Based on this data, write feedback as a hiring manager who has 6 seconds to decide.
Be specific — reference what you actually see (or don't see) in this portfolio.
Do NOT give generic advice. Reference specific things from the content above.

Respond ONLY with this exact JSON (no markdown, no extra text):
{
  "roast": "2 sentences max — direct, specific critique of the biggest weakness you see. Reference actual content.",
  "recruiterFeedback": "2 sentences — what a hiring manager thinks after landing on this portfolio. Be honest.",
  "improvements": [
    "Most impactful specific fix #1 — reference actual missing element",
    "Most impactful specific fix #2",
    "Most impactful specific fix #3",
    "Most impactful specific fix #4"
  ],
  "positives": [
    "Something specific that works — reference actual content",
    "Another genuine positive"
  ]
}`
}

// ─── Parser ───────────────────────────────────────────────────────────────────

function parseAIResponse(content: string, scores: AnalysisScore, issues: AnalysisIssue[]): AIFeedback {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      const roast             = typeof parsed.roast === 'string' && parsed.roast.length > 5 ? parsed.roast : null
      const recruiterFeedback = typeof parsed.recruiterFeedback === 'string' && parsed.recruiterFeedback.length > 5 ? parsed.recruiterFeedback : null
      const improvements      = Array.isArray(parsed.improvements) ? parsed.improvements.filter((s: unknown) => typeof s === 'string') : []
      const positives         = Array.isArray(parsed.positives) ? parsed.positives.filter((s: unknown) => typeof s === 'string') : []

      if (roast && recruiterFeedback && improvements.length > 0) {
        return {
          roast,
          recruiterFeedback,
          improvements: improvements.slice(0, 4),
          positives: positives.length > 0 ? positives.slice(0, 3) : ['You submitted your portfolio for review - that is already a step ahead.'],
        }
      }
    }
  } catch (e) {
    console.error('[Gemma] Failed to parse response:', e)
  }

  return generateFallbackFeedback(scores, issues)
}

export function generateFallbackFeedback(scores: AnalysisScore, issues: AnalysisIssue[]): AIFeedback {
  const criticalIssues = issues.filter(i => i.category === 'critical')
  const worstDimension = Object.entries({
    performance: scores.performance,
    accessibility: scores.accessibility,
    design: scores.design,
    content: scores.content,
    responsiveness: scores.responsiveness,
    seo: scores.seo ?? 50,
  }).sort((a, b) => a[1] - b[1])[0]

  const roastMap: Record<string, string> = {
    performance: 'Your portfolio is slow — recruiters wait 3 seconds max before closing a tab. Compress your images and remove unused scripts.',
    accessibility: 'Your portfolio has accessibility issues that also hurt your SEO. Missing alt text signals careless code to any engineer who reviews your source.',
    design: 'The visual hierarchy needs work. A recruiter scanning for 6 seconds cannot quickly identify what you do or why they should care.',
    content: 'Your portfolio is missing the basics: a clear value proposition, project descriptions with outcomes, and visible contact info.',
    responsiveness: 'Your portfolio breaks on mobile. Over 60% of recruiters check links on their phones — this is a hard disqualifier.',
    seo: 'Your portfolio is invisible to search engines. No meta description and a weak title mean it will never rank when someone searches your name.',
  }

  const recruiterMap: Record<string, string> = {
    performance: 'I opened this on my phone and waited too long. I moved on. Performance is non-negotiable for a developer portfolio.',
    accessibility: 'The code quality shows in the details. Missing alt text and poor semantic structure tell me you might not think about users beyond yourself.',
    design: 'I cannot quickly find your name, what you build, or how to contact you. A portfolio should answer those 3 questions in under 6 seconds.',
    content: 'There is not enough here to make a decision. I need to see real projects with results, not just a list of technologies.',
    responsiveness: 'Broken mobile layout is an automatic no for a web developer. If you cannot make your own site responsive, why would I trust you with ours?',
    seo: 'When I searched your name, nothing came up. Invest 30 minutes in SEO basics — title, meta description, and Open Graph tags.',
  }

  const improvements: string[] = []
  const positives: string[] = []

  // Priority improvements based on actual scores
  if (criticalIssues.length > 0) {
    improvements.push(`Fix ${criticalIssues.length} critical issue${criticalIssues.length > 1 ? 's' : ''}: ${criticalIssues.map(i => i.title).join(', ')}`)
  }
  if (scores.content < 70) {
    improvements.push('Add a clear value proposition in your hero: "I build X for Y" in one sentence above the fold')
  }
  if (scores.seo < 70) {
    improvements.push('Set your page title to "Your Name - Job Title" and add a 140-char meta description with your skills and location')
  }
  if (scores.responsiveness < 70) {
    improvements.push('Add viewport meta tag and test on a real phone — mobile-first is expected from any web developer')
  }
  if (scores.accessibility < 70) {
    improvements.push('Add alt text to all images and ensure all links have descriptive text — this also improves SEO')
  }
  if (scores.performance < 70) {
    improvements.push('Compress images with WebP format and add loading="lazy" to below-fold images')
  }
  if (improvements.length < 3) {
    improvements.push('Add Open Graph meta tags (og:title, og:description, og:image) so your portfolio looks professional when shared on LinkedIn or Slack')
  }

  // Positives based on actual scores
  if (scores.overall >= 70) positives.push('Overall solid foundation — you are ahead of most developer portfolios')
  if (scores.design >= 75) positives.push('Good visual design — clear hierarchy and consistent styling')
  if (scores.content >= 75) positives.push('Strong content — your projects and bio communicate your value effectively')
  if (scores.performance >= 80) positives.push('Fast load time — great for mobile recruiters and SEO')
  if (scores.accessibility >= 75) positives.push('Accessible markup — shows attention to code quality beyond just making things work')
  if (positives.length === 0) {
    positives.push('You are taking the right step by measuring and improving — most developers never do this')
  }

  const roast = roastMap[worstDimension[0]] ?? 'Your portfolio needs significant work across multiple dimensions to compete in today\'s market.'
  const recruiter = recruiterMap[worstDimension[0]] ?? 'This portfolio needs more work before I would pass it to our hiring team.'

  return {
    roast,
    recruiterFeedback: recruiter,
    improvements: improvements.slice(0, 4),
    positives: positives.slice(0, 3),
  }
}

export function generateTemplateRecommendations(scores: AnalysisScore): TemplateRecommendation[] {
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

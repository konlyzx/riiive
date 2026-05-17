import { AnalysisScore, AnalysisIssue } from '@/types/analysis'

export async function analyzePortfolioUrl(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PortfolioDoctor/1.0)',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch portfolio')
    }

    const html = await response.text()
    
    const scores = calculateHeuristicScores(html)
    const issues = detectIssues(html)

    return { scores, issues, html }
  } catch (error) {
    throw new Error(`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

function calculateHeuristicScores(html: string): AnalysisScore {
  const performance = analyzePerformance(html)
  const accessibility = analyzeAccessibility(html)
  const design = analyzeDesign(html)
  const content = analyzeContent(html)
  const responsiveness = analyzeResponsiveness(html)

  const overall = Math.round(
    (performance + accessibility + design + content + responsiveness) / 5
  )

  return {
    overall,
    performance,
    accessibility,
    design,
    content,
    responsiveness,
  }
}

function analyzePerformance(html: string): number {
  let score = 100

  const htmlSize = Buffer.byteLength(html, 'utf8')
  if (htmlSize > 500000) score -= 20
  else if (htmlSize > 200000) score -= 10

  const scriptMatches = html.match(/<script/gi) || []
  if (scriptMatches.length > 10) score -= 15
  else if (scriptMatches.length > 5) score -= 5

  const imgMatches = html.match(/<img[^>]*>/gi) || []
  const imagesWithoutLoading = imgMatches.filter(img => !img.includes('loading='))
  if (imagesWithoutLoading.length > 0) score -= 10

  const stylesheetMatches = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || []
  if (stylesheetMatches.length > 5) score -= 10

  return Math.max(0, score)
}

function analyzeAccessibility(html: string): number {
  let score = 100

  const imgMatches = html.match(/<img[^>]*>/gi) || []
  const imagesWithoutAlt = imgMatches.filter(img => !img.includes('alt='))
  if (imagesWithoutAlt.length > 0) {
    score -= Math.min(30, imagesWithoutAlt.length * 5)
  }

  const headingMatches = html.match(/<h[1-6][^>]*>/gi) || []
  if (headingMatches.length === 0) score -= 20

  const h1Matches = html.match(/<h1[^>]*>/gi) || []
  if (h1Matches.length === 0) score -= 10
  if (h1Matches.length > 1) score -= 5

  const hasLang = /<html[^>]*lang=/i.test(html)
  if (!hasLang) score -= 10

  return Math.max(0, score)
}

function analyzeDesign(html: string): number {
  let score = 100

  const hasCustomFont = /font-family:/i.test(html) || /<link[^>]*fonts\.googleapis/i.test(html)
  if (!hasCustomFont) score -= 15

  const headingMatches = html.match(/<h[1-3][^>]*>/gi) || []
  if (headingMatches.length < 2) score -= 10

  const semanticMatches = html.match(/<(section|article|main|header|footer|nav)[^>]*>/gi) || []
  if (semanticMatches.length === 0) score -= 15

  const hasWhitespace = /padding|margin/i.test(html)
  if (!hasWhitespace) score -= 20

  return Math.max(0, score)
}

function analyzeContent(html: string): number {
  let score = 100

  const textContent = html.replace(/<[^>]*>/g, ' ')
  const wordCount = textContent.split(/\s+/).filter(w => w.length > 0).length

  if (wordCount < 50) score -= 30
  else if (wordCount < 100) score -= 15

  const linkMatches = html.match(/<a[^>]*href=/gi) || []
  if (linkMatches.length < 3) score -= 10

  const hasContact = /contact|email|@|linkedin|github/i.test(textContent)
  if (!hasContact) score -= 20

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  const title = titleMatch ? titleMatch[1] : ''
  if (!title || title.length < 10) score -= 15

  const hasMetaDescription = /<meta[^>]*name=["']description["']/i.test(html)
  if (!hasMetaDescription) score -= 10

  return Math.max(0, score)
}

function analyzeResponsiveness(html: string): number {
  let score = 100

  const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html)
  if (!hasViewport) score -= 30

  const hasMediaQueries = /@media/i.test(html)
  if (!hasMediaQueries) score -= 20

  const hasFlexOrGrid = /display:\s*(flex|grid)/i.test(html)
  if (!hasFlexOrGrid) score -= 15

  return Math.max(0, score)
}

function detectIssues(html: string): AnalysisIssue[] {
  const issues: AnalysisIssue[] = []

  const imgMatches = html.match(/<img[^>]*>/gi) || []
  const imagesWithoutAlt = imgMatches.filter(img => !img.includes('alt='))
  if (imagesWithoutAlt.length > 0) {
    issues.push({
      category: 'critical',
      title: 'Missing Alt Text',
      description: `${imagesWithoutAlt.length} images are missing alt text, harming accessibility`,
      impact: 'high',
    })
  }

  const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html)
  if (!hasViewport) {
    issues.push({
      category: 'critical',
      title: 'No Viewport Meta Tag',
      description: 'Missing viewport meta tag will break mobile experience',
      impact: 'high',
    })
  }

  const h1Matches = html.match(/<h1[^>]*>/gi) || []
  if (h1Matches.length === 0) {
    issues.push({
      category: 'warning',
      title: 'No H1 Heading',
      description: 'Every page should have exactly one H1 for SEO and accessibility',
      impact: 'medium',
    })
  }

  const htmlSize = Buffer.byteLength(html, 'utf8')
  if (htmlSize > 500000) {
    issues.push({
      category: 'warning',
      title: 'Large Page Size',
      description: 'Page is over 500KB, which may slow down loading',
      impact: 'medium',
    })
  }

  return issues
}

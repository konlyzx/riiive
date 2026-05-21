import { AnalysisScore, AnalysisIssue } from '@/types/analysis'

export async function analyzePortfolioUrl(url: string) {
  let html = ''

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12_000)

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Riiive/1.0; +https://riiive.vercel.app)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
    })

    clearTimeout(timeout)

    if (res.ok) {
      const ct = res.headers.get('content-type') ?? ''
      if (ct.includes('text/html') || ct.includes('xhtml')) {
        html = await res.text()
      }
    }
  } catch {
    // fetch failed (CORS on client, timeout, etc.) — scores will reflect missing data
  }

  const scores = calculateHeuristicScores(html, url)
  const issues = detectIssues(html, url)

  return { scores, issues, html }
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

function calculateHeuristicScores(html: string, url: string): AnalysisScore {
  const performance    = analyzePerformance(html)
  const accessibility  = analyzeAccessibility(html)
  const design         = analyzeDesign(html)
  const content        = analyzeContent(html)
  const responsiveness = analyzeResponsiveness(html)
  const seo            = analyzeSEO(html, url)

  const overall = Math.round(
    (performance + accessibility + design + content + responsiveness + seo) / 6
  )

  return { overall, performance, accessibility, design, content, responsiveness, seo }
}

function analyzePerformance(html: string): number {
  if (!html) return 50
  let score = 100

  const bytes = new TextEncoder().encode(html).length
  if (bytes > 500_000) score -= 25
  else if (bytes > 200_000) score -= 12
  else if (bytes > 100_000) score -= 5

  const scripts = html.match(/<script(?![^>]*type=["']application\/ld\+json["'])/gi) || []
  if (scripts.length > 15) score -= 20
  else if (scripts.length > 8) score -= 10
  else if (scripts.length > 4) score -= 4

  const imgs = html.match(/<img[^>]*>/gi) || []
  const noLazy = imgs.filter(i => !/loading\s*=\s*["']lazy["']/i.test(i))
  if (noLazy.length > 3) score -= 12
  else if (noLazy.length > 1) score -= 6

  const sheets = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || []
  if (sheets.length > 6) score -= 10
  else if (sheets.length > 3) score -= 4

  const noDefer = scripts.filter(s => !/defer|async/i.test(s))
  if (noDefer.length > 3) score -= 8

  if (/<link[^>]*rel=["']preload["']/i.test(html)) score += 5

  return clamp(score)
}

function analyzeAccessibility(html: string): number {
  if (!html) return 50
  let score = 100

  const imgs = html.match(/<img[^>]*>/gi) || []
  const noAlt = imgs.filter(i => !/alt\s*=/i.test(i))
  score -= Math.min(30, noAlt.length * 6)

  if (!/<h1[^>]*>/i.test(html)) score -= 15
  if ((html.match(/<h1[^>]*>/gi) || []).length > 1) score -= 8
  if (!/<h[2-6][^>]*>/i.test(html)) score -= 10

  if (!/<html[^>]*lang=/i.test(html)) score -= 10

  const links = html.match(/<a[^>]*>/gi) || []
  const noLabel = links.filter(l =>
    !/aria-label|aria-labelledby|title\s*=/i.test(l) && !/>(?!\s*<)/i.test(l)
  )
  if (noLabel.length > 5) score -= 8

  if (!/<main[^>]*>/i.test(html)) score -= 8
  if (!/<nav[^>]*>/i.test(html)) score -= 4

  const inputs = html.match(/<input[^>]*>/gi) || []
  const noLabel2 = inputs.filter(inp =>
    !/type=["']hidden["']/i.test(inp) &&
    !/aria-label|id\s*=|placeholder\s*=/i.test(inp)
  )
  if (noLabel2.length > 0) score -= Math.min(10, noLabel2.length * 4)

  return clamp(score)
}

function analyzeDesign(html: string): number {
  if (!html) return 50
  let score = 100

  const hasFont =
    /font-family\s*:/i.test(html) ||
    /<link[^>]*(fonts\.googleapis|fonts\.bunny|typekit)/i.test(html) ||
    /@import[^;]*fonts/i.test(html)
  if (!hasFont) score -= 15

  const headings = html.match(/<h[1-3][^>]*>/gi) || []
  if (headings.length < 2) score -= 10
  if (headings.length > 10) score -= 5

  const semantic = html.match(/<(section|article|main|header|footer|nav|aside)[^>]*>/gi) || []
  if (semantic.length < 2) score -= 15
  else if (semantic.length < 4) score -= 7

  const hasSpacing = /padding\s*:|margin\s*:/i.test(html)
  if (!hasSpacing) score -= 15

  const hasGrid = /display\s*:\s*(flex|grid)/i.test(html)
  if (!hasGrid) score -= 10

  if (/<(video|canvas|svg)[^>]*>/i.test(html)) score += 5
  if (/animation|transition|transform/i.test(html)) score += 5

  return clamp(score)
}

function analyzeContent(html: string): number {
  if (!html) return 50
  let score = 100

  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = text.split(' ').filter(w => w.length > 2)

  if (words.length < 50) score -= 30
  else if (words.length < 100) score -= 18
  else if (words.length < 200) score -= 8

  const links = html.match(/<a[^>]*href=/gi) || []
  if (links.length < 2) score -= 15
  else if (links.length < 5) score -= 6

  const hasContact =
    /mailto:|contact|email|@[a-zA-Z0-9]/i.test(text) ||
    /linkedin\.com|github\.com|twitter\.com|x\.com/i.test(html)
  if (!hasContact) score -= 20

  const title = (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || ''
  if (!title) score -= 15
  else if (title.length < 10) score -= 8
  else if (title.length > 70) score -= 4

  const hasMetaDesc = /<meta[^>]*name=["']description["'][^>]*content=/i.test(html)
  if (!hasMetaDesc) score -= 10

  const hasAbout = /about|who i am|hi,? i'?m|hello,? i'?m/i.test(text)
  if (!hasAbout) score -= 8

  const hasProjects = /project|work|portfolio|case study/i.test(text)
  if (!hasProjects) score -= 8

  return clamp(score)
}

function analyzeResponsiveness(html: string): number {
  if (!html) return 50
  let score = 100

  if (!/<meta[^>]*name=["']viewport["']/i.test(html)) score -= 35

  if (!/@media/i.test(html)) score -= 20

  if (!/display\s*:\s*(flex|grid)/i.test(html)) score -= 15

  if (/width\s*:\s*\d+px(?!\s*max)/i.test(html)) score -= 8

  if (/<picture[^>]*>|srcset\s*=/i.test(html)) score += 8

  return clamp(score)
}

function analyzeSEO(html: string, url: string): number {
  if (!html) return 50
  let score = 100

  const title = (html.match(/<title[^>]*>([^<]+)<\/title>/i) || [])[1] || ''
  if (!title) score -= 20
  else if (title.length < 10 || title.length > 70) score -= 8

  if (!/<meta[^>]*name=["']description["'][^>]*content="[^"]{50,160}"/i.test(html)) score -= 15

  if (!/<h1[^>]*>/i.test(html)) score -= 15

  const imgNoAlt = (html.match(/<img[^>]*>/gi) || []).filter(i => !/alt\s*=/i.test(i))
  score -= Math.min(15, imgNoAlt.length * 4)

  if (!/<link[^>]*rel=["']canonical["']/i.test(html)) score -= 8

  if (!/<meta[^>]*property=["']og:/i.test(html)) score -= 10

  if (!/<html[^>]*lang=/i.test(html)) score -= 8

  const hasSchemaOrg = /application\/ld\+json|schema\.org/i.test(html)
  if (hasSchemaOrg) score += 8

  try {
    const u = new URL(url)
    if (u.protocol === 'https:') score += 5
  } catch { /* ignore */ }

  return clamp(score)
}

// ─── Issues ──────────────────────────────────────────────────────────────────

function detectIssues(html: string, url: string): AnalysisIssue[] {
  const issues: AnalysisIssue[] = []
  const text = html.replace(/<[^>]*>/g, ' ')

  // Critical
  if (!/<meta[^>]*name=["']viewport["']/i.test(html)) {
    issues.push({
      category: 'critical',
      title: 'Missing Viewport Meta Tag',
      description: 'No viewport meta tag found. Your site will break on mobile devices.',
      impact: 'high',
      fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> inside <head>.',
    })
  }

  const noAltImgs = (html.match(/<img[^>]*>/gi) || []).filter(i => !/alt\s*=/i.test(i))
  if (noAltImgs.length > 0) {
    issues.push({
      category: 'critical',
      title: `${noAltImgs.length} Image${noAltImgs.length > 1 ? 's' : ''} Missing Alt Text`,
      description: 'Images without alt text harm accessibility and SEO rankings.',
      impact: 'high',
      fix: 'Add descriptive alt attributes to every <img> tag. Use alt="" for purely decorative images.',
    })
  }

  if (!/<h1[^>]*>/i.test(html) && html) {
    issues.push({
      category: 'critical',
      title: 'No H1 Heading Found',
      description: 'Your page has no H1 tag. Search engines use this as the primary page signal.',
      impact: 'high',
      fix: 'Add a single, descriptive <h1> that summarises your page purpose.',
    })
  }

  // Warnings
  if (!/<title[^>]*>[^<]{10,}<\/title>/i.test(html) && html) {
    issues.push({
      category: 'warning',
      title: 'Missing or Short Page Title',
      description: 'A good title (40–60 chars) improves click-through rates in search results.',
      impact: 'medium',
      fix: 'Set a unique, keyword-rich <title> tag under 70 characters.',
    })
  }

  if (!/<meta[^>]*name=["']description["'][^>]*content="[^"]{50,}"/i.test(html) && html) {
    issues.push({
      category: 'warning',
      title: 'Missing Meta Description',
      description: 'No meta description found. This is shown in search results and social shares.',
      impact: 'medium',
      fix: 'Add a compelling meta description between 120–160 characters.',
    })
  }

  if (!/@media/i.test(html) && html) {
    issues.push({
      category: 'warning',
      title: 'No Responsive CSS Found',
      description: 'No media queries detected. Your layout may not adapt to different screen sizes.',
      impact: 'medium',
      fix: 'Add CSS media queries or use a responsive framework like Tailwind CSS.',
    })
  }

  const hasContact =
    /mailto:|contact|email|@[a-zA-Z0-9]/i.test(text) ||
    /linkedin\.com|github\.com/i.test(html)
  if (!hasContact && html) {
    issues.push({
      category: 'warning',
      title: 'No Contact Information',
      description: 'Recruiters need a way to reach you. No email, LinkedIn or GitHub found.',
      impact: 'high',
      fix: 'Add a contact section with at least an email address or LinkedIn profile link.',
    })
  }

  const scripts = html.match(/<script(?![^>]*type=["']application\/ld\+json["'])[^>]*src=/gi) || []
  const noDefer = scripts.filter(s => !/defer|async/i.test(s))
  if (noDefer.length > 2) {
    issues.push({
      category: 'warning',
      title: 'Render-Blocking Scripts',
      description: `${noDefer.length} scripts load synchronously, potentially blocking page render.`,
      impact: 'medium',
      fix: 'Add defer or async attributes to external <script> tags.',
    })
  }

  // Suggestions
  if (!/<meta[^>]*property=["']og:/i.test(html) && html) {
    issues.push({
      category: 'suggestion',
      title: 'No Open Graph Tags',
      description: 'Without OG tags, links to your portfolio look plain when shared on social media.',
      impact: 'low',
      fix: 'Add og:title, og:description, og:image and og:url meta tags.',
    })
  }

  if (!/application\/ld\+json|schema\.org/i.test(html) && html) {
    issues.push({
      category: 'suggestion',
      title: 'No Structured Data (Schema.org)',
      description: 'Structured data helps search engines understand your content and can generate rich results.',
      impact: 'low',
      fix: 'Add JSON-LD structured data with Person and Portfolio schemas.',
    })
  }

  const lazyImgs = (html.match(/<img[^>]*>/gi) || []).filter(i =>
    !/loading\s*=\s*["']lazy["']/i.test(i)
  )
  if (lazyImgs.length > 2) {
    issues.push({
      category: 'suggestion',
      title: `${lazyImgs.length} Images Without Lazy Loading`,
      description: 'Lazy loading defers off-screen images and speeds up initial page load.',
      impact: 'low',
      fix: 'Add loading="lazy" to images that are below the fold.',
    })
  }

  if (!/<link[^>]*rel=["']preload["']/i.test(html) && html) {
    issues.push({
      category: 'suggestion',
      title: 'No Resource Preloading',
      description: 'Preloading critical fonts and images can significantly improve perceived load time.',
      impact: 'low',
      fix: 'Add <link rel="preload"> for your main font and hero image.',
    })
  }

  return issues
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)))
}

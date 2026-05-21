import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { parseGitHubUrl, getRepoInfo, readRepoFiles } from '@/lib/github'

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'
const NVIDIA_MODEL   = 'google/gemma-3n-e2b-it'

const SYSTEM_PROMPT = `You are a brutally honest senior engineer reviewing a developer portfolio's source code. 
You have deep knowledge of what makes a portfolio get a developer hired vs discarded.

You analyze: code quality, component structure, accessibility, SEO, performance patterns, 
content clarity, missing sections, design consistency, and recruiter-visible issues.

You give feedback like a roast comedian who happens to be a tech lead:
- Direct, specific, reference actual code you see
- Funny but constructive — mock the bad patterns, not the person
- Prioritize issues by impact on getting hired
- Always end with genuine positives

Return ONLY valid JSON, no markdown, no extra text.`

function buildCodePrompt(files: { path: string; content: string }[]): string {
  const codeContext = files
    .map(f => `=== ${f.path} ===\n${f.content.slice(0, 3000)}`)
    .join('\n\n')
    .slice(0, 90_000)

  return `Analyze this portfolio repository's source code and give expert feedback.

REPOSITORY FILES:
${codeContext}

Based on this code, identify:
1. What this portfolio is about (framework, tech stack, developer's role)
2. Critical issues that would cause a recruiter to leave immediately
3. Code quality issues that signal bad practices
4. Missing sections or content (projects, contact, about, etc.)
5. SEO and accessibility problems in the code
6. What actually looks good

Respond ONLY with this JSON:
{
  "summary": "2-3 sentences: what this portfolio is, tech stack detected, overall impression",
  "roast": "2-3 sentence brutal but funny critique referencing specific things you see in the code",
  "recruiterTake": "What a hiring manager thinks in the first 10 seconds — be specific",
  "issues": [
    {
      "severity": "critical|warning|info",
      "file": "path/to/file.tsx",
      "title": "Short issue title",
      "description": "What's wrong and why it matters for getting hired",
      "fix": "Specific code change or approach to fix it"
    }
  ],
  "positives": [
    "Specific thing that's done well, reference actual code"
  ],
  "score": {
    "overall": 0-100,
    "codeQuality": 0-100,
    "accessibility": 0-100,
    "seo": 0-100,
    "content": 0-100,
    "performance": 0-100
  }
}`
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { repoUrl } = await req.json()
  const parsed = parseGitHubUrl(repoUrl)
  if (!parsed) {
    return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 })
  }

  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'NVIDIA_API_KEY not configured' }, { status: 500 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        )
      }

      try {
        send('status', { message: 'Fetching repository info...' })
        const info = await getRepoInfo(parsed.owner, parsed.repo, session.accessToken)

        send('status', { message: `Reading ${info.repo} source code...` })
        const files = await readRepoFiles(parsed.owner, parsed.repo, session.accessToken)

        send('status', { message: `Scanned ${files.length} files. Running AI analysis...` })
        send('files', { files: files.map(f => ({ path: f.path, size: f.size })) })

        const prompt = buildCodePrompt(files)

        const response = await fetch(NVIDIA_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            Accept: 'text/event-stream',
          },
          body: JSON.stringify({
            model: NVIDIA_MODEL,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: prompt },
            ],
            max_tokens: 2000,
            temperature: 0.3,
            top_p: 0.8,
            stream: true,
          }),
        })

        if (!response.ok || !response.body) {
          throw new Error(`Gemma API error: ${response.status}`)
        }

        const reader = response.body.getReader()
        const dec = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = dec.decode(value, { stream: true })
          for (const line of chunk.split('\n')) {
            if (!line.startsWith('data: ')) continue
            const payload = line.slice(6).trim()
            if (payload === '[DONE]') break
            try {
              const parsed = JSON.parse(payload)
              const delta = parsed.choices?.[0]?.delta?.content ?? ''
              if (delta) {
                accumulated += delta
                send('token', { token: delta })
              }
            } catch { /* skip malformed chunks */ }
          }
        }

        // Parse and send final result
        const jsonMatch = accumulated.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          try {
            const result = JSON.parse(jsonMatch[0])
            send('result', {
              ...result,
              repoInfo: {
                owner: parsed.owner,
                repo: parsed.repo,
                branch: info.defaultBranch,
                fileCount: files.length,
              },
              rawFiles: files.map(f => ({
                path: f.path,
                sha: f.sha,
                content: f.content,
              })),
            })
          } catch {
            send('error', { message: 'Failed to parse AI response' })
          }
        } else {
          send('error', { message: 'AI returned unexpected format' })
        }
      } catch (err) {
        send('error', { message: err instanceof Error ? err.message : 'Unknown error' })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { createBranch, commitFile, createPullRequest } from '@/lib/github'

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'
const NVIDIA_MODEL   = 'google/gemma-3n-e2b-it'

const AGENT_SYSTEM = `You are an expert frontend developer improving a portfolio website's code.
Your goal: make changes that help the developer get hired.

Rules:
- Return ONLY the complete improved file content, no explanations, no markdown fences
- Preserve the original framework, language and structure
- Make targeted improvements: SEO meta tags, accessibility (alt text, ARIA, semantic HTML), 
  performance (lazy loading, optimization hints), content clarity, missing sections
- Do NOT rewrite the entire file unless it's very short — make surgical improvements
- If the file doesn't need changes, return the exact original content unchanged`

interface FileToImprove {
  path: string
  content: string
  sha: string
  issue?: string
}

async function improveFile(
  file: FileToImprove,
  context: string,
  apiKey: string
): Promise<{ improved: string; changed: boolean }> {
  const prompt = `Portfolio context: ${context}

Improve this file to help the developer get hired. Apply SEO, accessibility, and content fixes.

File: ${file.path}
${file.issue ? `Known issues: ${file.issue}` : ''}

Current content:
${file.content.slice(0, 8000)}

Return ONLY the improved file content:`

  try {
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
          { role: 'system', content: AGENT_SYSTEM },
          { role: 'user', content: prompt },
        ],
        max_tokens: 3000,
        temperature: 0.15,
        top_p: 0.7,
        stream: true,
      }),
    })

    if (!response.ok || !response.body) {
      return { improved: file.content, changed: false }
    }

    const reader = response.body.getReader()
    const dec = new TextDecoder()
    let result = ''

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
          result += delta
        } catch { /* skip */ }
      }
    }

    const improved = result.trim()
    const changed = improved.length > 10 && improved !== file.content.trim()
    return { improved: changed ? improved : file.content, changed }
  } catch {
    return { improved: file.content, changed: false }
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const apiKey = process.env.NVIDIA_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'NVIDIA_API_KEY not configured' }, { status: 500 })
  }

  const {
    owner,
    repo,
    branch: baseBranch,
    files,
    summary,
    issues,
  }: {
    owner: string
    repo: string
    branch: string
    files: FileToImprove[]
    summary: string
    issues: { file?: string; title: string; fix: string }[]
  } = await req.json()

  const encoder = new TextEncoder()
  const branchName = `riiive/improvements-${Date.now()}`

  // Build issue map per file
  const issuesByFile: Record<string, string[]> = {}
  for (const issue of issues ?? []) {
    if (issue.file) {
      if (!issuesByFile[issue.file]) issuesByFile[issue.file] = []
      issuesByFile[issue.file].push(`${issue.title}: ${issue.fix}`)
    }
  }

  const stream = new ReadableStream({
    async start(controller) {
      function send(event: string, data: unknown) {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        )
      }

      try {
        send('status', { message: `Creating branch: ${branchName}` })
        await createBranch(owner, repo, branchName, baseBranch, session.accessToken)
        send('branch', { name: branchName })

        const changedFiles: { path: string; content: string }[] = []

        // Prioritise files with known issues
        const prioritized = [...files].sort((a, b) => {
          const aHas = issuesByFile[a.path] ? 1 : 0
          const bHas = issuesByFile[b.path] ? 1 : 0
          return bHas - aHas
        })

        for (const file of prioritized.slice(0, 15)) { // cap at 15 files
          send('processing', { file: file.path, status: 'improving' })

          const issueContext = (issuesByFile[file.path] ?? []).join('; ')
          const { improved, changed } = await improveFile(
            { ...file, issue: issueContext },
            summary,
            apiKey
          )

          if (changed) {
            send('processing', { file: file.path, status: 'committing', preview: improved.slice(0, 500) })
            try {
              await commitFile(
                owner, repo, file.path, improved,
                `riiive: improve ${file.path}`,
                branchName, file.sha,
                session.accessToken
              )
              changedFiles.push({ path: file.path, content: improved })
              send('committed', { file: file.path })
            } catch (err) {
              send('warning', {
                file: file.path,
                message: err instanceof Error ? err.message : 'Commit failed',
                fallback: improved,
              })
            }
          } else {
            send('skipped', { file: file.path, reason: 'No changes needed' })
          }
        }

        if (changedFiles.length === 0) {
          send('done', {
            pr: null,
            message: 'No files needed changes — your portfolio is already in good shape!',
            changedFiles: [],
          })
          controller.close()
          return
        }

        send('status', { message: 'Creating Pull Request...' })
        const prBody = `## Riiive AI Portfolio Improvements

This PR was automatically generated by [Riiive](https://riiive.dev) based on portfolio analysis.

### Changes made (${changedFiles.length} files):
${changedFiles.map(f => `- \`${f.path}\``).join('\n')}

### Issues addressed:
${issues.slice(0, 8).map(i => `- **${i.title}**: ${i.fix}`).join('\n')}

---
> Review each change before merging. The AI improves SEO, accessibility, and content — 
> but you know your portfolio best. Merge what you like, reject the rest.`

        const pr = await createPullRequest(
          owner, repo, branchName, baseBranch,
          'Riiive: AI Portfolio Improvements',
          prBody,
          session.accessToken
        )

        send('done', {
          pr,
          changedFiles: changedFiles.map(f => f.path),
          message: `Done! ${changedFiles.length} files improved. PR #${pr.number} ready for review.`,
        })
      } catch (err) {
        send('error', { message: err instanceof Error ? err.message : 'Agent failed' })
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

const GH_API = 'https://api.github.com'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RepoFile {
  path: string
  content: string
  sha: string
  size: number
}

export interface RepoInfo {
  owner: string
  repo: string
  defaultBranch: string
  description: string | null
}

// ─── Parse GitHub URL ─────────────────────────────────────────────────────────

export function parseGitHubUrl(input: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(input.startsWith('http') ? input : `https://${input}`)
    if (!url.hostname.includes('github.com')) return null
    const parts = url.pathname.replace(/^\//, '').split('/')
    if (parts.length < 2) return null
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, '') }
  } catch {
    return null
  }
}

// ─── Get repo info ────────────────────────────────────────────────────────────

export async function getRepoInfo(owner: string, repo: string, token: string): Promise<RepoInfo> {
  const res = await ghFetch(`/repos/${owner}/${repo}`, token)
  if (!res.ok) throw new Error(`Repo not found: ${owner}/${repo}`)
  const data = await res.json()
  return {
    owner,
    repo,
    defaultBranch: data.default_branch,
    description: data.description,
  }
}

// ─── Read file tree ───────────────────────────────────────────────────────────

const RELEVANT_EXTENSIONS = new Set([
  '.tsx', '.ts', '.jsx', '.js', '.html', '.css', '.scss',
  '.json', '.md', '.mdx', '.astro', '.svelte', '.vue',
])

const SKIP_DIRS = new Set([
  'node_modules', '.next', '.git', 'dist', 'build', '.vercel',
  'coverage', '.nyc_output', 'out', '.turbo', 'vendor',
])

export async function getRepoFileTree(
  owner: string,
  repo: string,
  branch: string,
  token: string
): Promise<{ path: string; sha: string; size: number }[]> {
  const res = await ghFetch(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    token
  )
  if (!res.ok) throw new Error('Failed to fetch file tree')
  const data = await res.json()

  return (data.tree as { path: string; type: string; sha: string; size: number }[])
    .filter(item => {
      if (item.type !== 'blob') return false
      const parts = item.path.split('/')
      if (parts.some(p => SKIP_DIRS.has(p))) return false
      const ext = item.path.slice(item.path.lastIndexOf('.'))
      return RELEVANT_EXTENSIONS.has(ext)
    })
    .slice(0, 80) // cap at 80 files to avoid token overflow
}

// ─── Read single file ─────────────────────────────────────────────────────────

export async function getFileContent(
  owner: string,
  repo: string,
  path: string,
  token: string
): Promise<string> {
  const res = await ghFetch(`/repos/${owner}/${repo}/contents/${path}`, token)
  if (!res.ok) return ''
  const data = await res.json()
  if (data.encoding === 'base64') {
    return Buffer.from(data.content, 'base64').toString('utf-8')
  }
  return data.content ?? ''
}

// ─── Read multiple files (capped by size) ────────────────────────────────────

export async function readRepoFiles(
  owner: string,
  repo: string,
  token: string,
  maxChars = 120_000
): Promise<RepoFile[]> {
  const info = await getRepoInfo(owner, repo, token)
  const tree = await getRepoFileTree(owner, repo, info.defaultBranch, token)

  const files: RepoFile[] = []
  let totalChars = 0

  for (const item of tree) {
    if (totalChars >= maxChars) break
    if (item.size > 50_000) continue // skip huge files

    try {
      const content = await getFileContent(owner, repo, item.path, token)
      totalChars += content.length
      files.push({ path: item.path, content, sha: item.sha, size: item.size })
    } catch {
      // skip unreadable files
    }
  }

  return files
}

// ─── Create branch ────────────────────────────────────────────────────────────

export async function createBranch(
  owner: string,
  repo: string,
  branchName: string,
  fromBranch: string,
  token: string
): Promise<void> {
  const refRes = await ghFetch(`/repos/${owner}/${repo}/git/refs/heads/${fromBranch}`, token)
  if (!refRes.ok) throw new Error('Could not get base branch ref')
  const { object } = await refRes.json()

  const res = await ghFetch(`/repos/${owner}/${repo}/git/refs`, token, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branchName}`, sha: object.sha }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Failed to create branch: ${err.message}`)
  }
}

// ─── Commit file ─────────────────────────────────────────────────────────────

export async function commitFile(
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  branch: string,
  currentSha: string,
  token: string
): Promise<void> {
  const encoded = Buffer.from(content).toString('base64')
  const res = await ghFetch(`/repos/${owner}/${repo}/contents/${path}`, token, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: encoded,
      sha: currentSha,
      branch,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Failed to commit ${path}: ${err.message}`)
  }
}

// ─── Create Pull Request ──────────────────────────────────────────────────────

export async function createPullRequest(
  owner: string,
  repo: string,
  head: string,
  base: string,
  title: string,
  body: string,
  token: string
): Promise<{ url: string; number: number }> {
  const res = await ghFetch(`/repos/${owner}/${repo}/pulls`, token, {
    method: 'POST',
    body: JSON.stringify({ title, body, head, base, draft: false }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Failed to create PR: ${err.message}`)
  }
  const data = await res.json()
  return { url: data.html_url, number: data.number }
}

// ─── Internal fetch helper ────────────────────────────────────────────────────

function ghFetch(path: string, token: string, init?: RequestInit): Promise<Response> {
  return fetch(`${GH_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
}

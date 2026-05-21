'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useGitHubSession, signInWithGitHub } from '@/lib/use-session'
import { FileIcon, FolderIcon } from '@/components/material-icons'

const FONT_BODY = 'Roboto, -apple-system, sans-serif'
const FONT_MONO = '"Roboto Mono", "Fira Code", monospace'
const FONT_HEAD = '"Plus Jakarta Sans", -apple-system, Roboto, sans-serif'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Issue {
  severity: 'critical' | 'warning' | 'info'
  file?: string
  title: string
  description: string
  fix: string
}

interface AnalysisResult {
  summary: string
  roast: string
  recruiterTake: string
  issues: Issue[]
  positives: string[]
  score: {
    overall: number
    codeQuality: number
    accessibility: number
    seo: number
    content: number
    performance: number
  }
  repoInfo: { owner: string; repo: string; branch: string; fileCount: number }
  rawFiles: { path: string; sha: string; content: string }[]
}

type AgentStatus =
  | { type: 'idle' }
  | { type: 'analyzing'; message: string }
  | { type: 'done_analysis'; result: AnalysisResult }
  | { type: 'improving'; file: string; message: string }
  | { type: 'done'; prUrl: string; prNumber: number; changedFiles: string[] }
  | { type: 'error'; message: string }

type LogEntry = { id: number; type: 'status' | 'file' | 'commit' | 'skip' | 'warn' | 'error'; text: string }

// ─── File tree types ──────────────────────────────────────────────────────────

interface TreeFile { kind: 'file'; name: string; path: string }
interface TreeDir  { kind: 'dir';  name: string; path: string; children: TreeNode[] }
type TreeNode = TreeFile | TreeDir

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  if (s >= 80) return 'text-green-400'
  if (s >= 60) return 'text-yellow-400'
  return 'text-red-400'
}

function severityColor(s: Issue['severity']) {
  if (s === 'critical') return 'text-red-400 border-red-500/20 bg-red-500/5'
  if (s === 'warning')  return 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5'
  return 'text-blue-400 border-blue-500/20 bg-blue-500/5'
}

function buildTree(paths: string[]): TreeNode[] {
  const root: TreeDir = { kind: 'dir', name: '', path: '', children: [] }
  for (const p of paths) {
    const parts = p.split('/')
    let cur = root
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const isLast = i === parts.length - 1
      const fullPath = parts.slice(0, i + 1).join('/')
      if (isLast) {
        cur.children.push({ kind: 'file', name: part, path: p })
      } else {
        let dir = cur.children.find(n => n.kind === 'dir' && n.name === part) as TreeDir | undefined
        if (!dir) {
          dir = { kind: 'dir', name: part, path: fullPath, children: [] }
          cur.children.push(dir)
        }
        cur = dir
      }
    }
  }
  return root.children
}

// ─── VS Code-style tree node ──────────────────────────────────────────────────

function TreeNode({
  node, depth, activeFile, onSelect, openDirs, toggleDir, processedFiles,
}: {
  node: TreeNode
  depth: number
  activeFile: string | null
  onSelect: (p: string) => void
  openDirs: Set<string>
  toggleDir: (p: string) => void
  processedFiles: Record<string, 'improved' | 'skipped' | 'processing' | 'error'>
}) {
  const indent = depth * 12

  if (node.kind === 'dir') {
    const isOpen = openDirs.has(node.path)
    return (
      <div>
        <button
          onClick={() => toggleDir(node.path)}
          className="flex items-center gap-1.5 w-full py-[3px] px-2 hover:bg-white/[0.04] text-[#838383] hover:text-white transition-colors rounded"
          style={{ paddingLeft: indent + 8 }}
        >
          {/* chevron */}
          <svg viewBox="0 0 16 16" fill="currentColor" className={`w-3 h-3 shrink-0 transition-transform text-[#555] ${isOpen ? 'rotate-90' : ''}`}>
            <path d="M6 4l4 4-4 4V4z"/>
          </svg>
          {/* folder icon */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0 text-[#e2b96a]">
            {isOpen
              ? <path d="M20 6h-8l-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
              : <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
            }
          </svg>
          <span className="text-xs truncate" style={{ fontFamily: FONT_MONO }}>{node.name}</span>
        </button>
        {isOpen && node.children.map(child => (
          <TreeNode key={child.path} node={child} depth={depth + 1} activeFile={activeFile} onSelect={onSelect} openDirs={openDirs} toggleDir={toggleDir} processedFiles={processedFiles} />
        ))}
      </div>
    )
  }

  const status = processedFiles[node.path]
  const isActive = activeFile === node.path

  return (
    <button
      onClick={() => onSelect(node.path)}
      className={`flex items-center gap-1.5 w-full py-[3px] px-2 rounded transition-colors truncate ${isActive ? 'bg-white/[0.08] text-white' : 'text-[#838383] hover:text-white hover:bg-white/[0.04]'}`}
      style={{ paddingLeft: indent + 20 }}
    >
      <FileIcon name={node.name} />
      <span className="text-xs truncate flex-1 text-left" style={{ fontFamily: FONT_MONO }}>{node.name}</span>
      {/* status dot */}
      {status === 'processing' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse shrink-0" />}
      {status === 'improved'   && <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />}
      {status === 'error'      && <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />}
    </button>
  )
}

// ─── Code viewer ──────────────────────────────────────────────────────────────

function CodeViewer({ content, path }: { content: string; path: string }) {
  const lines = content.split('\n')
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06] shrink-0 bg-[#0d0d0d]">
        <FileIcon name={path.split('/').pop() ?? ''} />
        <span className="text-[11px] text-[#838383]" style={{ fontFamily: FONT_MONO }}>{path}</span>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-xs" style={{ fontFamily: FONT_MONO }}>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-white/[0.02] leading-5">
                <td className="select-none text-right text-[#2a2a2a] w-10 px-3 py-0 align-top shrink-0 tabular-nums" style={{ minWidth: 44 }}>{i + 1}</td>
                <td className="pl-4 pr-6 py-0 text-[#838383] whitespace-pre">{line || ' '}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Web preview pane ─────────────────────────────────────────────────────────

function WebPreview({ owner, repo, files }: {
  owner: string
  repo: string
  files: { path: string; content: string }[]
}) {
  const [loaded, setLoaded] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    // Try to find deployed URL from config files
    for (const f of files) {
      // vercel.json / netlify.toml with custom domain unlikely, skip
      // Check package.json for homepage field
      if (f.path === 'package.json') {
        try {
          const pkg = JSON.parse(f.content)
          if (pkg.homepage && pkg.homepage.startsWith('http')) {
            setPreviewUrl(pkg.homepage)
            return
          }
        } catch { /* skip */ }
      }
      // astro.config site field
      if (f.path.startsWith('astro.config')) {
        const m = f.content.match(/site:\s*['"]([^'"]+)['"]/)
        if (m?.[1]?.startsWith('http')) { setPreviewUrl(m[1]); return }
      }
      // next.config env
      if (f.path === '.env' || f.path === '.env.production') {
        const m = f.content.match(/NEXT_PUBLIC_SITE_URL=(.+)/)
        if (m?.[1]?.trim().startsWith('http')) { setPreviewUrl(m[1].trim()); return }
      }
    }
    // Fallback: try vercel deploy URL pattern
    setPreviewUrl(`https://${repo}.vercel.app`)
  }, [files, repo])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] bg-[#0d0d0d] shrink-0">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
        <div className="flex-1 flex items-center bg-white/[0.04] border border-white/[0.07] rounded px-2 py-0.5 min-w-0">
          <span className="text-[10px] text-[#505050] truncate" style={{ fontFamily: FONT_MONO }}>
            {previewUrl ?? `${owner}/${repo}`}
          </span>
        </div>
        {previewUrl && (
          <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="text-[#444] hover:text-white transition-colors shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M200 896V760h60v76h440V336H260v76h-60V276h560v620H200Zm224-166-42-42 142-142H200v-60h324L382 344l42-42 220 220-220 220Z"/>
            </svg>
          </a>
        )}
      </div>

      {/* iframe */}
      <div className="flex-1 relative bg-white overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 bg-[#0d0d0d] flex flex-col items-center justify-center gap-3 z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" />
            <span className="text-[11px] text-[#333]" style={{ fontFamily: FONT_BODY }}>Loading preview...</span>
            {previewUrl && (
              <span className="text-[10px] text-[#2a2a2a]" style={{ fontFamily: FONT_MONO }}>{previewUrl}</span>
            )}
          </div>
        )}
        {previewUrl ? (
          <iframe
            key={previewUrl}
            src={previewUrl}
            className="w-full h-full border-0"
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }}
            onLoad={() => setLoaded(true)}
            onError={() => setLoaded(true)}
            title="Portfolio preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div className="absolute inset-0 bg-[#0d0d0d] flex items-center justify-center">
            <span className="text-xs text-[#333]" style={{ fontFamily: FONT_BODY }}>No preview URL found</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-[#505050]" style={{ fontFamily: FONT_BODY }}>
      <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse shrink-0" />
      {label}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AgentRepoPage() {
  const params = useParams<{ owner: string; repo: string }>()
  const owner   = params.owner
  const repo    = params.repo
  const repoUrl = `https://github.com/${owner}/${repo}`

  const { session, status: authStatus } = useGitHubSession()

  const [agentStatus,    setAgentStatus]    = useState<AgentStatus>({ type: 'idle' })
  const [log,            setLog]            = useState<LogEntry[]>([])
  const [activeTab,      setActiveTab]      = useState<'feedback' | 'log'>('feedback')
  const [centerPanel,    setCenterPanel]    = useState<'code' | 'preview'>('preview')
  const [activeFile,     setActiveFile]     = useState<string | null>(null)
  const [processedFiles, setProcessedFiles] = useState<Record<string, 'improved' | 'skipped' | 'processing' | 'error'>>({})
  const [openDirs,       setOpenDirs]       = useState<Set<string>>(new Set())
  const [streamingText,  setStreamingText]  = useState('')
  const logRef     = useRef<HTMLDivElement>(null)
  const logIdRef   = useRef(0)
  const startedRef = useRef(false)

  function addLog(type: LogEntry['type'], text: string) {
    setLog(prev => [...prev, { id: logIdRef.current++, type, text }])
  }

  const toggleDir = useCallback((path: string) => {
    setOpenDirs(prev => {
      const next = new Set(prev)
      next.has(path) ? next.delete(path) : next.add(path)
      return next
    })
  }, [])

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [log])

  // Auto-start once authenticated
  useEffect(() => {
    if (authStatus === 'authenticated' && !startedRef.current) {
      startedRef.current = true
      startAnalysis()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStatus])

  // Auto-open top-level dirs when files arrive
  useEffect(() => {
    const result = agentStatus.type === 'done_analysis' ? agentStatus.result : null
    if (!result) return
    const topDirs = new Set<string>()
    for (const f of result.rawFiles) {
      const parts = f.path.split('/')
      if (parts.length > 1) topDirs.add(parts[0])
    }
    setOpenDirs(topDirs)
  }, [agentStatus])

  async function startAnalysis() {
    setAgentStatus({ type: 'analyzing', message: 'Connecting to GitHub...' })
    setStreamingText('')
    setLog([])
    setProcessedFiles({})

    try {
      const response = await fetch('/api/agent/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl }),
      })
      if (!response.ok || !response.body) {
        throw new Error(`Server error ${response.status}`)
      }

      const reader = response.body.getReader()
      const dec    = new TextDecoder()
      let buffer   = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += dec.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop() ?? ''

        for (const raw of events) {
          const lines     = raw.split('\n')
          const eventType = lines.find(l => l.startsWith('event: '))?.slice(7)
          const dataLine  = lines.find(l => l.startsWith('data: '))?.slice(6)
          if (!eventType || !dataLine) continue
          try {
            const data = JSON.parse(dataLine)
            if (eventType === 'status') {
              setAgentStatus(s => ({ ...s, message: data.message } as AgentStatus))
              addLog('status', data.message)
            } else if (eventType === 'files') {
              addLog('status', `Found ${data.files.length} relevant files`)
            } else if (eventType === 'token') {
              setStreamingText(t => t + data.token)
            } else if (eventType === 'result') {
              setAgentStatus({ type: 'done_analysis', result: data })
              setActiveTab('feedback')
              setStreamingText('')
            } else if (eventType === 'error') {
              throw new Error(data.message)
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue
            throw e
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setAgentStatus({ type: 'error', message: msg })
      addLog('error', msg)
    }
  }

  async function startImprovement(result: AnalysisResult) {
    setAgentStatus({ type: 'improving', file: '', message: 'Starting AI agent...' })
    setCenterPanel('code')
    addLog('status', 'Starting improvement agent...')
    setProcessedFiles({})

    try {
      const response = await fetch('/api/agent/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner: result.repoInfo.owner,
          repo:  result.repoInfo.repo,
          branch: result.repoInfo.branch,
          files:  result.rawFiles,
          summary: result.summary,
          issues:  result.issues,
        }),
      })
      if (!response.ok || !response.body) throw new Error('Improvement request failed')

      const reader = response.body.getReader()
      const dec    = new TextDecoder()
      let buffer   = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += dec.decode(value, { stream: true })
        const events = buffer.split('\n\n')
        buffer = events.pop() ?? ''

        for (const raw of events) {
          const lines     = raw.split('\n')
          const eventType = lines.find(l => l.startsWith('event: '))?.slice(7)
          const dataLine  = lines.find(l => l.startsWith('data: '))?.slice(6)
          if (!eventType || !dataLine) continue
          try {
            const data = JSON.parse(dataLine)
            if (eventType === 'status') {
              setAgentStatus(s => ({ ...s, message: data.message } as AgentStatus))
              addLog('status', data.message)
            } else if (eventType === 'branch') {
              addLog('status', `Created branch: ${data.name}`)
            } else if (eventType === 'processing') {
              setAgentStatus({ type: 'improving', file: data.file, message: `${data.status === 'improving' ? 'Improving' : 'Committing'} ${data.file}...` })
              setActiveFile(data.file)
              setProcessedFiles(p => ({ ...p, [data.file]: 'processing' }))
              addLog('file', `${data.status === 'improving' ? 'Improving' : 'Committing'} ${data.file}`)
            } else if (eventType === 'committed') {
              setProcessedFiles(p => ({ ...p, [data.file]: 'improved' }))
              addLog('commit', `✓ ${data.file}`)
            } else if (eventType === 'skipped') {
              setProcessedFiles(p => ({ ...p, [data.file]: 'skipped' }))
              addLog('skip', `— ${data.file}`)
            } else if (eventType === 'warning') {
              setProcessedFiles(p => ({ ...p, [data.file]: 'error' }))
              addLog('warn', `${data.file}: ${data.message}`)
            } else if (eventType === 'done') {
              if (data.pr) {
                setAgentStatus({ type: 'done', prUrl: data.pr.url, prNumber: data.pr.number, changedFiles: data.changedFiles })
              } else {
                setAgentStatus({ type: 'done_analysis', result })
              }
              addLog('status', data.message)
            } else if (eventType === 'error') {
              throw new Error(data.message)
            }
          } catch (e) {
            if (e instanceof SyntaxError) continue
            const msg = e instanceof Error ? e.message : 'Unknown error'
            setAgentStatus({ type: 'error', message: msg })
            addLog('error', msg)
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setAgentStatus({ type: 'error', message: msg })
      addLog('error', msg)
    }
  }

  // ── Not signed in ─────────────────────────────────────────────────────────
  if (authStatus === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="max-w-sm flex flex-col gap-5 text-center">
          <h1 className="text-xl font-semibold text-white" style={{ fontFamily: FONT_HEAD }}>Connect GitHub to continue</h1>
          <p className="text-sm text-[#505050]" style={{ fontFamily: FONT_BODY }}>
            Riiive needs access to read <span className="text-white">{owner}/{repo}</span>
          </p>
          <button
            onClick={() => signInWithGitHub(`/agent/${owner}/${repo}`)}
            className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-white/90 transition-colors cursor-pointer"
            style={{ fontFamily: FONT_BODY }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
            Connect GitHub
          </button>
        </div>
      </div>
    )
  }

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse" />
      </div>
    )
  }

  const result            = agentStatus.type === 'done_analysis' ? agentStatus.result : null
  const files             = result?.rawFiles ?? []
  const treeNodes         = buildTree(files.map(f => f.path))
  const activeFileContent = files.find(f => f.path === activeFile)?.content ?? ''

  return (
    <div className="h-screen bg-[#0d0d0d] flex flex-col overflow-hidden text-white">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-white/[0.07] shrink-0 bg-[#111]">
        <a href="/" className="text-[#505050] hover:text-white transition-colors shrink-0 p-1">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-4 h-4">
            <path d="M313 576l224 224-57 56-280-280 280-280 57 56-224 224Z"/>
          </svg>
        </a>

        <div className="flex items-center gap-1.5 min-w-0">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#555] shrink-0">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
          </svg>
          <a href={repoUrl} target="_blank" rel="noopener noreferrer"
            className="text-sm text-[#838383] hover:text-white transition-colors truncate"
            style={{ fontFamily: FONT_MONO }}>
            <span className="text-[#555]">{owner}/</span><span className="text-white">{repo}</span>
          </a>
        </div>

        {/* Center panel toggle */}
        <div className="flex items-center gap-px border border-white/[0.08] rounded-lg overflow-hidden ml-4">
          {(['preview', 'code'] as const).map(p => (
            <button key={p} onClick={() => setCenterPanel(p)}
              className={`px-3 py-1 text-[11px] capitalize transition-colors ${centerPanel === p ? 'bg-white/10 text-white' : 'text-[#444] hover:text-[#838383]'}`}
              style={{ fontFamily: FONT_BODY }}>
              {p}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-4 shrink-0">
          {(agentStatus.type === 'analyzing' || agentStatus.type === 'improving') && (
            <Spinner label={agentStatus.type === 'analyzing' ? 'Analyzing...' : (agentStatus as { type: 'improving'; file: string; message: string }).message} />
          )}
          {agentStatus.type === 'done_analysis' && result && (
            <div className="flex items-center gap-1.5">
              <span className={`text-lg font-bold tabular-nums ${scoreColor(result.score.overall)}`} style={{ fontFamily: FONT_HEAD }}>{result.score.overall}</span>
              <span className="text-[10px] text-[#333] uppercase tracking-widest" style={{ fontFamily: FONT_BODY }}>/100</span>
            </div>
          )}
          {agentStatus.type === 'done' && (
            <a href={agentStatus.prUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-xs text-purple-400 hover:bg-purple-500/20 transition-colors"
              style={{ fontFamily: FONT_BODY }}>
              PR #{agentStatus.prNumber} ready →
            </a>
          )}
          {session && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#444]" style={{ fontFamily: FONT_BODY }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {session.login}
            </div>
          )}
        </div>
      </div>

      {/* ── Body: 4 columns ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Col 1: VS Code file tree */}
        <div className="w-56 border-r border-white/[0.07] flex flex-col overflow-hidden shrink-0 bg-[#111]">
          {/* Explorer header */}
          <div className="px-3 py-2 flex items-center justify-between shrink-0 border-b border-white/[0.05]">
            <span className="text-[10px] uppercase tracking-widest text-[#444] font-medium" style={{ fontFamily: FONT_BODY }}>Explorer</span>
            {files.length > 0 && (
              <span className="text-[10px] text-[#333]" style={{ fontFamily: FONT_MONO }}>{files.length} files</span>
            )}
          </div>
          {/* Repo root label */}
          {files.length > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-white/[0.04]">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-[#555] shrink-0 rotate-90"><path d="M6 4l4 4-4 4V4z"/></svg>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0 text-[#e2b96a]">
                <path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
              </svg>
              <span className="text-xs text-white font-medium truncate" style={{ fontFamily: FONT_MONO }}>{repo}</span>
            </div>
          )}
          <div className="flex-1 overflow-y-auto py-1">
            {files.length > 0 ? (
              treeNodes.map(node => (
                <TreeNode key={node.path} node={node} depth={0} activeFile={activeFile} onSelect={f => { setActiveFile(f); setCenterPanel('code') }} openDirs={openDirs} toggleDir={toggleDir} processedFiles={processedFiles} />
              ))
            ) : (
              <p className="px-4 py-2 text-[11px] text-[#2a2a2a]" style={{ fontFamily: FONT_MONO }}>
                {agentStatus.type === 'analyzing' ? 'Scanning repo...' : 'No files yet'}
              </p>
            )}
          </div>
        </div>

        {/* Col 2: Code viewer or Web preview */}
        <div className="flex-1 overflow-hidden flex flex-col border-r border-white/[0.07]">
          {centerPanel === 'preview' ? (
            <WebPreview owner={owner} repo={repo} files={files} />
          ) : activeFile && activeFileContent ? (
            <CodeViewer content={activeFileContent} path={activeFile} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[#222] bg-[#0d0d0d]">
              {agentStatus.type === 'analyzing' ? (
                <div className="flex flex-col items-center gap-3 max-w-xs text-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                  <p className="text-xs text-[#333]" style={{ fontFamily: FONT_MONO }}>
                    {(agentStatus as { type: string; message: string }).message}
                  </p>
                  {streamingText && (
                    <pre className="text-[10px] text-[#1e1e1e] max-w-sm overflow-hidden leading-4 whitespace-pre-wrap text-left" style={{ fontFamily: FONT_MONO }}>
                      {streamingText.slice(-600)}
                    </pre>
                  )}
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-7 h-7 opacity-30">
                    <path d="M320 720h60V576h-60v144Zm239 0h60V432h-60v288Zm-119 0h60V624h-60v96Zm-320 96V240l80 80 80-80 80 80 80-80 80 80 80-80 80 80 80-80 80 80V816H120Z"/>
                  </svg>
                  <span className="text-xs opacity-30" style={{ fontFamily: FONT_MONO }}>Select a file to view code</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Col 3: Analysis panel */}
        <div className="w-80 xl:w-96 flex flex-col overflow-hidden shrink-0 bg-[#111]">

          {/* Tabs */}
          <div className="flex border-b border-white/[0.07] shrink-0">
            {(['feedback', 'log'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-xs capitalize transition-colors ${activeTab === tab ? 'text-white border-b border-white' : 'text-[#444] hover:text-[#838383]'}`}
                style={{ fontFamily: FONT_BODY }}>
                {tab}
                {tab === 'log' && log.length > 0 && (
                  <span className="ml-1 text-[#333]">({log.length})</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">

            {agentStatus.type === 'analyzing' && activeTab === 'feedback' && (
              <div className="p-4 flex flex-col gap-3">
                <Spinner label={agentStatus.message} />
                <p className="text-[11px] text-[#2a2a2a] leading-relaxed" style={{ fontFamily: FONT_BODY }}>
                  Reading source code and running AI analysis...
                </p>
              </div>
            )}

            {agentStatus.type === 'improving' && activeTab === 'feedback' && (
              <div className="p-4"><Spinner label={agentStatus.message} /></div>
            )}

            {agentStatus.type === 'error' && (
              <div className="p-4 flex flex-col gap-2">
                <p className="text-xs text-red-400" style={{ fontFamily: FONT_BODY }}>{agentStatus.message}</p>
                <button onClick={() => { startedRef.current = false; startAnalysis() }}
                  className="text-xs text-[#505050] hover:text-white transition-colors text-left cursor-pointer"
                  style={{ fontFamily: FONT_BODY }}>Retry →</button>
              </div>
            )}

            {/* PR done banner */}
            {agentStatus.type === 'done' && activeTab === 'feedback' && (
              <div className="p-4">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex flex-col gap-2">
                  <p className="text-sm font-medium text-white" style={{ fontFamily: FONT_HEAD }}>Pull Request ready</p>
                  <p className="text-xs text-[#838383]" style={{ fontFamily: FONT_BODY }}>
                    {agentStatus.changedFiles.length} files improved.
                  </p>
                  <a href={agentStatus.prUrl} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    style={{ fontFamily: FONT_BODY }}>
                    View PR #{agentStatus.prNumber} on GitHub →
                  </a>
                </div>
              </div>
            )}

            {/* Feedback */}
            {result && activeTab === 'feedback' && agentStatus.type !== 'done' && (
              <div className="flex flex-col">

                {/* Score grid */}
                <div className="p-4 border-b border-white/[0.06]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-widest text-[#333]" style={{ fontFamily: FONT_BODY }}>Score</span>
                    <span className={`text-2xl font-bold tabular-nums ${scoreColor(result.score.overall)}`} style={{ fontFamily: FONT_HEAD }}>
                      {result.score.overall}<span className="text-sm text-[#333] font-normal">/100</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(result.score).filter(([k]) => k !== 'overall').map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between px-2 py-1 rounded bg-white/[0.03]">
                        <span className="text-[10px] text-[#505050] capitalize" style={{ fontFamily: FONT_BODY }}>{key}</span>
                        <span className={`text-xs font-medium tabular-nums ${scoreColor(val as number)}`} style={{ fontFamily: FONT_MONO }}>{val as number}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Roast */}
                <div className="p-4 border-b border-white/[0.06] flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#333]" style={{ fontFamily: FONT_BODY }}>Roast</span>
                  <p className="text-sm text-white leading-relaxed italic" style={{ fontFamily: FONT_HEAD }}>
                    &ldquo;{result.roast}&rdquo;
                  </p>
                </div>

                {/* Recruiter */}
                <div className="p-4 border-b border-white/[0.06] flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#333]" style={{ fontFamily: FONT_BODY }}>Recruiter view</span>
                  <p className="text-sm text-[#838383] leading-relaxed" style={{ fontFamily: FONT_BODY }}>{result.recruiterTake}</p>
                </div>

                {/* Issues */}
                <div className="p-4 border-b border-white/[0.06] flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#333]" style={{ fontFamily: FONT_BODY }}>
                    Issues <span className="text-[#2a2a2a]">({result.issues.length})</span>
                  </span>
                  <div className="flex flex-col gap-2">
                    {result.issues.map((issue, i) => (
                      <div key={i} className={`rounded-lg border p-3 flex flex-col gap-1.5 ${severityColor(issue.severity)}`}>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-medium" style={{ fontFamily: FONT_BODY }}>{issue.title}</span>
                          <span className={`text-[9px] uppercase tracking-widest shrink-0 opacity-70`} style={{ fontFamily: FONT_BODY }}>{issue.severity}</span>
                        </div>
                        {issue.file && (
                          <button onClick={() => { setActiveFile(issue.file!); setCenterPanel('code') }}
                            className="text-[10px] text-[#444] hover:text-white transition-colors text-left truncate cursor-pointer"
                            style={{ fontFamily: FONT_MONO }}>
                            {issue.file}
                          </button>
                        )}
                        <p className="text-[11px] text-[#505050] leading-relaxed" style={{ fontFamily: FONT_BODY }}>{issue.description}</p>
                        <p className="text-[11px] text-white/40 leading-relaxed" style={{ fontFamily: FONT_BODY }}>Fix: {issue.fix}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Positives */}
                {result.positives.length > 0 && (
                  <div className="p-4 border-b border-white/[0.06] flex flex-col gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-[#333]" style={{ fontFamily: FONT_BODY }}>What works</span>
                    {result.positives.map((p, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#838383]" style={{ fontFamily: FONT_BODY }}>
                        <span className="text-green-500 shrink-0 mt-px">✓</span>{p}
                      </div>
                    ))}
                  </div>
                )}

                {/* Fix CTA */}
                <div className="p-4">
                  <button onClick={() => startImprovement(result)}
                    className="w-full py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    style={{ fontFamily: FONT_BODY }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-4 h-4">
                      <path d="M480 976q-33 0-56.5-23.5T400 896h160q0 33-23.5 56.5T480 976Zm-160-140v-60h320v60H320Zm10-120q-69-41-109.5-110T180 446q0-125 87.5-212.5T480 146q125 0 212.5 87.5T780 446q0 80-40.5 149T630 716H330Z"/>
                    </svg>
                    Fix automatically with AI
                  </button>
                  <p className="text-[10px] text-[#2a2a2a] text-center mt-2" style={{ fontFamily: FONT_BODY }}>Creates a Pull Request — you approve the merge.</p>
                </div>
              </div>
            )}

            {/* Log */}
            {activeTab === 'log' && (
              <div ref={logRef} className="p-3 flex flex-col gap-0.5 text-[11px]" style={{ fontFamily: FONT_MONO }}>
                {log.length === 0 ? (
                  <span className="text-[#222]">No activity yet</span>
                ) : log.map(entry => (
                  <div key={entry.id} className={
                    entry.type === 'error'  ? 'text-red-400'    :
                    entry.type === 'warn'   ? 'text-yellow-400' :
                    entry.type === 'commit' ? 'text-green-400'  :
                    entry.type === 'skip'   ? 'text-[#333]'     :
                    entry.type === 'file'   ? 'text-blue-400'   :
                    'text-[#444]'
                  }>
                    <span className="text-[#222] select-none">{'> '}</span>{entry.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Material Icon Theme — exact SVG icons matching the VSCode extension
// Colors sourced from pkief/vscode-material-icon-theme

const CLS = 'w-4 h-4 shrink-0'

// ─── Folder icons ─────────────────────────────────────────────────────────────

export function FolderIcon({ open, name }: { open: boolean; name: string }) {
  const lc = name.toLowerCase()

  // Named folder colours from Material Icon Theme
  let color = '#90a4ae'
  let darkColor = '#546e7a'

  if (['src', 'source', 'sources'].includes(lc))         { color = '#26a69a'; darkColor = '#00695c' }
  else if (['components', 'component'].includes(lc))      { color = '#7e57c2'; darkColor = '#4527a0' }
  else if (['pages', 'page', 'app'].includes(lc))         { color = '#42a5f5'; darkColor = '#1565c0' }
  else if (['lib', 'libs', 'library'].includes(lc))       { color = '#26c6da'; darkColor = '#00838f' }
  else if (['utils', 'util', 'helpers', 'helper'].includes(lc)) { color = '#26c6da'; darkColor = '#00838f' }
  else if (['hooks', 'hook'].includes(lc))                { color = '#ec407a'; darkColor = '#880e4f' }
  else if (['styles', 'style', 'css', 'sass', 'scss'].includes(lc)) { color = '#42a5f5'; darkColor = '#1565c0' }
  else if (['public', 'static', 'assets', 'images', 'img'].includes(lc)) { color = '#ffa726'; darkColor = '#e65100' }
  else if (['api', 'apis', 'routes', 'route'].includes(lc)) { color = '#66bb6a'; darkColor = '#1b5e20' }
  else if (['types', 'type', 'typings'].includes(lc))     { color = '#42a5f5'; darkColor = '#1565c0' }
  else if (['config', 'configs', 'configuration'].includes(lc)) { color = '#78909c'; darkColor = '#37474f' }
  else if (['test', 'tests', '__tests__', 'spec', 'specs', 'e2e'].includes(lc)) { color = '#66bb6a'; darkColor = '#2e7d32' }
  else if (['node_modules'].includes(lc))                 { color = '#66bb6a'; darkColor = '#2e7d32' }
  else if (['.git', '.github'].includes(lc))              { color = '#f48fb1'; darkColor = '#c2185b' }
  else if (['dist', 'build', 'out', 'output'].includes(lc)) { color = '#ffa726'; darkColor = '#e65100' }
  else if (['docs', 'doc', 'documentation'].includes(lc)) { color = '#ffa726'; darkColor = '#e65100' }

  if (open) {
    return (
      <svg className={CLS} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 6C2 4.9 2.9 4 4 4H9L11 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z" fill={darkColor}/>
        <path d="M2 8C2 6.9 2.9 6 4 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8Z" fill={color}/>
      </svg>
    )
  }
  return (
    <svg className={CLS} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 6C2 4.9 2.9 4 4 4H9L11 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6Z" fill={darkColor}/>
      <path d="M2 8C2 6.9 2.9 6 4 6H20C21.1 6 22 6.9 22 8V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V8Z" fill={color} opacity="0.8"/>
    </svg>
  )
}

// ─── File icons ───────────────────────────────────────────────────────────────

function fileBase(color: string, accent?: string) {
  return (
    <svg className={CLS} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill={color} opacity="0.15"/>
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2V8H20" fill="none" stroke={accent ?? color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export function FileIcon({ name }: { name: string }) {
  const lower = name.toLowerCase()
  const ext   = lower.split('.').pop() ?? ''
  const base  = lower.split('.').shift() ?? ''

  // ── Exact filename matches ────────────────────────────────────────────────
  if (['package.json', 'package-lock.json'].includes(lower))
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#cb3837" opacity=".15" stroke="#cb3837" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#cb3837" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5.5" fill="#cb3837" fontFamily="monospace" fontWeight="700">npm</text></svg>

  if (lower === 'tsconfig.json' || lower.startsWith('tsconfig.'))
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#3178c6" opacity=".15" stroke="#3178c6" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#3178c6" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5" fill="#3178c6" fontFamily="monospace" fontWeight="700">tsco</text></svg>

  if (['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.mjs'].includes(lower))
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#06b6d4" opacity=".15" stroke="#06b6d4" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#06b6d4" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="4.5" fill="#06b6d4" fontFamily="monospace" fontWeight="700">TW</text></svg>

  if (['next.config.js', 'next.config.ts', 'next.config.mjs'].includes(lower))
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#ffffff" opacity=".1" stroke="#ffffff" strokeWidth="1.2" strokeOpacity=".4"/><path d="M14 2V8H20" stroke="#ffffff" strokeWidth="1.2" fill="none" strokeOpacity=".4"/><text x="12" y="17" textAnchor="middle" fontSize="5" fill="#aaaaaa" fontFamily="monospace" fontWeight="700">next</text></svg>

  if (lower === '.gitignore' || lower === '.gitattributes')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#f14e32" opacity=".15" stroke="#f14e32" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#f14e32" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5" fill="#f14e32" fontFamily="monospace" fontWeight="700">git</text></svg>

  if (['.env', '.env.local', '.env.production', '.env.development'].includes(lower) || lower.startsWith('.env'))
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#ffd700" opacity=".15" stroke="#ffd700" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#ffd700" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5" fill="#ffd700" fontFamily="monospace" fontWeight="700">env</text></svg>

  if (lower === 'readme.md' || lower === 'readme.mdx')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#42a5f5" opacity=".15" stroke="#42a5f5" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#42a5f5" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="4.5" fill="#42a5f5" fontFamily="monospace" fontWeight="700">README</text></svg>

  if (['dockerfile', 'docker-compose.yml', 'docker-compose.yaml'].includes(lower))
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#2496ed" opacity=".15" stroke="#2496ed" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#2496ed" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="4.5" fill="#2496ed" fontFamily="monospace" fontWeight="700">dock</text></svg>

  if (['vite.config.js', 'vite.config.ts', 'vite.config.mjs'].includes(lower))
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#646cff" opacity=".15" stroke="#646cff" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#646cff" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5" fill="#646cff" fontFamily="monospace" fontWeight="700">vite</text></svg>

  if (['astro.config.mjs', 'astro.config.ts', 'astro.config.js'].includes(lower))
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#ff5d01" opacity=".15" stroke="#ff5d01" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#ff5d01" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5" fill="#ff5d01" fontFamily="monospace" fontWeight="700">astro</text></svg>

  // ── Extension matches ─────────────────────────────────────────────────────
  if (ext === 'tsx')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#3178c6" opacity=".15" stroke="#3178c6" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#3178c6" strokeWidth="1.2" fill="none"/><path d="M8 13h8M8 16h5" stroke="#3178c6" strokeWidth="1.2" strokeLinecap="round" opacity=".7"/><circle cx="18" cy="16" r="2" fill="#61dafb" opacity=".8"/></svg>

  if (ext === 'ts')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#3178c6" opacity=".15" stroke="#3178c6" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#3178c6" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="6" fill="#3178c6" fontFamily="monospace" fontWeight="800">TS</text></svg>

  if (ext === 'jsx')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#61dafb" opacity=".1" stroke="#61dafb" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#61dafb" strokeWidth="1.2" fill="none"/><circle cx="12" cy="15" r="2.5" fill="none" stroke="#61dafb" strokeWidth="1.2"/><path d="M12 12.5V9M12 21v-3.5" stroke="#61dafb" strokeWidth="1" opacity=".5"/></svg>

  if (ext === 'js' || ext === 'mjs' || ext === 'cjs')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#f7df1e" opacity=".12" stroke="#f7df1e" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#f7df1e" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="6" fill="#f7df1e" fontFamily="monospace" fontWeight="800">JS</text></svg>

  if (ext === 'css')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#42a5f5" opacity=".15" stroke="#42a5f5" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#42a5f5" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5.5" fill="#42a5f5" fontFamily="monospace" fontWeight="700">CSS</text></svg>

  if (ext === 'scss' || ext === 'sass')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#cc6699" opacity=".15" stroke="#cc6699" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#cc6699" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5" fill="#cc6699" fontFamily="monospace" fontWeight="700">SCSS</text></svg>

  if (ext === 'json')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#fbc02d" opacity=".12" stroke="#fbc02d" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#fbc02d" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5.5" fill="#fbc02d" fontFamily="monospace" fontWeight="700">{'{}'}</text></svg>

  if (ext === 'md' || ext === 'mdx')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#42a5f5" opacity=".12" stroke="#42a5f5" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#42a5f5" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5.5" fill="#42a5f5" fontFamily="monospace" fontWeight="700">MD</text></svg>

  if (ext === 'html')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#e44d26" opacity=".15" stroke="#e44d26" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#e44d26" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5" fill="#e44d26" fontFamily="monospace" fontWeight="700">HTML</text></svg>

  if (ext === 'astro')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#ff5d01" opacity=".15" stroke="#ff5d01" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#ff5d01" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="4.5" fill="#ff5d01" fontFamily="monospace" fontWeight="700">astro</text></svg>

  if (ext === 'svelte')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#ff3e00" opacity=".15" stroke="#ff3e00" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#ff3e00" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="4.5" fill="#ff3e00" fontFamily="monospace" fontWeight="700">svelte</text></svg>

  if (ext === 'vue')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#42b883" opacity=".15" stroke="#42b883" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#42b883" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5.5" fill="#42b883" fontFamily="monospace" fontWeight="700">VUE</text></svg>

  if (ext === 'svg')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#ffb13b" opacity=".15" stroke="#ffb13b" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#ffb13b" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5" fill="#ffb13b" fontFamily="monospace" fontWeight="700">SVG</text></svg>

  if (['png','jpg','jpeg','gif','webp','ico','avif'].includes(ext))
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#a5d6a7" opacity=".15" stroke="#a5d6a7" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#a5d6a7" strokeWidth="1.2" fill="none"/><circle cx="9" cy="13" r="1.5" fill="#a5d6a7" opacity=".7"/><path d="M7 18l3-4 2.5 3L15 13l3 5H7Z" fill="#a5d6a7" opacity=".5"/></svg>

  if (['yml', 'yaml'].includes(ext))
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#cc4444" opacity=".15" stroke="#cc4444" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#cc4444" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5" fill="#cc4444" fontFamily="monospace" fontWeight="700">YAML</text></svg>

  if (ext === 'toml')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#9c4dcc" opacity=".15" stroke="#9c4dcc" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#9c4dcc" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5" fill="#9c4dcc" fontFamily="monospace" fontWeight="700">TOML</text></svg>

  if (ext === 'sh' || ext === 'bash' || ext === 'zsh')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#a5d6a7" opacity=".15" stroke="#a5d6a7" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#a5d6a7" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="5.5" fill="#a5d6a7" fontFamily="monospace" fontWeight="700">SH</text></svg>

  if (base === 'license' || base === 'licence')
    return <svg className={CLS} viewBox="0 0 24 24" fill="none"><path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#ffd54f" opacity=".15" stroke="#ffd54f" strokeWidth="1.2"/><path d="M14 2V8H20" stroke="#ffd54f" strokeWidth="1.2" fill="none"/><text x="12" y="17" textAnchor="middle" fontSize="4.5" fill="#ffd54f" fontFamily="monospace" fontWeight="700">MIT</text></svg>

  // Default
  return (
    <svg className={CLS} viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" fill="#90a4ae" opacity=".12" stroke="#546e7a" strokeWidth="1.2"/>
      <path d="M14 2V8H20" stroke="#546e7a" strokeWidth="1.2" fill="none"/>
    </svg>
  )
}

import { NextRequest, NextResponse } from 'next/server'

const IMPROVEMENTS_CSS = `
/* ── Riiive: Automated Improvements Preview ── */

/* 1. Force responsive viewport behavior */
*, *::before, *::after { box-sizing: border-box !important; }
img, video, iframe, embed, object { max-width: 100% !important; height: auto; }

/* 2. Typography improvements */
body {
  font-size: clamp(15px, 1.6vw, 18px) !important;
  line-height: 1.65 !important;
  -webkit-font-smoothing: antialiased !important;
  text-rendering: optimizeLegibility !important;
}

/* 3. Heading hierarchy */
h1 { font-size: clamp(2rem, 5vw, 4rem) !important; line-height: 1.1 !important; letter-spacing: -0.02em !important; }
h2 { font-size: clamp(1.5rem, 3.5vw, 2.5rem) !important; line-height: 1.2 !important; }
h3 { font-size: clamp(1.1rem, 2vw, 1.5rem) !important; }

/* 4. Focus indicators for accessibility */
:focus-visible {
  outline: 2px solid #60a5fa !important;
  outline-offset: 3px !important;
  border-radius: 3px !important;
}

/* 5. Link accessibility */
a:not([class]) {
  text-decoration-thickness: 1px !important;
  text-underline-offset: 3px !important;
}

/* 6. Improve color contrast for light backgrounds */
body:not(.dark):not([data-theme="dark"]) {
  color: #1a1a1a !important;
  background: #ffffff !important;
}

/* 7. Smooth transitions */
a, button, [role="button"] {
  transition: opacity 0.15s ease, transform 0.15s ease !important;
}
a:hover, button:hover, [role="button"]:hover {
  opacity: 0.8 !important;
}

/* 8. Better image rendering */
img {
  image-rendering: -webkit-optimize-contrast !important;
  vertical-align: middle !important;
}

/* 9. Reduce layout shift */
img:not([width]):not([height]) {
  aspect-ratio: auto !important;
}

/* 10. Better form inputs */
input, textarea, select {
  font-size: 1rem !important;
  border-radius: 6px !important;
}

/* ── Riiive improvement badge ── */
.__riiive_badge {
  position: fixed !important;
  bottom: 16px !important;
  right: 16px !important;
  z-index: 2147483647 !important;
  background: #18181b !important;
  color: #fff !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  font-size: 11px !important;
  font-weight: 500 !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  padding: 6px 12px !important;
  border-radius: 999px !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
  pointer-events: none !important;
  line-height: 1.4 !important;
}
`

const IMPROVEMENTS_SCRIPT = `
(function() {
  // Add alt text to images missing it
  document.querySelectorAll('img:not([alt])').forEach(function(img, i) {
    img.setAttribute('alt', 'Image ' + (i + 1));
  });

  // Add loading=lazy to off-screen images
  var images = document.querySelectorAll('img:not([loading])');
  images.forEach(function(img) {
    img.setAttribute('loading', 'lazy');
  });

  // Add defer to blocking scripts (can't modify loaded ones, but flag them)
  // Add lang attribute if missing
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }

  // Ensure viewport meta exists
  if (!document.querySelector('meta[name="viewport"]')) {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    document.head.appendChild(meta);
  }

  // Inject badge
  var badge = document.createElement('div');
  badge.className = '__riiive_badge';
  badge.textContent = 'Riiive: Improved Preview';
  document.body.appendChild(badge);
})();
`

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 })
  }

  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10_000)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Riiive/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
      redirect: 'follow',
    })

    clearTimeout(timeout)

    if (!response.ok) {
      return NextResponse.json({ error: `Upstream ${response.status}` }, { status: 502 })
    }

    let html = await response.text()

    // ── Inject improvements CSS ────────────────────────────────────────────
    const styleTag = `<style id="__riiive_improvements">${IMPROVEMENTS_CSS}</style>`

    if (/<\/head>/i.test(html)) {
      html = html.replace(/<\/head>/i, `${styleTag}</head>`)
    } else {
      html = styleTag + html
    }

    // ── Inject improvements JS ─────────────────────────────────────────────
    const scriptTag = `<script id="__riiive_script">${IMPROVEMENTS_SCRIPT}</script>`

    if (/<\/body>/i.test(html)) {
      html = html.replace(/<\/body>/i, `${scriptTag}</body>`)
    } else {
      html = html + scriptTag
    }

    // ── Rewrite relative URLs to absolute so assets load ──────────────────
    const base = `${parsed.protocol}//${parsed.host}`
    const baseTag = `<base href="${base}/">`

    if (/<head[^>]*>/i.test(html)) {
      html = html.replace(/<head[^>]*>/i, match => match + baseTag)
    } else {
      html = baseTag + html
    }

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Frame-Options': 'SAMEORIGIN',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}

# Riiive 🩺

Get brutally honest feedback on your portfolio. AI-powered analysis that actually helps.

## Features

- **Instant Analysis** - Get results in seconds
- **Multi-dimensional Scoring** - Performance, accessibility, design, content, and responsiveness
- **AI Roasts** - Funny but constructive criticism
- **Recruiter Perspective** - See what hiring managers think
- **Actionable Feedback** - Specific improvements you can make today
- **Template Recommendations** - Suggestions based on your needs
- **Dark Mode** - Beautiful in light or dark

## Tech Stack

- **Next.js 16** - App Router with Server Actions
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern styling
- **shadcn/ui** - Beautiful components
- **Framer Motion** - Smooth animations
- **Supabase** - Database (optional)
- **OpenAI** - AI feedback (optional)

## Getting Started

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Copy `env.example` to `.env.local` and fill in your values:

```bash
cp env.example .env.local
```

Required for AI features (optional):
- `OPENAI_API_KEY` - For AI-powered feedback

Optional:
- `NEXT_PUBLIC_SUPABASE_URL` - For storing analysis results
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

3. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## How It Works

1. **User Input** - Paste a portfolio URL or upload a screenshot
2. **Hybrid Analysis** - Combines heuristic scoring with optional AI enhancement
3. **Scoring System** - Analyzes 5 key areas:
   - Performance (page size, scripts, optimization)
   - Accessibility (alt text, semantic HTML, ARIA)
   - Design (typography, spacing, visual hierarchy)
   - Content (copy quality, contact info, SEO)
   - Responsiveness (mobile-friendly, viewport)
4. **AI Enhancement** - Optional OpenAI integration for witty feedback
5. **Results** - Comprehensive report with actionable improvements

## Architecture

```
app/
├── actions/          # Server Actions
│   └── analyze.ts    # Portfolio analysis logic
├── page.tsx          # Main landing page
└── layout.tsx        # Root layout with theme

components/
├── ui/               # shadcn/ui components
├── portfolio-input.tsx
├── analysis-results.tsx
├── theme-provider.tsx
└── theme-toggle.tsx

lib/
├── analyzer.ts       # Heuristic analysis engine
├── ai-feedback.ts    # AI feedback generator
├── supabase.ts       # Database client
└── utils.ts          # Utilities

types/
└── analysis.ts       # TypeScript types
```

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/portfolio-doctor)

Or deploy manually:

```bash
npm run build
npm start
```

## Contributing

Contributions welcome! Please open an issue or PR.

## License

MIT

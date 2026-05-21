'use client'

import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const dimensions = [
  {
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-4 h-4">
        <path d="M438 896V794q-60-9-105.5-46.5T272 650l58-22q22 57 70.5 88.5T510 748q57 0 96-35.5T645 616q0-55-35-88t-120-65q-79-24-121-69t-42-109q0-68 42-113.5T480 124v-88h60v87q48 8 85.5 40t52.5 79l-57 22q-14-38-43.5-61.5T510 179q-54 0-86 29t-32 78q0 47 32.5 73.5T549 428q78 24 121.5 71T714 616q0 74-46.5 122.5T548 794v102h-110Z"/>
      </svg>
    ),
    label: 'Performance',
    score: 87,
    description: 'Page size, scripts, load time, and image optimization.',
  },
  {
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-4 h-4">
        <path d="M480 696q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm0-60q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0 240q-131 0-234-72.5T96 616q48-135 151-207.5T480 336q131 0 234 72.5T864 616q-48 135-151 207.5T480 876Zm0-300Zm0 240q105 0 192.5-58T806 616q-34-87-121.5-145T480 413q-105 0-192.5 58T154 616q34 87 121.5 145T480 816Z"/>
      </svg>
    ),
    label: 'Accessibility',
    score: 72,
    description: 'Alt text, semantic HTML, ARIA labels, and contrast ratios.',
  },
  {
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-4 h-4">
        <path d="M180 936q-25 0-42.5-17.5T120 876V276q0-25 17.5-42.5T180 216h600q25 0 42.5 17.5T840 276v600q0 25-17.5 42.5T780 936H180Zm0-60h600V276H180v600Zm60-120h480v-60H240v60Zm0-180h480v-60H240v60Zm0-180h480v-60H240v60Z"/>
      </svg>
    ),
    label: 'Design',
    score: 94,
    description: 'Typography hierarchy, spacing, whitespace, and visual balance.',
  },
  {
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-4 h-4">
        <path d="M320 776h320v-60H320v60Zm0-160h320v-60H320v60Zm-80 320q-25 0-42.5-17.5T180 876V276q0-25 17.5-42.5T240 216h361l179 179v481q0 25-17.5 42.5T720 936H240Zm331-523V276H240v600h480V413H571ZM240 276v137-137 600-600Z"/>
      </svg>
    ),
    label: 'Content',
    score: 68,
    description: 'Copy quality, contact info, call to action, and SEO basics.',
  },
  {
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-4 h-4">
        <path d="M300 936q-25 0-42.5-17.5T240 876V276q0-25 17.5-42.5T300 216h360q25 0 42.5 17.5T720 276v600q0 25-17.5 42.5T660 936H300Zm0-120v60h360v-60H300Zm0-60h360V336H300v420Zm0-480h360v-60H300v60Zm0 0v-60 60Zm0 540v60-60Z"/>
      </svg>
    ),
    label: 'Responsiveness',
    score: 91,
    description: 'Mobile-friendly layout, viewport meta, and touch targets.',
  },
]

function ScoreBar({ score, inView, delay }: { score: number; inView: boolean; delay: number }) {
  return (
    <div className="h-[1px] w-full bg-white/10 overflow-hidden">
      <motion.div
        className="h-full bg-white"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: score / 100 } : {}}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: 'left' }}
      />
    </div>
  )
}

export default function ScoringSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section ref={ref} className="w-full bg-black py-32 px-8 md:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

          <motion.div style={{ y }}>
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="text-xs font-medium tracking-widest uppercase text-[#838383] mb-4 block"
                style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
              >
                Scoring system
              </span>
              <h2
                className="text-4xl md:text-5xl font-[650] leading-[1.2] tracking-tight mb-6"
                style={{
                  background: 'linear-gradient(97deg, rgb(255,255,255) 43%, rgb(150,150,150) 110%) text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: '"Plus Jakarta Sans", -apple-system, Roboto, Helvetica, sans-serif',
                }}
              >
                Five dimensions.<br /> One brutal score.
              </h2>
              <p
                className="text-base font-light text-[#838383] leading-relaxed"
                style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
              >
                Every portfolio is analysed across five key areas. Each dimension contributes to your overall grade — no hiding behind good design if your content is weak.
              </p>
            </motion.div>
          </motion.div>

          <div className="flex flex-col gap-7">
            {dimensions.map((dim, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 32 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[#505050]">{dim.svg}</span>
                    <span
                      className="text-sm font-medium text-white tracking-tight"
                      style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
                    >
                      {dim.label}
                    </span>
                    <span
                      className="text-xs text-[#444] hidden sm:block"
                      style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
                    >
                      {dim.description}
                    </span>
                  </div>
                  <span
                    className="text-sm font-light text-[#838383] tabular-nums shrink-0 ml-4"
                    style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
                  >
                    {dim.score}/100
                  </span>
                </div>
                <ScoreBar score={dim.score} inView={inView} delay={i * 0.1 + 0.2} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

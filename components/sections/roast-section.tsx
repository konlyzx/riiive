'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const roasts = [
  {
    quote: "Your portfolio looks like it was built in 2018 and forgot to come back.",
    type: 'Roast',
    fix: "Update your visual language — modern spacing, a clear hierarchy, and one strong typeface go a long way.",
  },
  {
    quote: "No contact email, no LinkedIn, no form. Are you hiding?",
    type: 'Recruiter Flag',
    fix: "Add a visible contact section above the fold. Recruiters spend less than 10 seconds on a portfolio.",
  },
  {
    quote: "Five hero images, zero context. We don't know what you actually did.",
    type: 'Content Gap',
    fix: "Each project needs a problem, your role, the process, and the outcome. Show your thinking.",
  },
  {
    quote: "Your mobile layout is a disaster. The nav covers 40% of the screen.",
    type: 'Accessibility',
    fix: "Test on real mobile devices. Fix your hamburger menu z-index and increase tap target sizes.",
  },
]

export default function RoastSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section ref={ref} className="w-full bg-black py-32 px-8 md:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <span
            className="text-xs font-medium tracking-widest uppercase text-[#838383] mb-4 block"
            style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
          >
            AI Feedback
          </span>
          <h2
            className="text-4xl md:text-5xl font-[650] leading-[1.2] tracking-tight"
            style={{
              background: 'linear-gradient(97deg, rgb(255,255,255) 43%, rgb(150,150,150) 110%) text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Plus Jakarta Sans", -apple-system, Roboto, Helvetica, sans-serif',
            }}
          >
            Honest. Specific.<br className="hidden md:block" /> Sometimes brutal.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
          {roasts.map((roast, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0a0a0a] p-8 flex flex-col gap-5"
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-medium tracking-widest uppercase text-[#838383] border border-white/10 rounded-full px-3 py-1"
                  style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
                >
                  {roast.type}
                </span>
              </div>
              <blockquote
                className="text-base font-medium text-white leading-snug tracking-tight"
                style={{ fontFamily: '"Plus Jakarta Sans", -apple-system, sans-serif' }}
              >
                "{roast.quote}"
              </blockquote>
              <div className="border-t border-white/10 pt-4">
                <p
                  className="text-sm font-light text-[#838383] leading-relaxed"
                  style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
                >
                  <span className="text-white font-medium">Fix: </span>
                  {roast.fix}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

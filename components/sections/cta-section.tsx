'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section ref={ref} className="w-full bg-black py-32 px-8 md:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center gap-8">

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className="text-xs font-medium tracking-widest uppercase text-[#838383] mb-6 block"
            style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
          >
            Get started — it's free
          </span>
          <h2
            className="text-5xl md:text-7xl font-[650] leading-[1.1] tracking-tight mb-6 max-w-3xl mx-auto"
            style={{
              background: 'linear-gradient(97deg, rgb(255,255,255) 43%, rgb(100,100,100) 110%) text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Plus Jakarta Sans", -apple-system, Roboto, Helvetica, sans-serif',
            }}
          >
            Your portfolio deserves better feedback.
          </h2>
          <p
            className="text-base font-light text-[#838383] max-w-lg mx-auto leading-relaxed"
            style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
          >
            Paste your URL and get a full report in seconds. No account needed. No fluff.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <a
            href="/analyze"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-medium tracking-tight hover:bg-white/90 transition-colors duration-300"
            style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
          >
            Analyze my portfolio
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-4 h-4"><path d="M647 616H160v-80h487L423 312l57-56 360 360-360 360-57-56 224-224Z"/></svg>
          </a>
          <a
            href="/showcase"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-white text-sm font-light tracking-tight hover:border-white/30 transition-colors duration-300"
            style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
          >
            See examples
          </a>
        </motion.div>

      </div>
    </section>
  )
}

'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    number: '01',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-6 h-6">
        <path d="M440 776v-526L296 394l-42-42 226-226 226 226-42 42-144-144v526h-80Z"/>
      </svg>
    ),
    title: 'Paste your URL',
    description: 'Drop in your portfolio link. We support any publicly accessible website — no login, no setup.',
  },
  {
    number: '02',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-6 h-6">
        <path d="M480 976q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Zm-30-106v-84q-34-1-57-21.5T372 716l56-24q4 22 19.5 35.5T484 741q26 0 43.5-13.5T545 693q0-30-20-45.5T466 617q-50-14-78-43t-28-72q0-34 22-60.5t58-38.5v-84h60v82q28 4 48.5 20.5T579 463l-55 23q-6-18-19.5-28.5T476 447q-25 0-40.5 11.5T420 490q0 22 17 34.5t58 25.5q50 14 79.5 45.5T604 676q0 39-25.5 68T510 786v84h-60Zm30 46q75 0 140.5-28.5t114-77q48.5-48.5 77-114T840 576q0-75-28.5-140.5t-77-114q-48.5-48.5-114-77T480 216q-75 0-140.5 28.5t-114 77q-48.5 48.5-77 114T120 576q0 75 28.5 140.5t77 114q48.5 48.5 114 77T480 916Z"/>
      </svg>
    ),
    title: 'AI scans everything',
    description: 'Our engine checks performance, accessibility, design quality, content clarity, and responsiveness in seconds.',
  },
  {
    number: '03',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-6 h-6">
        <path d="M319 806h322v-60H319v60Zm0-170h322v-60H319v60Zm-99 340q-24 0-42-18t-18-42V236q0-24 18-42t42-18h361l219 219v521q0 24-18 42t-42 18H220Zm331-554V236H220v680h520V422H551ZM220 236v186-186 680-680Z"/>
      </svg>
    ),
    title: 'Get your report',
    description: 'Receive a multi-dimensional score breakdown with brutally honest, actionable feedback you can act on immediately.',
  },
  {
    number: '04',
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960" fill="currentColor" className="w-6 h-6">
        <path d="M480 96q17 0 28.5 11.5T520 136v60q0 17-11.5 28.5T480 236q-17 0-28.5-11.5T440 196v-60q0-17 11.5-28.5T480 96ZM264 188l42 42q12 12 12 29t-12 29q-12 12-29 12t-29-12l-42-42q-12-12-12-29t12-29q12-12 29-12t29 12Zm432 0q12-12 29-12t29 12q12 12 12 29t-12 29l-42 42q-12 12-29 12t-29-12q-12-12-12-29t12-29l42-42ZM480 376q83 0 141.5 58.5T680 576q0 68-37 120t-97 75l-6 141q-2 17-14.5 28T497 951h-34q-18 0-30.5-11T418 912l-6-141q-60-23-97-75t-37-120q0-83 58.5-141.5T480 376ZM96 556q0-17 11.5-28.5T136 516h60q17 0 28.5 11.5T236 556q0 17-11.5 28.5T196 596h-60q-17 0-28.5-11.5T96 556Zm628 0q0-17 11.5-28.5T764 516h60q17 0 28.5 11.5T864 556q0 17-11.5 28.5T824 596h-60q-17 0-28.5-11.5T724 556ZM264 924q-12 12-29 12t-29-12q-12-12-12-29t12-29l42-42q12-12 29-12t29 12q12 12 12 29t-12 29l-42 42Zm432 0-42-42q-12-12-12-29t12-29q12-12 29-12t29 12l42 42q12 12 12 29t-12 29q-12 12-29 12t-29-12Z"/>
      </svg>
    ),
    title: 'Stand out',
    description: 'Apply the improvements. Resubmit. Watch your portfolio go from "meh" to "hired".',
  },
]

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section ref={ref} className="w-full bg-black py-32 px-8 md:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <span
            className="text-xs font-medium tracking-widest uppercase text-[#838383] mb-4 block"
            style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
          >
            How it works
          </span>
          <h2
            className="text-4xl md:text-5xl font-[650] leading-[1.2] tracking-tight"
            style={{
              background: 'linear-gradient(97deg, rgb(255,255,255) 43%, rgb(150,150,150) 110%) text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Plus Jakarta Sans", -apple-system, Roboto, Helvetica, sans-serif',
            }}
          >
            Four steps to a<br className="hidden md:block" /> portfolio that converts.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0a0a0a] p-12 flex flex-col gap-8 group"
            >
              <div className="flex items-start justify-between">
                <span
                  className="text-[#222] text-6xl font-bold leading-none select-none tabular-nums"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  {step.number}
                </span>
                <div className="text-[#505050] group-hover:text-white transition-colors duration-300 mt-1">
                  {step.svg}
                </div>
              </div>
              <div>
                <h3
                  className="text-xl font-semibold text-white mb-3 tracking-tight"
                  style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm font-light text-[#838383] leading-relaxed"
                  style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

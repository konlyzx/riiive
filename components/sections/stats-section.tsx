'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'

const stats = [
  { value: 98, suffix: '%', label: 'Analysis accuracy' },
  { value: 5,  suffix: 's', label: 'Average scan time' },
  { value: 12, suffix: 'k+', label: 'Portfolios analyzed' },
  { value: 3,  suffix: 'x', label: 'More interview callbacks' },
]

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView || !ref.current) return
    gsap.fromTo(
      ref.current,
      { innerText: 0 },
      {
        innerText: to,
        duration: 1.6,
        ease: 'power2.out',
        snap: { innerText: 1 },
        onUpdate() {
          if (ref.current) {
            ref.current.textContent = Math.round(Number(ref.current.textContent)) + suffix
          }
        },
      }
    )
  }, [inView, to, suffix])

  return <span ref={ref}>0{suffix}</span>
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })

  return (
    <section ref={ref} className="w-full bg-black border-t border-white/10 py-24 px-8 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0a0a0a] px-8 py-10 flex flex-col gap-2"
            >
              <span
                className="text-4xl md:text-5xl font-bold text-white tracking-tight tabular-nums"
                style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
              >
                <Counter to={stat.value} suffix={stat.suffix} />
              </span>
              <span
                className="text-sm font-light text-[#838383]"
                style={{ fontFamily: 'Roboto, -apple-system, sans-serif' }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const stats = [
  { value: 2400, suffix: '+', label: 'Women Empowered', icon: '♀' },
  { value: 18, suffix: '', label: 'Communities Served', icon: '🏘' },
  { value: 6, suffix: '', label: 'Years of Impact', icon: '✦' },
  { value: 340, suffix: '+', label: 'Dedicated Volunteers', icon: '❤' },
]

function useCountUp(target: number, isInView: boolean, duration = 1600): number {
  const [count, setCount] = useState(0)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!isInView || hasRun.current) return
    hasRun.current = true
    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, target, duration])

  return count
}

interface StatItemProps {
  stat: (typeof stats)[number]
  isInView: boolean
  index: number
  shouldReduce: boolean | null
}

const StatItem: React.FC<StatItemProps> = ({ stat, isInView, index, shouldReduce }) => {
  const count = useCountUp(stat.value, isInView)

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduce ? 0 : 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12, ease: 'easeOut' }}
      className="flex flex-col items-center px-6 py-4"
    >
      <span className="text-2xl mb-2 opacity-70" aria-hidden="true">{stat.icon}</span>
      <span
        className="font-display font-bold text-flame"
        style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.1 }}
        aria-label={`${stat.value}${stat.suffix}`}
      >
        {isInView ? count : 0}{stat.suffix}
      </span>
      <span className="font-body font-medium text-charcoal/70 text-sm mt-1 text-center">
        {stat.label}
      </span>
    </motion.div>
  )
}

const StatsBar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })
  const shouldReduce = useReducedMotion()

  return (
    <section
      id="stats"
      ref={ref}
      className="bg-ivory py-12 md:py-16 relative z-10"
      aria-label="Impact statistics"
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center font-body font-medium text-charcoal/50 uppercase tracking-widest text-xs mb-8"
        >
          Our Impact in Numbers
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 divide-x-0 md:divide-x divide-y md:divide-y-0 divide-blush rounded-2xl overflow-hidden bg-white shadow-card">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              stat={stat}
              isInView={isInView}
              index={index}
              shouldReduce={shouldReduce}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsBar

import React, { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const AboutStrip: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px 0px' })
  const shouldReduce = useReducedMotion()

  return (
    <section
      id="about"
      ref={ref}
      className="relative overflow-hidden"
      aria-label="About She Can Foundation"
    >
      <div className="grid md:grid-cols-2 min-h-[480px]">

        {/* Left: Image with Quote Overlay */}
        <motion.div
          initial={{ opacity: 0, x: shouldReduce ? 0 : -60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden group min-h-[350px]"
        >
          <motion.img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,h=800,fit=crop,f=jpeg/Aq2NJ23MzBH2rx2j/1682903599444-m5KPBaLG4LiW4P7B.jpg"
            alt="She Can Foundation impact"
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/30 transition-colors duration-500" />
          
          <div className="absolute inset-0 p-10 md:p-16 flex flex-col justify-end transform group-hover:translate-x-2 transition-transform duration-500">
            <blockquote className="relative z-10 border-l-4 border-flame pl-6 shadow-sm">
              <span className="font-display italic font-semibold text-white leading-tight block" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                "Every woman deserves the chance to write her own story."
              </span>
              <cite className="mt-4 flex items-center gap-3 not-italic">
                <span className="w-8 h-px bg-white/60" />
                <span className="font-body font-medium text-white/90 text-sm tracking-wide">
                  She Can Foundation
                </span>
              </cite>
            </blockquote>
          </div>
        </motion.div>

        {/* Right: Mission text */}
        <motion.div
          initial={{ opacity: 0, x: shouldReduce ? 0 : 60 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="bg-ivory flex items-center p-10 md:p-16"
        >
          <div>
            <p className="font-body font-medium text-flame uppercase tracking-widest text-xs mb-4">
              Our Mission
            </p>
            <h2 className="font-display font-bold text-navy mb-6" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}>
              Building a World Where Women Thrive
            </h2>
            <div className="space-y-4 text-charcoal/80 font-body text-base leading-relaxed">
              <p>
                She Can Foundation was born from a simple yet powerful belief — that every woman,
                regardless of where she starts, has the potential to transform her world. We provide
                mentorship, skills training, and community support to unlock that potential.
              </p>
              <p>
                From rural villages to urban centres, our programs bridge the gap between opportunity
                and access. We partner with local leaders, businesses, and passionate volunteers to
                create sustainable, community-led change.
              </p>
              <p>
                We don't just empower individuals — we ignite movements. When one woman rises,
                she lifts families, communities, and generations alongside her.
              </p>
            </div>
            <a
              href="#form"
              className="btn-flame mt-8 inline-flex text-sm px-7 py-3"
            >
              Join the Movement
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

export default AboutStrip

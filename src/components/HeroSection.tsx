import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
const HeroSection: React.FC = () => {
  const shouldReduce = useReducedMotion()
  const words1 = ['Empowering', 'Women,']
  const words2 = ['Changing', 'the', 'World.']

  return (
    <section
      id="hero"
      className="relative min-h-screen bg-flame flex items-center overflow-hidden pt-16"
      aria-label="Hero section"
    >
      {/* Background texture dots */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #FDF6F0 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center">

          {/* Text Content */}
          <div className="order-2 md:order-1">
            <motion.p
              initial={{ opacity: 0, y: shouldReduce ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="font-body font-medium text-white/70 uppercase tracking-[0.2em] text-xs mb-5"
            >
              She Can Foundation
            </motion.p>

            {/* Animated heading */}
            <h1
              className="font-display font-bold text-white leading-[1.08] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
              aria-label="Empowering Women, Changing the World."
            >
              <span className="flex flex-wrap gap-x-3 mb-1">
                {words1.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: shouldReduce ? 0 : 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="flex flex-wrap gap-x-3">
                {words2.map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: shouldReduce ? 0 : 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.36 + i * 0.08, ease: 'easeOut' }}
                    className="inline-block"
                  >
                    {word === 'World.' ? (
                      <span className="italic" style={{ color: '#F9C5B0' }}>{word}</span>
                    ) : word}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.65 }}
              className="font-body text-white/80 text-lg md:text-xl leading-relaxed max-w-md mb-10"
            >
              Join She Can Foundation and be part of a movement that transforms
              lives across communities — one woman at a time.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.85 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#form"
                id="hero-cta-btn"
                className="btn-navy text-base px-9 py-4 shadow-lg shadow-navy/30"
              >
                Get Involved
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 10h12M10 4l6 6-6 6" />
                </svg>
              </a>
              <a
                href="#about"
                className="font-body font-medium text-white/90 flex items-center gap-2 hover:text-white transition-colors self-center text-base underline underline-offset-4 decoration-white/30 hover:decoration-white"
              >
                Learn More
              </a>
            </motion.div>
          </div>

          {/* Hero Image / Silhouette Area */}
          <div className="order-1 md:order-2 flex justify-center md:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: shouldReduce ? 1 : 0.9, rotate: shouldReduce ? 0 : -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              className="relative group"
            >
              {/* Glow */}
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                style={{ background: '#E8452A', transform: 'scale(0.85) translateY(5%)' }}
                aria-hidden="true"
              />

              {/* Logo card / Image wrapper */}
              <div className="relative rounded-[2rem] p-2 backdrop-blur-sm border border-white/20 bg-white/5 shadow-2xl overflow-hidden transform group-hover:-translate-y-2 transition-all duration-500">
                <div
                  className="relative overflow-hidden rounded-[1.5rem] flex flex-col items-center justify-center bg-navy"
                  style={{
                    width: 'clamp(260px, 40vw, 420px)',
                    height: 'clamp(320px, 48vw, 500px)',
                  }}
                >
                  {/* Real Hero Image */}
                  <motion.img 
                    src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=800,h=1000,fit=crop,f=jpeg/Aq2NJ23MzBH2rx2j/1682903597510-ALpXVB4MoOSZr2xW.jpg"
                    alt="Women Empowerment"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />

                  <div className="absolute bottom-6 left-0 right-0 text-center z-10 px-6 transform group-hover:translate-y-[-4px] transition-transform duration-500">
                    <p
                      className="font-display font-bold text-white drop-shadow-md"
                      style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', lineHeight: 1 }}
                    >
                      She <span className="italic text-flame">Can!</span>
                    </p>
                    <p
                      className="font-body font-semibold tracking-[0.25em] uppercase text-white/90 mt-2"
                      style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)' }}
                    >
                      Foundation
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 80C240 20 480 0 720 40C960 80 1200 60 1440 20V80H0Z" fill="#FDF6F0" />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection

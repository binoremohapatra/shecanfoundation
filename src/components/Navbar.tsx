import React, { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Programs', href: '#stats' },
  { label: 'Volunteer', href: '#form' },
  { label: 'Contact', href: '#form' },
]

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      id="home"
      initial={{ opacity: 0, y: shouldReduce ? 0 : -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-none'
      }`}
      role="banner"
    >
      <nav
        className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group" aria-label="She Can Foundation Home">
          <motion.img 
            src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=192,h=192,fit=crop,f=png/Aq2NJ23MzBH2rx2j/she-A0x4keRWN9FkzVg3.jpg" 
            alt="She Can Foundation Logo"
            className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
            whileHover={{ rotate: 5 }}
          />
          <span className="font-display font-bold text-navy text-lg leading-tight">
            She <span className="text-flame">Can</span>
            <span className="block font-body font-medium text-[10px] text-charcoal/60 tracking-widest uppercase -mt-0.5">
              Foundation
            </span>
          </span>
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-7" role="list">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="nav-link text-sm">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Donate Button */}
        <div className="hidden md:block">
          <a
            href="#form"
            id="nav-donate-btn"
            className="btn-flame text-sm px-6 py-2.5"
            aria-label="Donate to She Can Foundation"
          >
            Donate ♥
          </a>
        </div>

        {/* Hamburger */}
        <button
          id="hamburger-btn"
          className="md:hidden p-2 rounded-lg text-navy hover:bg-navy/5 transition-colors"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer */}
      <motion.div
        id="mobile-menu"
        initial={false}
        animate={menuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="md:hidden overflow-hidden bg-white border-t border-navy/5"
        aria-hidden={!menuOpen}
      >
        <ul className="flex flex-col px-6 py-4 gap-1" role="list">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="nav-link block py-2.5 text-base"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-3">
            <a href="#form" className="btn-flame w-full justify-center text-sm" onClick={() => setMenuOpen(false)}>
              Donate ♥
            </a>
          </li>
        </ul>
      </motion.div>
    </motion.header>
  )
}

export default Navbar

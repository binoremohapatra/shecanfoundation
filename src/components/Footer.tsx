import React from 'react'
import { motion } from 'framer-motion'
const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Programs', href: '#stats' },
  { label: 'Volunteer', href: '#form' },
  { label: 'Donate', href: '#form' },
  { label: 'Contact', href: '#form' },
]

const SocialIcon: React.FC<{ href: string; label: string; children: React.ReactNode }> = ({
  href, label, children,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center
               text-white/50 hover:text-flame hover:border-flame transition-all duration-200 hover:bg-flame/10"
  >
    {children}
  </a>
)

const Footer: React.FC = () => {
  return (
    <footer
      className="bg-navy text-white"
      role="contentinfo"
      aria-label="She Can Foundation footer"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">

          {/* Column 1: Logo + Tagline + Socials */}
          <div>
            <a href="#home" className="flex items-center gap-3 mb-5 group" aria-label="She Can Foundation Home">
              <motion.img 
                src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=192,h=192,fit=crop,f=png/Aq2NJ23MzBH2rx2j/she-A0x4keRWN9FkzVg3.jpg" 
                alt="She Can Foundation Logo"
                className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform"
                whileHover={{ rotate: -5 }}
              />
              <span className="font-display font-bold text-white text-lg">
                She <span className="text-flame">Can</span>
                <span className="block font-body font-medium text-xs text-white/40 tracking-widest uppercase -mt-0.5">
                  Foundation
                </span>
              </span>
            </a>
            <p className="font-body text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Empowering women, transforming communities, changing the world — one story at a time.
            </p>
            <div className="flex gap-2.5">
              {/* Instagram */}
              <SocialIcon href="https://instagram.com" label="She Can Foundation on Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
              </SocialIcon>
              {/* LinkedIn */}
              <SocialIcon href="https://linkedin.com" label="She Can Foundation on LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </SocialIcon>
              {/* Twitter / X */}
              <SocialIcon href="https://twitter.com" label="She Can Foundation on Twitter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-body font-semibold text-white text-sm uppercase tracking-widest mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3" role="list">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-white/50 text-sm hover:text-flame transition-colors duration-200
                               flex items-center gap-2 group"
                  >
                    <span
                      className="w-0 group-hover:w-3 h-px bg-flame transition-all duration-200"
                      aria-hidden="true"
                    />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Newsletter */}
          <div>
            <h3 className="font-body font-semibold text-white text-sm uppercase tracking-widest mb-3">
              Stay Connected
            </h3>
            <p className="font-body text-white/50 text-sm mb-5 leading-relaxed">
              Get inspiring stories and updates from our community delivered to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-0"
              aria-label="Newsletter subscription"
            >
              <input
                id="newsletter-email"
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/30
                           px-4 py-3 rounded-l-full text-sm font-body focus:outline-none
                           focus:border-flame focus:bg-white/8 transition-all duration-150"
                aria-label="Email address for newsletter"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-flame text-white px-4 py-3 rounded-r-full hover:brightness-110
                           transition-all duration-200 flex items-center gap-1"
                aria-label="Subscribe to newsletter"
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 10h12M10 4l6 6-6 6" />
                </svg>
              </motion.button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-white/30 text-xs">
            © 2025 She Can Foundation. All rights reserved.
          </p>
          <a
            href="https://www.shecanfoundation.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-blush text-xs hover:text-flame transition-colors duration-200 tracking-wide"
          >
            www.shecanfoundation.org
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer

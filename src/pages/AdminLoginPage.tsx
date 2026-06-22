import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getSubmissions } from '../api/client'
const AdminLoginPage: React.FC = () => {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!key.trim()) { setError('Please enter the admin key'); return }
    setLoading(true)
    setError('')
    try {
      await getSubmissions(key.trim())
      sessionStorage.setItem('shecan-admin-key', key.trim())
      navigate('/admin/dashboard')
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 401) {
        setError('Invalid admin key. Please try again.')
      } else {
        setError('Connection failed. Is the backend running on port 8080?')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4"
         style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1a2e42 100%)' }}>

      {/* Background dots */}
      <div className="absolute inset-0 opacity-5"
           style={{ backgroundImage: 'radial-gradient(circle, #E8452A 1px, transparent 1px)', backgroundSize: '32px 32px' }}
           aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <img 
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=192,h=192,fit=crop,f=png/Aq2NJ23MzBH2rx2j/she-A0x4keRWN9FkzVg3.jpg" 
              alt="She Can Foundation Logo"
              className="w-12 h-12 rounded-full object-cover shadow-sm"
            />
            <div className="text-left">
              <p className="font-display font-bold text-white text-xl leading-tight">
                She <span className="text-flame">Can</span>
              </p>
              <p className="font-body text-white/50 text-xs tracking-widest uppercase">
                Foundation
              </p>
            </div>
          </div>
          <h1 className="font-display font-bold text-white text-2xl">Admin Portal</h1>
          <p className="font-body text-white/50 text-sm mt-1">Enter your admin key to continue</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5" aria-label="Admin login form">
            <div>
              <label htmlFor="admin-key" className="block font-body font-medium text-white/80 text-sm mb-2">
                Admin Key
              </label>
              <input
                id="admin-key"
                type="password"
                value={key}
                onChange={e => { setKey(e.target.value); setError('') }}
                placeholder="Enter your admin key..."
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30
                           px-4 py-3 rounded-xl font-body text-sm focus:outline-none focus:border-flame
                           focus:bg-white/15 transition-all duration-150"
                aria-label="Admin key input"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-body text-red-400 text-sm flex items-center gap-2"
                role="alert"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M7 0a7 7 0 100 14A7 7 0 007 0zm0 10.5a.875.875 0 110-1.75.875.875 0 010 1.75zm.875-4.375a.875.875 0 01-1.75 0V4.375a.875.875 0 011.75 0V6.125z"/>
                </svg>
                {error}
              </motion.p>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-flame text-white font-body font-semibold py-3.5 rounded-xl
                         flex items-center justify-center gap-2 hover:brightness-110 hover:scale-[1.02]
                         transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><span className="spinner" aria-hidden="true" /><span>Verifying...</span></>
              ) : (
                <>Access Dashboard <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M10 4l6 6-6 6"/></svg></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-white/25 text-xs mt-6">
          Default key for local dev: <code className="text-white/40">shecan-admin-2025</code>
        </p>
      </motion.div>
    </div>
  )
}

export default AdminLoginPage

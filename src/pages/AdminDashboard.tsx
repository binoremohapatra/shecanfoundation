import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getSubmissions, getStats, updateStatus } from '../api/client'
import type { Submission, StatsDto } from '../api/client'
// ─── Status helpers ──────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  NEW:       { label: 'New',       bg: 'bg-flame',       text: 'text-white' },
  REVIEWED:  { label: 'Reviewed',  bg: 'bg-amber-400',   text: 'text-navy' },
  CONTACTED: { label: 'Contacted', bg: 'bg-emerald-500', text: 'text-white' },
} as const

type StatusKey = keyof typeof STATUS_CONFIG

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status as StatusKey] ?? { label: status, bg: 'bg-gray-300', text: 'text-charcoal' }
  return (
    <span className={`${cfg.bg} ${cfg.text} text-xs font-body font-semibold px-3 py-1 rounded-full whitespace-nowrap`}>
      {cfg.label}
    </span>
  )
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

const StatCard: React.FC<{ label: string; value: number; accent: string }> = ({ label, value, accent }) => (
  <div className="bg-white rounded-2xl p-5 shadow-card flex flex-col gap-1">
    <span className={`font-display font-bold text-3xl ${accent}`}>{value}</span>
    <span className="font-body text-charcoal/60 text-sm">{label}</span>
  </div>
)

// ─── Main Dashboard ──────────────────────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const adminKey = sessionStorage.getItem('shecan-admin-key') ?? ''

  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [stats, setStats]             = useState<StatsDto | null>(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState('')
  const [updating, setUpdating]       = useState<number | null>(null)

  const fetchData = useCallback(async () => {
    if (!adminKey) { navigate('/admin'); return }
    setLoading(true)
    setError('')
    try {
      const [subsRes, statsRes] = await Promise.all([
        getSubmissions(adminKey),
        getStats(adminKey),
      ])
      setSubmissions(subsRes.data)
      setStats(statsRes.data)
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 401) {
        sessionStorage.removeItem('shecan-admin-key')
        navigate('/admin')
      } else {
        setError('Failed to load submissions. Is the backend running?')
      }
    } finally {
      setLoading(false)
    }
  }, [adminKey, navigate])

  useEffect(() => { fetchData() }, [fetchData])

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    setUpdating(id)
    // Optimistic update
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: newStatus as Submission['status'] } : s))
    try {
      const res = await updateStatus(id, newStatus, adminKey)
      setSubmissions(prev => prev.map(s => s.id === id ? res.data : s))
      // Refresh stats
      const statsRes = await getStats(adminKey)
      setStats(statsRes.data)
    } catch {
      // Revert on failure
      fetchData()
    } finally {
      setUpdating(null)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('shecan-admin-key')
    navigate('/admin')
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="spinner !w-10 !h-10 !border-4 !border-flame/30 !border-t-flame mx-auto mb-4" />
          <p className="font-body text-charcoal/60">Loading submissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory">
      {/* Top Bar */}
      <header className="bg-navy shadow-lg sticky top-0 z-40" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=192,h=192,fit=crop,f=png/Aq2NJ23MzBH2rx2j/she-A0x4keRWN9FkzVg3.jpg" 
              alt="She Can Foundation Logo"
              className="w-8 h-8 rounded-full object-cover shadow-sm"
            />
            <div>
              <span className="font-display font-bold text-white text-base">She <span className="text-flame">Can</span></span>
              <span className="font-body text-white/40 text-xs ml-2 hidden sm:inline">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="font-body text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1.5"
              title="Refresh data"
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
              Refresh
            </button>
            <button
              id="admin-logout-btn"
              onClick={handleLogout}
              className="font-body bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-1.5 rounded-full transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8" id="main-content">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-navy text-3xl">Submissions Dashboard</h1>
          <p className="font-body text-charcoal/60 mt-1">Manage volunteer and contact form submissions</p>
        </div>

        {/* Stats Row */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Submissions" value={stats.total}        accent="text-navy" />
            <StatCard label="New"               value={stats.newCount}     accent="text-flame" />
            <StatCard label="Reviewed"          value={stats.reviewedCount} accent="text-amber-500" />
            <StatCard label="Contacted"         value={stats.contactedCount} accent="text-emerald-600" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 font-body text-sm">
            {error}
          </div>
        )}

        {/* Table Card */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-flame via-blush to-navy" />
          <div className="p-5 border-b border-navy/5 flex items-center justify-between">
            <p className="font-body font-semibold text-navy">{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</p>
            <p className="font-body text-charcoal/40 text-xs">Newest first</p>
          </div>

          {submissions.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-display text-navy/30 text-xl mb-2">No submissions yet</p>
              <p className="font-body text-charcoal/40 text-sm">Submit the contact form to see entries here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]" aria-label="Submissions table">
                <thead>
                  <tr className="border-b border-navy/5 bg-ivory/60">
                    {['#', 'Name', 'Email', 'Type', 'Message', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left font-body font-semibold text-navy/60 text-xs uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {submissions.map((sub, i) => (
                      <motion.tr
                        key={sub.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-navy/5 hover:bg-ivory/40 transition-colors"
                      >
                        <td className="px-5 py-4 font-body text-charcoal/40 text-sm">#{sub.id}</td>
                        <td className="px-5 py-4 font-body font-medium text-navy text-sm whitespace-nowrap">{sub.fullName}</td>
                        <td className="px-5 py-4 font-body text-charcoal/70 text-sm">{sub.email}</td>
                        <td className="px-5 py-4">
                          <span className="bg-navy/10 text-navy font-body text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap">
                            {sub.helpType}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-body text-charcoal/70 text-sm max-w-xs">
                          <span className="line-clamp-2 block">{sub.message}</span>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={sub.status} />
                        </td>
                        <td className="px-5 py-4 font-body text-charcoal/50 text-xs whitespace-nowrap">
                          {formatDate(sub.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {sub.status !== 'REVIEWED' && (
                              <button
                                onClick={() => handleStatusUpdate(sub.id, 'REVIEWED')}
                                disabled={updating === sub.id}
                                className="font-body text-xs bg-amber-100 text-amber-700 hover:bg-amber-200
                                           px-3 py-1 rounded-full transition-colors disabled:opacity-50 whitespace-nowrap"
                              >
                                Mark Reviewed
                              </button>
                            )}
                            {sub.status !== 'CONTACTED' && (
                              <button
                                onClick={() => handleStatusUpdate(sub.id, 'CONTACTED')}
                                disabled={updating === sub.id}
                                className="font-body text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200
                                           px-3 py-1 rounded-full transition-colors disabled:opacity-50 whitespace-nowrap"
                              >
                                Mark Contacted
                              </button>
                            )}
                            {sub.status !== 'NEW' && (
                              <button
                                onClick={() => handleStatusUpdate(sub.id, 'NEW')}
                                disabled={updating === sub.id}
                                className="font-body text-xs bg-flame/10 text-flame hover:bg-flame/20
                                           px-3 py-1 rounded-full transition-colors disabled:opacity-50"
                              >
                                Reset
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard

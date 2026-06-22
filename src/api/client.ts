import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// ── Types ──────────────────────────────────────────────────────────────────

export interface ContactPayload {
  fullName: string
  email: string
  phone?: string
  helpType: string
  message: string
}

export interface Submission {
  id: number
  fullName: string
  email: string
  phone: string | null
  helpType: string
  message: string
  status: 'NEW' | 'REVIEWED' | 'CONTACTED'
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

export interface StatsDto {
  total: number
  newCount: number
  reviewedCount: number
  contactedCount: number
}

// ── Contact API ───────────────────────────────────────────────────────────

export async function submitContact(payload: ContactPayload): Promise<ApiResponse<Submission>> {
  const { data } = await api.post<ApiResponse<Submission>>('/api/contact', payload)
  return data
}

// ── Admin API ─────────────────────────────────────────────────────────────

function adminHeaders(key: string) {
  return { 'X-Admin-Key': key }
}

export async function getSubmissions(key: string): Promise<ApiResponse<Submission[]>> {
  const { data } = await api.get<ApiResponse<Submission[]>>('/api/admin/submissions', {
    headers: adminHeaders(key),
  })
  return data
}

export async function getStats(key: string): Promise<ApiResponse<StatsDto>> {
  const { data } = await api.get<ApiResponse<StatsDto>>('/api/admin/stats', {
    headers: adminHeaders(key),
  })
  return data
}

export async function updateStatus(
  id: number,
  status: string,
  key: string
): Promise<ApiResponse<Submission>> {
  const { data } = await api.patch<ApiResponse<Submission>>(
    `/api/admin/submissions/${id}/status`,
    { status },
    { headers: adminHeaders(key) }
  )
  return data
}

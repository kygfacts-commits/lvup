import type { StatKey, Stats } from '@/app/onboarding/questions'

export type { StatKey, Stats }

export type Profile = {
  display_name: string | null
  rank: string | null
  level: number | null
  total_xp: number | null
  xp_to_next: number | null
  stats: Partial<Record<StatKey, number>> | null
  role_name: string | null
}

export type Challenge = {
  id: string
  title: string
  progress: number
  progress_target: number
  deadline: string | null
  skill_icon: string | null
  skill_name: string | null
}

/** Rank colors (hex so we can derive translucent glows). */
export const RANK_COLORS: Record<string, string> = {
  F: '#6b7280',
  E: '#10b981',
  D: '#3b82f6',
  C: '#8b5cf6',
  B: '#f59e0b',
  A: '#ef4444',
  S: '#f97316',
  'S+': '#ec4899',
}

export function rankColor(rank: string | null | undefined): string {
  if (!rank) return RANK_COLORS.F
  return RANK_COLORS[rank] ?? RANK_COLORS.F
}

/** Mood scale 1-5 → emoji. */
export const MOOD_EMOJIS = ['😫', '😞', '😐', '🙂', '😄'] as const

/** Local date as YYYY-MM-DD (matches the DB `date` / `logged_at` columns). */
export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

/** Human-friendly Indonesian date, e.g. "Senin, 29 Juni 2026". */
export function formatTodayID(): string {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

/** Up to two uppercase initials from a display name. */
export function initials(name: string | null | undefined): string {
  if (!name) return 'H'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'H'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Deadline like "3 hari lagi" / "Hari ini" / "Lewat". */
export function formatDeadline(deadline: string | null): string | null {
  if (!deadline) return null
  const end = new Date(deadline)
  if (Number.isNaN(end.getTime())) return null
  const start = new Date()
  const days = Math.ceil((end.getTime() - start.getTime()) / 86_400_000)
  if (days < 0) return 'Lewat deadline'
  if (days === 0) return 'Hari ini'
  return `${days} hari lagi`
}

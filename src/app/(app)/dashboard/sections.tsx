'use client'

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { STAT_COLORS, STAT_KEYS } from '@/app/onboarding/questions'
import {
  formatDeadline,
  formatTodayID,
  initials,
  MOOD_EMOJIS,
  rankColor,
  type Challenge,
  type Profile,
} from './types'

/* ----------------------------- shared card ------------------------------ */

function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '1.5rem',
        borderRadius: 16,
        background: 'var(--surface)',
        border: `1px solid ${hover ? 'var(--accent)' : 'var(--border)'}`,
        boxShadow: hover ? '0 14px 34px rgba(124, 58, 237, 0.18)' : 'none',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

const sectionTitleStyle: CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
}

const ghostButtonStyle: CSSProperties = {
  marginTop: '1rem',
  padding: '0.6rem 1rem',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--surface-2)',
  color: 'var(--text)',
  fontWeight: 600,
  fontSize: '0.85rem',
  cursor: 'pointer',
}

const accentButtonStyle: CSSProperties = {
  marginTop: '1rem',
  padding: '0.6rem 1.1rem',
  borderRadius: 10,
  border: 'none',
  background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.85rem',
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(124, 58, 237, 0.35)',
}

/* ------------------------------- top nav -------------------------------- */

export function TopNav({
  displayName,
  onSignOut,
}: {
  displayName: string
  onSignOut: () => void
}) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header style={navStyle}>
      <Link href="/dashboard" style={wordmarkStyle}>
        Lv<span style={{ color: 'var(--accent)' }}>Up</span>
      </Link>

      <div ref={menuRef} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          style={avatarStyle}
        >
          {initials(displayName)}
        </button>

        {open && (
          <div role="menu" style={menuStyle}>
            <Link href="/profile" style={menuItemStyle} onClick={() => setOpen(false)}>
              Profile
            </Link>
            <button type="button" role="menuitem" onClick={onSignOut} style={menuItemButtonStyle}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

const navStyle: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  height: 64,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 1.5rem',
  background: 'rgba(10, 10, 15, 0.85)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid var(--border)',
}

const wordmarkStyle: CSSProperties = {
  fontWeight: 900,
  fontSize: '1.25rem',
  letterSpacing: '-0.02em',
  color: '#fff',
  textDecoration: 'none',
}

const avatarStyle: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: '50%',
  border: '1px solid var(--border)',
  background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
  color: '#fff',
  fontWeight: 800,
  fontSize: '0.85rem',
  cursor: 'pointer',
}

const menuStyle: CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 0.5rem)',
  right: 0,
  minWidth: 160,
  padding: '0.4rem',
  borderRadius: 12,
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  boxShadow: '0 18px 40px rgba(0, 0, 0, 0.5)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.15rem',
}

const menuItemStyle: CSSProperties = {
  padding: '0.6rem 0.75rem',
  borderRadius: 8,
  color: 'var(--text)',
  textDecoration: 'none',
  fontSize: '0.9rem',
}

const menuItemButtonStyle: CSSProperties = {
  ...menuItemStyle,
  textAlign: 'left',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  color: 'var(--rank-a)',
  fontWeight: 600,
}

/* -------------------------------- hero ---------------------------------- */

export function Hero({ profile }: { profile: Profile }) {
  const color = rankColor(profile.rank)
  const rank = profile.rank ?? 'F'
  const level = profile.level ?? 1
  const totalXp = profile.total_xp ?? 0
  const xpToNext = profile.xp_to_next ?? 100
  const pct = Math.min(100, Math.round((totalXp / Math.max(1, xpToNext)) * 100))
  const name = profile.display_name ?? 'Hunter'
  const role = profile.role_name ?? 'Unranked'

  return (
    <section style={heroStyle}>
      <div style={{ flex: '1 1 320px', minWidth: 280 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={rankBadgeStyle(color)}>{rank}</div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
              {name} <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>· {role}</span>
            </h1>
            <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)', fontWeight: 700 }}>
              Level {level}
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', maxWidth: 360 }}>
          <div style={xpTrackStyle}>
            <div style={{ ...xpFillStyle, width: `${pct}%` }} />
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {totalXp} / {xpToNext} XP to next level
          </p>
        </div>
      </div>

      <div style={statsWrapStyle}>
        {STAT_KEYS.map((key) => (
          <div key={key} style={statPillStyle}>
            <span style={{ ...statDotStyle, background: STAT_COLORS[key] }} />
            <span style={{ fontWeight: 700 }}>{key}</span>
            <span style={{ marginLeft: 'auto', fontVariantNumeric: 'tabular-nums', fontWeight: 800 }}>
              {profile.stats?.[key] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

const heroStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2rem',
  justifyContent: 'space-between',
  padding: '2rem',
  borderRadius: 20,
  background:
    'radial-gradient(ellipse 60% 120% at 0% 0%, rgba(124, 58, 237, 0.12), transparent 60%), var(--surface)',
  border: '1px solid var(--border)',
}

function rankBadgeStyle(color: string): CSSProperties {
  return {
    width: 76,
    height: 76,
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    borderRadius: 18,
    fontSize: '2.5rem',
    fontWeight: 900,
    lineHeight: 1,
    color,
    background: 'var(--surface-2)',
    border: `2px solid ${color}`,
    boxShadow: `0 0 36px ${color}66`,
  }
}

const xpTrackStyle: CSSProperties = {
  height: 10,
  borderRadius: 999,
  background: 'var(--surface-2)',
  overflow: 'hidden',
  border: '1px solid var(--border)',
}

const xpFillStyle: CSSProperties = {
  height: '100%',
  borderRadius: 999,
  background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
  boxShadow: '0 0 16px var(--accent-glow)',
  transition: 'width 700ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const statsWrapStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
  gap: '0.6rem',
  flex: '1 1 320px',
  alignContent: 'start',
}

const statPillStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.6rem 0.85rem',
  borderRadius: 10,
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  fontSize: '0.85rem',
}

const statDotStyle: CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
}

/* --------------------------- daily overview ----------------------------- */

export function DailyOverview({
  taskCount,
  habitCount,
  mood,
  onMood,
  savingMood,
}: {
  taskCount: number
  habitCount: number
  mood: number | null
  onMood: (value: number) => void
  savingMood: boolean
}) {
  const router = useRouter()
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem' }}>
        <h2 style={sectionTitleStyle}>Hari Ini</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatTodayID()}</span>
      </div>

      <div style={overviewGridStyle}>
        <Card>
          <h3 style={cardHeadingStyle}>Daily Tasks</h3>
          <p style={cardMutedStyle}>{taskCount} task hari ini</p>
          <button type="button" onClick={() => router.push('/tasks')} style={accentButtonStyle}>
            Tambah Task
          </button>
        </Card>

        <Card>
          <h3 style={cardHeadingStyle}>Habits</h3>
          <p style={cardMutedStyle}>{habitCount} habit aktif</p>
          <button type="button" style={ghostButtonStyle}>
            Kelola Habits
          </button>
        </Card>

        <Card>
          <h3 style={cardHeadingStyle}>Mood</h3>
          <p style={cardMutedStyle}>
            {mood ? 'Mood hari ini tercatat' : 'Bagaimana perasaanmu hari ini?'}
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', gap: '0.4rem' }}>
            {MOOD_EMOJIS.map((emoji, i) => {
              const value = i + 1
              const isSelected = mood === value
              return (
                <button
                  key={value}
                  type="button"
                  disabled={savingMood}
                  onClick={() => onMood(value)}
                  aria-label={`Mood ${value}`}
                  style={moodButtonStyle(isSelected, savingMood)}
                >
                  {emoji}
                </button>
              )
            })}
          </div>
        </Card>
      </div>
    </section>
  )
}

const overviewGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '1rem',
}

const cardHeadingStyle: CSSProperties = {
  fontSize: '1.05rem',
  fontWeight: 800,
}

const cardMutedStyle: CSSProperties = {
  marginTop: '0.35rem',
  color: 'var(--text-muted)',
  fontSize: '0.9rem',
}

function moodButtonStyle(isSelected: boolean, disabled: boolean): CSSProperties {
  return {
    width: 44,
    height: 44,
    borderRadius: 10,
    fontSize: '1.4rem',
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: isSelected ? 'var(--accent-glow)' : 'var(--surface-2)',
    border: `1px solid ${isSelected ? 'var(--accent)' : 'var(--border)'}`,
    transform: isSelected ? 'scale(1.08)' : 'scale(1)',
    transition: 'all 160ms ease',
  }
}

/* ---------------------------- quick stats ------------------------------- */

export function QuickStats({
  streak,
  tasksDone,
  totalXp,
  rank,
}: {
  streak: number
  tasksDone: number
  totalXp: number
  rank: string
}) {
  const items: { icon: string; label: string; value: string }[] = [
    { icon: '🔥', label: 'Streak', value: `${streak} hari` },
    { icon: '⚔️', label: 'Tasks Selesai', value: `${tasksDone} total` },
    { icon: '✨', label: 'XP Total', value: `${totalXp} XP` },
    { icon: '🏆', label: 'Rank', value: rank },
  ]
  return (
    <section style={quickGridStyle}>
      {items.map((it) => (
        <Card key={it.label} style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '1.5rem' }}>{it.icon}</div>
          <div style={{ marginTop: '0.5rem', fontSize: '1.4rem', fontWeight: 900 }}>{it.value}</div>
          <div style={{ marginTop: '0.1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {it.label}
          </div>
        </Card>
      ))}
    </section>
  )
}

const quickGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '1rem',
}

/* ------------------------- skill challenges ----------------------------- */

export function SkillChallenges({ challenges }: { challenges: Challenge[] }) {
  return (
    <section>
      <h2 style={{ ...sectionTitleStyle, marginBottom: '1rem' }}>Skill Challenges</h2>

      {challenges.length === 0 ? (
        <Card>
          <p style={{ color: 'var(--text-muted)' }}>Belum ada challenge aktif</p>
          <button type="button" style={accentButtonStyle}>
            Lihat Preset Challenges
          </button>
        </Card>
      ) : (
        <div style={challengeGridStyle}>
          {challenges.map((c) => {
            const target = Math.max(1, c.progress_target)
            const pct = Math.min(100, Math.round((c.progress / target) * 100))
            const deadline = formatDeadline(c.deadline)
            return (
              <Card key={c.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.4rem' }}>{c.skill_icon ?? '🎯'}</span>
                  <div>
                    <h3 style={{ fontWeight: 800 }}>{c.title}</h3>
                    {c.skill_name && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.skill_name}</p>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <div style={xpTrackStyle}>
                    <div style={{ ...xpFillStyle, width: `${pct}%` }} />
                  </div>
                  <div
                    style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <span>
                      {c.progress} / {c.progress_target}
                    </span>
                    {deadline && <span>{deadline}</span>}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </section>
  )
}

const challengeGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: '1rem',
}

/* ------------------------------ skeleton -------------------------------- */

export function DashboardSkeleton() {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '88px 1.5rem 3rem' }}>
      <div style={{ ...skeletonBlock, height: 180, marginBottom: '2rem' }} />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div style={{ ...skeletonBlock, height: 150 }} />
        <div style={{ ...skeletonBlock, height: 150 }} />
        <div style={{ ...skeletonBlock, height: 150 }} />
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
        }}
      >
        <div style={{ ...skeletonBlock, height: 110 }} />
        <div style={{ ...skeletonBlock, height: 110 }} />
        <div style={{ ...skeletonBlock, height: 110 }} />
        <div style={{ ...skeletonBlock, height: 110 }} />
      </div>
    </div>
  )
}

const skeletonBlock: CSSProperties = {
  borderRadius: 16,
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  animation: 'pulseGlow 1.6s ease-in-out infinite',
}

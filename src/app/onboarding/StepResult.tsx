'use client'

import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { ROLES, STAT_COLORS, STAT_KEYS, STAT_LABELS, suggestRole } from './questions'
import type { Role, Stats } from './questions'

type Props = {
  stats: Stats
  onComplete: (role: Role, roleName: string) => void
}

const MAX_ROLE_NAME = 40

export function StepResult({ stats, onComplete }: Props) {
  const suggested = useMemo(() => suggestRole(stats), [stats])
  const maxStat = useMemo(
    () => Math.max(1, ...STAT_KEYS.map((key) => stats[key])),
    [stats],
  )

  const [selectedRole, setSelectedRole] = useState<Role>(suggested)
  const [roleName, setRoleName] = useState<string>(suggested.name)
  const [filled, setFilled] = useState(false)
  const [hoveredRole, setHoveredRole] = useState<string | null>(null)

  // Trigger the stat-bar fill transition one frame after mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => setFilled(true))
    return () => cancelAnimationFrame(id)
  }, [])

  function handlePickRole(role: Role) {
    setSelectedRole(role)
    setRoleName(role.name)
  }

  const trimmedName = roleName.trim()
  const canBegin = trimmedName.length > 0

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={eyebrowStyle}>RANK F · AWAKENED</p>
          <h1 style={titleStyle}>Awakening Complete</h1>
          <p style={subtitleStyle}>Kekuatanmu telah terbangun. Inilah dirimu.</p>
        </header>

        <section style={cardStyle}>
          <h2 style={sectionTitleStyle}>Your Stats</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {STAT_KEYS.map((key) => {
              const value = stats[key]
              const pct = filled ? Math.round((value / maxStat) * 100) : 0
              return (
                <div key={key}>
                  <div style={statHeaderStyle}>
                    <span>
                      {STAT_LABELS[key]}{' '}
                      <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{key}</span>
                    </span>
                    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{value}</span>
                  </div>
                  <div style={statTrackStyle}>
                    <div
                      style={{
                        ...statFillStyle,
                        width: `${pct}%`,
                        background: STAT_COLORS[key],
                        boxShadow: `0 0 12px ${STAT_COLORS[key]}`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ ...sectionTitleStyle, marginBottom: '1rem' }}>Choose Your Class</h2>
          <div style={roleGridStyle}>
            {ROLES.map((role) => {
              const isSelected = selectedRole.name === role.name
              const isSuggested = suggested.name === role.name
              const isHover = hoveredRole === role.name
              return (
                <button
                  key={role.name}
                  type="button"
                  onClick={() => handlePickRole(role)}
                  onMouseEnter={() => setHoveredRole(role.name)}
                  onMouseLeave={() => setHoveredRole(null)}
                  style={roleCardStyle(isSelected, isHover)}
                >
                  {isSuggested && <span style={suggestedBadgeStyle}>Suggested</span>}
                  <span style={{ fontSize: '2rem', lineHeight: 1 }}>{role.icon}</span>
                  <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{role.name}</span>
                  <span style={rolePrimaryStyle}>{role.primaryStat}</span>
                  <span style={roleDescStyle}>{role.description}</span>
                </button>
              )
            })}
          </div>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Role Name
            </span>
            <input
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              maxLength={MAX_ROLE_NAME}
              placeholder={selectedRole.name}
              style={inputStyle}
            />
          </label>
        </section>

        <button
          type="button"
          disabled={!canBegin}
          onClick={() => onComplete(selectedRole, trimmedName)}
          style={beginButtonStyle(canBegin)}
        >
          Begin Your Journey
        </button>
      </div>
    </main>
  )
}

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  padding: '4rem 1.5rem',
  background:
    'radial-gradient(ellipse 80% 50% at 50% -5%, rgba(124, 58, 237, 0.18), transparent 70%), var(--bg)',
}

const shellStyle: CSSProperties = {
  width: '100%',
  maxWidth: 720,
  animation: 'fadeUp 450ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const eyebrowStyle: CSSProperties = {
  letterSpacing: '0.35em',
  fontSize: '0.7rem',
  color: 'var(--accent)',
  marginBottom: '0.75rem',
}

const titleStyle: CSSProperties = {
  fontSize: 'clamp(2.2rem, 1rem + 5vw, 3.5rem)',
  fontWeight: 900,
  letterSpacing: '-0.03em',
  backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #c9c2ff 70%, #7c3aed 150%)',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
}

const subtitleStyle: CSSProperties = {
  marginTop: '0.75rem',
  color: 'var(--text-muted)',
}

const cardStyle: CSSProperties = {
  padding: '1.75rem',
  borderRadius: 18,
  background: 'var(--surface)',
  border: '1px solid var(--border)',
}

const sectionTitleStyle: CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 700,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: '1.25rem',
}

const statHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  marginBottom: '0.4rem',
  fontSize: '0.9rem',
  fontWeight: 700,
}

const statTrackStyle: CSSProperties = {
  height: 10,
  borderRadius: 999,
  background: 'var(--surface-2)',
  overflow: 'hidden',
}

const statFillStyle: CSSProperties = {
  height: '100%',
  borderRadius: 999,
  transition: 'width 900ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const roleGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '0.85rem',
}

function roleCardStyle(isSelected: boolean, isHover: boolean): CSSProperties {
  const active = isSelected || isHover
  return {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1.25rem',
    borderRadius: 14,
    cursor: 'pointer',
    textAlign: 'left',
    color: 'var(--text)',
    background: isSelected ? 'var(--surface-2)' : 'var(--surface)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    boxShadow: isSelected ? '0 12px 32px rgba(124, 58, 237, 0.3)' : 'none',
    transform: isHover && !isSelected ? 'translateY(-3px)' : 'translateY(0)',
    transition: 'transform 200ms ease, border-color 200ms ease, background 200ms ease, box-shadow 200ms ease',
  }
}

const suggestedBadgeStyle: CSSProperties = {
  position: 'absolute',
  top: 10,
  right: 10,
  fontSize: '0.6rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  padding: '0.2rem 0.5rem',
  borderRadius: 999,
  color: '#fff',
  background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
}

const rolePrimaryStyle: CSSProperties = {
  alignSelf: 'flex-start',
  fontSize: '0.65rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  padding: '0.15rem 0.5rem',
  borderRadius: 6,
  color: 'var(--accent)',
  background: 'var(--accent-glow)',
}

const roleDescStyle: CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  lineHeight: 1.45,
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: 10,
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  fontSize: '1rem',
  outline: 'none',
}

function beginButtonStyle(enabled: boolean): CSSProperties {
  return {
    marginTop: '2rem',
    width: '100%',
    padding: '1rem',
    borderRadius: 12,
    border: 'none',
    fontWeight: 800,
    fontSize: '1rem',
    color: '#fff',
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.5,
    background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
    boxShadow: '0 10px 30px rgba(124, 58, 237, 0.45)',
  }
}

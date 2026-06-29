'use client'

import type { CSSProperties } from 'react'

type Props = {
  error: string | null
  onRetry: () => void
}

export function StepSaving({ error, onRetry }: Props) {
  if (error) {
    return (
      <main style={pageStyle}>
        <div style={errorCardStyle}>
          <span style={{ fontSize: '2.5rem' }}>⚠️</span>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Awakening Interrupted</h1>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>{error}</p>
          <button type="button" onClick={onRetry} style={retryButtonStyle}>
            Try Again
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={pageStyle}>
      <div style={{ textAlign: 'center' }}>
        <div style={spinnerStyle} />
        <p style={loadingTextStyle}>AWAKENING YOUR POWER…</p>
      </div>
    </main>
  )
}

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: '2rem',
  background:
    'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124, 58, 237, 0.16), transparent 70%), var(--bg)',
}

const spinnerStyle: CSSProperties = {
  width: 56,
  height: 56,
  margin: '0 auto',
  borderRadius: '50%',
  border: '3px solid var(--surface-2)',
  borderTopColor: 'var(--accent)',
  animation: 'spin 800ms linear infinite',
}

const loadingTextStyle: CSSProperties = {
  marginTop: '1.5rem',
  letterSpacing: '0.25em',
  fontSize: '0.85rem',
  color: 'var(--text-muted)',
  animation: 'pulseGlow 1.6s ease-in-out infinite',
}

const errorCardStyle: CSSProperties = {
  width: '100%',
  maxWidth: 420,
  padding: '2.5rem',
  borderRadius: 18,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.85rem',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5)',
}

const retryButtonStyle: CSSProperties = {
  marginTop: '0.75rem',
  padding: '0.85rem 2rem',
  borderRadius: 10,
  border: 'none',
  fontWeight: 700,
  color: '#fff',
  cursor: 'pointer',
  background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
}

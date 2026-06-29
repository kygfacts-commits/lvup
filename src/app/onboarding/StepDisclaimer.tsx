'use client'

import { useEffect, useState, type CSSProperties } from 'react'

type Props = {
  onStart: () => void
}

export function StepDisclaimer({ onStart }: Props) {
  const [showButton, setShowButton] = useState(false)

  // Reveal the CTA only after the user has had a moment to read the copy.
  useEffect(() => {
    const id = window.setTimeout(() => setShowButton(true), 1500)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <main style={pageStyle}>
      <div aria-hidden="true" style={pulseLayerStyle} />

      <div style={contentStyle}>
        <p style={wordmarkStyle}>
          Lv<span style={{ color: 'var(--accent)' }}>Up</span>
        </p>

        <div style={copyStyle}>
          <p style={leadStyle}>LvUp bikin kamu beneran Level Up.</p>
          <p style={bodyStyle}>
            Jawaban jujurmu dibutuhkan agar rankmu sesuai dengan kondisi nyatamu.
          </p>
          <p style={bodyStyle}>Achieve rankmu dan tingkatkan.</p>
          <p style={closingStyle}>
            <em>Selamat Bertarung, Pejuang.</em> ⚔️
          </p>
        </div>

        <button
          type="button"
          onClick={onStart}
          style={{
            ...buttonStyle,
            opacity: showButton ? 1 : 0,
            transform: showButton ? 'translateY(0)' : 'translateY(8px)',
            pointerEvents: showButton ? 'auto' : 'none',
          }}
        >
          Mulai →
        </button>
      </div>
    </main>
  )
}

const pageStyle: CSSProperties = {
  position: 'relative',
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: '2rem 1.5rem',
  overflow: 'hidden',
  background: 'var(--bg)',
}

const pulseLayerStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background:
    'radial-gradient(ellipse 60% 50% at 50% 45%, rgba(124, 58, 237, 0.22), transparent 70%)',
  animation: 'pulseGlow 5s ease-in-out infinite',
}

const contentStyle: CSSProperties = {
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: 560,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2.5rem',
  animation: 'fadeUp 600ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const wordmarkStyle: CSSProperties = {
  fontSize: '2rem',
  fontWeight: 900,
  letterSpacing: '-0.03em',
  color: '#fff',
}

const copyStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
}

const leadStyle: CSSProperties = {
  fontSize: 'clamp(1.4rem, 1rem + 2vw, 2rem)',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  lineHeight: 1.25,
  color: 'var(--text)',
}

const bodyStyle: CSSProperties = {
  fontSize: '1rem',
  lineHeight: 1.6,
  color: 'var(--text-muted)',
}

const closingStyle: CSSProperties = {
  marginTop: '0.75rem',
  fontSize: '1.05rem',
  color: 'var(--text)',
}

const buttonStyle: CSSProperties = {
  padding: '0.9rem 2.5rem',
  borderRadius: 999,
  border: 'none',
  fontWeight: 800,
  fontSize: '1rem',
  color: '#fff',
  cursor: 'pointer',
  background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
  boxShadow: '0 10px 30px rgba(124, 58, 237, 0.45)',
  transition: 'opacity 600ms ease, transform 600ms ease',
}

'use client'

import { useState, type CSSProperties } from 'react'
import { OPTION_KEYS } from './questions'
import type { OptionKey, Question } from './questions'

type Props = {
  question: Question
  index: number
  total: number
  onAnswer: (questionId: number, option: OptionKey) => void
}

export function StepQuestions({ question, index, total, onAnswer }: Props) {
  const [hovered, setHovered] = useState<OptionKey | null>(null)

  const progress = Math.round(((index + 1) / total) * 100)
  const current = String(index + 1).padStart(2, '0')
  const totalLabel = String(total).padStart(2, '0')

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <div style={progressHeaderStyle}>
          <span style={{ letterSpacing: '0.35em', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            AWAKENING
          </span>
          <span style={{ fontVariantNumeric: 'tabular-nums', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {current} / {totalLabel}
          </span>
        </div>

        <div style={trackStyle}>
          <div style={{ ...fillStyle, width: `${progress}%` }} />
        </div>

        {/* keyed so each new question re-triggers the entrance animation */}
        <div key={question.id} style={contentStyle}>
          <h1 style={questionStyle}>{question.question}</h1>

          <div style={optionsGridStyle}>
            {OPTION_KEYS.map((key) => {
              const option = question.options[key]
              const isHover = hovered === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onAnswer(question.id, key)}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                  style={optionCardStyle(isHover)}
                >
                  <span style={letterBadgeStyle(isHover)}>{key}</span>
                  <span style={{ textAlign: 'left', lineHeight: 1.45 }}>{option.text}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem 1.5rem',
  background:
    'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124, 58, 237, 0.16), transparent 70%), var(--bg)',
}

const shellStyle: CSSProperties = {
  width: '100%',
  maxWidth: 760,
}

const progressHeaderStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.75rem',
}

const trackStyle: CSSProperties = {
  height: 6,
  borderRadius: 999,
  background: 'var(--surface-2)',
  overflow: 'hidden',
  border: '1px solid var(--border)',
}

const fillStyle: CSSProperties = {
  height: '100%',
  borderRadius: 999,
  background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)',
  boxShadow: '0 0 16px var(--accent-glow)',
  transition: 'width 400ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const contentStyle: CSSProperties = {
  marginTop: '3rem',
  animation: 'fadeUp 350ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const questionStyle: CSSProperties = {
  fontSize: 'clamp(1.5rem, 1rem + 2.5vw, 2.4rem)',
  fontWeight: 800,
  lineHeight: 1.2,
  letterSpacing: '-0.02em',
  textAlign: 'center',
  marginBottom: '2.5rem',
}

const optionsGridStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '1rem',
}

function optionCardStyle(isHover: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.25rem',
    borderRadius: 14,
    cursor: 'pointer',
    textAlign: 'left',
    color: 'var(--text)',
    fontSize: '1rem',
    background: isHover ? 'var(--surface-2)' : 'var(--surface)',
    border: `1px solid ${isHover ? 'var(--accent)' : 'var(--border)'}`,
    boxShadow: isHover ? '0 10px 30px rgba(124, 58, 237, 0.25)' : 'none',
    transform: isHover ? 'translateY(-3px)' : 'translateY(0)',
    transition: 'transform 200ms ease, border-color 200ms ease, background 200ms ease, box-shadow 200ms ease',
  }
}

function letterBadgeStyle(isHover: boolean): CSSProperties {
  return {
    flexShrink: 0,
    width: 38,
    height: 38,
    display: 'grid',
    placeItems: 'center',
    borderRadius: 10,
    fontWeight: 800,
    fontSize: '1rem',
    color: isHover ? '#fff' : 'var(--accent)',
    background: isHover ? 'linear-gradient(180deg, #8b5cf6, #7c3aed)' : 'var(--surface-2)',
    border: `1px solid ${isHover ? 'transparent' : 'var(--border)'}`,
    transition: 'all 200ms ease',
  }
}

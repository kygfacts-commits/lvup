'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { OPTION_KEYS } from './questions'
import type { OptionKey, Question } from './questions'

type Props = {
  question: Question
  index: number
  total: number
  onAnswer: (questionId: number, option: OptionKey) => void
}

const ADVANCE_DELAY_MS = 220

export function StepQuestions({ question, index, total, onAnswer }: Props) {
  const [hovered, setHovered] = useState<OptionKey | null>(null)
  const [selected, setSelected] = useState<OptionKey | null>(null)

  // Reset transient UI state whenever a new question is shown.
  useEffect(() => {
    setHovered(null)
    setSelected(null)
  }, [question.id])

  const progress = Math.round(((index + 1) / total) * 100)
  const current = String(index + 1).padStart(2, '0')
  const totalLabel = String(total).padStart(2, '0')

  function handlePick(key: OptionKey) {
    if (selected) return
    setSelected(key)
    window.setTimeout(() => onAnswer(question.id, key), ADVANCE_DELAY_MS)
  }

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

          <div style={optionsListStyle}>
            {OPTION_KEYS.map((key) => {
              const option = question.options[key]
              const isHover = hovered === key
              const isSelected = selected === key
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handlePick(key)}
                  onMouseEnter={() => setHovered(key)}
                  onMouseLeave={() => setHovered(null)}
                  style={optionCardStyle(isHover, isSelected)}
                >
                  <span style={letterBadgeStyle(isSelected)}>{key}</span>
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
  padding: '2.5rem 1.5rem',
  background:
    'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124, 58, 237, 0.16), transparent 70%), var(--bg)',
}

const shellStyle: CSSProperties = {
  width: '100%',
  maxWidth: 640,
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
  marginTop: '2.5rem',
  animation: 'fadeUp 350ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const questionStyle: CSSProperties = {
  fontSize: 'clamp(1.35rem, 1rem + 2vw, 2.1rem)',
  fontWeight: 800,
  lineHeight: 1.25,
  letterSpacing: '-0.02em',
  textAlign: 'center',
  marginBottom: '2rem',
}

const optionsListStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
}

function optionCardStyle(isHover: boolean, isSelected: boolean): CSSProperties {
  const active = isHover || isSelected
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
    padding: '1.1rem 1.25rem',
    borderRadius: 12,
    cursor: 'pointer',
    textAlign: 'left',
    color: 'var(--text)',
    fontSize: '1rem',
    background: active ? 'var(--surface-2)' : 'var(--surface)',
    border: '1px solid var(--border)',
    borderLeft: `3px solid ${active ? 'var(--accent)' : 'transparent'}`,
    boxShadow: isSelected ? '0 10px 30px rgba(124, 58, 237, 0.25)' : 'none',
    transform: isHover && !isSelected ? 'translateX(4px)' : 'translateX(0)',
    transition: 'transform 180ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease',
  }
}

function letterBadgeStyle(isSelected: boolean): CSSProperties {
  return {
    flexShrink: 0,
    width: 34,
    height: 34,
    display: 'grid',
    placeItems: 'center',
    borderRadius: 8,
    fontWeight: 800,
    fontSize: '0.95rem',
    color: isSelected ? '#fff' : 'var(--text-muted)',
    background: isSelected ? 'linear-gradient(180deg, #8b5cf6, #7c3aed)' : 'var(--surface-2)',
    border: `1px solid ${isSelected ? 'transparent' : 'var(--border)'}`,
    transition: 'all 180ms ease',
  }
}

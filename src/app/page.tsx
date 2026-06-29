import Link from 'next/link'

const RANKS = [
  { label: 'F', color: 'var(--rank-f)', top: '18%', left: '8%', size: 64, delay: '0s' },
  { label: 'E', color: 'var(--rank-e)', top: '70%', left: '14%', size: 52, delay: '0.6s' },
  { label: 'D', color: 'var(--rank-d)', top: '32%', left: '84%', size: 58, delay: '1.2s' },
  { label: 'C', color: 'var(--rank-c)', top: '78%', left: '80%', size: 70, delay: '0.3s' },
  { label: 'B', color: 'var(--rank-b)', top: '12%', left: '68%', size: 48, delay: '0.9s' },
  { label: 'A', color: 'var(--rank-a)', top: '54%', left: '4%', size: 56, delay: '1.5s' },
  { label: 'S', color: 'var(--rank-s)', top: '8%', left: '40%', size: 80, delay: '0.45s' },
  { label: 'S+', color: 'var(--rank-sp)', top: '60%', left: '52%', size: 44, delay: '1.1s' },
]

export default function LandingPage() {
  return (
    <main
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124, 58, 237, 0.18), transparent 70%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124, 58, 237, 0.10), transparent 70%), var(--bg)',
      }}
    >
      {/* Floating rank badges (decorative) */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {RANKS.map((r) => (
          <span
            key={r.label}
            style={{
              position: 'absolute',
              top: r.top,
              left: r.left,
              width: r.size,
              height: r.size,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 16,
              border: `1px solid ${r.color}`,
              color: r.color,
              fontWeight: 800,
              fontSize: r.size * 0.4,
              letterSpacing: '0.02em',
              background: 'rgba(18, 18, 26, 0.55)',
              boxShadow: `0 0 24px ${r.color}33, inset 0 0 12px ${r.color}22`,
              backdropFilter: 'blur(2px)',
              animation: `floaty 6s ease-in-out ${r.delay} infinite`,
            }}
          >
            {r.label}
          </span>
        ))}
      </div>

      {/* Hero */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
        <p
          style={{
            textTransform: 'uppercase',
            letterSpacing: '0.4em',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            marginBottom: '1.5rem',
          }}
        >
          LvUp
        </p>
        <h1
          style={{
            fontSize: 'clamp(3rem, 1rem + 9vw, 7rem)',
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: '-0.03em',
            backgroundImage:
              'linear-gradient(180deg, #ffffff 0%, #c9c2ff 60%, #7c3aed 140%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            textShadow: '0 0 60px rgba(124, 58, 237, 0.35)',
          }}
        >
          Level Up
          <br />
          Yourself
        </h1>
        <p
          style={{
            marginTop: '1.5rem',
            fontSize: 'clamp(1rem, 0.92rem + 0.4vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: 540,
            marginInline: 'auto',
            lineHeight: 1.6,
          }}
        >
          Track habits, complete quests, unlock skills.
          <br />
          Your life — gamified.
        </p>

        <div
          style={{
            marginTop: '2.5rem',
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Link
            href="/register"
            style={{
              padding: '0.9rem 2rem',
              borderRadius: 12,
              fontWeight: 700,
              color: '#fff',
              background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
              boxShadow: '0 8px 30px rgba(124, 58, 237, 0.45)',
              textDecoration: 'none',
            }}
          >
            Start Your Journey
          </Link>
          <Link
            href="/login"
            style={{
              padding: '0.9rem 2rem',
              borderRadius: 12,
              fontWeight: 700,
              color: 'var(--text)',
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              textDecoration: 'none',
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </main>
  )
}

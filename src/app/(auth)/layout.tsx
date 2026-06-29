import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background:
          'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124, 58, 237, 0.16), transparent 70%), var(--bg)',
      }}
    >
      <header style={{ padding: '1.5rem 2rem' }}>
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            fontWeight: 900,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
            color: 'var(--text)',
          }}
        >
          Lv<span style={{ color: 'var(--accent)' }}>Up</span>
        </Link>
      </header>
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        {children}
      </main>
    </div>
  )
}

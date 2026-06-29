'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div style={cardStyle}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
        Welcome back, Hunter
      </h1>
      <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
        Log in to continue your ascent.
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label style={labelStyle}>
          <span style={labelTextStyle}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          <span style={labelTextStyle}>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={inputStyle}
          />
        </label>

        {error && <p style={{ color: 'var(--rank-a)', fontSize: '0.85rem' }}>{error}</p>}

        <button type="submit" disabled={loading} style={buttonStyle(loading)}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>

      <p style={footerStyle}>
        New here?{' '}
        <Link href="/register" style={linkStyle}>
          Create an account
        </Link>
      </p>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 420,
  padding: '2.5rem',
  borderRadius: 20,
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(124,58,237,0.06)',
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
}

const labelTextStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  fontWeight: 600,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 0.9rem',
  borderRadius: 10,
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  fontSize: '0.95rem',
  outline: 'none',
}

const buttonStyle = (loading: boolean): React.CSSProperties => ({
  marginTop: '0.5rem',
  padding: '0.85rem 1rem',
  borderRadius: 10,
  border: 'none',
  fontWeight: 700,
  color: '#fff',
  cursor: loading ? 'not-allowed' : 'pointer',
  opacity: loading ? 0.65 : 1,
  background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
})

const footerStyle: React.CSSProperties = {
  marginTop: '1.5rem',
  textAlign: 'center',
  fontSize: '0.9rem',
  color: 'var(--text-muted)',
}

const linkStyle: React.CSSProperties = {
  color: 'var(--accent)',
  fontWeight: 600,
  textDecoration: 'none',
}

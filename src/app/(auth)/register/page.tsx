'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    })

    if (signUpError) {
      setLoading(false)
      setError(signUpError.message)
      return
    }

    // Fallback for a flaky handle_new_user trigger: if signup succeeded but
    // the trigger didn't populate the profile (or its display_name), backfill
    // it manually. The upsert error is intentionally ignored because the row
    // may already exist from the trigger.
    if (data.user) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      await supabase
        .from('profiles')
        .upsert(
          { id: data.user.id, display_name: displayName },
          { onConflict: 'id' },
        )
    }

    setLoading(false)
    router.push('/onboarding')
  }

  return (
    <AuthCard
      title="Begin your ascent"
      subtitle="Create an account to start leveling up."
    >
      <form onSubmit={handleSubmit} style={formStyle}>
        <Field
          label="Display name"
          type="text"
          value={displayName}
          onChange={setDisplayName}
          placeholder="Shadow Monarch"
          required
        />
        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          required
        />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          required
        />
        <Field
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="••••••••"
          required
        />

        {error && <p className="text-red-400 text-sm">{typeof error === 'string' ? error : (error as any).message || JSON.stringify(error)}</p>}

        <button type="submit" disabled={loading} style={buttonStyle(loading)}>
          {loading ? 'Creating account…' : 'Start Your Journey'}
        </button>
      </form>

      <p style={footerStyle}>
        Already have an account?{' '}
        <Link href="/login" style={linkStyle}>
          Login
        </Link>
      </p>
    </AuthCard>
  )
}

/* ---- shared auth UI (kept local to avoid premature abstraction) ---- */

function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 420,
        padding: '2.5rem',
        borderRadius: 20,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(124,58,237,0.06)',
      }}
    >
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
        {title}
      </h1>
      <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
        {subtitle}
      </p>
      <div style={{ marginTop: '2rem' }}>{children}</div>
    </div>
  )
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  required?: boolean
}) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
      />
    </label>
  )
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
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

'use client'

import { useCallback, useEffect, useState, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { todayISO, type Challenge, type Profile } from './types'
import {
  DailyOverview,
  DashboardSkeleton,
  Hero,
  QuickStats,
  SkillChallenges,
  TopNav,
} from './sections'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [mood, setMood] = useState<number | null>(null)
  const [taskCount, setTaskCount] = useState(0)
  const [tasksDone, setTasksDone] = useState(0)
  const [habitCount, setHabitCount] = useState(0)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [savingMood, setSavingMood] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      router.replace('/login')
      return
    }
    setUserId(user.id)

    const today = todayISO()
    const [profileRes, moodRes, tasksRes, habitsRes, challengesRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('display_name, rank, level, total_xp, xp_to_next, stats, role_name')
        .eq('id', user.id)
        .single(),
      supabase.from('mood_logs').select('mood').eq('user_id', user.id).eq('logged_at', today).maybeSingle(),
      supabase.from('daily_tasks').select('id, is_completed').eq('user_id', user.id).eq('date', today),
      supabase.from('habits').select('id').eq('user_id', user.id).eq('is_active', true),
      supabase
        .from('skill_challenges')
        .select('id, title, progress, progress_target, deadline, skill_icon, skill_name')
        .eq('user_id', user.id)
        .eq('status', 'active'),
    ])

    if (profileRes.error || !profileRes.data) {
      setError('Gagal memuat profil. Coba lagi.')
      setLoading(false)
      return
    }

    setProfile(profileRes.data as Profile)
    setMood((moodRes.data as { mood: number } | null)?.mood ?? null)

    const tasks = (tasksRes.data as { id: string; is_completed: boolean }[] | null) ?? []
    setTaskCount(tasks.length)
    setTasksDone(tasks.filter((t) => t.is_completed).length)

    setHabitCount(((habitsRes.data as unknown[] | null) ?? []).length)
    setChallenges((challengesRes.data as Challenge[] | null) ?? [])

    setLoading(false)
  }, [router])

  useEffect(() => {
    void load()
  }, [load])

  const handleMood = useCallback(
    async (value: number) => {
      if (!userId || savingMood) return
      const previous = mood
      setMood(value)
      setSavingMood(true)

      const supabase = createClient()
      const { error: moodError } = await supabase.from('mood_logs').upsert(
        {
          user_id: userId,
          mood: value,
          logged_at: todayISO(),
        },
        { onConflict: 'user_id,logged_at' },
      )
      if (moodError) setMood(previous)
      setSavingMood(false)
    },
    [userId, mood, savingMood],
  )

  const handleSignOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/login')
  }, [router])

  if (loading) return <DashboardSkeleton />

  if (error || !profile) {
    return (
      <main style={errorWrapStyle}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {error ?? 'Profil tidak ditemukan.'}
          </p>
          <button type="button" onClick={() => void load()} style={retryButtonStyle}>
            Coba Lagi
          </button>
        </div>
      </main>
    )
  }

  return (
    <>
      <TopNav displayName={profile.display_name ?? 'Hunter'} onSignOut={handleSignOut} />
      <main style={pageWrapStyle}>
        <Hero profile={profile} />
        <DailyOverview
          taskCount={taskCount}
          habitCount={habitCount}
          mood={mood}
          onMood={handleMood}
          savingMood={savingMood}
        />
        <QuickStats
          streak={0}
          tasksDone={tasksDone}
          totalXp={profile.total_xp ?? 0}
          rank={profile.rank ?? 'F'}
        />
        <SkillChallenges challenges={challenges} />
      </main>
    </>
  )
}

const pageWrapStyle: CSSProperties = {
  maxWidth: 1100,
  margin: '0 auto',
  padding: '88px 1.5rem 4rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  animation: 'fadeUp 400ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const errorWrapStyle: CSSProperties = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  padding: '2rem',
}

const retryButtonStyle: CSSProperties = {
  padding: '0.75rem 1.75rem',
  borderRadius: 10,
  border: 'none',
  fontWeight: 700,
  color: '#fff',
  cursor: 'pointer',
  background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
}

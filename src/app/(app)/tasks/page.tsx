'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatTodayID, todayISO } from '../dashboard/types'

type Task = {
  id: string
  title: string
  description: string | null
  is_completed: boolean
  xp_reward: number
  priority: number
  category_id: string | null
}

const PRIORITIES: { value: number; label: string; icon: string }[] = [
  { value: 1, label: 'Tinggi', icon: '🔴' },
  { value: 2, label: 'Sedang', icon: '🟡' },
  { value: 3, label: 'Rendah', icon: '🟢' },
]

const XP_MIN = 5
const XP_MAX = 50
const XP_DEFAULT = 10

function priorityMeta(priority: number) {
  return PRIORITIES.find((p) => p.value === priority) ?? PRIORITIES[1]
}

export default function TasksPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set())
  const [modalOpen, setModalOpen] = useState(false)

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

    const { data, error: tasksError } = await supabase
      .from('daily_tasks')
      .select('id, title, description, is_completed, xp_reward, priority, category_id')
      .eq('user_id', user.id)
      .eq('date', todayISO())
      .order('priority', { ascending: true })
      .order('created_at', { ascending: true })

    if (tasksError) {
      setError('Gagal memuat task. Coba lagi.')
      setLoading(false)
      return
    }

    setTasks((data as Task[] | null) ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => {
    void load()
  }, [load])

  const setBusy = useCallback((id: string, busy: boolean) => {
    setBusyIds((prev) => {
      const next = new Set(prev)
      if (busy) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const toggleComplete = useCallback(
    async (task: Task) => {
      if (!userId || busyIds.has(task.id)) return
      const completing = !task.is_completed
      setBusy(task.id, true)
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, is_completed: completing } : t)),
      )

      const supabase = createClient()
      const { error: updateError } = await supabase
        .from('daily_tasks')
        .update({
          is_completed: completing,
          completed_at: completing ? new Date().toISOString() : null,
        })
        .eq('id', task.id)

      if (updateError) {
        // revert on failure
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, is_completed: !completing } : t)),
        )
        setBusy(task.id, false)
        return
      }

      if (completing) {
        await supabase.rpc('award_xp', {
          p_user_id: userId,
          p_source_type: 'daily_task',
          p_source_id: task.id,
          p_xp: task.xp_reward,
          p_stat: null,
          p_stat_amount: 0,
          p_description: `Task selesai: ${task.title}`,
        })
      }

      setBusy(task.id, false)
    },
    [userId, busyIds, setBusy],
  )

  const deleteTask = useCallback(
    async (task: Task) => {
      if (busyIds.has(task.id)) return
      const snapshot = tasks
      setTasks((prev) => prev.filter((t) => t.id !== task.id))

      const supabase = createClient()
      const { error: deleteError } = await supabase.from('daily_tasks').delete().eq('id', task.id)
      if (deleteError) {
        // restore on failure
        setTasks(snapshot)
      }
    },
    [tasks, busyIds],
  )

  const addTask = useCallback(
    async (input: {
      title: string
      description: string
      priority: number
      xpReward: number
    }) => {
      if (!userId) throw new Error('Not authenticated')

      const supabase = createClient()
      const { data, error: insertError } = await supabase
        .from('daily_tasks')
        .insert({
          user_id: userId,
          title: input.title.trim(),
          description: input.description.trim() || null,
          date: todayISO(),
          priority: input.priority,
          xp_reward: input.xpReward,
          is_completed: false,
        })
        .select('id, title, description, is_completed, xp_reward, priority, category_id')
        .single()

      if (insertError || !data) {
        throw new Error(insertError?.message ?? 'Gagal menambah task')
      }

      setTasks((prev) =>
        [...prev, data as Task].sort((a, b) => a.priority - b.priority),
      )
    },
    [userId],
  )

  const { doneCount, totalCount, xpEarned, pct } = useMemo(() => {
    const total = tasks.length
    const done = tasks.filter((t) => t.is_completed).length
    const xp = tasks.filter((t) => t.is_completed).reduce((sum, t) => sum + (t.xp_reward ?? 0), 0)
    return {
      doneCount: done,
      totalCount: total,
      xpEarned: xp,
      pct: total === 0 ? 0 : Math.round((done / total) * 100),
    }
  }, [tasks])

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        {/* header */}
        <header style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link href="/dashboard" aria-label="Kembali ke dashboard" style={backButtonStyle}>
              ←
            </Link>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
                Daily Tasks
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{formatTodayID()}</p>
            </div>
          </div>
          <button type="button" onClick={() => setModalOpen(true)} style={accentButtonStyle}>
            ＋ Tambah Task
          </button>
        </header>

        {/* progress summary */}
        {!loading && !error && totalCount > 0 && (
          <section style={summaryStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {doneCount} / {totalCount} task selesai hari ini
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 700 }}>
                ✨ {xpEarned} XP
              </span>
            </div>
            <div style={trackStyle}>
              <div style={{ ...fillStyle, width: `${pct}%` }} />
            </div>
          </section>
        )}

        {/* body */}
        {loading ? (
          <TaskListSkeleton />
        ) : error ? (
          <div style={emptyStyle}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{error}</p>
            <button type="button" onClick={() => void load()} style={accentButtonStyle}>
              Coba Lagi
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div style={emptyStyle}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🗒️</div>
            <p style={{ color: 'var(--text-muted)' }}>
              Belum ada task hari ini. Tambahkan task pertamamu!
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              style={{ ...accentButtonStyle, marginTop: '1.25rem' }}
            >
              ＋ Tambah Task
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                busy={busyIds.has(task.id)}
                onToggle={() => void toggleComplete(task)}
                onDelete={() => void deleteTask(task)}
              />
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <AddTaskModal onClose={() => setModalOpen(false)} onSubmit={addTask} />
      )}
    </main>
  )
}

/* ------------------------------ task card ------------------------------- */

function TaskCard({
  task,
  busy,
  onToggle,
  onDelete,
}: {
  task: Task
  busy: boolean
  onToggle: () => void
  onDelete: () => void
}) {
  const [hover, setHover] = useState(false)
  const meta = priorityMeta(task.priority)
  const done = task.is_completed

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={taskCardStyle(hover, done)}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={busy}
        aria-label={done ? 'Tandai belum selesai' : 'Tandai selesai'}
        aria-pressed={done}
        style={checkboxStyle(done)}
      >
        {done ? '✓' : ''}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontWeight: 700,
            textDecoration: done ? 'line-through' : 'none',
            color: done ? 'var(--text-muted)' : 'var(--text)',
            transition: 'color 200ms ease',
          }}
        >
          {task.title}
        </p>
        {task.description && (
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {task.description}
          </p>
        )}
      </div>

      <span style={priorityBadgeStyle}>
        {meta.icon} {meta.label}
      </span>
      <span style={xpBadgeStyle}>+{task.xp_reward} XP</span>

      <button
        type="button"
        onClick={onDelete}
        aria-label="Hapus task"
        style={{ ...trashButtonStyle, opacity: hover ? 1 : 0 }}
      >
        🗑️
      </button>
    </div>
  )
}

/* ----------------------------- add modal -------------------------------- */

function AddTaskModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (input: {
    title: string
    description: string
    priority: number
    xpReward: number
  }) => Promise<void>
}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState(2)
  const [xpReward, setXpReward] = useState(XP_DEFAULT)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!title.trim() || submitting) return
    setSubmitting(true)
    setFormError(null)
    try {
      await onSubmit({ title, description, priority, xpReward })
      onClose()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Gagal menambah task')
      setSubmitting(false)
    }
  }

  return (
    <div
      style={overlayStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <form onSubmit={handleSubmit} style={modalStyle}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          Tambah Task
        </h2>

        <label style={labelStyle}>
          <span style={labelTextStyle}>Judul</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Misal: Olahraga 30 menit"
            autoFocus
            required
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          <span style={labelTextStyle}>Deskripsi (opsional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detail tambahan…"
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </label>

        <div style={labelStyle}>
          <span style={labelTextStyle}>Prioritas</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {PRIORITIES.map((p) => {
              const active = priority === p.value
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  style={priorityToggleStyle(active)}
                >
                  {p.icon} {p.label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={labelStyle}>
          <span style={labelTextStyle}>
            XP Reward: <strong style={{ color: 'var(--accent)' }}>{xpReward}</strong>
          </span>
          <input
            type="range"
            min={XP_MIN}
            max={XP_MAX}
            step={5}
            value={xpReward}
            onChange={(e) => setXpReward(Number(e.target.value))}
            style={{ accentColor: 'var(--accent)', width: '100%' }}
          />
        </div>

        {formError && (
          <p style={{ color: 'var(--rank-a)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {formError}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button type="button" onClick={onClose} style={cancelButtonStyle}>
            Batal
          </button>
          <button
            type="submit"
            disabled={!title.trim() || submitting}
            style={submitButtonStyle(!!title.trim() && !submitting)}
          >
            {submitting ? 'Menyimpan…' : 'Simpan Task'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ------------------------------ skeleton -------------------------------- */

function TaskListSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ ...skeletonBlock, height: 72 }} />
      ))}
    </div>
  )
}

/* ------------------------------- styles --------------------------------- */

const pageStyle: CSSProperties = {
  minHeight: '100vh',
  padding: '2.5rem 1.5rem 4rem',
  background:
    'radial-gradient(ellipse 70% 40% at 50% -10%, rgba(124, 58, 237, 0.12), transparent 70%), var(--bg)',
}

const shellStyle: CSSProperties = {
  maxWidth: 760,
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  animation: 'fadeUp 400ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  flexWrap: 'wrap',
}

const backButtonStyle: CSSProperties = {
  width: 40,
  height: 40,
  flexShrink: 0,
  display: 'grid',
  placeItems: 'center',
  borderRadius: 10,
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  fontSize: '1.2rem',
  textDecoration: 'none',
}

const accentButtonStyle: CSSProperties = {
  padding: '0.7rem 1.2rem',
  borderRadius: 10,
  border: 'none',
  background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
  color: '#fff',
  fontWeight: 700,
  fontSize: '0.9rem',
  cursor: 'pointer',
  boxShadow: '0 8px 22px rgba(124, 58, 237, 0.4)',
}

const summaryStyle: CSSProperties = {
  padding: '1.25rem',
  borderRadius: 14,
  background: 'var(--surface)',
  border: '1px solid var(--border)',
}

const trackStyle: CSSProperties = {
  height: 10,
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
  transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const emptyStyle: CSSProperties = {
  textAlign: 'center',
  padding: '4rem 1.5rem',
  borderRadius: 16,
  background: 'var(--surface)',
  border: '1px dashed var(--border)',
}

function taskCardStyle(hover: boolean, done: boolean): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '1rem 1.1rem',
    borderRadius: 12,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderLeft: `3px solid ${hover ? 'var(--accent)' : 'transparent'}`,
    boxShadow: hover ? '0 12px 28px rgba(124, 58, 237, 0.16)' : 'none',
    transform: hover ? 'translateY(-2px)' : 'translateY(0)',
    opacity: done ? 0.6 : 1,
    transition: 'transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease, opacity 180ms ease',
  }
}

function checkboxStyle(done: boolean): CSSProperties {
  return {
    flexShrink: 0,
    width: 26,
    height: 26,
    borderRadius: '50%',
    display: 'grid',
    placeItems: 'center',
    fontSize: '0.85rem',
    fontWeight: 800,
    cursor: 'pointer',
    color: '#fff',
    background: done ? 'linear-gradient(180deg, #8b5cf6, #7c3aed)' : 'transparent',
    border: `2px solid ${done ? 'transparent' : 'var(--border)'}`,
    boxShadow: done ? '0 0 14px var(--accent-glow)' : 'none',
    transform: done ? 'scale(1.05)' : 'scale(1)',
    transition: 'all 180ms ease',
  }
}

const priorityBadgeStyle: CSSProperties = {
  flexShrink: 0,
  fontSize: '0.72rem',
  fontWeight: 700,
  padding: '0.25rem 0.55rem',
  borderRadius: 999,
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  color: 'var(--text-muted)',
}

const xpBadgeStyle: CSSProperties = {
  flexShrink: 0,
  fontSize: '0.72rem',
  fontWeight: 800,
  padding: '0.25rem 0.55rem',
  borderRadius: 999,
  color: 'var(--accent)',
  background: 'var(--accent-glow)',
}

const trashButtonStyle: CSSProperties = {
  flexShrink: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '1rem',
  padding: '0.25rem',
  transition: 'opacity 180ms ease',
}

const overlayStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 100,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: '1rem',
  background: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(4px)',
}

const modalStyle: CSSProperties = {
  width: '100%',
  maxWidth: 460,
  alignSelf: 'center',
  padding: '1.75rem',
  borderRadius: 20,
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  boxShadow: '0 -10px 60px rgba(0, 0, 0, 0.6)',
  animation: 'fadeUp 300ms cubic-bezier(0.16, 1, 0.3, 1)',
}

const labelStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.45rem',
  marginBottom: '1.1rem',
}

const labelTextStyle: CSSProperties = {
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
}

const inputStyle: CSSProperties = {
  width: '100%',
  padding: '0.75rem 0.9rem',
  borderRadius: 10,
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  color: 'var(--text)',
  fontSize: '0.95rem',
  outline: 'none',
  fontFamily: 'inherit',
}

function priorityToggleStyle(active: boolean): CSSProperties {
  return {
    flex: 1,
    padding: '0.6rem 0.5rem',
    borderRadius: 10,
    fontSize: '0.85rem',
    fontWeight: 700,
    cursor: 'pointer',
    color: active ? '#fff' : 'var(--text-muted)',
    background: active ? 'var(--accent-glow)' : 'var(--surface-2)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    transition: 'all 160ms ease',
  }
}

const cancelButtonStyle: CSSProperties = {
  flex: 1,
  padding: '0.85rem',
  borderRadius: 10,
  border: '1px solid var(--border)',
  background: 'var(--surface-2)',
  color: 'var(--text)',
  fontWeight: 700,
  cursor: 'pointer',
}

function submitButtonStyle(enabled: boolean): CSSProperties {
  return {
    flex: 2,
    padding: '0.85rem',
    borderRadius: 10,
    border: 'none',
    fontWeight: 800,
    color: '#fff',
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.5,
    background: 'linear-gradient(180deg, #8b5cf6, #7c3aed)',
    boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
  }
}

const skeletonBlock: CSSProperties = {
  borderRadius: 12,
  background: 'var(--surface-2)',
  border: '1px solid var(--border)',
  animation: 'pulseGlow 1.6s ease-in-out infinite',
}

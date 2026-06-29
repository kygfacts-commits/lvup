'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { QUESTIONS, calculateStats } from './questions'
import type { OptionKey, Role } from './questions'
import { StepDisclaimer } from './StepDisclaimer'
import { StepQuestions } from './StepQuestions'
import { StepResult } from './StepResult'
import { StepSaving } from './StepSaving'

type Phase = 'disclaimer' | 'questions' | 'result' | 'saving'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message)
  }
  return 'Something went wrong. Please try again.'
}

export default function OnboardingPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('disclaimer')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, OptionKey>>({})
  const [chosen, setChosen] = useState<{ role: Role; name: string } | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  function handleAnswer(questionId: number, option: OptionKey) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      setPhase('result')
    }
  }

  async function saveProfile(role: Role, roleName: string) {
    setPhase('saving')
    setSaveError(null)

    try {
      const supabase = createClient()

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) throw new Error('Not authenticated')

      const statResult = calculateStats(answers)

      // Fetch question UUIDs: onboarding_answers.question_id is a UUID FK to
      // onboarding_questions, but our QUESTIONS array uses numeric ids (1-10).
      // SQL needed: create policy "Anyone can read questions" on onboarding_questions for select using (true);
      const { data: dbQuestions, error: qError } = await supabase
        .from('onboarding_questions')
        .select('id, order_num')
        .order('order_num')
      if (qError || !dbQuestions) {
        throw new Error(`Failed to fetch questions: ${qError?.message}`)
      }

      // Map order_num (1-10) → UUID.
      const questionIdMap: Record<number, string> = {}
      dbQuestions.forEach((q) => {
        questionIdMap[q.order_num] = q.id
      })

      // Resolve the role_id by fetching all roles and matching client-side — a
      // filtered `.eq('name', ...).single()` was returning null (RLS / silent miss).
      // SQL needed: create policy "Anyone can read roles" on roles for select using (true);
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('id, name')
      if (rolesError || !rolesData?.length) {
        throw new Error(`Failed to fetch roles: ${rolesError?.message}`)
      }

      const matchedRole = rolesData.find(
        (r) => r.name.toLowerCase() === role.name.toLowerCase().trim(),
      )
      if (!matchedRole) {
        throw new Error(`Role "${role.name}" not found in DB`)
      }

      // Persist the profile snapshot with the calculated rank.
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          stats: statResult.stats,
          role_id: matchedRole.id,
          role_name: roleName.trim() || role.name,
          rank: statResult.rank,
          onboarding_done: true,
        })
        .eq('id', user.id)
      if (profileError) {
        throw new Error(`Profile update failed: ${profileError.message}`)
      }

      // Seed the user's default tracking categories.
      const { error: catError } = await supabase.rpc('create_default_categories', {
        p_user_id: user.id,
      })
      if (catError) {
        throw new Error(`Categories creation failed: ${catError.message}`)
      }

      // Store each onboarding answer, keyed by the DB question UUID.
      const answersToInsert = Object.entries(answers).map(([questionId, choice]) => ({
        user_id: user.id,
        question_id: questionIdMap[Number(questionId)],
        answer: choice,
        stat_gained:
          QUESTIONS.find((q) => q.id === Number(questionId))?.options[choice as OptionKey]
            ?.stats ?? {},
      }))
      const { error: answersError } = await supabase
        .from('onboarding_answers')
        .insert(answersToInsert)
      if (answersError) {
        throw new Error(`Answers insert failed: ${answersError.message}`)
      }

      // Award the onboarding XP bonus.
      const { error: xpError } = await supabase.rpc('award_xp', {
        p_user_id: user.id,
        p_source_type: 'onboarding',
        p_source_id: null,
        p_xp: 50,
        p_stat: null,
        p_stat_amount: 0,
        p_description: 'Onboarding complete',
      })
      if (xpError) {
        throw new Error(`XP award failed: ${xpError.message}`)
      }

      router.replace('/dashboard')
    } catch (error) {
      setSaveError(getErrorMessage(error))
    }
  }

  function handleComplete(role: Role, roleName: string) {
    setChosen({ role, name: roleName })
    void saveProfile(role, roleName)
  }

  function handleRetry() {
    if (chosen) {
      void saveProfile(chosen.role, chosen.name)
    }
  }

  if (phase === 'saving') {
    return <StepSaving error={saveError} onRetry={handleRetry} />
  }

  if (phase === 'result') {
    const { stats, rank } = calculateStats(answers)
    return <StepResult stats={stats} rank={rank} onComplete={handleComplete} />
  }

  if (phase === 'questions') {
    return (
      <StepQuestions
        question={QUESTIONS[currentIndex]}
        index={currentIndex}
        total={QUESTIONS.length}
        onAnswer={handleAnswer}
      />
    )
  }

  return <StepDisclaimer onStart={() => setPhase('questions')} />
}

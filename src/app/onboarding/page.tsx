'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { QUESTIONS, calculateStats } from './questions'
import type { OptionKey, Role } from './questions'
import { StepQuestions } from './StepQuestions'
import { StepResult } from './StepResult'
import { StepSaving } from './StepSaving'

type Phase = 'questions' | 'result' | 'saving'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message)
  }
  return 'Something went wrong. Please try again.'
}

export default function OnboardingPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('questions')
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
      if (userError || !user) {
        throw new Error('Your session expired. Please log in again.')
      }

      const stats = calculateStats(answers)

      // 1. Resolve the role_id for the chosen class.
      const { data: roleRow, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', role.name)
        .single()
      if (roleError || !roleRow) {
        throw new Error(`Role "${role.name}" was not found. Please try again.`)
      }

      // 2. Persist the profile snapshot.
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          stats,
          role_id: roleRow.id,
          role_name: roleName,
          rank: 'F',
          onboarding_done: true,
        })
        .eq('id', user.id)
      if (profileError) throw profileError

      // 3. Seed the user's default tracking categories.
      const { error: categoriesError } = await supabase.rpc('create_default_categories', {
        p_user_id: user.id,
      })
      if (categoriesError) throw categoriesError

      // 4. Store each onboarding answer (10 rows).
      const answerRows = QUESTIONS.map((q) => ({
        user_id: user.id,
        question_id: q.id,
        answer: answers[q.id],
      }))
      const { error: answersError } = await supabase
        .from('onboarding_answers')
        .insert(answerRows)
      if (answersError) throw answersError

      // 5. Award the onboarding XP bonus.
      const { error: xpError } = await supabase.rpc('award_xp', {
        p_user_id: user.id,
        p_source: 'onboarding',
        p_source_id: null,
        p_amount: 50,
        p_skill_id: null,
        p_stat_gain: 0,
        p_reason: 'Onboarding complete',
      })
      if (xpError) throw xpError

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
    return <StepResult stats={calculateStats(answers)} onComplete={handleComplete} />
  }

  return (
    <StepQuestions
      question={QUESTIONS[currentIndex]}
      index={currentIndex}
      total={QUESTIONS.length}
      onAnswer={handleAnswer}
    />
  )
}

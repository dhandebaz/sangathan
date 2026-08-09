'use client'

import { useState, useEffect } from 'react'
import { MemberOnboardingGuide } from '@/components/dashboard/member-onboarding-guide'
import { markOnboardingCompleted } from '@/actions/auth'

interface MemberOnboardingOverlayProps {
  userId: string
  orgType: string
  orgName?: string
  initialShow: boolean
}

const STORAGE_KEY = 'sangathan_onboarding_done'

export function MemberOnboardingOverlay({ userId, orgType, orgName, initialShow }: MemberOnboardingOverlayProps) {
  const [show, setShow] = useState(initialShow)

  useEffect(() => {
    if (!initialShow) return
    const stored = localStorage.getItem(`${STORAGE_KEY}:${userId}`)
    if (!stored) {
      setShow(true)
    }
  }, [userId, initialShow])

  const handleComplete = async () => {
    setShow(false)
    localStorage.setItem(`${STORAGE_KEY}:${userId}`, 'true')
    try {
      await markOnboardingCompleted(userId)
    } catch {
      // silent fail — localStorage is enough
    }
  }

  const handleSkip = async () => {
    setShow(false)
    localStorage.setItem(`${STORAGE_KEY}:${userId}`, 'true')
    try {
      await markOnboardingCompleted(userId)
    } catch {
      // silent fail
    }
  }

  if (!show) return null

  return (
    <MemberOnboardingGuide
      orgType={orgType}
      orgName={orgName}
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  )
}

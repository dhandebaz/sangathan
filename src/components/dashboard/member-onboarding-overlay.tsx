'use client'

import { useState, useSyncExternalStore } from 'react'
import { MemberOnboardingGuide } from '@/components/dashboard/member-onboarding-guide'
import { markOnboardingCompleted } from '@/actions/auth'

interface MemberOnboardingOverlayProps {
  userId: string
  orgType: string
  orgName?: string
  initialShow: boolean
}

const STORAGE_KEY = 'sangathan_onboarding_done'

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

export function MemberOnboardingOverlay({ userId, orgType, orgName, initialShow }: MemberOnboardingOverlayProps) {
  const [dismissed, setDismissed] = useState(false)
  const isStoredDone = useSyncExternalStore(
    subscribe,
    () => (typeof window !== 'undefined' ? localStorage.getItem(`${STORAGE_KEY}:${userId}`) === 'true' : false),
    () => false
  )

  if (!initialShow || dismissed || isStoredDone) return null

  const handleClose = async () => {
    setDismissed(true)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`${STORAGE_KEY}:${userId}`, 'true')
      }
      await markOnboardingCompleted(userId)
    } catch {
      // silent fail
    }
  }

  return (
    <MemberOnboardingGuide
      orgType={orgType}
      orgName={orgName}
      onComplete={handleClose}
      onSkip={handleClose}
    />
  )
}

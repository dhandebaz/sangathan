'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { StepProgress } from '@/components/ui/step-progress'
import {
  Calendar, CheckSquare, Megaphone, Rocket,
  HeartHandshake, Vote, Wrench, HandCoins,
  ShieldCheck, Scale, HardHat, Database, AlertCircle, Flag
} from 'lucide-react'
import { OrgType, ORG_TYPES } from '@/lib/org-types'

interface StepContent {
  emoji: string
  titleHi: string
  titleEn: string
  descHi: string
  descEn: string
  features?: { icon: React.ElementType; labelHi: string; labelEn: string }[]
}

function getSteps(orgType: string): StepContent[] {
  const featureSets: Partial<Record<OrgType, { icon: React.ElementType; labelHi: string; labelEn: string }[]>> = {
    ngo: [
      { icon: HandCoins, labelHi: 'Donations', labelEn: 'Donations' },
      { icon: HeartHandshake, labelHi: 'Volunteers', labelEn: 'Volunteers' },
      { icon: ShieldCheck, labelHi: 'Reports', labelEn: 'Reports' },
    ],
    student_union: [
      { icon: Vote, labelHi: 'Elections', labelEn: 'Elections' },
      { icon: Database, labelHi: 'RTI/ATR', labelEn: 'RTI/ATR' },
      { icon: Wrench, labelHi: 'Hostel Audit', labelEn: 'Hostel Audit' },
    ],
    workers_union: [
      { icon: Scale, labelHi: 'CBA Docs', labelEn: 'CBA Docs' },
      { icon: AlertCircle, labelHi: 'Grievances', labelEn: 'Grievances' },
      { icon: Vote, labelHi: 'Strike Votes', labelEn: 'Strike Votes' },
    ],
    rwa: [
      { icon: Wrench, labelHi: 'Maintenance', labelEn: 'Maintenance' },
      { icon: Calendar, labelHi: 'Facilities', labelEn: 'Facilities' },
      { icon: Vote, labelHi: 'Polls', labelEn: 'Polls' },
    ],
    political_party: [
      { icon: Flag, labelHi: 'Campaigns', labelEn: 'Campaigns' },
      { icon: Vote, labelHi: 'Voting', labelEn: 'Voting' },
      { icon: HeartHandshake, labelHi: 'Volunteers', labelEn: 'Volunteers' },
    ],
  }

  return [
    {
      emoji: '🎉',
      titleHi: 'स्वागत है!',
      titleEn: 'Welcome!',
      descHi: 'Sangathan में आपका स्वागत है — आपका digital संगठन तैयार है',
      descEn: 'Welcome to Sangathan — your digital organization is ready',
    },
    {
      emoji: '📱',
      titleHi: 'बहुत आसान है!',
      titleEn: "It's very easy!",
      descHi: 'बस टैप करें — सब कुछ समझ आ जाएगा',
      descEn: 'Just tap — everything will make sense',
    },
    {
      emoji: '🎯',
      titleHi: 'ये 3 चीज़ें सबसे ज़रूरी हैं',
      titleEn: 'These 3 things matter most',
      descHi: 'Events, Tasks और Updates — ये देखते रहें',
      descEn: 'Events, Tasks and Updates — check these often',
      features: featureSets[orgType as OrgType] || featureSets.ngo,
    },
    {
      emoji: '🚀',
      titleHi: 'आप तैयार हैं!',
      titleEn: "You're ready!",
      descHi: 'शुरू करें — आपका dashboard इंतज़ार कर रहा है',
      descEn: "Let's go — your dashboard is waiting",
    },
  ]
}

interface MemberOnboardingGuideProps {
  orgType: string
  orgName?: string
  onComplete: () => void
  onSkip: () => void
}

export function MemberOnboardingGuide({ orgType, orgName, onComplete, onSkip }: MemberOnboardingGuideProps) {
  const [step, setStep] = useState(0)
  const steps = getSteps(orgType)

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const currentStep = steps[step]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 md:p-6">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Skip Button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-xs text-muted-foreground hover:text-foreground font-medium px-3 py-1.5 rounded-full hover:bg-muted transition-colors z-10"
        >
          Skip →
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Step Progress */}
          <div className="mb-8">
            <StepProgress total={steps.length} current={step + 1} />
          </div>

          {/* Step Content */}
          <div className="text-center">
            <div className="text-5xl md:text-6xl mb-4">{currentStep.emoji}</div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">{currentStep.titleHi}</h2>
            <p className="text-sm text-muted-foreground mb-1">{currentStep.titleEn}</p>
            <p className="text-sm text-foreground mt-4">{currentStep.descHi}</p>
            <p className="text-xs text-muted-foreground mt-1">{currentStep.descEn}</p>
          </div>

          {/* Feature Icons (Step 3 only) */}
          {currentStep.features && (
            <div className="flex justify-center gap-4 mt-6">
              {currentStep.features.map((f, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center">
                    <f.icon className="h-6 w-6 text-brand-600" />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground">{f.labelEn}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-4 md:p-6 border-t border-border bg-muted/30">
          {step > 0 ? (
            <Button variant="outline" onClick={handleBack} className="h-10 text-sm">
              ← Back
            </Button>
          ) : (
            <div />
          )}
          <Button onClick={handleNext} className="h-10 px-6 text-sm font-semibold bg-brand-600 hover:bg-brand-700">
            {step === steps.length - 1 ? 'शुरू करें! 🚀' : 'Next →'}
          </Button>
        </div>
      </div>
    </div>
  )
}

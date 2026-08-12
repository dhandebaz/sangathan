'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StepProgress } from '@/components/ui/step-progress'
import {
  Users, ShieldCheck, FileText, ArrowRight, Upload,
  Building, Sparkles, CheckCircle2, UserCheck, ShieldAlert
} from 'lucide-react'
import Link from 'next/link'

interface MemberOnboardingGuideProps {
  orgType: string
  orgName?: string
  onComplete: () => void
  onSkip: () => void
}

export function MemberOnboardingGuide({ orgType, orgName = 'Your Organisation', onComplete, onSkip }: MemberOnboardingGuideProps) {
  const [step, setStep] = useState(0)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [usernameSlug, setUsernameSlug] = useState(orgName.toLowerCase().replace(/[^a-z0-9]/g, '-'))

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const steps = [
    {
      title: 'Welcome to Sangathan OS',
      titleHi: 'Sangathan में आपका स्वागत है!',
      desc: `Setting up ${orgName}. Let's configure your organization identity and roles.`,
    },
    {
      title: 'Logo & Username Setup',
      titleHi: 'लोगो और यूजरनेम सेटअप',
      desc: 'Set up your official logo and public handle slug.',
    },
    {
      title: 'Master Account & Role Hierarchy',
      titleHi: 'मास्टर अकाउंट एवं रोल मैनेजमेंट',
      desc: 'Understand your master privileges and assign roles to your team.',
    },
    {
      title: 'Plan & Recognition Status',
      titleHi: 'प्लान एवं BQF मान्यता स्थिति',
      desc: 'Confirm your plan or verify your unregistered collective with BQF.',
    },
    {
      title: 'You are Ready!',
      titleHi: 'आप तैयार हैं!',
      desc: 'Launch into your personalized dashboard or draft your first official letter.',
    },
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 md:p-6">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Skip Button */}
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-xs text-slate-400 hover:text-slate-700 font-medium px-3 py-1 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          Skip Onboarding →
        </button>

        {/* Header */}
        <div className="p-6 md:p-8 border-b bg-slate-50">
          <div className="mb-4">
            <StepProgress total={steps.length} current={step + 1} />
          </div>
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-bold text-slate-900">{steps[step].title}</h2>
            <p className="text-xs text-purple-700 font-semibold mt-0.5">{steps[step].titleHi}</p>
            <p className="text-xs text-slate-500 mt-1">{steps[step].desc}</p>
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 md:p-8 space-y-4 min-h-[220px]">
          {step === 0 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 mx-auto">
                <Building className="w-8 h-8" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                As the <strong>Primary Admin / Master Account</strong>, you hold full administrative authority for <strong>{orgName}</strong>. You can invite team members, assign granular permissions, and manage public representations.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Upload className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="text-xs max-w-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-slate-500">Public Username / Slug</label>
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-400 font-mono">sangathan.app/</span>
                  <Input
                    value={usernameSlug}
                    onChange={(e) => setUsernameSlug(e.target.value)}
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                <p className="font-bold text-purple-900">👑 Master Account (You)</p>
                <p className="text-purple-700 mt-0.5">Primary admin with full billing, role delegation & org management rights.</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 border rounded bg-slate-50">
                  <p className="font-semibold text-slate-900">Second Admin</p>
                  <p className="text-[11px] text-slate-500">Org management without billing/deletion power.</p>
                </div>
                <div className="p-2.5 border rounded bg-slate-50">
                  <p className="font-semibold text-slate-900">Can Manage</p>

                  <p className="text-[11px] text-slate-500">Projects, complaints & team task assignments.</p>
                </div>
                <div className="p-2.5 border rounded bg-slate-50">
                  <p className="font-semibold text-slate-900">Can Edit</p>
                  <p className="text-[11px] text-slate-500">Create complaints, edit own tasks & meetings.</p>
                </div>
                <div className="p-2.5 border rounded bg-slate-50">
                  <p className="font-semibold text-slate-900">Can Comment</p>
                  <p className="text-[11px] text-slate-500">Community view, comments & votes.</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 text-xs">
              <div className="p-3 border rounded bg-slate-50 space-y-1">
                <p className="font-bold text-slate-900">Registered NGOs / RWAs / Unions</p>
                <p className="text-slate-500">Standard ₹1,000+ monthly plan for full compliance, donor CRM & grants.</p>
              </div>
              <div className="p-3 border border-purple-200 bg-purple-50/50 rounded space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-purple-950">Unregistered Civic Collectives</p>
                  <span className="text-[10px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded">Pay Your Price</span>
                </div>
                <p className="text-slate-600">Free / Pay-What-You-Can plan with Bahujan Queer Foundation (BQF) Recognition option.</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="text-xs text-slate-700 font-semibold">Your organisation is fully set up!</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                <Link
                  href="/dashboard/compliance/bqf-verification"
                  className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded text-purple-900 font-semibold flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> BQF AI Verification
                </Link>
                <Link
                  href="/dashboard/municipal-letters"
                  className="p-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-900 font-semibold flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" /> Print Government Letter
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="flex items-center justify-between p-4 md:p-6 border-t border-slate-200 bg-slate-50">
          {step > 0 ? (
            <Button variant="outline" onClick={handleBack} className="h-9 text-xs">
              ← Back
            </Button>
          ) : (
            <div />
          )}
          <Button onClick={handleNext} className="h-9 px-6 text-xs font-semibold bg-purple-700 hover:bg-purple-800 text-white">
            {step === steps.length - 1 ? 'Go to Dashboard 🚀' : 'Next →'}
          </Button>
        </div>
      </div>
    </div>
  )
}

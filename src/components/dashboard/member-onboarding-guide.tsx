'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { StepProgress } from '@/components/ui/step-progress'
import {
  Users, ArrowRight, CheckCircle2, Calendar, FileText,
} from 'lucide-react'
import Link from 'next/link'

interface MemberOnboardingGuideProps {
  orgType: string
  orgName?: string
  lang?: string
  isAdmin?: boolean
  onComplete: () => void
  onSkip: () => void
}

// One plain-language next step per org type — max 3, no jargon.
function getFirstSteps(orgType: string, lang: string): { href: string; title: string; desc: string }[] {
  const hi = lang === 'hi'
  switch (orgType) {
    case 'civic_collective':
      return [
        { href: `/dashboard/people`, title: hi ? '1. साथियों को जोड़ें' : '1. Add your people', desc: hi ? 'WhatsApp से invite भेजें' : 'Invite via WhatsApp link' },
        { href: `/dashboard/calendar`, title: hi ? '2. पहली बैठक तय करें' : '2. Call first meeting', desc: hi ? 'तारीख, जगह और एजेंडा' : 'Date, place and agenda' },
        { href: `/dashboard/parcha`, title: hi ? '3. पहला पर्चा बनाएं' : '3. Make first parcha', desc: hi ? '₹1 प्रिंट वाला पर्चा' : 'Simple ₹1 print flyer' },
      ]
    default:
      return [
        { href: `/dashboard/people`, title: hi ? '1. टीम को जोड़ें' : '1. Add your team', desc: hi ? 'साथियों को invite करें' : 'Invite teammates' },
        { href: `/dashboard/calendar`, title: hi ? '2. पहली बैठक तय करें' : '2. Schedule first meeting', desc: hi ? 'काम की शुरुआत करें' : 'Kick off the work' },
        { href: `/dashboard/tasks`, title: hi ? '3. पहला काम सौंपें' : '3. Assign first task', desc: hi ? 'छोटा काम देकर शुरू करें' : 'Start with a small task' },
      ]
  }
}

export function MemberOnboardingGuide({ orgType, orgName = 'Your Organisation', lang = 'en', isAdmin = false, onComplete, onSkip }: MemberOnboardingGuideProps) {
  const [step, setStep] = useState(0)
  const hi = lang === 'hi'
  const steps = getFirstSteps(orgType, lang)

  const titles = hi
    ? ['नमस्ते! शुरुआत करें', '3 आसान कदम', 'तैयार हैं!']
    : ['Welcome! Start here', '3 simple steps', 'You are ready!']

  const handleNext = () => {
    if (step < 2) setStep(step + 1)
    else onComplete()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 md:p-6">
      <div className="relative w-full max-w-lg bg-white rounded-sm shadow-2xl overflow-hidden border border-slate-200">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 text-xs text-slate-400 hover:text-slate-700 font-medium px-3 py-1 rounded-full hover:bg-slate-100 transition-colors z-10"
        >
          {hi ? 'छोड़ें →' : 'Skip →'}
        </button>

        <div className="p-6 md:p-8 border-b bg-slate-50">
          <div className="mb-4">
            <StepProgress total={3} current={step + 1} />
          </div>
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-bold text-slate-900">{titles[step]}</h2>
            <p className="text-xs text-slate-500 mt-1">{orgName}</p>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-4 min-h-[200px]">
          {step === 0 && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-sm bg-white text-slate-900 border border-slate-200 flex items-center justify-center mx-auto">
                <Users className="w-8 h-8" />
              </div>
              <p className="text-sm text-slate-700 leading-relaxed max-w-sm mx-auto">
                {isAdmin
                  ? hi
                    ? `आप ${orgName} का कार्यक्षेत्र चला रहे हैं। घबराएं नहीं — सिर्फ 3 काम करने हैं।`
                    : `You run ${orgName}'s workspace. Only 3 things to do to get started.`
                  : hi
                    ? `आप ${orgName} से जुड़ गए हैं। यहां बैठकें, काम और वोट सब एक जगह मिलेंगे।`
                    : `You joined ${orgName}. Meetings, tasks and votes all live here.`}
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-2.5">
              {steps.map((s) => (
                <Link
                  key={s.href}
                  href={`/${lang}${s.href}`}
                  onClick={onComplete}
                  className="flex items-center gap-3 p-3.5 rounded-sm border border-slate-200 bg-white hover:border-slate-400 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    {s.href.includes('people') ? <Users className="w-4 h-4" /> : s.href.includes('calendar') ? <Calendar className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900">{s.title}</p>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 ml-auto shrink-0" />
                </Link>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="text-sm text-slate-700 font-medium">
                {hi ? 'बस इतना ही। बाकी सब बाद में सीख लेंगे।' : 'That is it. You will learn the rest as you go.'}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 md:p-6 border-t border-slate-200 bg-slate-50">
          {step > 0 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="h-9 text-xs">
              {hi ? '← पीछे' : '← Back'}
            </Button>
          ) : (
            <div />
          )}
          <Button onClick={handleNext} className="h-9 px-6 text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-white">
            {step === 2 ? (hi ? 'शुरू करें' : 'Start') : hi ? 'आगे →' : 'Next →'}
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { Target, TrendingUp, Users, HeartHandshake, Server, ShieldCheck } from 'lucide-react'

interface GoalData {
  totalRaised: number
  initialGoal: number
  stretchGoal: number
  contributorCount: number
  progressPercentage: number
  isLive: boolean
}

export function ContributionGoalTracker({
  lang,
  isHindi,
}: {
  lang: string
  isHindi: boolean
}) {
  const [data, setData] = useState<GoalData>({
    totalRaised: 0,
    initialGoal: 50000,
    stretchGoal: 100000,
    contributorCount: 0,
    progressPercentage: 0,
    isLive: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGoal() {
      try {
        const res = await fetch('/api/contributions/goal')
        if (res.ok) {
          const json = await res.json()
          setData(json)
        }
      } catch (e) {
        console.error('Failed to load live goal data', e)
      } finally {
        setLoading(false)
      }
    }
    void fetchGoal()
  }, [])

  const initialGoalPercent = Math.min(100, Math.round((data.totalRaised / data.initialGoal) * 100))
  const stretchGoalPercent = Math.min(100, Math.round((data.totalRaised / data.stretchGoal) * 100))

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-700 font-semibold text-xs mb-1">
            <Target className="w-4 h-4" />
            <span>{isHindi ? 'पारदर्शी मिशन फंडिंग लक्ष्य' : 'Transparent Mission Funding Goal'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            {isHindi ? 'नागरिक अवसंरचना स्थिरता कोष' : 'Civic Infrastructure Sustainability Fund'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {isHindi
              ? 'संगठन के सर्वर, सुरक्षा ऑडिट और तकनीकी विकास को बनाए रखने के लिए सार्वजनिक लक्ष्य।'
              : 'Public operational targets sustaining Sangathan’s servers, database backups, and development for civic organizations.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">{isHindi ? 'कुल योगदान' : 'Total Contributed'}</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              ₹{data.totalRaised.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Goal Progress Bars */}
      <div className="space-y-5">
        {/* Initial Goal */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span>
              {isHindi ? 'प्रारंभिक परिचालन लक्ष्य:' : 'Phase 1 Operational Goal:'} ₹{data.initialGoal.toLocaleString('en-IN')}
            </span>
            <span className="text-indigo-600 font-bold">{initialGoalPercent}% Funded</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.max(initialGoalPercent, data.totalRaised > 0 ? 2 : 0)}%` }}
            />
          </div>
        </div>

        {/* Stretch Goal */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
            <span>
              {isHindi ? 'विस्तारित सुरक्षा व बैकअप लक्ष्य:' : 'Phase 2 Stretch Resilience Goal:'} ₹{data.stretchGoal.toLocaleString('en-IN')}
            </span>
            <span className="text-slate-600 font-bold">{stretchGoalPercent}% Funded</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${Math.max(stretchGoalPercent, data.totalRaised > 0 ? 1 : 0)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Goal Allocation Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
          <Server className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-slate-900">{isHindi ? 'सुरक्षित सर्वर व बैकअप' : 'Servers & Daily Backups'}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {isHindi ? 'हाई-स्पीड डेटाबेस और एन्क्रिप्टेड स्टोरेज' : 'Encrypted storage & multi-region database sync'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-slate-900">{isHindi ? 'सुरक्षा व कोड ऑडिट' : 'Security & Code Audits'}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {isHindi ? 'नियमित भेद्यता जांच और सुधार' : 'Continuous patching & vulnerability scanning'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-slate-900">{isHindi ? '100% गैर-लाभकारी' : 'Section 8 Non-Profit'}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {isHindi ? 'बहुजन क्वीर फाउंडेशन द्वारा संचालित' : 'Managed by Bahujan Queer Foundation'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

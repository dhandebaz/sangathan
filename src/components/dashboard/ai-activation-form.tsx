'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, Sliders, ShieldCheck, HeartHandshake } from 'lucide-react'
import { SangathanAiModal } from '@/components/ai/sangathan-ai-modal'

export function AiActivationForm({ lang }: { lang: string }) {
  const isHi = lang === 'hi'

  return (
    <div className="rounded-sm border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-sm">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            {isHi ? 'संगठन AI बुद्धिमत्ता सुइट' : 'Sangathan AI Intelligence Suite'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            {isHi
              ? 'जमीनी नागरिक समूहों के लिए पारदर्शी और संप्रभु AI सहायता।'
              : 'Privacy-first, assistive AI capabilities designed for civic organizations.'}
          </p>
        </div>
      </div>

      <div className="rounded-sm bg-slate-50 border border-slate-200 p-4 text-xs sm:text-sm text-slate-600 space-y-2">
        <p className="font-semibold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          {isHi ? 'शून्य डेटा साझाकरण व मानवीय नियंत्रण' : 'Strict Privacy & Human Governance'}
        </p>
        <p className="leading-relaxed">
          {isHi
            ? 'संगठन AI आपके डेटा को कभी भी अन्य संगठनों के AI को प्रशिक्षित करने के लिए उपयोग नहीं करता है। सभी बाध्यकारी निर्णय मानव सदस्यों के हाथों में रहते हैं।'
            : 'Sangathan AI never uses your organizational records to train third-party or multi-tenant models. You maintain complete control with a master On/Off switch in Settings.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          href={`/${lang}/dashboard/settings`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-white text-xs sm:text-sm font-bold transition-colors shadow-sm"
        >
          <Sliders className="w-4 h-4" />
          <span>{isHi ? 'AI सेटिंग्स प्रबंधित करें' : 'Manage AI Settings'}</span>
        </Link>

        <SangathanAiModal lang={lang} isHindi={isHi}>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-semibold transition-colors border border-indigo-200"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>{isHi ? 'AI वास्तुकला पढ़ें' : 'View AI Architecture'}</span>
          </button>
        </SangathanAiModal>
      </div>
    </div>
  )
}

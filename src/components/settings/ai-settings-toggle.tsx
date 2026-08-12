'use client'

import React, { useState, useTransition } from 'react'
import { Sparkles, CheckCircle2, XCircle, Loader2, ShieldCheck, Info } from 'lucide-react'
import { toast } from 'sonner'
import { toggleAiAssistanceAction } from '@/actions/ai/settings'
import { SangathanAiModal } from '@/components/ai/sangathan-ai-modal'

interface AiSettingsToggleProps {
  initialEnabled: boolean
  isPlanSupported: boolean
  isConfigured: boolean
  lang: string
  isHindi: boolean
}

export function AiSettingsToggle({
  initialEnabled,
  isPlanSupported,
  isConfigured,
  lang,
  isHindi,
}: AiSettingsToggleProps) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [isPending, startTransition] = useTransition()

  const handleToggle = () => {
    const nextState = !enabled
    startTransition(async () => {
      const res = await toggleAiAssistanceAction(nextState)
      if (res.success) {
        setEnabled(nextState)
        toast.success(
          isHindi
            ? nextState
              ? 'संगठन AI सहायता सक्रिय कर दी गई है।'
              : 'संगठन AI सहायता बंद कर दी गई है।'
            : nextState
              ? 'Sangathan AI Assistance is now active.'
              : 'Sangathan AI Assistance has been disabled.',
        )
      } else {
        toast.error(res.error || (isHindi ? 'सेटिंग्स अपडेट करने में विफल' : 'Failed to update AI settings'))
      }
    })
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-bold text-slate-900">
                {isHindi ? 'संगठन AI सहायता नियंत्रण' : 'Sangathan AI Assistance'}
              </h3>
              {/* State Indicator */}
              {enabled && isPlanSupported ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isHindi ? 'AI सहायता: चालू (On)' : 'AI Assistance: On'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  <XCircle className="w-3.5 h-3.5 text-slate-500" />
                  {isHindi ? 'AI सहायता: बंद (Off)' : 'AI Assistance: Off'}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isHindi
                ? 'अपने संगठन के कार्यक्षेत्र के लिए मास्टर AI सहायता सक्षम या अक्षम करें।'
                : 'Master organizational control to enable or completely disable AI tools across your collective.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SangathanAiModal lang={lang} isHindi={isHindi}>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <Info className="w-4 h-4 text-slate-500" />
              <span>{isHindi ? 'गोपनीयता विवरण' : 'Privacy & AI Architecture'}</span>
            </button>
          </SangathanAiModal>

          <button
            type="button"
            onClick={handleToggle}
            disabled={isPending || !isPlanSupported}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              enabled
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : enabled ? (
              <span>{isHindi ? 'AI बंद करें (Turn Off)' : 'Turn AI Off'}</span>
            ) : (
              <span>{isHindi ? 'AI चालू करें (Turn On)' : 'Turn AI On'}</span>
            )}
          </button>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{isHindi ? 'वास्तविक API-स्तरीय सुरक्षा' : 'True Backend-Level Enforcement'}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isHindi
              ? 'जब AI बंद होता है, तो सभी AI कॉल (बैठक मिनट्स, फॉर्म विश्लेषण, प्रस्ताव सारांश, और पृष्ठभूमि कार्य) API स्तर पर निष्पादित होने से रोक दिए जाते हैं।'
              : 'When AI Assistance is turned off, all AI-dependent endpoints, automated summaries, draft generation, and background analysis are blocked directly at the server API level.'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>{isHindi ? 'कार्यक्षेत्र स्मृति पृथक्करण' : 'Strict Workspace Isolation'}</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {isHindi
              ? 'आपके संगठन का निजी डेटा कभी भी अन्य संगठनों के AI को प्रशिक्षित करने के लिए उपयोग नहीं किया जाता है।'
              : "Your collective's private notes and internal documents are never used as training data for other organizations or foundation models."}
          </p>
        </div>
      </div>
    </div>
  )
}

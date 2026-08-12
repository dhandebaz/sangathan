'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Sparkles,
  ShieldCheck,
  Lock,
  Sliders,
  CheckCircle2,
  ExternalLink,
  BrainCircuit,
  EyeOff,
} from 'lucide-react'

interface SangathanAiModalProps {
  children?: React.ReactNode
  lang?: string
  orgId?: string
  isHindi?: boolean
}

export function SangathanAiModal({
  children,
  lang = 'en',
  isHindi = false,
}: SangathanAiModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors border border-indigo-200"
            title="Sangathan AI Privacy & Architecture Information"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sangathan AI</span>
          </button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>{isHindi ? 'संगठन AI (Sangathan AI)' : 'Sangathan AI'}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                  {isHindi ? 'नागरिक बुद्धिमत्ता' : 'Civic Intelligence'}
                </span>
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHindi
                  ? 'बहुजन क्वीर फाउंडेशन द्वारा संचालित सुरक्षित व पारदर्शी AI सहायता।'
                  : 'Transparent, privacy-first AI assistance for democratic collectives.'}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4 text-xs sm:text-sm text-slate-600">
          {/* Question 1: What is Sangathan AI? */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-600 shrink-0" />
              {isHindi ? 'संगठन AI क्या है?' : 'What is Sangathan AI?'}
            </h4>
            <p className="leading-relaxed text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {isHindi
                ? 'संगठन AI एक संप्रभु नागरिक सहायता प्रणाली है जो गैर-सरकारी संगठनों और जमीनी स्तर के कार्यकर्ताओं को बैठकों के मिनट्स तैयार करने, जटिल प्रस्तावों का सारांश बनाने, शिकायत वर्गीकरण करने और अनुदान योजनाओं का विश्लेषण करने में मदद करती है।'
                : 'Sangathan AI is an assistive technology layer designed specifically for civic collectives and NGOs. It assists human organizers with drafting structured meeting minutes, synthesizing lengthy community proposals, triaging grievances, and matching open grant opportunities.'}
            </p>
          </div>

          {/* Question 2: What data does it use? */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-emerald-600 shrink-0" />
              {isHindi ? 'यह किस डेटा का उपयोग करता है?' : 'What data does it use?'}
            </h4>
            <p className="leading-relaxed text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {isHindi
                ? 'संगठन AI केवल उस विशिष्ट कार्य के लिए आवश्यक न्यूनतम संदर्भ को संसाधित करता है जिसके लिए आपने स्पष्ट रूप से अनुरोध किया है (जैसे कि सारांश के लिए दी गई बैठक नोट्स)। यह आपके व्यक्तिगत क्रेडेंशियल या असंबंधित संदेशों को कभी स्कैन नहीं करता है।'
                : 'Sangathan AI operates on strict data minimization principles. It only processes the specific context necessary to execute your active request (for example, raw notes you submit for minutes generation). It does not scan user credentials or unrelated organizational records.'}
            </p>
          </div>

          {/* Question 3: Does my data train other organizations' AI? */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              {isHindi
                ? 'क्या मेरा डेटा अन्य संगठनों के AI को प्रशिक्षित करता है?'
                : "Does my data train other organizations' AI?"}
            </h4>
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'बिलकुल नहीं (100% डेटा पृथक्करण)' : 'Strictly No. Absolute Data Isolation.'}</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {isHindi
                  ? 'आपके संगठन का निजी डेटा और कार्यक्षेत्र संदर्भ पूरी तरह से अलग है। एक संगठन की जानकारी का उपयोग कभी भी दूसरे संगठन के AI को प्रशिक्षित करने या मॉडल सुधार के लिए नहीं किया जाता है।'
                  : "Your organization's private data, workspace context, and uploaded documents are strictly isolated. Information from your collective is never used to train AI models for other organizations or external commercial datasets."}
              </p>
            </div>
          </div>

          {/* Question 4: Can I turn AI off? */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-700 shrink-0" />
              {isHindi ? 'क्या मैं AI सहायता को बंद कर सकता हूँ?' : 'Can I turn AI assistance off?'}
            </h4>
            <p className="leading-relaxed text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {isHindi
                ? 'हाँ, किसी भी समय। संगठन के व्यवस्थापक सेटिंग्स से मास्टर AI स्विच को बंद कर सकते हैं। जब AI बंद होता है, तो सभी AI कॉल और पृष्ठभूमि कार्य API स्तर पर तुरंत अवरुद्ध हो जाते हैं।'
                : 'Yes, at any time. Organization administrators have a master switch in Settings. When turned off, all AI drafting tools, automated insights, and background processing are halted completely at the backend API level.'}
            </p>
          </div>

          {/* Decision-Making Principle */}
          <div className="border-t border-slate-100 pt-4 text-xs text-slate-500">
            <p>
              {isHindi
                ? '⚖️ मानवीय संप्रभुता: AI केवल सहायता करता है। बाध्यकारी संगठनात्मक और प्रशासनिक निर्णय हमेशा केवल अधिकृत मानव सदस्यों द्वारा लिए जाते हैं।'
                : '⚖️ Human-in-Control Principle: Sangathan AI assists with analysis and drafting, but consequential governance and voting decisions remain strictly with authorized human members.'}
            </p>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
          <Link
            href={`/${lang}/dashboard/settings`}
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isHindi ? 'AI सेटिंग्स प्रबंधित करें' : 'Manage AI Settings'}</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

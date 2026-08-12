'use client'

import { FormField } from '@/types/forms'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Printer, Phone, Mail, User, Calendar, ShieldCheck, Star } from 'lucide-react'
import { detectTextSentiment } from '@/lib/forms/analytics-engine'

interface Submission {
  id: string
  created_at: string
  data: Record<string, any>
  user_id?: string | null
}

interface ParticipantDossierModalProps {
  isOpen: boolean
  onClose: () => void
  submission: Submission | null
  formTitle: string
  fields: FormField[]
  lang: string
}

export function ParticipantDossierModal({
  isOpen,
  onClose,
  submission,
  formTitle,
  fields,
  lang,
}: ParticipantDossierModalProps) {
  if (!submission) return null

  const isHindi = lang === 'hi'
  const data = submission.data || {}

  // Try to find participant contact details from submission fields
  let participantName = ''
  let participantPhone = ''
  let participantEmail = ''

  fields.forEach((f) => {
    const val = data[f.id]
    if (!val) return

    const norm = f.label.toLowerCase()
    if (!participantName && (norm.includes('name') || norm.includes('naam') || norm.includes('worker') || norm.includes('student') || norm.includes('resident'))) {
      participantName = String(val)
    } else if (!participantPhone && (f.type === 'phone' || norm.includes('phone') || norm.includes('mobile') || norm.includes('whatsapp'))) {
      participantPhone = String(val)
    } else if (!participantEmail && (f.type === 'email' || norm.includes('email') || norm.includes('mail'))) {
      participantEmail = String(val)
    }
  })

  // Detect overall sentiment for this single participant
  const combinedText = Object.values(data).map((v) => String(v)).join(' ')
  const participantSentiment = detectTextSentiment(combinedText)

  function handlePrint() {
    window.print()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 bg-white">
        <DialogHeader className="border-b border-slate-100 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-sm bg-orange-100 text-orange-800">
                {isHindi ? 'व्यक्तिगत प्रतिक्रिया विवरण' : 'Individual Participant Dossier'}
              </span>
              <DialogTitle className="text-xl font-black text-slate-900 mt-1">
                {participantName || 'Anonymous Participant'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                {formTitle} • Submitted on {new Date(submission.created_at).toLocaleString()}
              </DialogDescription>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs font-bold shrink-0 border-slate-200"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5 text-orange-700" />
              {isHindi ? 'PDF / प्रिंट करें' : 'Print PDF Dossier'}
            </Button>
          </div>
        </DialogHeader>

        {/* Participant Profile Banner */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <User size={14} className="text-orange-700" />
              <span className="font-bold">{participantName || 'Anonymous'}</span>
            </div>

            {participantPhone && (
              <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                <Phone size={13} className="text-slate-400" />
                <a href={`tel:${participantPhone}`} className="hover:underline text-orange-800 font-bold">
                  {participantPhone}
                </a>
                <a
                  href={`https://wa.me/${participantPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded hover:bg-emerald-200"
                >
                  WhatsApp
                </a>
              </div>
            )}

            {participantEmail && (
              <div className="flex items-center gap-1.5 text-slate-600 font-mono">
                <Mail size={13} className="text-slate-400" />
                <a href={`mailto:${participantEmail}`} className="hover:underline">
                  {participantEmail}
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
            <div className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-blue-600" />
              <span>Immutable Response ID: <code className="font-mono text-slate-700">{submission.id.slice(0, 12)}</code></span>
            </div>

            <span className={`font-bold px-2 py-0.5 rounded-full uppercase text-[10px] ${
              participantSentiment === 'urgent'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : participantSentiment === 'positive'
                ? 'bg-emerald-100 text-emerald-800'
                : participantSentiment === 'negative'
                ? 'bg-red-100 text-red-800'
                : 'bg-slate-200 text-slate-700'
            }`}>
              Sentiment: {participantSentiment}
            </span>
          </div>
        </div>

        {/* Question-by-Question Audit Table */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            {isHindi ? 'प्रश्नोत्तरी उत्तर व स्कोर' : 'Question Responses & Scorecard'}
          </h4>

          <div className="space-y-3">
            {fields.map((field, idx) => {
              if (field.type === 'heading') {
                return (
                  <div key={field.id} className="pt-3 border-t border-slate-100 first:border-t-0">
                    <h5 className="text-xs font-black text-slate-900">{field.label}</h5>
                    {field.description && <p className="text-[11px] text-slate-400">{field.description}</p>}
                  </div>
                )
              }

              const rawVal = data[field.id]
              const hasAnswer = rawVal !== undefined && rawVal !== null && String(rawVal).trim() !== ''

              return (
                <div key={field.id} className="p-3 rounded-lg border border-slate-100 bg-white hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 leading-snug">
                      {idx + 1}. {field.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0 uppercase">
                      {field.type}
                    </span>
                  </div>

                  <div className="mt-1.5 text-xs text-slate-900">
                    {!hasAnswer ? (
                      <span className="text-slate-400 italic">No response provided</span>
                    ) : field.type === 'rating' ? (
                      <div className="flex items-center gap-1.5 font-bold text-amber-600">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={16}
                            className={s <= Number(rawVal) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}
                          />
                        ))}
                        <span className="text-slate-700 ml-1">({rawVal} / 5 Stars)</span>
                      </div>
                    ) : field.type === 'scale' ? (
                      <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-950 font-bold px-3 py-1 rounded-md text-xs">
                        <span>Score: {rawVal} / 5</span>
                        <span className="text-[10px] text-orange-700 font-normal">
                          ({Number(rawVal) >= 4 ? 'High / Positive' : Number(rawVal) <= 2 ? 'Low / Dissatisfied' : 'Neutral'})
                        </span>
                      </div>
                    ) : Array.isArray(rawVal) ? (
                      <div className="flex flex-wrap gap-1">
                        {rawVal.map((item, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-medium text-slate-700">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : field.type === 'yes_no' ? (
                      <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                        String(rawVal).toLowerCase() === 'yes' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {String(rawVal).toUpperCase()}
                      </span>
                    ) : field.type === 'textarea' ? (
                      <div className="p-2.5 rounded bg-slate-50 border border-slate-100 text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                        {String(rawVal)}
                      </div>
                    ) : (
                      <span className="font-medium text-slate-800">{String(rawVal)}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer print action */}
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
          <Button size="sm" onClick={handlePrint} className="bg-orange-700 hover:bg-orange-800 text-white font-bold text-xs">
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

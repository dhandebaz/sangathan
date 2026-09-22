'use client'

import React, { useState } from 'react'
import {
  Clock, Plus, ShieldAlert, CheckCircle2, FileText,
  Printer, AlertTriangle, Calendar, Building2, X, Sparkles,
  Camera
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  logPhysicalReceivingAction,
  generateRtiEscalationAction,
  RTIApplicationResult
} from '@/actions/receiving-tracker'

interface ReceivingRecord {
  id: string
  letter_ref_number: string
  subject: string
  authority_name: string
  recipient_official?: string | null
  submission_date: string
  receiving_photo_url?: string | null
  receiving_number?: string | null
  statutory_deadline_days: number
  escalation_status: string
  rti_ref_number?: string | null
  rti_filed_date?: string | null
  notes?: string | null
  elapsedDays?: number
  remainingDays?: number
  isOverdue?: boolean
  created_at: string
}

interface ReceivingTrackerClientProps {
  orgId: string
  orgName: string
  initialTrackers: ReceivingRecord[]
}

export function ReceivingTrackerClient({ orgId, orgName, initialTrackers }: ReceivingTrackerClientProps) {
  const [trackers, setTrackers] = useState<ReceivingRecord[]>(initialTrackers)
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [letterRefNumber, setLetterRefNumber] = useState('')
  const [subject, setSubject] = useState('')
  const [authorityName, setAuthorityName] = useState('')
  const [recipientOfficial, setRecipientOfficial] = useState('')
  const [submissionDate, setSubmissionDate] = useState(() => new Date().toISOString().split('T')[0])
  const [receivingNumber, setReceivingNumber] = useState('')
  const [statutoryDeadlineDays, setStatutoryDeadlineDays] = useState('30')
  const [notes, setNotes] = useState('')

  // RTI Generator State
  const [selectedForRti, setSelectedForRti] = useState<ReceivingRecord | null>(null)
  const [applicantName, setApplicantName] = useState('')
  const [applicantAddress, setApplicantAddress] = useState('')
  const [applicantPhone, setApplicantPhone] = useState('')
  const [isGeneratingRti, setIsGeneratingRti] = useState(false)
  const [generatedRti, setGeneratedRti] = useState<(RTIApplicationResult & { rtiRef: string }) | null>(null)

  async function handleLogReceiving(e: React.FormEvent) {
    e.preventDefault()
    if (!letterRefNumber.trim() || !subject.trim() || !authorityName.trim()) {
      toast.error('Please fill required fields')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await logPhysicalReceivingAction({
        letterRefNumber,
        subject,
        authorityName,
        recipientOfficial: recipientOfficial || undefined,
        submissionDate,
        receivingNumber: receivingNumber || undefined,
        statutoryDeadlineDays: parseInt(statutoryDeadlineDays) || 30,
        notes: notes || undefined,
      })

      if (res.success && res.data) {
        toast.success('Physical receiving stamped letter logged!')
        setTrackers([{ ...(res.data as any), elapsedDays: 0, remainingDays: 30, isOverdue: false }, ...trackers])
        setIsLogModalOpen(false)
        resetForm()
      } else {
        toast.error(res.error || 'Failed to log receiving')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  function resetForm() {
    setLetterRefNumber('')
    setSubject('')
    setAuthorityName('')
    setRecipientOfficial('')
    setReceivingNumber('')
    setNotes('')
  }

  async function handleGenerateRti(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedForRti || !applicantName.trim()) {
      toast.error('Please provide applicant details')
      return
    }

    setIsGeneratingRti(true)
    try {
      const res = await generateRtiEscalationAction(
        selectedForRti.id,
        applicantName,
        applicantAddress || 'Local Resident Association Office',
        applicantPhone || 'Applicant Contact'
      )

      if (res.success && res.data) {
        setGeneratedRti(res.data)
        toast.success('Formal RTI application generated!')
        // update local list
        setTrackers(trackers.map(t => t.id === selectedForRti.id ? { ...t, escalation_status: 'rti_filed', rti_ref_number: res.data.rtiRef } : t))
      } else {
        toast.error(res.error || 'Failed to generate RTI')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setIsGeneratingRti(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-100 text-amber-900 rounded-lg">
              <Clock className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Complaint Diary & RTI Helper
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Save stamped receiving photos from MCD, PWD, DJB with dates. Get a 30-day reminder and a ready Section 6(1) RTI draft that you print, sign and submit yourself.
          </p>
        </div>

        <Button
          onClick={() => setIsLogModalOpen(true)}
          className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs gap-2 px-4 h-9 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Log Stamped Letter (रिसीविंग दर्ज करें)</span>
        </Button>
      </div>

      {/* Trackers Grid */}
      {trackers.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-300 rounded-lg bg-slate-50/50 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No letters saved yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            When you submit a complaint to a ward or municipal office, save the stamped diary number and photo here so the date is never lost.
          </p>
          <Button
            onClick={() => setIsLogModalOpen(true)}
            variant="outline"
            className="text-xs font-bold gap-2 text-amber-800 border-amber-300 hover:bg-amber-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Stamped Letter</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trackers.map((rec) => {
            const remaining = rec.remainingDays !== undefined ? rec.remainingDays : 30
            const isOverdue = rec.isOverdue || (remaining <= 0 && rec.escalation_status === 'pending_response')

            return (
              <div
                key={rec.id}
                className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        REF: {rec.letter_ref_number}
                      </span>
                      {rec.receiving_number && (
                        <span className="font-mono text-[11px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Diary: {rec.receiving_number}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                      {rec.subject}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{rec.authority_name} {rec.recipient_official ? `(${rec.recipient_official})` : ''}</span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-400 block">
                      Submitted: {rec.submission_date}
                    </span>
                  </div>
                </div>

                {/* Countdown Status Pill */}
                <div className="flex items-center justify-between p-3 rounded-md border text-xs font-semibold bg-slate-50 border-slate-200">
                  <div className="flex items-center gap-2">
                    {rec.escalation_status === 'rti_filed' ? (
                      <span className="inline-flex items-center gap-1 text-purple-800 bg-purple-100 px-2 py-0.5 rounded font-bold text-[11px]">
                        <FileText className="w-3 h-3" />
                        <span>RTI Filed ({rec.rti_ref_number || 'Sec 6(1)'})</span>
                      </span>
                    ) : isOverdue ? (
                      <span className="inline-flex items-center gap-1 text-red-800 bg-red-100 px-2 py-0.5 rounded font-bold text-[11px]">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span>{Math.abs(remaining)} days waiting</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-bold text-[11px]">
                        <Clock className="w-3 h-3 text-emerald-700" />
                        <span>{remaining} days left on reminder</span>
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono">
                    Limit: {rec.statutory_deadline_days} Days
                  </span>
                </div>

                {rec.notes && (
                  <p className="text-xs text-slate-500 italic">
                    &quot;{rec.notes}&quot;
                  </p>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Complaint diary
                  </span>

                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedForRti(rec)
                      setGeneratedRti(null)
                    }}
                    className={`text-xs h-7 font-bold gap-1 shadow-2xs ${
                      isOverdue
                        ? 'bg-red-700 hover:bg-red-800 text-white animate-pulse'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{rec.escalation_status === 'rti_filed' ? 'View RTI draft' : 'Make RTI draft'}</span>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal: Log Stamped Letter */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold text-slate-900">Log Stamped Physical Letter / Receiving</h2>
              </div>
              <button onClick={() => setIsLogModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogReceiving} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold text-slate-700">Letter Reference No. *</Label>
                  <Input
                    required
                    placeholder="e.g. CIVIC/2026/089"
                    value={letterRefNumber}
                    onChange={e => setLetterRefNumber(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700">Stamped Diary Number</Label>
                  <Input
                    placeholder="e.g. Diary No 1492 / MCD"
                    value={receivingNumber}
                    onChange={e => setReceivingNumber(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Subject / Issue *</Label>
                <Input
                  required
                  placeholder="e.g. Urgent repair of open sewage manhole near school"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold text-slate-700">Target Authority *</Label>
                  <Input
                    required
                    placeholder="e.g. Executive Engineer, MCD Ward 42"
                    value={authorityName}
                    onChange={e => setAuthorityName(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700">Officer Name / Designation</Label>
                  <Input
                    placeholder="e.g. Sh. R.K. Meena, EE"
                    value={recipientOfficial}
                    onChange={e => setRecipientOfficial(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold text-slate-700">Submission Date</Label>
                  <Input
                    type="date"
                    value={submissionDate}
                    onChange={e => setSubmissionDate(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700">Deadline (Days)</Label>
                  <Input
                    type="number"
                    value={statutoryDeadlineDays}
                    onChange={e => setStatutoryDeadlineDays(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Notes / Promises made by official</Label>
                <Textarea
                  rows={2}
                  placeholder="Official promised inspection within 48 hours..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsLogModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs"
                >
                  {isSubmitting ? 'Saving...' : 'Save to diary'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Generate RTI Application */}
      {selectedForRti && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  RTI Application Generator (Right to Information Act, 2005)
                </h2>
                <p className="text-xs text-slate-500">
                  Draft for pending letter Ref: {selectedForRti.letter_ref_number} — you file it yourself
                </p>
              </div>
              <button onClick={() => setSelectedForRti(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!generatedRti ? (
              <form onSubmit={handleGenerateRti} className="space-y-3 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 leading-relaxed">
                  <strong>How this works.</strong> The app only prepares a draft. You print it, sign it, attach the ₹10 fee and submit it to the PIO yourself. The PIO must reply within 30 days (Section 7(1)). Fine on officers happens only if the Information Commission orders it after an appeal — nothing is automatic.
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700">Applicant Full Name (Citizen / Resident) *</Label>
                  <Input
                    required
                    placeholder="e.g. Ramesh Chandra Verma"
                    value={applicantName}
                    onChange={e => setApplicantName(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700">Residential Postal Address *</Label>
                  <Input
                    required
                    placeholder="e.g. Flat 204, Pocket B, Mayur Vihar Phase 2, Delhi - 110091"
                    value={applicantAddress}
                    onChange={e => setApplicantAddress(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700">Contact Phone Number</Label>
                  <Input
                    placeholder="+91 98765 43210"
                    value={applicantPhone}
                    onChange={e => setApplicantPhone(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setSelectedForRti(null)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isGeneratingRti}
                    className="bg-purple-800 hover:bg-purple-900 text-white font-bold text-xs gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGeneratingRti ? 'Synthesizing RTI Queries...' : 'Generate Formal RTI Application'}</span>
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs text-slate-800">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded font-mono space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>APPLICATION UNDER SECTION 6(1) OF RTI ACT, 2005</span>
                    <span>REF: {generatedRti.rtiRef}</span>
                  </div>
                  <div className="font-bold text-slate-700 mt-2">TO: {generatedRti.publicInformationOfficer}</div>
                  <div className="font-bold text-slate-900 mt-1">SUBJECT: {generatedRti.rtiSubject}</div>
                  <div className="text-[11px] text-slate-500 mt-1">Court Fee / IPO of ₹10 attached under Rule 3.</div>
                </div>

                <div className="space-y-1.5 p-3 bg-white border border-slate-200 rounded font-sans leading-relaxed">
                  <span className="font-bold text-slate-900 uppercase text-[11px]">Specific Information Requested:</span>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-700">
                    {generatedRti.specificInformationRequested.map((query, i) => (
                      <li key={i}>{query}</li>
                    ))}
                  </ol>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded whitespace-pre-line text-xs font-sans">
                  {generatedRti.applicationBodyFormatted}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedRti.applicationBodyFormatted)
                      toast.success('RTI Application copied!')
                    }}
                  >
                    Copy RTI Text
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => window.print()}
                    className="bg-slate-900 text-white font-bold gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print RTI Application</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

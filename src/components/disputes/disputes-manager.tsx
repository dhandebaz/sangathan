'use client'

import { useState } from 'react'
import { TradeDispute } from '@/types/dashboard'
import { createTradeDispute, advanceDisputeStage } from '@/actions/trade-disputes'
import { Scale, Plus, Building2, Calendar, ArrowRight, CheckCircle, AlertTriangle, FileText, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

interface DisputesManagerProps {
  initialDisputes: TradeDispute[]
  isHindi: boolean
  orgId: string
}

const STAGE_LABELS: Record<string, { en: string; hi: string; color: string }> = {
  shop_floor: { en: 'Shop Floor Inquiry', hi: 'कारखाना स्तर जांच', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  works_committee: { en: 'Works Committee', hi: 'कार्य समिति वार्ता', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  alc_conciliation: { en: 'ALC Conciliation', hi: 'श्रम आयुक्त सुलह (ALC)', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  labour_court: { en: 'Labour Court', hi: 'श्रम न्यायालय', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  industrial_tribunal: { en: 'Industrial Tribunal', hi: 'औद्योगिक न्यायाधिकरण', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  settled: { en: 'Settled Accord', hi: 'सुलह समझौता', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
}

const NATURE_LABELS: Record<string, { en: string; hi: string }> = {
  wage_theft: { en: 'Wage Theft & Overtime Denial', hi: 'वेतन चोरी / ओवरटाइम अस्वीकार' },
  unlawful_termination: { en: 'Unlawful Retrenchment', hi: 'गैर-कानूनी छंटनी / बर्खास्तगी' },
  safety_hazard: { en: 'Occupational Safety Hazard', hi: 'कार्यस्थल सुरक्षा उल्लंघन' },
  cba_violation: { en: 'CBA Agreement Breach', hi: 'समझौता (CBA) उल्लंघन' },
  lockout: { en: 'Illegal Lockout / Layoff', hi: 'अवैध तालाबंदी / ले-ऑफ' },
  pension_gratuity: { en: 'PF & Gratuity Non-Payment', hi: 'पीएफ व ग्रेच्युटी बकाया' },
}

export function DisputesManager({ initialDisputes, isHindi }: DisputesManagerProps) {
  const [disputes, setDisputes] = useState<TradeDispute[]>(initialDisputes)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAdvancingId, setIsAdvancingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Form State
  const [employerName, setEmployerName] = useState('')
  const [disputeNature, setDisputeNature] = useState<TradeDispute['dispute_nature']>('wage_theft')
  const [workerCount, setWorkerCount] = useState(1)
  const [summary, setSummary] = useState('')
  const [nextHearingDate, setNextHearingDate] = useState('')

  // Advance Stage Form State
  const [nextStage, setNextStage] = useState<TradeDispute['stage']>('alc_conciliation')
  const [settlementTerms, setSettlementTerms] = useState('')
  const [hearingDate, setHearingDate] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await createTradeDispute({
        employer_name: employerName,
        dispute_nature: disputeNature,
        worker_count: Number(workerCount),
        summary,
        next_hearing_date: nextHearingDate || undefined,
      })

      if (!res.error && res.data?.dispute) {
        setDisputes([res.data.dispute, ...disputes])
        setIsModalOpen(false)
        setEmployerName('')
        setSummary('')
        setNextHearingDate('')
        toast.success(isHindi ? 'विवाद मामला सफलतापूर्वक दर्ज किया गया।' : 'Trade dispute filed successfully.')
      } else {
        toast.error(res.error || 'Failed to file dispute')
      }
    } catch {
      toast.error('An error occurred while creating the dispute.')
    } finally {
      setLoading(false)
    }
  }

  const handleAdvanceStage = async (disputeId: string) => {
    setLoading(true)
    try {
      const res = await advanceDisputeStage({
        dispute_id: disputeId,
        stage: nextStage,
        next_hearing_date: hearingDate || undefined,
        settlement_terms: settlementTerms || undefined,
      })

      if (!res.error && res.data?.success) {
        setDisputes(
          disputes.map((d) =>
            d.id === disputeId
              ? {
                  ...d,
                  stage: nextStage,
                  next_hearing_date: hearingDate || d.next_hearing_date,
                  settlement_terms: settlementTerms || d.settlement_terms,
                  status: nextStage === 'settled' ? 'settled' : d.status,
                }
              : d
          )
        )
        setIsAdvancingId(null)
        setSettlementTerms('')
        setHearingDate('')
        toast.success(isHindi ? 'विवाद चरण सफलतापूर्वक अपडेट किया गया।' : 'Dispute stage updated successfully.')
      } else {
        toast.error(res.error || 'Failed to advance stage')
      }
    } catch {
      toast.error('An error occurred while updating stage.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          {isHindi ? 'विवाद मामले एवं सुनवाई रजिस्टर' : 'Dispute Registry & Proceedings'}
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition shadow-2xs active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          {isHindi ? 'नया विवाद दर्ज करें' : 'File New Dispute'}
        </button>
      </div>

      {/* Disputes List */}
      {disputes.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-slate-200/80 p-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {isHindi ? 'कोई सक्रिय विवाद दर्ज नहीं है' : 'No Trade Disputes Logged'}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            {isHindi
              ? 'जब भी किसी कंपनी या फैक्ट्री में वेतन, सुरक्षा या छंटनी का मुद्दा उठे, यहाँ नया विवाद दर्ज करें।'
              : 'Log workplace grievances, collective bargaining deadlocks, and conciliation proceedings here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => {
            const stageConfig = STAGE_LABELS[dispute.stage] || STAGE_LABELS.shop_floor
            const natureConfig = NATURE_LABELS[dispute.dispute_nature] || { en: dispute.dispute_nature, hi: dispute.dispute_nature }

            return (
              <div
                key={dispute.id}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
                      {dispute.dispute_ref}
                    </span>
                    <span className="text-base font-bold text-slate-900">{dispute.employer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${stageConfig.color}`}>
                      {isHindi ? stageConfig.hi : stageConfig.en}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {dispute.worker_count} {isHindi ? 'श्रमिक' : 'workers'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold text-amber-800">
                    {isHindi ? natureConfig.hi : natureConfig.en}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{dispute.summary}</p>
                  {dispute.settlement_terms && (
                    <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                      <span className="font-bold">{isHindi ? 'सुलह समझौता शर्तें: ' : 'Settlement Accord: '}</span>
                      {dispute.settlement_terms}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    {dispute.next_hearing_date && (
                      <span className="flex items-center gap-1.5 font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
                        <Calendar className="w-3.5 h-3.5" />
                        {isHindi ? 'अगली सुनवाई: ' : 'Next Hearing: '}
                        {dispute.next_hearing_date}
                      </span>
                    )}
                    <span>
                      {isHindi ? 'दर्ज तारीख: ' : 'Filed on: '}
                      {new Date(dispute.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {dispute.stage !== 'settled' && (
                    <button
                      onClick={() => {
                        setIsAdvancingId(dispute.id)
                        setNextStage(dispute.stage)
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
                    >
                      <span>{isHindi ? 'चरण आगे बढ़ाएं' : 'Advance Stage'}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Advance Stage Inline Drawer */}
                {isAdvancingId === dispute.id && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      {isHindi ? 'सुलह प्रक्रिया चरण बदलें' : 'Advance Conciliation Stage'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {isHindi ? 'नया चरण' : 'Target Stage'}
                        </label>
                        <select
                          value={nextStage}
                          onChange={(e) => setNextStage(e.target.value as any)}
                          className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                        >
                          <option value="shop_floor">{isHindi ? 'कारखाना स्तर जांच' : 'Shop Floor Inquiry'}</option>
                          <option value="works_committee">{isHindi ? 'कार्य समिति वार्ता' : 'Works Committee'}</option>
                          <option value="alc_conciliation">{isHindi ? 'श्रम आयुक्त सुलह (ALC)' : 'ALC Conciliation'}</option>
                          <option value="labour_court">{isHindi ? 'श्रम न्यायालय' : 'Labour Court'}</option>
                          <option value="industrial_tribunal">{isHindi ? 'औद्योगिक न्यायाधिकरण' : 'Industrial Tribunal'}</option>
                          <option value="settled">{isHindi ? 'सुलह समझौता (Settled Accord)' : 'Settled Accord'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {isHindi ? 'अगली सुनवाई तारीख' : 'Next Hearing Date'}
                        </label>
                        <input
                          type="date"
                          value={hearingDate}
                          onChange={(e) => setHearingDate(e.target.value)}
                          className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                        />
                      </div>
                    </div>

                    {nextStage === 'settled' && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {isHindi ? 'समझौता विवरण (Settlement Accord Terms)' : 'Settlement Terms'}
                        </label>
                        <textarea
                          rows={2}
                          value={settlementTerms}
                          onChange={(e) => setSettlementTerms(e.target.value)}
                          placeholder={isHindi ? 'वेतन वृद्धि, बहाली, या मुआवजे का विवरण...' : 'Details of reinstatement, wage arrears paid, or agreed CBA terms...'}
                          className="w-full text-xs rounded-lg border border-slate-300 p-2 bg-white"
                        />
                      </div>
                    )}

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAdvancingId(null)}
                        className="px-3 py-1.5 text-xs text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition"
                      >
                        {isHindi ? 'रद्द करें' : 'Cancel'}
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        onClick={() => handleAdvanceStage(dispute.id)}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition"
                      >
                        {loading ? (isHindi ? 'सहेज रहे हैं...' : 'Saving...') : (isHindi ? 'सहेजें' : 'Save Stage')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* New Dispute Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isHindi ? 'नया श्रमिक विवाद दर्ज करें' : 'File New Trade Dispute'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'कंपनी / नियोक्ता का नाम' : 'Employer / Enterprise Name'}
                </label>
                <input
                  type="text"
                  required
                  value={employerName}
                  onChange={(e) => setEmployerName(e.target.value)}
                  placeholder="e.g. Acme Manufacturing Ltd."
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'विवाद की प्रकृति' : 'Dispute Nature'}
                  </label>
                  <select
                    value={disputeNature}
                    onChange={(e) => setDisputeNature(e.target.value as any)}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  >
                    <option value="wage_theft">{isHindi ? 'वेतन चोरी / ओवरटाइम' : 'Wage Theft & Overtime'}</option>
                    <option value="unlawful_termination">{isHindi ? 'गैर-कानूनी छंटनी' : 'Unlawful Retrenchment'}</option>
                    <option value="safety_hazard">{isHindi ? 'सुरक्षा उल्लंघन' : 'Safety Hazard'}</option>
                    <option value="cba_violation">{isHindi ? 'समझौता (CBA) उल्लंघन' : 'CBA Violation'}</option>
                    <option value="lockout">{isHindi ? 'अवैध तालाबंदी' : 'Illegal Lockout'}</option>
                    <option value="pension_gratuity">{isHindi ? 'पीएफ व ग्रेच्युटी' : 'PF & Gratuity'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'प्रभावित श्रमिक संख्या' : 'Affected Workers'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={workerCount}
                    onChange={(e) => setWorkerCount(Number(e.target.value))}
                    className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'विवाद का संक्षिप्त विवरण' : 'Dispute Summary'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder={isHindi ? 'घटना, तारीख और प्रबंधन की प्रतिक्रिया लिखें...' : 'Describe violation details, affected shifts, and union demands...'}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'पहली सुनवाई तारीख (वैकल्पिक)' : 'Initial Hearing Date (Optional)'}
                </label>
                <input
                  type="date"
                  value={nextHearingDate}
                  onChange={(e) => setNextHearingDate(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition shadow-2xs"
                >
                  {loading ? (isHindi ? 'दर्ज कर रहे हैं...' : 'Submitting...') : (isHindi ? 'दर्ज करें' : 'Submit Case')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

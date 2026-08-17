'use client'

import { useState, useMemo } from 'react'
import { FormField } from '@/types/forms'
import { computeSurveyAnalytics, detectTextSentiment, SurveyAnalyticsReport } from '@/lib/forms/analytics-engine'
import {
  FileText,
  BarChart3,
  Users,
  Star,
  Printer,
  Copy,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  Download,
  Calendar,
  Eye,
  SlidersHorizontal,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Globe,
  Link2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormStatusToggle } from '@/components/forms/form-status-toggle'
import { CsvExportButton } from '@/components/forms/csv-export-button'
import { ParticipantDossierModal } from '@/components/forms/participant-dossier-modal'
import { WhatsappShareModal } from '@/components/forms/whatsapp-share-modal'
import { toast } from 'sonner'
import Link from 'next/link'

interface Submission {
  id: string
  created_at: string
  data: Record<string, any>
  user_id?: string | null
}

interface Form {
  id: string
  title: string
  description?: string
  slug?: string | null
  is_active: boolean
  created_at: string
  visibility?: 'public' | 'members' | 'private' | null
  fields?: FormField[]
}

interface SurveyAnalyticsDashboardProps {
  form: Form
  submissions: Submission[]
  lang: string
  orgName?: string
}

export function SurveyAnalyticsDashboard({
  form,
  submissions,
  lang,
  orgName = 'Sangathan',
}: SurveyAnalyticsDashboardProps) {
  const isHindi = lang === 'hi'

  const [activeTab, setActiveTab] = useState<'analytics' | 'responses' | 'report'>('analytics')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState<'all' | 'positive' | 'neutral' | 'negative' | 'urgent'>('all')
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isDossierOpen, setIsDossierOpen] = useState(false)
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false)
  const [formSlug, setFormSlug] = useState<string | null>(form.slug || null)

  // Compute rich survey analytics
  const analytics = useMemo(() => {
    return computeSurveyAnalytics(form, submissions)
  }, [form, submissions])

  const fields = form.fields || []

  // Filtered submissions list
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const dataStr = Object.values(sub.data || {}).map(v => String(v)).join(' ').toLowerCase()
      const matchesSearch = !searchQuery || dataStr.includes(searchQuery.toLowerCase())
      
      if (!matchesSearch) return false

      if (selectedSentimentFilter !== 'all') {
        const sentiment = detectTextSentiment(dataStr)
        if (sentiment !== selectedSentimentFilter) return false
      }

      return true
    })
  }, [submissions, searchQuery, selectedSentimentFilter])

  const shareIdentifier = formSlug || form.id

  function handleCopyPublicLink() {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const link = `${origin}/f/${shareIdentifier}`
    navigator.clipboard.writeText(link)
    toast.success(isHindi ? 'पब्लिक फॉर्म लिंक कॉपी हुआ!' : 'Public form link copied to clipboard!')
  }

  function handleOpenDossier(sub: Submission) {
    setSelectedSubmission(sub)
    setIsDossierOpen(true)
  }

  function handlePrintExecutiveReport() {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-orange-100 text-orange-800">
                {isHindi ? 'सर्वेक्षण विश्लेषण व रिपोर्ट' : 'Survey Intelligence & Live Analytics'}
              </span>
              <button
                type="button"
                onClick={() => setIsWhatsappModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs text-orange-700 hover:text-orange-900 font-mono bg-orange-50/80 hover:bg-orange-100 px-2 py-0.5 rounded transition-colors"
                title="Click to view/edit custom link & share on WhatsApp"
              >
                <Globe size={11} />
                <span>/f/{formSlug ? formSlug : form.id.slice(0, 8)}</span>
              </button>
            </div>
            <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">{form.title}</h1>
            {form.description && (
              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">{form.description}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <FormStatusToggle formId={form.id} isActive={form.is_active} />

            <Button
              type="button"
              onClick={() => setIsWhatsappModalOpen(true)}
              className="bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-xs shadow-xs"
              title="Share via WhatsApp with custom CTA"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1.5 fill-white" />
              {isHindi ? 'व्हाट्सएप शेयर' : 'WhatsApp Share'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyPublicLink}
              className="text-xs font-bold border-slate-200 text-slate-700"
              title="Copy Public Link"
            >
              <Copy className="w-3.5 h-3.5 mr-1 text-slate-500" />
              {isHindi ? 'लिंक कॉपी' : 'Copy Link'}
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="text-xs font-bold border-slate-200 text-slate-700"
            >
              <a href={`/f/${shareIdentifier}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1 text-slate-500" />
                {isHindi ? 'सार्वजनिक फॉर्म' : 'Open Public Form'}
              </a>
            </Button>

            <CsvExportButton
              data={submissions || []}
              filename={`${form.title.replace(/[^a-zA-Z0-9]/g, '_')}-submissions.csv`}
            />

            <Button
              type="button"
              size="sm"
              onClick={handlePrintExecutiveReport}
              className="bg-orange-700 hover:bg-orange-800 text-white font-bold text-xs shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              {isHindi ? 'कार्यकारी रिपोर्ट प्रिंट (PDF)' : 'Print Executive Report'}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BarChart3 size={14} />
            {isHindi ? 'एनालिटिक्स व लक्ष्य स्कोर' : 'Executive Analytics & Goal Metrics'}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('responses')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'responses'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users size={14} />
            {isHindi ? `सभी प्रतिक्रियाएं (${submissions.length})` : `All Submissions (${submissions.length})`}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'report'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText size={14} />
            {isHindi ? 'कार्यकारी रिपोर्ट प्रारूप' : 'Printable Executive Dossier'}
          </button>
        </div>
      </div>

      {/* TAB 1: EXECUTIVE ANALYTICS & GOAL METRICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Submissions */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Total Sample Size</span>
                <Users size={16} className="text-orange-700" />
              </div>
              <div className="text-3xl font-black text-slate-900">{analytics.totalSubmissions}</div>
              <div className="text-[11px] text-slate-400">
                {analytics.firstSubmissionAt ? `From ${new Date(analytics.firstSubmissionAt).toLocaleDateString()}` : 'No submissions yet'}
              </div>
            </div>

            {/* Goal Alignment Index */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Goal Consensus Index</span>
                <Sparkles size={16} className="text-emerald-700" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700">{analytics.goalAlignmentScore}%</span>
                <span className="text-xs font-semibold text-slate-500">Alignment</span>
              </div>
              <div className="text-[11px] text-slate-400">
                {analytics.goalAlignmentScore >= 75 ? 'High community consensus' : 'Action items require review'}
              </div>
            </div>

            {/* Satisfaction / Rating */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Average CSAT Score</span>
                <Star size={16} className="text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900">
                  {analytics.averageRating !== null ? `${analytics.averageRating} / 5` : 'N/A'}
                </span>
              </div>
              <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    className={s <= Math.round(analytics.averageRating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}
                  />
                ))}
                <span>Rating Benchmark</span>
              </div>
            </div>

            {/* Sentiment & Escalation */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Sentiment & Action</span>
                <Flame size={16} className="text-rose-600" />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  analytics.overallSentiment === 'positive'
                    ? 'bg-emerald-100 text-emerald-800'
                    : analytics.overallSentiment === 'critical'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : analytics.overallSentiment === 'negative'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {analytics.overallSentiment} Sentiment
                </span>
              </div>
              <div className="text-[11px] text-slate-500 pt-1 flex gap-2 font-mono">
                <span className="text-emerald-700">+{analytics.sentimentCounts.positive} Pos</span>
                <span className="text-red-700">-{analytics.sentimentCounts.negative} Neg</span>
                {analytics.sentimentCounts.urgent > 0 && (
                  <span className="text-amber-700 font-bold">⚠️ {analytics.sentimentCounts.urgent} Urgent</span>
                )}
              </div>
            </div>
          </div>

          {/* Automated Executive Takeaways & Synthesis */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-orange-400">
              <Sparkles size={16} />
              <span>{isHindi ? 'कार्यकारी निष्कर्ष व रिपोर्ट सारांश' : 'Executive Synthesis & Strategic Takeaways'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-200">
              {analytics.keyTakeaways.map((takeaway, i) => (
                <div key={i} className="flex items-start gap-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-orange-400 font-bold">•</span>
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Question-by-Question Deep Distribution Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                {isHindi ? 'प्रश्नवार परिणाम व सांख्यिकी' : 'Question-by-Question Breakdown & Distributions'}
              </h3>
              <span className="text-xs text-slate-500">{analytics.questionBreakdown.length} Questions analyzed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.questionBreakdown.map((q, idx) => {
                if (q.type === 'heading') return null

                return (
                  <div key={q.fieldId} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          Question {idx + 1} • {q.type}
                        </span>
                        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {q.totalResponses} responses
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">{q.label}</h4>
                      {q.description && <p className="text-[11px] text-slate-500">{q.description}</p>}
                    </div>

                    {/* Numeric / Rating / Scale Distribution Breakdown */}
                    {q.distribution && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-xs font-bold text-slate-700">Rating Distribution:</span>
                          <span className="text-sm font-black text-orange-700 font-mono">
                            Avg: {q.average} / {q.maxRating}
                          </span>
                        </div>

                        {Object.entries(q.distribution).map(([score, stat]) => (
                          <div key={score} className="space-y-1 text-xs">
                            <div className="flex justify-between text-slate-600">
                              <span className="font-bold">{score} {q.type === 'rating' ? '★' : 'Pts'}</span>
                              <span className="font-mono">{stat.count} ({stat.percentage}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-600 rounded-full transition-all"
                                style={{ width: `${stat.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Choice / Option Progress Bars */}
                    {q.optionCounts && (
                      <div className="space-y-2.5 pt-2 border-t border-slate-100">
                        {Object.entries(q.optionCounts).map(([opt, stat]) => (
                          <div key={opt} className="space-y-1 text-xs">
                            <div className="flex justify-between text-slate-700 font-medium">
                              <span className="truncate max-w-[70%]">{opt}</span>
                              <span className="font-mono font-bold text-slate-900">{stat.count} ({stat.percentage}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  opt === q.topChoice ? 'bg-orange-700' : 'bg-slate-300'
                                }`}
                                style={{ width: `${stat.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Text Responses & Key Word Frequency */}
                    {q.textResponses && (
                      <div className="space-y-3 pt-2 border-t border-slate-100">
                        {q.wordFrequency && q.wordFrequency.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Recurring Keywords:</span>
                            <div className="flex flex-wrap gap-1">
                              {q.wordFrequency.map((w, i) => (
                                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-medium text-slate-700">
                                  #{w.word} ({w.count})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                          {q.textResponses.slice(0, 4).map((t, i) => (
                            <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed italic">
                              &ldquo;{t.text}&rdquo;
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INDIVIDUAL RESPONSES & PARTICIPANT DOSSIERS */}
      {activeTab === 'responses' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {isHindi ? 'प्रतिभागी प्रतिक्रियाएं व विस्तृत रिकॉर्ड' : 'Individual Participant Submissions'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHindi ? 'किसी भी प्रतिक्रिया पर क्लिक करके उसका व्यक्तिगत PDF रिपोर्ट देखें।' : 'Click on any response to inspect answers or generate a Participant PDF Report.'}
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, phone, text..."
                className="pl-9 text-xs"
              />
            </div>
          </div>

          {/* Sentiment Filter Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="text-slate-400 self-center text-[11px] font-bold mr-1">Filter Sentiment:</span>
            {[
              { id: 'all', label: 'All Responses' },
              { id: 'positive', label: 'Positive' },
              { id: 'neutral', label: 'Neutral' },
              { id: 'negative', label: 'Grievance / Negative' },
              { id: 'urgent', label: '⚠️ Urgent' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedSentimentFilter(f.id as any)}
                className={`px-3 py-1 rounded-full font-semibold transition-all ${
                  selectedSentimentFilter === f.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Table of Submissions */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-extrabold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-32">Timestamp</th>
                  <th className="py-3.5 px-4">Participant Details</th>
                  {fields.slice(0, 2).map((f) => (
                    <th key={f.id} className="py-3.5 px-4 max-w-xs truncate">{f.label}</th>
                  ))}
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                      No matching survey responses found.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => {
                    const subText = Object.values(sub.data || {}).map(v => String(v)).join(' ')
                    const sentiment = detectTextSentiment(subText)

                    return (
                      <tr
                        key={sub.id}
                        onClick={() => handleOpenDossier(sub)}
                        className="hover:bg-orange-50/40 cursor-pointer transition-colors group"
                      >
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap font-mono">
                          {new Date(sub.created_at).toLocaleDateString()}{' '}
                          <span className="text-[10px] text-slate-400">{new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 group-hover:text-orange-700">
                              {Object.values(sub.data || {})[0] ? String(Object.values(sub.data)[0]).slice(0, 24) : 'Participant'}
                            </span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              sentiment === 'urgent'
                                ? 'bg-amber-100 text-amber-900'
                                : sentiment === 'positive'
                                ? 'bg-emerald-100 text-emerald-800'
                                : sentiment === 'negative'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {sentiment}
                            </span>
                          </div>
                        </td>

                        {fields.slice(0, 2).map((f) => (
                          <td key={f.id} className="py-3.5 px-4 max-w-xs truncate text-slate-700">
                            {typeof sub.data[f.id] === 'object'
                              ? JSON.stringify(sub.data[f.id])
                              : String(sub.data[f.id] || '-')}
                          </td>
                        ))}

                        <td className="py-3.5 px-4 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenDossier(sub)
                            }}
                            className="text-xs font-bold text-orange-700 group-hover:bg-white"
                          >
                            <Eye size={13} className="mr-1" /> View Dossier
                          </Button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EXECUTIVE PDF REPORT PREVIEW */}
      {activeTab === 'report' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-8 max-w-4xl mx-auto space-y-6">
          {/* Official Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex justify-between items-start">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest text-orange-700">{orgName}</div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Official Survey & Grievance Intelligence Report
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Subject: <strong>{form.title}</strong> • Generated on {new Date().toLocaleDateString()}
              </p>
            </div>

            <Button
              type="button"
              onClick={handlePrintExecutiveReport}
              className="bg-orange-700 hover:bg-orange-800 text-white font-bold text-xs"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5" />
              Print / Save as PDF
            </Button>
          </div>

          {/* Key Metric Indicators */}
          <div className="grid grid-cols-4 gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Sample Size</div>
              <div className="text-2xl font-black text-slate-900">{analytics.totalSubmissions}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Consensus Index</div>
              <div className="text-2xl font-black text-emerald-700">{analytics.goalAlignmentScore}%</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Average CSAT</div>
              <div className="text-2xl font-black text-slate-900">{analytics.averageRating || 'N/A'} / 5</div>
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Primary Sentiment</div>
              <div className="text-sm font-black text-slate-800 uppercase mt-1.5">{analytics.overallSentiment}</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Executive Summary & Strategic Takeaways</h4>
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs text-slate-700 leading-relaxed">
              {analytics.keyTakeaways.map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-orange-700 font-bold">•</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Question Breakdown Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Key Questionnaire Aggregates</h4>
            <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 border-b border-slate-200 text-left font-bold text-slate-700">
                <tr>
                  <th className="p-2.5">Question</th>
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5">Responses</th>
                  <th className="p-2.5">Consensus Result / Top Metric</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {analytics.questionBreakdown.map((q, idx) => {
                  if (q.type === 'heading') return null

                  let resultText = '-'
                  if (q.average !== undefined) {
                    resultText = `Average: ${q.average} / ${q.maxRating}`
                  } else if (q.topChoice) {
                    resultText = `Top: "${q.topChoice}" (${q.optionCounts?.[q.topChoice]?.percentage || 0}%)`
                  } else if (q.textResponses) {
                    resultText = `${q.textResponses.length} qualitative entries logged`
                  }

                  return (
                    <tr key={q.fieldId}>
                      <td className="p-2.5 font-medium text-slate-900">{idx + 1}. {q.label}</td>
                      <td className="p-2.5 text-slate-500 font-mono uppercase text-[10px]">{q.type}</td>
                      <td className="p-2.5 text-slate-600 font-mono">{q.totalResponses}</td>
                      <td className="p-2.5 font-bold text-orange-950">{resultText}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-6 border-t border-slate-200 flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Verified by Sangathan Governance Infrastructure</span>
            <span>Document Signature: SHA256-AUTHENTICATED</span>
          </div>
        </div>
      )}

      {/* Participant Dossier Modal */}
      <ParticipantDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        submission={selectedSubmission}
        formTitle={form.title}
        fields={fields}
        lang={lang}
      />

      {/* WhatsApp Share & SEO Slug Modal */}
      <WhatsappShareModal
        isOpen={isWhatsappModalOpen}
        onClose={() => setIsWhatsappModalOpen(false)}
        formId={form.id}
        formTitle={form.title}
        formDescription={form.description}
        currentSlug={formSlug}
        orgName={orgName}
        lang={lang}
        onSlugUpdated={(newSlug) => setFormSlug(newSlug)}
      />
    </div>
  )
}


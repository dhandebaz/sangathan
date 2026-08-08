'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { FileText, Clock, CheckCircle2, Download, Printer, Plus, Sparkles, Loader2 } from 'lucide-react'
import { generateRtiAction, logAtrAction } from '@/actions/rti-atr'
import { toast } from 'sonner'

interface RtiAtrClientProps {
  organisationId: string
  initialLogs: any[]
}

const RTI_TEMPLATES = [
  {
    id: 'budget_audit',
    subject: 'Request for University Maintenance Budget Allocation & Expenditure',
    department: 'Finance Officer & Central Accounts',
    questions: `1. Total annual budget allocated for campus hostel maintenance in FY 2025-2026.
2. Itemized list of expenditures incurred under head 'Student Welfare' during the past 12 months.
3. Name of contractors awarded campus mess and sanitation tenders.`
  },
  {
    id: 'reeval_delay',
    subject: 'Data Regarding Pending Examination Re-evaluation Results',
    department: 'Controller of Examinations',
    questions: `1. Total number of re-evaluation applications received for Semester 2 & 4.
2. Number of pending re-evaluation results beyond 45 days.
3. Reasons for delay in declaring re-evaluation marks before next semester exams.`
  }
]

export default function RtiAtrClient({ initialLogs }: RtiAtrClientProps) {
  const [logs, setLogs] = useState<any[]>(initialLogs)
  const [activeTab, setActiveTab] = useState<'rti' | 'atr'>('rti')
  const [loading, setLoading] = useState(false)

  // RTI Form State
  const [subject, setSubject] = useState('')
  const [department, setDepartment] = useState('')
  const [questions, setQuestions] = useState('')

  // ATR Form State
  const [officialName, setOfficialName] = useState('')
  const [commitment, setCommitment] = useState('')
  const [promisedDate, setPromisedDate] = useState('')

  const handleSelectRtiTemplate = (tplId: string) => {
    const tpl = RTI_TEMPLATES.find(t => t.id === tplId)
    if (tpl) {
      setSubject(tpl.subject)
      setDepartment(tpl.department)
      setQuestions(tpl.questions)
    }
  }

  const handleCreateRti = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !questions) return
    setLoading(true)

    try {
      const res = await generateRtiAction({
        subject,
        department: department || 'Public Information Officer (PIO)',
        questions
      })

      if (res.success && res.data) {
        toast.success('RTI Application generated & saved to Supabase!')
        setLogs([res.data, ...logs])
        setSubject('')
        setDepartment('')
        setQuestions('')
      } else {
        toast.error(res.error || 'Failed to generate RTI')
      }
    } catch {
      toast.error('An error occurred while drafting RTI')
    } finally {
      setLoading(false)
    }
  }

  const handleLogAtr = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!officialName || !commitment) return
    setLoading(true)

    try {
      const res = await logAtrAction({
        officialName,
        commitment,
        promisedDate: promisedDate || new Date().toLocaleDateString()
      })

      if (res.success && res.data) {
        toast.success('ATR Commitment logged & saved to Supabase!')
        setLogs([res.data, ...logs])
        setOfficialName('')
        setCommitment('')
        setPromisedDate('')
      } else {
        toast.error(res.error || 'Failed to log ATR commitment')
      }
    } catch {
      toast.error('An error occurred while logging ATR')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 text-white p-6 rounded-2xl border border-blue-800 shadow-xl">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-400" />
          <div>
            <h2 className="text-xl font-bold">RTI & Action Taken Report (ATR) Assistant</h2>
            <p className="text-slate-300 text-sm mt-1">
              File Right to Information (RTI Act 2005) queries & track Vice-Chancellor / Dean commitment deadlines.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white/10 p-1 rounded-xl border border-white/20">
          <button
            onClick={() => setActiveTab('rti')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'rti' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          >
            RTI Act 2005 Generator
          </button>
          <button
            onClick={() => setActiveTab('atr')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${activeTab === 'atr' ? 'bg-blue-600 text-white shadow' : 'text-slate-300 hover:text-white'}`}
          >
            VC/Dean ATR Commitment Tracker
          </button>
        </div>
      </div>

      {/* Tab 1: RTI Generator */}
      {activeTab === 'rti' && (
        <Card className="border shadow-md bg-white">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Draft RTI Application (सूचना का अधिकार आवेदन)
            </CardTitle>
            <CardDescription>
              Legal format application addressed to the Public Information Officer (PIO) under RTI Act 2005.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateRti}>
            <CardContent className="space-y-6 pt-6">
              {/* Quick Template Selector */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Standard Campus RTI Templates</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {RTI_TEMPLATES.map(tpl => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectRtiTemplate(tpl.id)}
                      className="text-left p-3 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition text-xs font-medium text-slate-700"
                    >
                      <p className="font-bold text-slate-900">{tpl.subject}</p>
                      <p className="text-slate-500 mt-1">To: {tpl.department}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">RTI Subject / Matter</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Seeking Information Regarding Library Fund Usage"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Target Department / PIO</label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g. Public Information Officer (Central Accounts)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Specific Information Sought (Questions)</label>
                <textarea
                  required
                  rows={6}
                  value={questions}
                  onChange={e => setQuestions(e.target.value)}
                  placeholder="1. Please provide itemized ledger of...\n2. Copy of tender agreement for..."
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 flex justify-end gap-3 p-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Generate & Save RTI to DB
              </button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Tab 2: ATR Commitment Tracker */}
      {activeTab === 'atr' && (
        <Card className="border shadow-md bg-white">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Log Administration Commitment (कार्यवाही रिपोर्ट / ATR)
            </CardTitle>
            <CardDescription>
              Record verbal/written promises made by VCs, Deans, or Wardens and set resolution deadline alerts.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogAtr}>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Official Name & Designation</label>
                  <input
                    type="text"
                    required
                    value={officialName}
                    onChange={e => setOfficialName(e.target.value)}
                    placeholder="e.g. Prof. R.K. Sharma (Dean of Student Welfare)"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Promised Resolution Deadline</label>
                  <input
                    type="date"
                    required
                    value={promisedDate}
                    onChange={e => setPromisedDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Commitment Details / Action Item</label>
                <textarea
                  rows={4}
                  required
                  value={commitment}
                  onChange={e => setCommitment(e.target.value)}
                  placeholder="e.g. Promised to replace broken water purifiers in Hostel 4 by next Friday."
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 flex justify-end p-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Commitment to DB
              </button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Database RTI & ATR Logs */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-slate-900 text-base">
            Database RTI & ATR Records ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {logs.map((item: any) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/50">
              <div>
                <span className="font-extrabold text-slate-900 text-base">{item.title}</span>
                <p className="text-xs text-slate-500 mt-0.5 whitespace-pre-wrap">{item.content}</p>
                <p className="text-[11px] text-blue-700 font-medium mt-1">
                  Logged: {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg border"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Legal PDF
              </button>
            </div>
          ))}

          {logs.length === 0 && (
            <p className="text-xs text-slate-500 p-6 text-center">No RTI applications or ATR commitments logged in database yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { FileText, Plus, CheckCircle2, UserCheck, Sparkles, Download, Loader2 } from 'lucide-react'
import { createMemorandum, signMemorandum } from '@/actions/memorandums'
import { toast } from 'sonner'

interface MemorandumClientProps {
  initialMemorandums: any[]
  organisationId: string
}

const TEMPLATES = [
  {
    id: 'hostel_mess',
    title: 'Representation Regarding Community Facility & Service Quality',
    recipient: 'Concerned Authority / Facility Manager',
    department: 'Facility Administration',
    content: `Respected Sir/Madam,

We, the undersigned members and representatives, submit this Memorandum (ज्ञापन) regarding urgent concerns in community facilities:
1. Immediate audit and improvement of service quality.
2. Timely allotment and maintenance of community resources.
3. Extension of facility access hours.

We request your prompt action within 7 business days.

Yours sincerely,
Collective Representatives`
  },
  {
    id: 'exam_extension',
    title: 'Memorandum for Extension of Deadlines & Relief',
    recipient: 'Concerned Authority',
    department: 'Administration',
    content: `Respected Authority,

Due to recent schedule disruptions, we request:
1. Extension of deadline by 10 days.
2. Publication of assessment scores prior to final decisions.

We trust the administration will consider the welfare of the community.

Yours sincerely,
Member Delegation`
  },
  {
    id: 'fee_hike',
    title: 'Memorandum Demanding Rollback of Proposed Fee Hike',
    recipient: 'Chairperson / Finance Officer',
    department: 'Central Administration',
    content: `To the Honorable Chairperson,

We express our strong objection to the proposed 15% increase in annual fees:
1. Immediate suspension of the fee hike decision.
2. Formation of a joint member committee to review fee structures.
3. Special fee waivers for economically marginalized members.

Thanking you,
Collective Executive Committee`
  }
]

export default function MemorandumClient({ initialMemorandums }: MemorandumClientProps) {
  const [memorandums, setMemorandums] = useState<any[]>(initialMemorandums)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(false)

  const [newTitle, setNewTitle] = useState('')
  const [newRecipient, setNewRecipient] = useState('')
  const [newDepartment, setNewDepartment] = useState('')
  const [newContent, setNewContent] = useState('')

  const handleSelectTemplate = (templateId: string) => {
    const tpl = TEMPLATES.find(t => t.id === templateId)
    if (tpl) {
      setNewTitle(tpl.title)
      setNewRecipient(tpl.recipient)
      setNewDepartment(tpl.department)
      setNewContent(tpl.content)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newContent) return
    setLoading(true)

    try {
      const res = await createMemorandum({
        title: newTitle,
        recipient: newRecipient || 'Concerned Authority',
        department: newDepartment || 'Administration',
        content: newContent
      })

      if (res.success && res.data) {
        toast.success('Gyapan published and saved to database!')
        setMemorandums([res.data, ...memorandums])
        setIsCreating(false)
        setNewTitle('')
        setNewRecipient('')
        setNewDepartment('')
        setNewContent('')
      } else {
        toast.error(res.error || 'Failed to create memorandum')
      }
    } catch {
      toast.error('An error occurred while creating memorandum')
    } finally {
      setLoading(false)
    }
  }

  const handleSign = async (id: string) => {
    try {
      const res = await signMemorandum(id)
      if (res.success) {
        toast.success('Digitally signed Gyapan representation!')
        window.location.reload()
      } else {
        toast.error(res.error || 'Failed to sign')
      }
    } catch {
      toast.error('Error signing memorandum')
    }
  }

  return (
    <div className="space-y-8">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-lg border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-400" />
            <h2 className="text-xl font-bold">Gyapan (ज्ञापन) & Memorandum Generator</h2>
          </div>
          <p className="text-slate-300 text-sm mt-1">
            Draft formal collective representations, collect verified member signatures, and present demands to authorities and departments.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl font-medium transition shadow"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? 'Cancel Draft' : 'Draft New Gyapan'}
        </button>
      </div>

      {/* Creation Form */}
      {isCreating && (
        <Card className="border-2 border-indigo-100 shadow-xl bg-white">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Draft Formal Memorandum (ज्ञापन)
            </CardTitle>
            <CardDescription>
              Select a standard template or write a custom representation.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCreate}>
            <CardContent className="space-y-6 pt-6">
              {/* Quick Template Picker */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Quick Templates</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {TEMPLATES.map(tpl => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tpl.id)}
                      className="text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/30 transition text-xs font-medium text-slate-700"
                    >
                      <p className="font-bold text-slate-900">{tpl.title.slice(0, 38)}...</p>
                      <p className="text-slate-500 mt-1">To: {tpl.recipient}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">Memorandum Title</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g., Representation Regarding Hostel 3 Sanitation"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">Addressed To (Recipient)</label>
                  <input
                    type="text"
                    required
                    value={newRecipient}
                    onChange={e => setNewRecipient(e.target.value)}
                    placeholder="e.g., Chairperson / Concerned Authority"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">Memorandum Content</label>
                <textarea
                  required
                  rows={8}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Write the memorandum demands and text here..."
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 flex justify-end gap-3 py-4">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Publish Gyapan to Supabase
              </button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Database Memorandums List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Database Memorandums & Demands ({memorandums.length})
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {memorandums.map((mem: any) => (
            <Card key={mem.id} className="border shadow-sm hover:shadow-md transition">
              <CardHeader className="bg-slate-50/50 pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
                      Official Gyapan
                    </span>
                    <CardTitle className="text-xl text-slate-900">{mem.title.replace('[GYAPAN] ', '')}</CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">
                      Created {new Date(mem.created_at).toLocaleDateString()} • Status: <span className="font-bold text-indigo-600 uppercase">{mem.status}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border text-left leading-relaxed">
                  {mem.content}
                </pre>
              </CardContent>
              <CardFooter className="border-t bg-white flex flex-wrap justify-between items-center gap-4 py-3">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleSign(mem.id)}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Sign Digitally
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium px-3 py-2 rounded-lg transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Print PDF
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}

          {memorandums.length === 0 && !isCreating && (
            <Card className="border-dashed p-8 text-center bg-slate-50/50">
              <p className="text-slate-500 text-sm">No Memorandums (ज्ञापन) created yet in database.</p>
              <button
                onClick={() => setIsCreating(true)}
                className="mt-3 inline-flex items-center gap-2 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                <Plus className="w-4 h-4" />
                Draft First Gyapan
              </button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

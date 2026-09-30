'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Printer, Copy, FileText, Landmark, Building2, Zap, Shield, MapPin,
  ChevronRight, Sparkles, PlusCircle, CheckCircle2, HardHat, GraduationCap
} from 'lucide-react'
import { toast } from 'sonner'
import {
  MUNICIPAL_LETTER_TEMPLATES,
  getTemplatesByCategory,
  type MunicipalLetterTemplate
} from '@/lib/data/municipal-letter-templates'
import { generateLegalGovernmentTemplate } from '@/actions/generate-template'

interface MunicipalLettersClientProps {
  organisationId: string
  defaultOrgName: string
}

const categoryIcons: Record<string, React.ElementType> = {
  bqf_official: Shield,
  elected_representative: Landmark,
  municipal_civic: Building2,
  utility: Zap,
  police: Shield,
  revenue: MapPin,
  labour_rights: HardHat,
  student_campus: GraduationCap,
}

function generateRefNumber(prefix: string): string {
  return `${prefix}/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 9000) + 1000)}`
}

export default function MunicipalLettersClient({
  defaultOrgName,
}: MunicipalLettersClientProps) {
  const [customTemplates, setCustomTemplates] = useState<MunicipalLetterTemplate[]>([])
  
  // Letter state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [activeTemplateTitle, setActiveTemplateTitle] = useState('')
  const [orgName, setOrgName] = useState(defaultOrgName)
  const [colonyName, setColonyName] = useState('')
  const [refNumber, setRefNumber] = useState('')
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0])
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [signatory1, setSignatory1] = useState('President / Lead Convener')
  const [signatory2, setSignatory2] = useState('General Secretary')
  const [isBqfHeaderEnabled, setIsBqfHeaderEnabled] = useState(false)

  // AI Generator Modal state
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const allTemplates = [...customTemplates, ...MUNICIPAL_LETTER_TEMPLATES]

  const handleSelectTemplate = (template: MunicipalLetterTemplate) => {
    setSelectedTemplateId(template.id)
    setActiveTemplateTitle(template.title)
    setRecipient(template.recipient)
    setSubject(template.subject)
    setBody(template.body)
    setSignatory1(template.signatory1)
    setSignatory2(template.signatory2)
    setRefNumber(generateRefNumber(template.refPrefix))
  }

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please describe the official government letter you want to generate.')
      return
    }

    setIsGenerating(true)
    try {
      const res = await generateLegalGovernmentTemplate(aiPrompt, orgName)
      if (res.success && res.template) {
        const newTemp: MunicipalLetterTemplate = {
          id: 'ai_' + Date.now(),
          category: res.template.category,
          title: res.template.title,
          titleHi: res.template.titleHi,
          description: res.template.description,
          recipient: res.template.recipient,
          subject: res.template.subject,
          body: res.template.body,
          signatory1: res.template.signatory1,
          signatory2: res.template.signatory2,
          refPrefix: res.template.refPrefix,
        }

        setCustomTemplates((prev) => [newTemp, ...prev])
        handleSelectTemplate(newTemp)
        setShowAiModal(false)
        setAiPrompt('')
        toast.success('Legally valid AI government template generated and added to grid!')
      } else {
        toast.error(res.error || 'AI generation failed')
      }
    } catch (err) {
      toast.error('Error generating AI template.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyText = () => {
    const text = `Ref: ${refNumber}\nDate: ${letterDate}\n\n${recipient}\n\nSubject: ${subject}\n\n${body}\n\n${signatory1}\n${signatory2}`
    navigator.clipboard.writeText(text)
    toast.success('Letter text copied to clipboard!')
  }

  // Template selector grid view
  if (!selectedTemplateId) {
    const categories = getTemplatesByCategory()

    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Government & Municipal Letter Generator</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Generate, customize, and 1-click print legally structured official representations for MLAs, Parshads, MCD, Police, and BQF Submissions.
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAiModal(true)} className="bg-purple-700 hover:bg-purple-800 text-white text-xs gap-2 shrink-0">
            <Sparkles className="w-4 h-4" /> AI Generate Custom Representation
          </Button>
        </div>

        {/* AI Generator Modal */}
        {showAiModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4">
            <div className="bg-white border border-slate-200 rounded-sm p-6 max-w-lg w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-2 text-purple-800 font-bold text-base">
                  <Sparkles className="w-5 h-5" /> AI Government Representation Generator
                </div>
                <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-slate-600 text-sm">✕</button>
              </div>

              <p className="text-xs text-slate-600">
                Describe the specific issue, target authority (SDM, Police Commissioner, MCD, Jal Board, Labour Office), and key demands. AI will draft a legally sound representation.
              </p>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase text-slate-500">Prompt / Complaint Description</Label>
                <textarea
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Complaint to Police Commissioner regarding unauthorized night noise and safety issues in Ghaffar Manzil, demanding night beat patrolling."
                  className="w-full rounded border border-slate-300 p-3 text-xs bg-white focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowAiModal(false)} className="text-xs">Cancel</Button>
                <Button onClick={handleAiGenerate} disabled={isGenerating} className="bg-purple-700 hover:bg-purple-800 text-white text-xs gap-2">
                  {isGenerating ? 'Drafting Legal Template...' : 'Generate Template ✓'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Custom AI templates section if available */}
        {customTemplates.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-purple-900 uppercase tracking-wider">
                AI Generated Templates (Custom)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {customTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTemplate(t)}
                  className="text-left bg-purple-50/40 border border-purple-200 rounded-sm p-4 hover:border-purple-400 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-purple-950 group-hover:text-purple-700 transition-colors">
                        {t.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-purple-400 group-hover:text-purple-700 shrink-0 mt-0.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Standard Template Categories Grid */}
        {Object.entries(categories).map(([key, cat]) => {
          if (cat.templates.length === 0) return null
          const Icon = categoryIcons[key] || FileText
          return (
            <div key={key}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                  {cat.label}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cat.templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="text-left bg-white border border-slate-200 rounded-sm p-4 hover:border-sky-300 hover:bg-sky-50/30 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                          {template.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {template.description}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                          {template.titleHi}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 shrink-0 mt-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Letter editor + preview
  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="print:hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 p-4 rounded-sm shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedTemplateId(null)}
            className="text-xs text-sky-600 hover:text-sky-800 font-medium transition-colors"
          >
            ← Back to Templates Grid
          </button>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-medium text-slate-700">{activeTemplateTitle}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyText} className="gap-1.5">
            <Copy className="w-3.5 h-3.5" /> Copy Text
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-white">
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Editor Card */}
      <Card className="print:hidden border shadow-md bg-white">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-slate-900 text-sm">Letter Customization & Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Organisation / Collective Name</Label>
              <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Locality / Ward Name</Label>
              <Input value={colonyName} onChange={(e) => setColonyName(e.target.value)} placeholder="e.g. Ward 45, Ghaffar Manzil" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Reference Number</Label>
              <Input value={refNumber} onChange={(e) => setRefNumber(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Document Date</Label>
              <Input type="date" value={letterDate} onChange={(e) => setLetterDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Subject Line</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="font-semibold" />
            </div>
          </div>

          <label className="flex items-start gap-2.5 p-3 rounded-md border border-slate-200 bg-slate-50 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isBqfHeaderEnabled}
              onChange={(e) => setIsBqfHeaderEnabled(e.target.checked)}
              className="w-4 h-4 mt-0.5"
            />
            <span>
              Add BQF community-affiliation line. Tick only if your group has recorded BQF affiliation — it adds no legal status and letters still go in your own name.
            </span>
          </label>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-slate-500">Recipient Address Block</Label>
            <textarea
              rows={4}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full rounded-md border border-slate-300 p-2.5 text-sm bg-white focus:ring-2 focus:ring-sky-200 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-slate-500">Letter Body Content</Label>
            <textarea
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-md border border-slate-300 p-3 text-sm bg-white focus:ring-2 focus:ring-sky-200 outline-none font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Left Signatory Title</Label>
              <Input value={signatory1} onChange={(e) => setSignatory1(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Right Signatory Title</Label>
              <Input value={signatory2} onChange={(e) => setSignatory2(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Printable Official Letterhead */}
      <div className="bg-white p-8 sm:p-12 rounded-sm border border-slate-300 shadow-lg max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 text-slate-900 font-sans">
        {/* Header */}
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase text-slate-900">
            {orgName}
          </h1>
          {colonyName && (
            <p className="text-xs text-slate-600 tracking-wide mt-1">
              {colonyName} • Public Civic Representation
            </p>
          )}
          {isBqfHeaderEnabled && (
            <div className="mt-2 text-[11px] font-mono text-purple-900 bg-purple-50/80 inline-block px-3 py-1 rounded border border-purple-200">
              Community-affiliated group (self-declared) • BAHUJAN QUEER FOUNDATION (Section 8 NGO, Delhi)
            </div>
          )}
        </div>

        {/* Ref & Date */}
        <div className="flex justify-between items-center text-xs font-mono border-b pb-2 mb-6">
          <span><strong>Ref No:</strong> {refNumber}</span>
          <span><strong>Date:</strong> {letterDate}</span>
        </div>

        {/* Recipient */}
        <div className="mb-6 whitespace-pre-line text-sm font-medium text-slate-800">
          {recipient}
        </div>

        {/* Subject */}
        <div className="mb-6 bg-slate-50 p-3 rounded border font-extrabold text-sm uppercase text-slate-900">
          Subject: {subject}
        </div>

        {/* Body */}
        <div className="mb-12 whitespace-pre-line text-sm leading-relaxed text-slate-900">
          {body}
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-12 border-t border-slate-300 text-xs">
          <div className="text-center">
            <div className="h-16 flex items-center justify-center italic text-slate-400 font-serif">
              [Signature & Official Stamp]
            </div>
            <p className="font-bold border-t pt-1 uppercase text-slate-900">{signatory1}</p>
            <p className="text-[10px] text-slate-500">{orgName}</p>
          </div>
          <div className="text-center">
            <div className="h-16 flex items-center justify-center italic text-slate-400 font-serif">
              [Signature & Official Stamp]
            </div>
            <p className="font-bold border-t pt-1 uppercase text-slate-900">{signatory2}</p>
            <p className="text-[10px] text-slate-500">{orgName}</p>
          </div>
        </div>

        {/* BQF Statutory Disclaimer Footer */}
        <div className="mt-10 pt-4 border-t border-dashed border-slate-300 text-[10px] text-slate-500 space-y-1 font-mono">
          <p><strong>BQF RECOGNITION SEAL:</strong> Bahujan Queer Foundation (CIN: U88900DL2025NPL452474) recognizes this collective for civic representations. BQF is indemnified from any unauthorized or illegal acts.</p>
        </div>
      </div>
    </div>
  )
}

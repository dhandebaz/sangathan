'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import {
  Printer, Copy, FileText, Landmark, Building2, Zap, Shield, MapPin,
  ChevronRight
} from 'lucide-react'
import { toast } from 'sonner'
import {
  MUNICIPAL_LETTER_TEMPLATES,
  getTemplatesByCategory,
  type MunicipalLetterTemplate
} from '@/lib/data/municipal-letter-templates'

interface MunicipalLettersClientProps {
  organisationId: string
  defaultOrgName: string
}

const categoryIcons: Record<string, React.ElementType> = {
  elected_representative: Landmark,
  municipal_civic: Building2,
  utility: Zap,
  police: Shield,
  revenue: MapPin,
}

function generateRefNumber(prefix: string): string {
  return `${prefix}/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 9000) + 1000)}`
}

export default function MunicipalLettersClient({
  defaultOrgName,
}: MunicipalLettersClientProps) {
  const categories = getTemplatesByCategory()

  // Letter state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [orgName, setOrgName] = useState(defaultOrgName)
  const [colonyName, setColonyName] = useState('')
  const [refNumber, setRefNumber] = useState('')
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0])
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [signatory1, setSignatory1] = useState('President, RWA')
  const [signatory2, setSignatory2] = useState('General Secretary, RWA')

  const selectedTemplate = MUNICIPAL_LETTER_TEMPLATES.find(t => t.id === selectedTemplateId)

  const handleSelectTemplate = (template: MunicipalLetterTemplate) => {
    setSelectedTemplateId(template.id)
    setRecipient(template.recipient)
    setSubject(template.subject)
    setBody(template.body)
    setSignatory1(template.signatory1)
    setSignatory2(template.signatory2)
    setRefNumber(generateRefNumber(template.refPrefix))
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCopyText = () => {
    const text = `Ref: ${refNumber}\nDate: ${letterDate}\n\n${recipient}\n\nSubject: ${subject}\n\n${body}\n\n${signatory1}\n${signatory2}`
    navigator.clipboard.writeText(text)
    toast.success('Letter text copied to clipboard!')
  }

  // Template selector view
  if (!selectedTemplateId) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-sm bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Colony Municipal Letter Generator</h2>
              <p className="text-slate-500 text-xs mt-0.5">
                Select a pre-formatted template to create official representations to MLAs, Parshads, MCD, DJB, BSES, and Police.
              </p>
            </div>
          </div>
        </div>

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
                {cat.templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="text-left bg-white border border-slate-200 rounded-sm p-4 hover:border-sky-300 hover:bg-sky-50/30 transition-all group"
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
            ← Back to Templates
          </button>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-medium text-slate-700">{selectedTemplate?.title}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyText} className="gap-1.5">
            <Copy className="w-3.5 h-3.5" /> Copy Text
          </Button>
          <Button size="sm" onClick={handlePrint} className="gap-1.5">
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </Button>
        </div>
      </div>

      {/* Editor */}
      <Card className="print:hidden border shadow-md bg-white">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-slate-900 text-sm">Letter Details & Customization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Organisation / RWA Name</Label>
              <Input value={orgName} onChange={e => setOrgName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Colony Name</Label>
              <Input value={colonyName} onChange={e => setColonyName(e.target.value)} placeholder="e.g. Ghaffar Manzil Colony" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Reference Number</Label>
              <Input value={refNumber} onChange={e => setRefNumber(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Document Date</Label>
              <Input type="date" value={letterDate} onChange={e => setLetterDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Subject Line</Label>
              <Input value={subject} onChange={e => setSubject(e.target.value)} className="font-semibold" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-slate-500">Recipient Address Block</Label>
            <textarea
              rows={4}
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              className="w-full rounded-md border border-slate-300 p-2.5 text-sm bg-white focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-slate-500">Letter Body</Label>
            <textarea
              rows={12}
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full rounded-md border border-slate-300 p-3 text-sm bg-white focus:ring-2 focus:ring-sky-200 focus:border-sky-400 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Left Signatory Title</Label>
              <Input value={signatory1} onChange={e => setSignatory1(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Right Signatory Title</Label>
              <Input value={signatory2} onChange={e => setSignatory2(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Printable Letterhead */}
      <div className="bg-white p-8 sm:p-12 rounded-sm border border-slate-300 shadow-lg max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 text-slate-900 font-serif">
        {/* Header */}
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase font-sans text-slate-900">
            {orgName}
          </h1>
          {colonyName && (
            <p className="text-xs font-sans text-slate-600 tracking-wide mt-1">
              {colonyName} • Registered Resident Welfare Association
            </p>
          )}
        </div>

        {/* Ref & Date */}
        <div className="flex justify-between items-center text-xs font-mono border-b pb-2 mb-6 font-sans">
          <span><strong>Ref No:</strong> {refNumber}</span>
          <span><strong>Date:</strong> {letterDate}</span>
        </div>

        {/* Recipient */}
        <div className="mb-6 whitespace-pre-line text-sm font-sans font-medium text-slate-800">
          {recipient}
        </div>

        {/* Subject */}
        <div className="mb-6 font-sans bg-slate-50 p-3 rounded border font-extrabold text-sm uppercase text-slate-900">
          Subject: {subject}
        </div>

        {/* Body */}
        <div className="mb-12 whitespace-pre-line text-sm leading-relaxed text-slate-900 font-sans">
          {body}
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-12 border-t border-slate-300 font-sans text-xs">
          <div className="text-center">
            <div className="h-16 flex items-center justify-center italic text-slate-400 font-serif">
              [Signature & Stamp]
            </div>
            <p className="font-bold border-t pt-1 uppercase text-slate-900">{signatory1}</p>
            <p className="text-[10px] text-slate-500">{orgName}</p>
          </div>
          <div className="text-center">
            <div className="h-16 flex items-center justify-center italic text-slate-400 font-serif">
              [Signature & Stamp]
            </div>
            <p className="font-bold border-t pt-1 uppercase text-slate-900">{signatory2}</p>
            <p className="text-[10px] text-slate-500">{orgName}</p>
          </div>
        </div>

        {/* CC line */}
        <div className="mt-8 pt-4 border-t border-dashed border-slate-300 text-xs font-sans text-slate-500">
          <p className="font-semibold text-slate-700 mb-1">CC:</p>
          <p>1. Hon&apos;ble MLA, ________ Vidhan Sabha</p>
          <p>2. Ward Councillor (Nigam Parshad), Ward No. ________</p>
          <p>3. SDM, ________ Sub-Division</p>
          <p>4. SHO, PS ________</p>
        </div>
      </div>
    </div>
  )
}

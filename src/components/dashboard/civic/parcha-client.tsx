'use client'

import React, { useState } from 'react'
import {
  Printer, Sparkles, MessageSquare, FileText, CheckCircle2,
  Users, MapPin, QrCode, Share2, Layers
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { QRCodeSVG } from 'qrcode.react'
import {
  generateParchaAndSignatureSheetAction,
  ParchaOutputResult
} from '@/actions/parcha'

interface ParchaClientProps {
  orgName: string
  orgSlug: string
}

export function ParchaClient({ orgName, orgSlug }: ParchaClientProps) {
  const [localityName, setLocalityName] = useState('')
  const [issueTitle, setIssueTitle] = useState('')
  const [issueContext, setIssueContext] = useState('')
  const [demands, setDemands] = useState('')
  const [spokespersonContact, setSpokespersonContact] = useState('')
  const [rallyOrMeetingInfo, setRallyOrMeetingInfo] = useState('Colony General Meeting • This Sunday at 5:00 PM (Central Park)')
  const [isGenerating, setIsGenerating] = useState(false)
  const [parchaData, setParchaData] = useState<ParchaOutputResult | null>(null)
  const [activeTab, setActiveTab] = useState<'parcha' | 'signature_sheet' | 'whatsapp'>('parcha')

  const publicJoinUrl = `https://sangathan.space/org/${orgSlug}`

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!localityName.trim() || !issueTitle.trim() || !demands.trim()) {
      toast.error('Please enter locality, issue title, and demands')
      return
    }

    setIsGenerating(true)
    try {
      const demandsArr = demands
        .split('\n')
        .map(d => d.trim())
        .filter(Boolean)

      const res = await generateParchaAndSignatureSheetAction({
        orgName,
        localityName,
        issueTitle,
        issueContext: issueContext || issueTitle,
        demands: demandsArr.length > 0 ? demandsArr : ['Immediate municipal resolution and repair'],
        spokespersonContact: spokespersonContact || 'Local Colony Action Committee',
        rallyOrMeetingInfo,
      })

      if (res.success && res.data) {
        setParchaData(res.data)
        toast.success('Printable Parcha & Signature Sheet created!')
      } else {
        toast.error(res.error || 'Failed to generate Parcha')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-slate-900 text-white rounded-lg">
              <Printer className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              1-Page Printable Parcha & Physical Signature Sheets
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Black & white print-ready flyers (पर्चे) for ₹1 photostat/photocopy and pen-and-paper signature sheets for parks and chai stalls.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <h2 className="text-sm font-bold text-slate-900">Colony Grievance & Mobilization Details</h2>
          </div>

          <form onSubmit={handleGenerate} className="space-y-3">
            <div>
              <Label className="text-xs font-bold text-slate-700">Locality / Ward / Colony *</Label>
              <Input
                required
                placeholder="e.g. Laxmi Nagar Ward 42 / Rohini Sec 7"
                value={localityName}
                onChange={e => setLocalityName(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Core Issue Title *</Label>
              <Input
                required
                placeholder="e.g. Foul Black Drinking Water & Dry Taps"
                value={issueTitle}
                onChange={e => setIssueTitle(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Grievance Story & Daily Impact</Label>
              <Textarea
                rows={2}
                placeholder="How this affects residents: children falling sick, water tanker mafia charging extra, sewage mixing in pipeline..."
                value={issueContext}
                onChange={e => setIssueContext(e.target.value)}
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Demand Points (One per line) *</Label>
              <Textarea
                required
                rows={3}
                placeholder="1. Urgent replacement of corroded water pipes&#10;2. Free clean municipal water tankers daily at 7 AM&#10;3. Public display of water quality test lab reports"
                value={demands}
                onChange={e => setDemands(e.target.value)}
                className="mt-1 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Meeting / Gathering Info</Label>
              <Input
                placeholder="e.g. Colony Meeting • Sunday 5:00 PM (Main Park)"
                value={rallyOrMeetingInfo}
                onChange={e => setRallyOrMeetingInfo(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-slate-700">Contact / Conveners Line</Label>
              <Input
                placeholder="e.g. R.K. Sharma (9876543210), Sunita Devi (9811122233)"
                value={spokespersonContact}
                onChange={e => setSpokespersonContact(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs h-9 gap-1.5 shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Generating Print Layouts...' : 'Generate Parcha & Signature Sheet'}</span>
            </Button>
          </form>
        </div>

        {/* Right: Print Preview & Outputs */}
        <div className="lg:col-span-7 space-y-4">
          {parchaData ? (
            <div className="space-y-4">
              {/* Switch View Buttons */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveTab('parcha')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                      activeTab === 'parcha' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    1. Movement Parcha (पर्चा)
                  </button>
                  <button
                    onClick={() => setActiveTab('signature_sheet')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                      activeTab === 'signature_sheet' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    2. Signature Sheet (हस्ताक्षर पत्र)
                  </button>
                  <button
                    onClick={() => setActiveTab('whatsapp')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                      activeTab === 'whatsapp' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    3. WhatsApp Forward
                  </button>
                </div>

                {activeTab !== 'whatsapp' && (
                  <Button
                    size="sm"
                    onClick={() => window.print()}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs gap-1.5 h-8"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print (A4 Sheet)</span>
                  </Button>
                )}
              </div>

              {/* TAB 1: 1-PAGE PARCHA (High contrast black & white) */}
              {activeTab === 'parcha' && (
                <div className="bg-white border-2 border-black p-6 rounded-none font-sans text-black space-y-4 shadow-md max-w-xl mx-auto print:border-none print:shadow-none print:p-0">
                  {/* Top Banner Header */}
                  <div className="border-b-2 border-black pb-3 text-center space-y-1">
                    <span className="text-[11px] font-black uppercase tracking-widest block font-mono">
                      ★ {orgName.toUpperCase()} • {localityName.toUpperCase()} ★
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-tight">
                      {parchaData.mainBannerHeadingHi}
                    </h2>
                    <h3 className="text-sm font-black uppercase tracking-normal">
                      {parchaData.mainBannerHeadingEn}
                    </h3>
                  </div>

                  {/* Slogans */}
                  <div className="border-y border-black py-1.5 text-center font-bold text-xs italic">
                    &quot;{parchaData.slogans.join(' • ')}&quot;
                  </div>

                  {/* Grievance Statement */}
                  <div className="space-y-1 text-xs leading-relaxed">
                    <span className="font-bold uppercase text-[11px] block border-b border-dotted border-black pb-0.5">
                      साथियों व मोहल्ला वासियों (Dear Residents):
                    </span>
                    <p className="whitespace-pre-line pt-1 font-medium">{parchaData.problemStatementHi}</p>
                    <p className="whitespace-pre-line pt-1 text-[11px] text-neutral-800">{parchaData.problemStatementEn}</p>
                  </div>

                  {/* Demands Box */}
                  <div className="border-2 border-black p-3 bg-neutral-50 space-y-1 text-xs">
                    <span className="font-black uppercase text-xs block">
                      हमारी मुख्य मांगें (Our Core Demands):
                    </span>
                    <ol className="list-decimal pl-5 space-y-1 font-bold">
                      {parchaData.bulletedDemandsHi.map((demand, i) => (
                        <li key={i}>{demand}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Call to Action & Meeting Box */}
                  <div className="border-2 border-dashed border-black p-3 text-center space-y-1">
                    <span className="text-sm font-black uppercase block">
                      {parchaData.callToActionHi}
                    </span>
                    <div className="text-xs font-bold mt-1 bg-black text-white py-1 px-2">
                      📍 {rallyOrMeetingInfo}
                    </div>
                  </div>

                  {/* Footer with QR and Contacts */}
                  <div className="pt-2 border-t-2 border-black flex items-center justify-between gap-4 text-xs">
                    <div className="space-y-0.5 text-[11px]">
                      <div><strong>जारीकर्ता (Issued by):</strong> {orgName} ({localityName})</div>
                      <div><strong>संपर्क (Contact):</strong> {spokespersonContact || 'Colony Coordination Committee'}</div>
                      <div className="font-mono text-[10px] text-neutral-600">Scan QR to sign online & join WhatsApp updates</div>
                    </div>

                    <div className="shrink-0 text-center">
                      <QRCodeSVG value={publicJoinUrl} size={64} />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PHYSICAL SIGNATURE SHEET */}
              {activeTab === 'signature_sheet' && (
                <div className="bg-white border-2 border-black p-6 rounded-none font-sans text-black space-y-4 shadow-md max-w-xl mx-auto print:border-none print:shadow-none print:p-0">
                  <div className="border-b-2 border-black pb-2 text-center">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest block">
                      {orgName} • PHYSICAL RESIDENTS PETITION
                    </span>
                    <h2 className="text-lg font-black uppercase mt-1">
                      नागरिक हस्ताक्षर अभियान (Citizen Signature Drive)
                    </h2>
                    <p className="text-xs font-bold mt-0.5">
                      विषय: {issueTitle} ({localityName})
                    </p>
                  </div>

                  <p className="text-xs leading-relaxed border border-black p-2.5 font-medium">
                    {parchaData.signatureSheetPreambleHi}
                  </p>

                  {/* Signature Table */}
                  <div className="border border-black overflow-hidden">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-black bg-neutral-100 font-bold text-[11px]">
                          <th className="p-1.5 border-r border-black w-10 text-center">क्र.</th>
                          <th className="p-1.5 border-r border-black">निवासी का नाम (Name)</th>
                          <th className="p-1.5 border-r border-black w-24">मकान / फ्लैट नं.</th>
                          <th className="p-1.5 border-r border-black w-28">मोबाइल नंबर</th>
                          <th className="p-1.5 w-24 text-center">हस्ताक्षर (Sign)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(12)].map((_, i) => (
                          <tr key={i} className="border-b border-neutral-300 h-8">
                            <td className="p-1 border-r border-black text-center font-mono text-[10px]">{i + 1}</td>
                            <td className="p-1 border-r border-black"></td>
                            <td className="p-1 border-r border-black"></td>
                            <td className="p-1 border-r border-black"></td>
                            <td className="p-1"></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-1 font-mono">
                    <span>Sheet No: 01</span>
                    <span>Submit filled sheets to: {spokespersonContact}</span>
                  </div>
                </div>
              )}

              {/* TAB 3: WHATSAPP FORWARD */}
              {activeTab === 'whatsapp' && (
                <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900">WhatsApp Broadcast Message (Ready to forward)</h3>
                    <Button
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(parchaData.whatsappDistributionText)
                        toast.success('WhatsApp text copied!')
                      }}
                      className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </Button>
                  </div>

                  <Textarea
                    readOnly
                    rows={12}
                    value={parchaData.whatsappDistributionText}
                    className="text-xs font-mono bg-slate-50 leading-relaxed"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center border border-dashed border-slate-300 rounded-lg bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 mx-auto flex items-center justify-center">
                <Printer className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">Print Preview will appear here</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Fill the colony grievance form on the left to generate clean, high-contrast A4 leaflets and pen-and-paper signature sheets.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

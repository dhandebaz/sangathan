'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Printer, FileText, Sparkles, Building, CheckCircle2, Copy } from 'lucide-react'
import { toast } from 'sonner'

interface LetterheadClientProps {
  organisationId: string
  defaultOrgName: string
}

export default function LetterheadClient({ defaultOrgName }: LetterheadClientProps) {
  const [unionName, setUnionName] = useState(defaultOrgName || 'STUDENT UNION EXECUTIVE COUNCIL')
  const [tagline, setTagline] = useState('Recognized Apex Student Body • Central Campus Representation')
  const [refNumber, setRefNumber] = useState(`SU/REG/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`)
  const [letterDate, setLetterDate] = useState(new Date().toISOString().split('T')[0])
  const [recipient, setRecipient] = useState('To,\nThe Vice-Chancellor / Dean of Student Welfare,\nCentral Administration Building, Campus')
  const [subject, setSubject] = useState('MEMORANDUM REGARDING IMMEDIATE RESOLUTION OF HOSTEL MESS & SANITATION ISSUES')
  const [body, setBody] = useState(
`Respected Sir/Madam,

We, the elected representatives of the Student Union, wish to bring your urgent attention to the pressing student grievances regarding hostel mess quality, sanitation infrastructure, and library reading room hours.

Despite multiple oral representations, concrete action remains pending. We request an official delegation meeting within 48 hours to discuss the Action Taken Report (ATR).

Thanking you,

Yours sincerely,`
  )
  const [signatory1, setSignatory1] = useState('President, Student Union')
  const [signatory2, setSignatory2] = useState('General Secretary, Student Union')

  const handlePrint = () => {
    window.print()
  }

  const handleCopyText = () => {
    const text = `Ref: ${refNumber}\nDate: ${letterDate}\n\n${recipient}\n\nSubject: ${subject}\n\n${body}\n\n${signatory1}\n${signatory2}`
    navigator.clipboard.writeText(text)
    toast.success('Official Letterhead text copied to clipboard!')
  }

  return (
    <div className="space-y-8">
      {/* Top Banner (Hidden during print) */}
      <div className="print:hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white text-slate-900 p-6 rounded-sm border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Official Union Letterhead &amp; Printable PDF Exporter</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Format formal Gyapans, Press Releases, and RTI Applications into official print-ready letterheads.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-sm border border-slate-300 shadow-xs transition"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy Text
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-sm shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save Official PDF
          </button>
        </div>
      </div>

      {/* Editor Controls (Hidden during print) */}
      <Card className="print:hidden border shadow-md bg-white">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-slate-900 text-base flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Letterhead Customizer & Document Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Union Heading Title</label>
              <input
                type="text"
                value={unionName}
                onChange={e => setUnionName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Official Reference Number</label>
              <input
                type="text"
                value={refNumber}
                onChange={e => setRefNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Document Date</label>
              <input
                type="date"
                value={letterDate}
                onChange={e => setLetterDate(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Recipient Address Block</label>
              <textarea
                rows={3}
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Subject Line</label>
              <textarea
                rows={3}
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2.5 text-sm font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Letter Body Content</label>
            <textarea
              rows={6}
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Left Signatory Title</label>
              <input
                type="text"
                value={signatory1}
                onChange={e => setSignatory1(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Right Signatory Title</label>
              <input
                type="text"
                value={signatory2}
                onChange={e => setSignatory2(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Official Printable Letterhead Sheet */}
      <div className="bg-white p-8 sm:p-12 rounded-xl border border-slate-300 shadow-2xl max-w-4xl mx-auto print:shadow-none print:border-none print:p-0 print:m-0 text-slate-900 font-serif">
        {/* Letterhead Top Emblem & Header */}
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center font-bold text-lg font-sans bg-slate-100">
              SU
            </div>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase font-sans text-slate-900">
                {unionName}
              </h1>
              <p className="text-xs font-sans text-slate-600 tracking-wide mt-0.5">
                {tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Ref & Date Row */}
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

        {/* Letter Body */}
        <div className="mb-12 whitespace-pre-line text-sm leading-relaxed text-slate-900 font-sans">
          {body}
        </div>

        {/* Official Stamp & Signatures */}
        <div className="grid grid-cols-2 gap-8 pt-12 border-t border-slate-300 font-sans text-xs">
          <div className="text-center">
            <div className="h-16 flex items-center justify-center italic text-slate-400 font-serif">
              [Official Signature & Seal]
            </div>
            <p className="font-bold border-t pt-1 uppercase text-slate-900">{signatory1}</p>
            <p className="text-[10px] text-slate-500">{unionName}</p>
          </div>

          <div className="text-center">
            <div className="h-16 flex items-center justify-center italic text-slate-400 font-serif">
              [Official Signature & Seal]
            </div>
            <p className="font-bold border-t pt-1 uppercase text-slate-900">{signatory2}</p>
            <p className="text-[10px] text-slate-500">{unionName}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

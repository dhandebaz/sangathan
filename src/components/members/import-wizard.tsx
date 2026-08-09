'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { bulkImportMembers } from '@/actions/members/import'
import { toast } from 'sonner'
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Users,
  ShieldCheck
} from 'lucide-react'

interface ImportWizardProps {
  lang: string
  orgType?: string
  remainingCapacity?: number
}

type ColumnMapping = {
  full_name: number
  phone: number
  email: number
  designation: number
  area: number
  role: number
  notes: number
}

export function ImportWizard({ lang, orgType = 'ngo', remainingCapacity = 1000 }: ImportWizardProps) {
  const router = useRouter()
  const isHindi = lang === 'hi'

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [rawText, setRawText] = useState('')
  const [fileName, setFileName] = useState('')
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([])
  const [parsedRows, setParsedRows] = useState<string[][]>([])
  const [mapping, setMapping] = useState<ColumnMapping>({
    full_name: -1,
    phone: -1,
    email: -1,
    designation: -1,
    area: -1,
    role: -1,
    notes: -1,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resultSummary, setResultSummary] = useState<{
    insertedCount: number
    skippedCount: number
    skippedDetails?: string[]
  } | null>(null)

  function parseCsvString(text: string) {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    if (lines.length === 0) return { headers: [], rows: [] }

    // Simple CSV parser supporting comma and tab delimiters
    const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ','
    const parsed = lines.map((line) =>
      line
        .split(delimiter)
        .map((cell) => cell.replace(/^["']|["']$/g, '').trim())
    )

    const headers = parsed[0]
    const rows = parsed.slice(1)
    return { headers, rows }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = (event.target?.result as string) || ''
      setRawText(content)
      processRawData(content)
    }
    reader.readAsText(file)
  }

  function handlePasteProcess() {
    if (!rawText.trim()) {
      toast.error(isHindi ? 'कृपया CSV डेटा पेस्ट करें' : 'Please paste CSV data')
      return
    }
    processRawData(rawText)
  }

  function processRawData(content: string) {
    const { headers, rows } = parseCsvString(content)

    if (headers.length === 0 || rows.length === 0) {
      toast.error(isHindi ? 'अमान्य या खाली डेटा' : 'Invalid or empty CSV data')
      return
    }

    setParsedHeaders(headers)
    setParsedRows(rows)

    // Auto-detect columns intelligently
    const newMapping: ColumnMapping = {
      full_name: -1,
      phone: -1,
      email: -1,
      designation: -1,
      area: -1,
      role: -1,
      notes: -1,
    }

    headers.forEach((h, idx) => {
      const norm = h.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (norm.includes('name') || norm.includes('naam') || norm.includes('member')) {
        if (newMapping.full_name === -1) newMapping.full_name = idx
      } else if (norm.includes('phone') || norm.includes('mobile') || norm.includes('contact') || norm.includes('tel') || norm.includes('whatsapp')) {
        if (newMapping.phone === -1) newMapping.phone = idx
      } else if (norm.includes('email') || norm.includes('mail')) {
        if (newMapping.email === -1) newMapping.email = idx
      } else if (norm.includes('designation') || norm.includes('post') || norm.includes('pad') || norm.includes('title')) {
        if (newMapping.designation === -1) newMapping.designation = idx
      } else if (norm.includes('area') || norm.includes('flat') || norm.includes('hostel') || norm.includes('unit') || norm.includes('wing') || norm.includes('tower')) {
        if (newMapping.area === -1) newMapping.area = idx
      } else if (norm.includes('role') || norm.includes('type')) {
        if (newMapping.role === -1) newMapping.role = idx
      } else if (norm.includes('note') || norm.includes('comment') || norm.includes('remark')) {
        if (newMapping.notes === -1) newMapping.notes = idx
      }
    })

    setMapping(newMapping)
    setStep(2)
  }

  function handleContinueToValidation() {
    if (mapping.full_name === -1 || mapping.phone === -1) {
      toast.error(
        isHindi
          ? 'नाम (Name) और फ़ोन (Phone) कॉलम मैप करना अनिवार्य है'
          : 'Full Name and Phone columns are required for import'
      )
      return
    }
    setStep(3)
  }

  async function handleExecuteImport() {
    setIsSubmitting(true)

    const payloadMembers = parsedRows.map((r) => {
      const name = mapping.full_name !== -1 ? r[mapping.full_name] : ''
      const phone = mapping.phone !== -1 ? r[mapping.phone] : ''
      const email = mapping.email !== -1 ? r[mapping.email] : ''
      const designation = mapping.designation !== -1 ? r[mapping.designation] : ''
      const area = mapping.area !== -1 ? r[mapping.area] : ''
      const roleRaw = mapping.role !== -1 ? r[mapping.role]?.toLowerCase() : 'member'
      const notes = mapping.notes !== -1 ? r[mapping.notes] : ''

      const role: 'admin' | 'editor' | 'viewer' | 'member' =
        roleRaw === 'admin' || roleRaw === 'editor' || roleRaw === 'viewer' ? roleRaw : 'member'

      return {
        full_name: name || 'Unnamed Member',
        phone: phone || '',
        email: email || undefined,
        designation: designation || undefined,
        area: area || undefined,
        role,
        status: 'active' as const,
        notes: notes || undefined,
      }
    }).filter((m) => m.phone.trim().length >= 5)

    if (payloadMembers.length === 0) {
      setIsSubmitting(false)
      toast.error(isHindi ? 'कोई मान्य पंक्ति नहीं मिली' : 'No valid member rows found with valid phone numbers')
      return
    }

    const res = await bulkImportMembers({ members: payloadMembers })
    setIsSubmitting(false)

    if (res.success && res.data) {
      setResultSummary({
        insertedCount: res.data.insertedCount || 0,
        skippedCount: res.data.skippedCount || 0,
        skippedDetails: res.data.skippedDetails,
      })
      setStep(4)
      toast.success(
        isHindi
          ? `${res.data.insertedCount} सदस्य सफलतापूर्वक आयात किए गए!`
          : `Successfully imported ${res.data.insertedCount} members!`
      )
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to import members')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700 mb-1">
          <FileSpreadsheet className="w-4 h-4" />
          {isHindi ? 'यूनिवर्सल डेटा आयातक' : 'Universal Data Importer & Migration Wizard'}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isHindi ? 'एक्सेल व सीएसवी से सदस्य आयात करें' : 'Import Members from Excel / CSV'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isHindi
            ? 'अपनी मौजूदा स्प्रेडशीट या गूगल शीट से सदस्यों, पदों, फ्लैट नंबरों और संपर्कों को 1 क्लिक में माइग्रेट करें।'
            : 'Migrate your existing rosters from Excel, Google Sheets, or CSV files into Sangathan with automated column auto-matching and deduplication.'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, label: isHindi ? '1. फाइल चुनें' : '1. Upload File' },
          { num: 2, label: isHindi ? '2. कॉलम मैच करें' : '2. Map Columns' },
          { num: 3, label: isHindi ? '3. पूर्वावलोकन' : '3. Validate' },
          { num: 4, label: isHindi ? '4. पूर्ण' : '4. Complete' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-3 rounded-xl border text-center transition-all ${
              step === s.num
                ? 'border-orange-600 bg-orange-50/50 text-orange-950 font-bold'
                : step > s.num
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900 font-semibold'
                : 'border-slate-200 bg-white text-slate-400 font-medium'
            }`}
          >
            <div className="text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* STEP 1: Upload or Paste */}
      {step === 1 && (
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">
              {isHindi ? 'चरण 1: अपनी स्प्रेडशीट फाइल अपलोड करें या डेटा पेस्ट करें' : 'Step 1: Upload Spreadsheet or Paste CSV Data'}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {isHindi
                ? 'समर्थित प्रारूप: .csv, .tsv या सीधे एक्सेल/गूगल शीट्स से कॉपी किया गया डेटा।'
                : 'Supported formats: .csv, .tsv, or tab-delimited text copied directly from Excel / Google Sheets.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Dropzone */}
            <div className="border-2 border-dashed border-slate-200 hover:border-orange-500 rounded-2xl p-8 text-center transition-all bg-slate-50/50 flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <Label htmlFor="csv-file" className="cursor-pointer font-bold text-sm text-orange-700 hover:underline">
                  {fileName ? fileName : isHindi ? 'फाइल चुनने के लिए क्लिक करें' : 'Click to browse and upload CSV'}
                </Label>
                <p className="text-xs text-slate-400 mt-1">
                  {isHindi ? 'अधिकतम 5,000 पंक्तियाँ प्रति बैच' : 'Up to 5,000 member rows per batch upload'}
                </p>
              </div>
              <input
                id="csv-file"
                type="file"
                accept=".csv,.txt,.tsv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase">
                {isHindi ? 'या सीधे टेक्स्ट पेस्ट करें' : 'OR PASTE RAW CSV / TABULAR TEXT'}
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">
                {isHindi ? 'CSV / स्प्रेडशीट टेक्स्ट' : 'Paste Rows Here'}
              </Label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Full Name, Phone, Email, Designation, Unit/Area&#10;Aarav Sharma, 9876543210, aarav@example.com, Coordinator, Wing A&#10;Fatima Khan, 9811223344, fatima@example.com, Member, Tower 2"
                rows={6}
                className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-600 leading-relaxed"
              />
            </div>

            <Button
              onClick={handlePasteProcess}
              className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
            >
              {isHindi ? 'डेटा प्रोसेस करें और आगे बढ़ें' : 'Process Data & Match Columns'}{' '}
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Column Mapping */}
      {step === 2 && (
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center justify-between">
              <span>{isHindi ? 'चरण 2: कॉलम फ़ील्ड मैच करें' : 'Step 2: Match Spreadsheet Columns'}</span>
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {parsedRows.length} {isHindi ? 'पंक्तियाँ पाई गईं' : 'rows detected'}
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {isHindi
                ? 'हमारे AI ने संभावित कॉलम का अनुमान लगाया है। कृपया सुनिश्चित करें कि नाम और फ़ोन सही हैं।'
                : 'Our column detector matched standard headers automatically. Verify or adjust the mappings below.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  {isHindi ? 'पूरा नाम (Full Name)' : 'Full Name'} <span className="text-red-500">*</span>
                </Label>
                <select
                  value={mapping.full_name}
                  onChange={(e) => setMapping({ ...mapping, full_name: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value={-1}>-- {isHindi ? 'कॉलम चुनें' : 'Select Column'} --</option>
                  {parsedHeaders.map((h, i) => (
                    <option key={i} value={i}>
                      {h} (Column {i + 1})
                    </option>
                  ))}
                </select>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  {isHindi ? 'फ़ोन नंबर / WhatsApp (Phone)' : 'Phone Number'} <span className="text-red-500">*</span>
                </Label>
                <select
                  value={mapping.phone}
                  onChange={(e) => setMapping({ ...mapping, phone: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value={-1}>-- {isHindi ? 'कॉलम चुनें' : 'Select Column'} --</option>
                  {parsedHeaders.map((h, i) => (
                    <option key={i} value={i}>
                      {h} (Column {i + 1})
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-900">
                  {isHindi ? 'ईमेल (Email - Optional)' : 'Email (Optional)'}
                </Label>
                <select
                  value={mapping.email}
                  onChange={(e) => setMapping({ ...mapping, email: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value={-1}>-- {isHindi ? 'छोड़ें / उपलब्ध नहीं' : 'Skip / Not present'} --</option>
                  {parsedHeaders.map((h, i) => (
                    <option key={i} value={i}>
                      {h} (Column {i + 1})
                    </option>
                  ))}
                </select>
              </div>

              {/* Designation */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-900">
                  {isHindi ? 'पद / शीर्षक (Designation / Title)' : 'Designation / Post'}
                </Label>
                <select
                  value={mapping.designation}
                  onChange={(e) => setMapping({ ...mapping, designation: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value={-1}>-- {isHindi ? 'छोड़ें / उपलब्ध नहीं' : 'Skip / Not present'} --</option>
                  {parsedHeaders.map((h, i) => (
                    <option key={i} value={i}>
                      {h} (Column {i + 1})
                    </option>
                  ))}
                </select>
              </div>

              {/* Area / Unit */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-900">
                  {isHindi ? 'फ्लैट / हॉस्टल / विंग (Area / Unit)' : 'Flat / Hostel / Unit / Wing'}
                </Label>
                <select
                  value={mapping.area}
                  onChange={(e) => setMapping({ ...mapping, area: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value={-1}>-- {isHindi ? 'छोड़ें / उपलब्ध नहीं' : 'Skip / Not present'} --</option>
                  {parsedHeaders.map((h, i) => (
                    <option key={i} value={i}>
                      {h} (Column {i + 1})
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-900">
                  {isHindi ? 'टिप्पणियां (Notes)' : 'Internal Notes'}
                </Label>
                <select
                  value={mapping.notes}
                  onChange={(e) => setMapping({ ...mapping, notes: Number(e.target.value) })}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value={-1}>-- {isHindi ? 'छोड़ें / उपलब्ध नहीं' : 'Skip / Not present'} --</option>
                  {parsedHeaders.map((h, i) => (
                    <option key={i} value={i}>
                      {h} (Column {i + 1})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Live 3-row sample preview */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">
                {isHindi ? 'नमूना पूर्वावलोकन (प्रथम 3 पंक्तियाँ)' : 'Sample Row Preview (First 3 Rows)'}
              </Label>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                    <tr>
                      <th className="p-2.5">Name</th>
                      <th className="p-2.5">Phone</th>
                      <th className="p-2.5">Email</th>
                      <th className="p-2.5">Designation</th>
                      <th className="p-2.5">Unit / Area</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.slice(0, 3).map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="p-2.5 font-medium text-slate-900">
                          {mapping.full_name !== -1 ? r[mapping.full_name] : '-'}
                        </td>
                        <td className="p-2.5 text-slate-600 font-mono">
                          {mapping.phone !== -1 ? r[mapping.phone] : '-'}
                        </td>
                        <td className="p-2.5 text-slate-500">
                          {mapping.email !== -1 ? r[mapping.email] : '-'}
                        </td>
                        <td className="p-2.5 text-slate-600">
                          {mapping.designation !== -1 ? r[mapping.designation] : '-'}
                        </td>
                        <td className="p-2.5 text-slate-600">
                          {mapping.area !== -1 ? r[mapping.area] : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> {isHindi ? 'पीछे' : 'Back'}
              </Button>
              <Button
                onClick={handleContinueToValidation}
                className="bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl"
              >
                {isHindi ? 'सत्यापन और पूर्वावलोकन' : 'Continue to Validation'}{' '}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: Validation Sandbox & Execution */}
      {step === 3 && (
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900">
              {isHindi ? 'चरण 3: आयात की पुष्टि करें' : 'Step 3: Confirm Batch Import'}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {isHindi
                ? 'डुप्लीकेट फ़ोन नंबर और ईमेल स्वचालित रूप से छोड़ दिए जाएंगे।'
                : 'Deduplication engine is active. Any phone numbers or emails already present in your organisation will be skipped safely.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="text-2xl font-extrabold text-slate-900">{parsedRows.length}</div>
                <div className="text-xs text-slate-500 font-medium">{isHindi ? 'कुल पंक्तियाँ' : 'Total Rows in File'}</div>
              </div>
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <div className="text-2xl font-extrabold text-emerald-700">
                  {parsedRows.filter((r) => mapping.phone !== -1 && r[mapping.phone]?.trim().length >= 5).length}
                </div>
                <div className="text-xs text-emerald-800 font-medium">{isHindi ? 'मान्य फ़ोन नंबर' : 'Ready for Insertion'}</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="text-2xl font-extrabold text-orange-700">{remainingCapacity}</div>
                <div className="text-xs text-slate-500 font-medium">{isHindi ? 'शेष क्षमता स्लॉट' : 'Plan Capacity Slots'}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 text-blue-900 text-xs flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong>{isHindi ? 'सुरक्षित व अपरिवर्तनीय ऑडिट ट्रेल:' : 'Audit-Ready Guarantee:'}</strong>{' '}
                {isHindi
                  ? 'सभी रिकॉर्ड्स संस्थागत डेटा अलगाव (RLS) के तहत आयात किए जाएंगे और गतिविधि लॉग में सुरक्षित रहेंगे।'
                  : 'All imported records are cryptographically isolated under your organisation ID with an immutable audit log entry.'}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setStep(2)}
                className="text-xs font-bold text-slate-700"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> {isHindi ? 'कॉलम बदलें' : 'Adjust Columns'}
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={handleExecuteImport}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm"
              >
                {isSubmitting
                  ? isHindi
                    ? 'आयात किया जा रहा है...'
                    : 'Importing Batch...'
                  : isHindi
                  ? `अब ${parsedRows.length} सदस्य आयात करें`
                  : `Start Import (${parsedRows.length} Members)`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 4: Success & Summary */}
      {step === 4 && resultSummary && (
        <Card className="border border-emerald-200 shadow-sm bg-white">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-900">
              {isHindi ? 'आयात सफलतापूर्वक पूरा हुआ!' : 'Import Completed Successfully!'}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {isHindi ? 'आपके नए सदस्य अब सक्रिय रजिस्ट्री में उपलब्ध हैं।' : 'Your member registry has been updated.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                <div className="text-3xl font-black text-emerald-700">{resultSummary.insertedCount}</div>
                <div className="text-xs font-semibold text-emerald-900 mt-1">
                  {isHindi ? 'नए सदस्य जोड़े गए' : 'New Members Added'}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-3xl font-black text-slate-600">{resultSummary.skippedCount}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">
                  {isHindi ? 'डुप्लिकेट छोड़े गए' : 'Duplicates Skipped'}
                </div>
              </div>
            </div>

            {resultSummary.skippedDetails && resultSummary.skippedDetails.length > 0 && (
              <div className="text-left text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-700 mb-1">
                  {isHindi ? 'छोड़े गए रिकॉर्ड (डुप्लिकेट्स):' : 'Skipped Duplicate Records:'}
                </p>
                <ul className="list-disc list-inside text-slate-500 space-y-0.5">
                  {resultSummary.skippedDetails.map((detail, idx) => (
                    <li key={idx} className="truncate">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStep(1)
                  setRawText('')
                  setFileName('')
                  setParsedRows([])
                }}
                className="text-xs font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                {isHindi ? 'एक और फाइल आयात करें' : 'Import Another File'}
              </Button>
              <Button
                onClick={() => router.push(`/${lang}/dashboard/members`)}
                className="bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold px-6 rounded-xl"
              >
                {isHindi ? 'सदस्य रजिस्ट्री खोलें' : 'View Member Registry'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

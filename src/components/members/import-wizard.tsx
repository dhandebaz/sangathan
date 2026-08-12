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
  ShieldCheck,
  Globe,
  Contact,
  Loader2,
  ExternalLink
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

type SourceType = 'csv' | 'google_sheets' | 'google_contacts' | 'live_google_contacts'

export function ImportWizard({ lang, orgType = 'ngo', remainingCapacity = 1000 }: ImportWizardProps) {
  const router = useRouter()
  const isHindi = lang === 'hi'

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [sourceType, setSourceType] = useState<SourceType>('csv')
  const [rawText, setRawText] = useState('')
  const [fileName, setFileName] = useState('')
  const [googleSheetUrl, setGoogleSheetUrl] = useState('')
  const [isLoadingGoogleContacts, setIsLoadingGoogleContacts] = useState(false)
  const [googleContacts, setGoogleContacts] = useState<Array<{ name: string; email: string; phone: string; organization: string; title: string }>>([])
  const [selectedGoogleContacts, setSelectedGoogleContacts] = useState<Set<number>>(new Set())
  const [googleContactsError, setGoogleContactsError] = useState<string | null>(null)
  const [needsGoogleConsent, setNeedsGoogleConsent] = useState(false)
  const [isFetchingSheet, setIsFetchingSheet] = useState(false)
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

    // CSV parser with delimiter & quote support
    const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ','
    const parsed = lines.map((line) => {
      const row: string[] = []
      let inQuotes = false
      let currentCell = ''

      for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (char === '"' || char === "'") {
          inQuotes = !inQuotes
        } else if (char === delimiter && !inQuotes) {
          row.push(currentCell.trim())
          currentCell = ''
        } else {
          currentCell += char
        }
      }
      row.push(currentCell.trim())
      return row.map((cell) => cell.replace(/^["']|["']$/g, '').trim())
    })

    const headers = parsed[0]
    const rows = parsed.slice(1).filter((r) => r.some((c) => c.length > 0))
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

  async function handleFetchGoogleSheet() {
    if (!googleSheetUrl.trim()) {
      toast.error(isHindi ? 'कृपया Google Sheet का URL दर्ज करें' : 'Please enter a Google Sheet URL')
      return
    }

    try {
      setIsFetchingSheet(true)
      const res = await fetch('/api/import/google-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl: googleSheetUrl.trim() }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch Google Sheet')
      }

      setRawText(data.csvContent)
      setFileName('Google Sheet (Live Sync)')
      toast.success(isHindi ? 'Google Sheet सफलतापूर्वक लोड हो गई!' : 'Google Sheet loaded successfully!')
      processRawData(data.csvContent)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Could not fetch Google Sheet')
    } finally {
      setIsFetchingSheet(false)
    }
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
      if (norm.includes('name') || norm.includes('naam') || norm.includes('member') || norm.includes('givenname') || norm.includes('firstname')) {
        if (newMapping.full_name === -1) newMapping.full_name = idx
      } else if (norm.includes('phone') || norm.includes('mobile') || norm.includes('contact') || norm.includes('tel') || norm.includes('whatsapp') || norm.includes('phonenumber')) {
        if (newMapping.phone === -1) newMapping.phone = idx
      } else if (norm.includes('email') || norm.includes('mail') || norm.includes('e-mail')) {
        if (newMapping.email === -1) newMapping.email = idx
      } else if (norm.includes('designation') || norm.includes('post') || norm.includes('pad') || norm.includes('title') || norm.includes('job') || norm.includes('role')) {
        if (newMapping.designation === -1) newMapping.designation = idx
      } else if (norm.includes('area') || norm.includes('flat') || norm.includes('hostel') || norm.includes('unit') || norm.includes('wing') || norm.includes('tower') || norm.includes('address') || norm.includes('city')) {
        if (newMapping.area === -1) newMapping.area = idx
      } else if (norm.includes('role') || norm.includes('type')) {
        if (newMapping.role === -1) newMapping.role = idx
      } else if (norm.includes('note') || norm.includes('comment') || norm.includes('remark') || norm.includes('description')) {
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

  async function handleRequestGoogleConsent() {
    // Re-auth with Google requesting contacts scope
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
        scopes: 'https://www.googleapis.com/auth/contacts.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  }

  async function handleFetchGoogleContacts() {
    setIsLoadingGoogleContacts(true)
    setGoogleContactsError(null)
    setNeedsGoogleConsent(false)
    
    try {
      const res = await fetch('/api/import/google-contacts')
      const data = await res.json()
      
      if (!res.ok) {
        if (data.needsConsent) {
          setNeedsGoogleConsent(true)
          setGoogleContactsError(isHindi ? 'Google Contacts का अधिकार दें। नीचे बटन दबाएं।' : 'Please grant Google Contacts permission first.')
        } else {
          setGoogleContactsError(data.error || 'Failed to load contacts')
        }
        return
      }
      
      setGoogleContacts(data.contacts || [])
      // Select all by default
      setSelectedGoogleContacts(new Set((data.contacts || []).map((_: any, i: number) => i)))
      toast.success(isHindi ? `${data.totalCount} Google Contacts मिले!` : `Found ${data.totalCount} Google Contacts!`)
    } catch (err: unknown) {
      setGoogleContactsError(err instanceof Error ? err.message : 'Failed to connect to Google')
    } finally {
      setIsLoadingGoogleContacts(false)
    }
  }

  async function handleImportSelectedGoogleContacts() {
    setIsSubmitting(true)
    
    const selected = googleContacts.filter((_, i) => selectedGoogleContacts.has(i))
    const payloadMembers = selected
      .map((c) => ({
        full_name: c.name || 'Unnamed Contact',
        phone: c.phone || '',
        email: c.email || undefined,
        designation: c.title || undefined,
        area: c.organization || undefined,
        role: 'member' as const,
        status: 'active' as const,
      }))
      .filter((m) => m.phone.trim().length >= 5 || (m.email && m.email.length > 0))
    
    if (payloadMembers.length === 0) {
      setIsSubmitting(false)
      toast.error(isHindi ? 'कोई मान्य संपर्क नहीं (फ़ोन 5+ अंक आवश्यक)' : 'No valid contacts found (phone must be 5+ digits)')
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
      toast.success(isHindi ? `${res.data.insertedCount} सदस्य Google Contacts से आयात!` : `Imported ${res.data.insertedCount} members from Google Contacts!`)
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to import')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700 mb-1">
          <FileSpreadsheet className="w-4 h-4" />
          {isHindi ? 'यूनिवर्सल डेटा व गूगल माइग्रेशन हब' : 'Universal Data & Google Workspace Migration Hub'}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {isHindi ? 'सदस्य व संपर्क आयात करें' : 'Import Members & Contacts'}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isHindi
            ? 'अपनी मौजूदा एक्सेल शीट, गूगल शीट या गूगल कॉन्टैक्ट्स से सदस्यों, पदों और संपर्कों को सुरक्षित रूप से माइग्रेट करें।'
            : 'Migrate your existing rosters from CSV/Excel files, live Google Sheets, or Google Contacts into Sangathan with automated column matching and deduplication.'}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, label: isHindi ? '1. स्रोत चुनें' : '1. Select Source' },
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

      {/* STEP 1: Source Selection (CSV / Google Sheets / Google Contacts) */}
      {step === 1 && (
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3 mb-2">
              <button
                type="button"
                onClick={() => setSourceType('csv')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  sourceType === 'csv'
                    ? 'bg-orange-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                {isHindi ? 'CSV / Excel फाइल' : 'CSV / Excel Upload'}
              </button>

              <button
                type="button"
                onClick={() => setSourceType('google_sheets')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  sourceType === 'google_sheets'
                    ? 'bg-orange-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                {isHindi ? 'Google Sheets लिंक' : 'Google Sheets Link'}
              </button>

              <button
                type="button"
                onClick={() => setSourceType('google_contacts')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  sourceType === 'google_contacts'
                    ? 'bg-orange-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Contact className="w-3.5 h-3.5" />
                {isHindi ? 'Google Contacts / vCard' : 'Google Contacts / Export'}
              </button>

              <button
                type="button"
                onClick={() => setSourceType('live_google_contacts')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  sourceType === 'live_google_contacts'
                    ? 'bg-orange-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isHindi ? 'Live Google Contacts API' : 'Live Google Contacts'}
              </button>
            </div>

            <CardTitle className="text-lg font-bold text-slate-900">
              {sourceType === 'csv' && (isHindi ? 'विकल्प A: CSV / एक्सेल फाइल अपलोड या पेस्ट करें' : 'Option A: Upload Spreadsheet or Paste CSV')}
              {sourceType === 'google_sheets' && (isHindi ? 'विकल्प B: सीधे Google Sheet से आयात करें' : 'Option B: Import Directly from Google Sheets')}
              {sourceType === 'google_contacts' && (isHindi ? 'विकल्प C: Google Contacts / vCard से आयात करें' : 'Option C: Import from Google Contacts / vCard')}
              {sourceType === 'live_google_contacts' && (isHindi ? 'विकल्प D: Google API से सीधे संपर्क लाएं' : 'Option D: Fetch Contacts via Google API')}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {sourceType === 'csv' && (isHindi ? 'समर्थित प्रारूप: .csv, .tsv या सीधे एक्सेल से कॉपी किया गया टेक्स्ट।' : 'Supported formats: .csv, .tsv, or tab-delimited text copied directly from Excel / Sheets.')}
              {sourceType === 'google_sheets' && (isHindi ? 'अपनी Google Sheet का लिंक पेस्ट करें (सुनिश्चित करें कि Sharing "Anyone with link can view" पर सेट हो)।' : 'Paste your Google Sheet link (ensure sharing is set to "Anyone with link can view").')}
              {sourceType === 'google_contacts' && (isHindi ? 'Google Contacts (contacts.google.com) से Export की गई CSV या vCard का डेटा पेस्ट करें।' : 'Export CSV from Google Contacts (contacts.google.com -> Export -> Google CSV) and upload or paste below.')}
              {sourceType === 'live_google_contacts' && (isHindi ? 'आपके Google खाते से सीधे संपर्कों को एक क्लिक में आयात करें। कोई CSV फ़ाइल डाउनलोड करने की ज़रूरत नहीं।' : 'Import contacts directly from your Google account with a single click. No CSV file download needed.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* SOURCE: CSV File Dropzone & Paste */}
            {sourceType === 'csv' && (
              <>
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
              </>
            )}

            {/* SOURCE: Google Sheets URL Fetch */}
            {sourceType === 'google_sheets' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 text-xs text-blue-900 leading-relaxed">
                  <p className="font-bold mb-1">{isHindi ? 'Google Sheet कैसे कनेक्ट करें:' : 'How to connect your Google Sheet:'}</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600">
                    <li>Open your Google Sheet $\rightarrow$ Click <strong>Share</strong> (top right).</li>
                    <li>Change General access to <strong>"Anyone with the link can view"</strong>.</li>
                    <li>Copy the sheet URL and paste it below.</li>
                  </ol>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">
                    {isHindi ? 'Google Sheet URL' : 'Google Sheet URL'}
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                    value={googleSheetUrl}
                    onChange={(e) => setGoogleSheetUrl(e.target.value)}
                    className="text-xs font-mono"
                  />
                </div>

                <Button
                  onClick={handleFetchGoogleSheet}
                  disabled={isFetchingSheet}
                  className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
                >
                  {isFetchingSheet ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isHindi ? 'Google Sheet लोड हो रही है...' : 'Fetching Google Sheet Data...'}
                    </>
                  ) : (
                    <>
                      {isHindi ? 'Google Sheet फेच करें और आगे बढ़ें' : 'Fetch Sheet & Match Columns'}{' '}
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* SOURCE: Google Contacts / vCard */}
            {sourceType === 'google_contacts' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-600 leading-relaxed">
                  <p className="font-bold text-slate-800 mb-1">{isHindi ? 'Google Contacts एक्सपोर्ट गाइड:' : 'Google Contacts Export Guide:'}</p>
                  <p>
                    Go to{' '}
                    <a
                      href="https://contacts.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-700 font-bold underline inline-flex items-center gap-1"
                    >
                      contacts.google.com <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    $\rightarrow$ click <strong>Export</strong> $\rightarrow$ select <strong>"Google CSV"</strong>. Then drop that file or paste its contents below.
                  </p>
                </div>

                <div className="border-2 border-dashed border-slate-200 hover:border-orange-500 rounded-2xl p-6 text-center transition-all bg-white flex flex-col items-center justify-center gap-2">
                  <Contact className="w-8 h-8 text-orange-700" />
                  <Label htmlFor="contacts-csv-file" className="cursor-pointer font-bold text-xs text-orange-700 hover:underline">
                    {fileName ? fileName : isHindi ? 'Google Contacts CSV अपलोड करें' : 'Upload Google Contacts .CSV'}
                  </Label>
                  <input
                    id="contacts-csv-file"
                    type="file"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">
                    {isHindi ? 'या Contacts CSV का डेटा यहाँ पेस्ट करें' : 'Or Paste Contacts CSV Data'}
                  </Label>
                  <textarea
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Name,Given Name,Family Name,E-mail 1 - Value,Phone 1 - Value,Organization 1 - Title&#10;Dr. Ambedkar,Ambedkar,Dr,ambedkar@org.in,+919876543210,Chief Patron"
                    rows={4}
                    className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-600 leading-relaxed"
                  />
                </div>

                <Button
                  onClick={handlePasteProcess}
                  className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
                >
                  {isHindi ? 'Contacts प्रोसेस करें' : 'Process Contacts & Match Columns'}{' '}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            )}

            {/* SOURCE: Live Google Contacts API */}
            {sourceType === 'live_google_contacts' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-xs text-emerald-900 leading-relaxed">
                  <p className="font-bold mb-1">{isHindi ? 'Google Contacts API से सीधे आयात' : 'Import Directly from Google Contacts API'}</p>
                  <p className="text-slate-600">
                    {isHindi
                      ? 'एक क्लिक में अपने Google खाते के सभी संपर्कों को सीधे खींचें। कोई CSV डाउनलोड ज़रूरी नहीं!'
                      : 'Pull all your contacts directly from Google with one click. No CSV download required!'}
                  </p>
                </div>

                {googleContactsError && (
                  <div className="p-3 rounded-xl border border-red-200 bg-red-50/50 text-xs text-red-800">
                    {googleContactsError}
                  </div>
                )}

                {needsGoogleConsent ? (
                  <Button
                    onClick={handleRequestGoogleConsent}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-sm"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    {isHindi ? 'Google Contacts का अधिकार दें' : 'Grant Google Contacts Permission'}
                  </Button>
                ) : googleContacts.length === 0 ? (
                  <Button
                    onClick={handleFetchGoogleContacts}
                    disabled={isLoadingGoogleContacts}
                    className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-3 rounded-xl text-sm"
                  >
                    {isLoadingGoogleContacts ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isHindi ? 'Google Contacts लोड हो रहे हैं...' : 'Loading Google Contacts...'}</>
                    ) : (
                      <><Contact className="w-4 h-4 mr-2" />{isHindi ? 'मेरे Google Contacts लाएं' : 'Fetch My Google Contacts'}</>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-800">
                        {googleContacts.length} {isHindi ? 'संपर्क मिले' : 'contacts found'} — {selectedGoogleContacts.size} {isHindi ? 'चयनित' : 'selected'}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedGoogleContacts(new Set(googleContacts.map((_, i) => i)))}
                          className="text-xs text-orange-700 font-bold hover:underline"
                        >
                          {isHindi ? 'सभी चुनें' : 'Select All'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedGoogleContacts(new Set())}
                          className="text-xs text-slate-500 font-bold hover:underline"
                        >
                          {isHindi ? 'सभी हटाएं' : 'Deselect All'}
                        </button>
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                      {googleContacts.map((c, i) => (
                        <label
                          key={i}
                          className={`flex items-center gap-3 px-3 py-2.5 text-xs cursor-pointer transition-colors ${
                            selectedGoogleContacts.has(i) ? 'bg-orange-50/60' : 'bg-white hover:bg-slate-50'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedGoogleContacts.has(i)}
                            onChange={() => {
                              const next = new Set(selectedGoogleContacts)
                              if (next.has(i)) next.delete(i)
                              else next.add(i)
                              setSelectedGoogleContacts(next)
                            }}
                            className="w-3.5 h-3.5 text-orange-700 rounded border-slate-300"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-slate-900 truncate">{c.name || 'No Name'}</p>
                            <p className="text-slate-500 truncate">
                              {[c.phone, c.email, c.organization].filter(Boolean).join(' · ')}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                      <strong>{isHindi ? 'अगले चरण पर:' : 'On import:'}</strong>{' '}
                      {isHindi
                        ? 'चयनित संपर्क सीधे सदस्य सूची में जुड़ जाएंगे। डुप्लीकेट फ़ोन नंबर स्वतः छोड़ दिए जाएंगे।'
                        : 'Selected contacts will be added directly to your member directory. Duplicate phone numbers are auto-skipped.'}
                    </div>

                    <Button
                      onClick={handleImportSelectedGoogleContacts}
                      disabled={selectedGoogleContacts.size === 0 || isSubmitting}
                      className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-2.5 rounded-xl text-sm"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isHindi ? 'आयात हो रहा है...' : 'Importing...'}</>
                      ) : (
                        <>{isHindi ? `${selectedGoogleContacts.size} संपर्क आयात करें` : `Import ${selectedGoogleContacts.size} Contacts`} <ArrowRight className="w-4 h-4 ml-1.5" /></>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
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
                  setGoogleSheetUrl('')
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

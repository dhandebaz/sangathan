'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { importGoogleFormWithSubmissions } from '@/actions/forms/import-google-form'
import {
  FileText,
  Globe,
  Upload,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Users,
  RotateCcw,
  Sparkles,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Eye
} from 'lucide-react'
import Link from 'next/link'

interface GoogleFormImporterProps {
  lang: string
}

export function GoogleFormImporter({ lang }: GoogleFormImporterProps) {
  const router = useRouter()
  const isHindi = lang === 'hi'

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [sourceType, setSourceType] = useState<'sheets_url' | 'csv_paste' | 'file_upload' | 'google_api'>('sheets_url')
  const [googleFormUrl, setGoogleFormUrl] = useState('')
  const [isFetchingGoogleForm, setIsFetchingGoogleForm] = useState(false)
  const [googleFormData, setGoogleFormData] = useState<{
    formTitle: string
    formDescription: string
    fields: any[]
    responses: Array<{ data: Record<string, any>; submittedAt: string }>
    totalResponses: number
  } | null>(null)
  const [needsGoogleConsent, setNeedsGoogleConsent] = useState(false)
  const [googleApiError, setGoogleApiError] = useState<string | null>(null)
  const [sheetUrl, setSheetUrl] = useState('')
  const [rawData, setRawData] = useState('')
  const [fileName, setFileName] = useState('')
  const [isFetchingSheet, setIsFetchingSheet] = useState(false)

  // Form metadata
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'members' | 'private'>('public')
  const [importAsMembers, setImportAsMembers] = useState(false)
  const [memberRole, setMemberRole] = useState<'member' | 'viewer' | 'editor'>('member')

  // Analyzed fields
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([])
  const [detectedRowsCount, setDetectedRowsCount] = useState(0)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resultData, setResultData] = useState<{
    formId?: string
    fieldsCount?: number
    submissionsCount?: number
    membersImportResult?: { insertedCount?: number; skippedCount?: number }
  } | null>(null)

  function parsePreview(content: string) {
    const lines = content.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0)
    if (lines.length === 0) return

    const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ','
    const headers = lines[0].split(delimiter).map((h) => h.replace(/^["']|["']$/g, '').trim())
    const rows = lines.slice(1).filter((r) => r.length > 0)

    setDetectedHeaders(headers)
    setDetectedRowsCount(rows.length)
  }

  async function handleRequestFormsConsent() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
        scopes: 'https://www.googleapis.com/auth/forms.body.readonly https://www.googleapis.com/auth/forms.responses.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  }

  async function handleFetchGoogleForm() {
    if (!googleFormUrl.trim()) {
      toast.error(isHindi ? 'कृपया Google Form URL दर्ज करें' : 'Please enter a Google Form URL')
      return
    }
    
    setIsFetchingGoogleForm(true)
    setGoogleApiError(null)
    setNeedsGoogleConsent(false)
    
    try {
      const res = await fetch('/api/import/google-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formUrl: googleFormUrl.trim() }),
      })
      const data = await res.json()
      
      if (!res.ok) {
        if (data.needsConsent) {
          setNeedsGoogleConsent(true)
          setGoogleApiError(isHindi ? 'Google Forms का अधिकार दें।' : 'Please grant Google Forms permission.')
        } else {
          setGoogleApiError(data.error || 'Failed to fetch form')
        }
        return
      }
      
      setGoogleFormData(data)
      setTitle(data.formTitle || '')
      setDescription(data.formDescription || '')
      setDetectedHeaders(data.fields.map((f: any) => f.label))
      setDetectedRowsCount(data.totalResponses)
      toast.success(isHindi ? `${data.fields.length} प्रश्न और ${data.totalResponses} उत्तर मिले!` : `Found ${data.fields.length} questions and ${data.totalResponses} responses!`)
      setStep(2)
    } catch (err: unknown) {
      setGoogleApiError(err instanceof Error ? err.message : 'Failed to connect')
    } finally {
      setIsFetchingGoogleForm(false)
    }
  }

  async function handleSubmitGoogleApiForm() {
    if (!googleFormData) return
    setIsSubmitting(true)
    
    const headers = googleFormData.fields.map((f: any) => f.label)
    const rows = googleFormData.responses.map(r =>
      googleFormData.fields.map((f: any) => r.data[f.id] || '')
    )
    const csvLines = [headers.join(','), ...rows.map(r => r.map((c: any) => `"${String(c).replace(/"/g, '""')}"`).join(','))]
    const csvContent = csvLines.join('\n')
    
    const res = await importGoogleFormWithSubmissions({
      title: title || googleFormData.formTitle,
      description: description || googleFormData.formDescription || undefined,
      visibility,
      rawData: csvContent,
      importAsMembers,
      defaultMemberRole: memberRole,
    })
    
    setIsSubmitting(false)
    if (res.success && res.data) {
      setResultData(res.data)
      setStep(3)
      toast.success(isHindi ? 'Google Form सफलतापूर्वक आयात हुआ!' : 'Google Form imported successfully!')
      router.refresh()
    } else {
      toast.error(res.error || 'Failed')
    }
  }

  async function handleFetchGoogleSheet() {
    if (!sheetUrl.trim()) {
      toast.error(isHindi ? 'कृपया Google Sheet का URL दर्ज करें' : 'Please enter a Google Sheet URL')
      return
    }

    try {
      setIsFetchingSheet(true)
      const res = await fetch('/api/import/google-sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl: sheetUrl.trim() }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch Google Sheet')
      }

      setRawData(data.csvContent)
      parsePreview(data.csvContent)
      if (!title) {
        setTitle('Imported Google Form / Survey')
      }
      toast.success(isHindi ? 'Google Sheet डेटा प्राप्त हुआ!' : 'Google Sheet data retrieved!')
      setStep(2)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to fetch Google Sheet')
    } finally {
      setIsFetchingSheet(false)
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '))
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = (event.target?.result as string) || ''
      setRawData(content)
      parsePreview(content)
      setStep(2)
    }
    reader.readAsText(file)
  }

  function handlePasteContinue() {
    if (!rawData.trim()) {
      toast.error(isHindi ? 'कृपया फॉर्म का डेटा पेस्ट करें' : 'Please paste Google Form response CSV data')
      return
    }
    parsePreview(rawData)
    if (!title) {
      setTitle('Imported Survey / Feedback Form')
    }
    setStep(2)
  }

  async function handleExecuteMigration() {
    if (!title.trim()) {
      toast.error(isHindi ? 'कृपया फॉर्म का शीर्षक दें' : 'Please provide a Form Title')
      return
    }

    try {
      setIsSubmitting(true)
      const res = await importGoogleFormWithSubmissions({
        title: title.trim(),
        description: description.trim() || undefined,
        visibility,
        rawData,
        importAsMembers,
        defaultMemberRole: memberRole,
      })

      if (res.success && res.data) {
        setResultData(res.data)
        setStep(3)
        toast.success(isHindi ? 'गूगल फॉर्म व सबमिशन सफलतापूर्वक माइग्रेट हो गए!' : 'Google Form & Submissions migrated successfully!')
      } else {
        toast.error(res.error || 'Failed to import form')
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Migration failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href={`/${lang}/dashboard/forms`} className="text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-700">
            <FileText className="w-4 h-4" />
            {isHindi ? 'गूगल फॉर्म्स व सर्वे माइग्रेटर' : 'Google Forms & Past Surveys Migrator'}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {isHindi ? 'पुराने Google Forms का डेटा माइग्रेट करें' : 'Import Google Forms & Historical Responses'}
          </h1>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        {isHindi
          ? 'अपने पुराने Google Forms और सर्वे रिस्पॉन्स को संगठन में लाएं। यह अपने आप फॉर्म फील्ड्स बनाएगा और सारे पिछले सबमिशन को डेटाबेस में हमेशा के लिए सुरक्षित रखेगा।'
          : 'Migrate your legacy Google Forms and survey responses into Sangathan. Automatically generates matching form fields and ingests past responses for ongoing analytics and member conversion.'}
      </p>

      {/* STEP 1: Select Data Source */}
      {step === 1 && (
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3 mb-2">
              <button
                type="button"
                onClick={() => setSourceType('sheets_url')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  sourceType === 'sheets_url'
                    ? 'bg-orange-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                {isHindi ? 'Google Sheet रिस्पॉन्स लिंक' : 'Google Sheets Response Link'}
              </button>

              <button
                type="button"
                onClick={() => setSourceType('file_upload')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  sourceType === 'file_upload'
                    ? 'bg-orange-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                {isHindi ? 'CSV फाइल अपलोड' : 'Upload Form CSV (.csv)'}
              </button>

              <button
                type="button"
                onClick={() => setSourceType('csv_paste')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  sourceType === 'csv_paste'
                    ? 'bg-orange-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                {isHindi ? 'टेक्स्ट पेस्ट करें' : 'Paste Raw Response Text'}
              </button>

              <button
                type="button"
                onClick={() => setSourceType('google_api')}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  sourceType === 'google_api'
                    ? 'bg-orange-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isHindi ? 'Live Google Forms API' : 'Live Google Forms'}
              </button>
            </div>

            <CardTitle className="text-lg font-bold text-slate-900">
              {sourceType === 'sheets_url' && (isHindi ? 'Google Form से जुड़ी Sheet का लिंक दें' : 'Connect Google Form Linked Sheet')}
              {sourceType === 'file_upload' && (isHindi ? 'Google Form Responses CSV अपलोड करें' : 'Upload Google Form Response CSV')}
              {sourceType === 'csv_paste' && (isHindi ? 'Google Form का डेटा पेस्ट करें' : 'Paste Google Form Table Rows')}
              {sourceType === 'google_api' && (isHindi ? 'Live Google Form से कनेक्ट करें' : 'Connect Live Google Form')}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {isHindi
                ? 'Google Forms के "Responses" टैब में "Link to Sheets" या "Download responses (.csv)" पर क्लिक करके डेटा प्राप्त कर सकते हैं।'
                : 'In Google Forms, click "Responses" tab -> "Link to Sheets" or "Download responses (.csv)" to export your past survey data.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {sourceType === 'sheets_url' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">
                    {isHindi ? 'Google Sheet Response URL' : 'Google Sheet Response URL'}
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    className="text-xs font-mono"
                  />
                  <p className="text-[11px] text-slate-400">
                    {isHindi
                      ? 'सुनिश्चित करें कि Sheet की Sharing "Anyone with link can view" पर हो।'
                      : 'Ensure Google Sheet sharing is set to "Anyone with the link can view".'}
                  </p>
                </div>

                <Button
                  onClick={handleFetchGoogleSheet}
                  disabled={isFetchingSheet}
                  className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
                >
                  {isFetchingSheet ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isHindi ? 'डेटा लोड हो रहा है...' : 'Fetching Google Form Data...'}
                    </>
                  ) : (
                    <>
                      {isHindi ? 'डेटा लोड करें और संरचना देखें' : 'Fetch Responses & Preview Schema'}{' '}
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {sourceType === 'file_upload' && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 hover:border-orange-500 rounded-2xl p-8 text-center transition-all bg-slate-50/50 flex flex-col items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <Label htmlFor="form-csv-file" className="cursor-pointer font-bold text-sm text-orange-700 hover:underline">
                      {fileName ? fileName : isHindi ? 'Form CSV चुनने के लिए क्लिक करें' : 'Click to browse Form Responses CSV'}
                    </Label>
                  </div>
                  <input
                    id="form-csv-file"
                    type="file"
                    accept=".csv,.txt,.tsv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            )}

            {sourceType === 'csv_paste' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">
                    {isHindi ? 'Google Form CSV डेटा यहाँ पेस्ट करें' : 'Paste Google Form CSV Data'}
                  </Label>
                  <textarea
                    value={rawData}
                    onChange={(e) => setRawData(e.target.value)}
                    placeholder="Timestamp,Full Name,Phone Number,Area/Unit,Feedback,Volunteer Interest&#10;2026/05/10 10:15:00 AM,Pooja Verma,+919876543210,South Wing,Great initiative!,Yes&#10;2026/05/10 11:30:00 AM,Rahul Sharma,+919811223344,North Wing,Need more meetings,No"
                    rows={8}
                    className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-600 leading-relaxed"
                  />
                </div>

                <Button
                  onClick={handlePasteContinue}
                  className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
                >
                  {isHindi ? 'डेटा जांचें और आगे बढ़ें' : 'Validate & Configure Form'}{' '}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            )}

            {sourceType === 'google_api' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 text-xs text-emerald-900 leading-relaxed">
                  <p className="font-bold mb-1">{isHindi ? 'Google Forms API से सीधे आयात करें' : 'Import Directly from Google Forms API'}</p>
                  <p className="text-slate-600">
                    {isHindi
                      ? 'अपने Google Form का URL डालें — हम फ़ॉर्म की संरचना और सभी पिछले उत्तर स्वचालित रूप से खींच लेंगे।'
                      : 'Enter your Google Form URL — we\'ll automatically pull the form structure and all past responses.'}
                  </p>
                </div>

                {googleApiError && (
                  <div className="p-3 rounded-xl border border-red-200 bg-red-50/50 text-xs text-red-800">{googleApiError}</div>
                )}

                {needsGoogleConsent ? (
                  <Button
                    onClick={handleRequestFormsConsent}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 rounded-xl text-sm"
                  >
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    {isHindi ? 'Google Forms का अधिकार दें' : 'Grant Google Forms Permission'}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-700">{isHindi ? 'Google Form URL' : 'Google Form URL'}</Label>
                      <Input
                        type="url"
                        placeholder="https://docs.google.com/forms/d/1BxiMVs0XRA5n.../edit"
                        value={googleFormUrl}
                        onChange={(e) => setGoogleFormUrl(e.target.value)}
                        className="text-xs font-mono"
                      />
                    </div>
                    <Button
                      onClick={handleFetchGoogleForm}
                      disabled={isFetchingGoogleForm}
                      className="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-2.5 rounded-xl text-sm"
                    >
                      {isFetchingGoogleForm ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isHindi ? 'फ़ॉर्म लोड हो रहा है...' : 'Loading Form Structure...'}</>
                      ) : (
                        <>{isHindi ? 'फ़ॉर्म लाएं और आयात करें' : 'Fetch Form & Import'} <ArrowRight className="w-4 h-4 ml-1.5" /></>
                      )}
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* STEP 2: Configure Form & Preview Fields */}
      {step === 2 && (
        <Card className="border border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-900 flex items-center justify-between">
              <span>{isHindi ? 'चरण 2: फॉर्म सेटिंग्स और फील्ड पूर्वावलोकन' : 'Step 2: Form Configuration & Detected Questions'}</span>
              <span className="text-xs font-normal text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {detectedRowsCount} {isHindi ? 'पिछले रिस्पॉन्स मिले' : 'past submissions detected'}
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {isHindi
                ? 'संगठन में नया फॉर्म बनाने के लिए शीर्षक और विवरण दर्ज करें।'
                : 'Configure how this form and its past submissions will appear in your organisation dashboard.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-900">
                  {isHindi ? 'फॉर्म का शीर्षक (Form Title)' : 'Form Title'} <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Annual Community Feedback Survey"
                  className="text-sm font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-900">
                  {isHindi ? 'विवरण (Description)' : 'Description (Optional)'}
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Historical responses migrated from Google Forms (May 2026)"
                  rows={2}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-900">
                  {isHindi ? 'दृश्यता (Visibility)' : 'Visibility'}
                </Label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as 'public' | 'members' | 'private')}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="public">Public - Anyone can submit new responses</option>
                  <option value="members">Members Only - Requires active member login</option>
                  <option value="private">Private - Only staff can view / submit</option>
                </select>
              </div>
            </div>

            {/* Member Conversion Checkbox */}
            <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/50 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={importAsMembers}
                  onChange={(e) => setImportAsMembers(e.target.checked)}
                  className="mt-1 rounded border-slate-300 text-orange-700 focus:ring-orange-600"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {isHindi ? 'क्या रिस्पॉन्स देने वालों को सीधे सदस्य रजिस्ट्री में जोड़ना है?' : 'Also convert respondents into Registered Members?'}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    {isHindi
                      ? 'अगर यह गूगल फॉर्म किसी मेम्बरशिप या वॉलंटियर रजिस्ट्रेशन के लिए था, तो नाम और फ़ोन नंबर का पता लगाकर अपने आप सदस्य जोड़ दिए जाएंगे (डुप्लिकेट्स अपने आप सुरक्षित रूप से छूट जाएंगे)।'
                      : 'If this Google Form was used for membership/intake, Sangathan will automatically extract names and phone numbers to register them in your Member Directory with duplicate protection.'}
                  </div>
                </div>
              </label>

              {importAsMembers && (
                <div className="pt-2 border-t border-orange-200 flex items-center gap-3">
                  <Label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                    {isHindi ? 'डिफ़ॉल्ट पद / रोल:' : 'Default Role:'}
                  </Label>
                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value as 'member' | 'viewer' | 'editor')}
                    className="text-xs p-1.5 rounded-md border border-slate-300 bg-white"
                  >
                    <option value="member">Member</option>
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
              )}
            </div>

            {/* Detected Fields Preview */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">
                {isHindi ? `पहचाने गए सवाल / फ़ील्ड्स (${detectedHeaders.length})` : `Detected Questions / Columns (${detectedHeaders.length})`}
              </Label>
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                {detectedHeaders.map((header, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 font-medium text-slate-700 shadow-2xs"
                  >
                    {header}
                  </span>
                ))}
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
                disabled={isSubmitting}
                onClick={sourceType === 'google_api' ? handleSubmitGoogleApiForm : handleExecuteMigration}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isHindi ? 'माइग्रेट किया जा रहा है...' : 'Migrating Form & Responses...'}
                  </>
                ) : (
                  <>
                    {isHindi ? `माइग्रेशन शुरू करें (${detectedRowsCount} सबमिशन)` : `Start Migration (${detectedRowsCount} Submissions)`}{' '}
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STEP 3: Success Screen */}
      {step === 3 && resultData && (
        <Card className="border border-emerald-200 shadow-sm bg-white">
          <CardHeader className="text-center pb-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-900">
              {isHindi ? 'गूगल फॉर्म सफलतापूर्वक माइग्रेट हो गया!' : 'Google Form & Submissions Migrated!'}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {isHindi
                ? 'आपका फॉर्म और उसके सारे पिछले रिस्पॉन्स अब संगठन डेटाबेस में हमेशा के लिए सुरक्षित हैं।'
                : 'Your form schema and all past submissions are now stored locally in Sangathan database.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center max-w-md mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50">
                <div className="text-3xl font-black text-emerald-700">{resultData.submissionsCount || 0}</div>
                <div className="text-xs font-semibold text-emerald-900 mt-1">
                  {isHindi ? 'सबमिशन आयात किए गए' : 'Past Submissions Ingested'}
                </div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-3xl font-black text-slate-700">{resultData.fieldsCount || 0}</div>
                <div className="text-xs font-semibold text-slate-500 mt-1">
                  {isHindi ? 'फॉर्म फील्ड्स बने' : 'Form Fields Created'}
                </div>
              </div>
            </div>

            {resultData.membersImportResult && (
              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50 text-xs text-blue-900 flex items-center justify-center gap-2">
                <Users className="w-4 h-4 text-blue-700" />
                <span>
                  <strong>{resultData.membersImportResult.insertedCount || 0}</strong> {isHindi ? 'नए सदस्य जोड़े गए' : 'new members registered'} ({resultData.membersImportResult.skippedCount || 0} duplicates skipped).
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {resultData.formId && (
                <Button
                  onClick={() => router.push(`/${lang}/dashboard/forms/${resultData.formId}`)}
                  className="bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold px-6 rounded-xl"
                >
                  <Eye className="w-3.5 h-3.5 mr-1.5" />
                  {isHindi ? 'सबमिशन और एनालिटिक्स देखें' : 'View Submissions & Analytics'}
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => {
                  setStep(1)
                  setRawData('')
                  setSheetUrl('')
                  setTitle('')
                  setDescription('')
                }}
                className="text-xs font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                {isHindi ? 'एक और फॉर्म आयात करें' : 'Import Another Form'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

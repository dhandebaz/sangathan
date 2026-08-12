'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, Upload, Camera, FileText, CheckCircle2, AlertTriangle, Building, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { processBqfVerification } from '@/actions/bqf-verification'

interface BqfVerificationClientProps {
  orgId: string
  userId: string
  orgName: string
  existingVerification?: {
    verified: boolean
    verified_at: string
    verifier: string
    representative_name: string
    extracted_id: string
    legal_disclaimer: string
  } | null
}

export function BqfVerificationClient({
  orgId,
  userId,
  orgName,
  existingVerification,
}: BqfVerificationClientProps) {
  const [step, setStep] = useState(existingVerification?.verified ? 3 : 1)
  const [repName, setRepName] = useState(existingVerification?.representative_name || '')
  const [phone, setPhone] = useState('')
  const [idType, setIdType] = useState<'aadhaar' | 'passport' | 'voter_id'>('aadhaar')
  const [idFile, setIdFile] = useState<File | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [idPreview, setIdPreview] = useState<string | null>(null)
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  const [indemnityAccepted, setIndemnityAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationData, setVerificationData] = useState(existingVerification || null)

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIdFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setIdPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelfieFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setSelfiePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitVerification = async () => {
    if (!repName || !phone) {
      toast.error('Please enter representative name and contact phone number.')
      return
    }
    if (!indemnityAccepted) {
      toast.error('You must accept the legal indemnity agreement.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await processBqfVerification({
        orgId,
        userId,
        representativeName: repName,
        contactPhone: phone,
        idType,
        idDocumentDataUrl: idPreview || undefined,
        selfieDataUrl: selfiePreview || undefined,
        indemnityAccepted,
      })

      if (res.success && res.data) {
        toast.success('Bahujan Queer Foundation Recognition Granted!')
        setVerificationData(res.data)
        setStep(3)
      } else {
        toast.error(res.error || 'Verification failed')
      }
    } catch (err) {
      toast.error('System error during verification processing.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-sm bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">BQF Recognition & AI Verification</h1>
                {verificationData?.verified && (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold text-xs">
                    ✓ Recognized Collective
                  </Badge>
                )}
              </div>
              <p className="text-slate-500 text-xs mt-1">
                Official recognition for unregistered civic collectives by <strong className="text-slate-800">BAHUJAN QUEER FOUNDATION</strong> (Section 8 NGO, Delhi • CIN: U88900DL2025NPL452474).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Verified Badge View */}
      {step === 3 && verificationData?.verified ? (
        <Card className="border-emerald-200 bg-emerald-50/20">
          <CardHeader className="border-b border-emerald-100 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-base font-bold">Official BQF Recognition Active</CardTitle>
              </div>
              <span className="text-xs font-mono text-slate-500">CIN: U88900DL2025NPL452474</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-4 rounded border border-slate-200">
                <span className="text-slate-400 font-bold uppercase block mb-1">Organization</span>
                <p className="font-bold text-slate-900 text-sm">{orgName}</p>
                <p className="text-slate-500 mt-0.5">Unregistered Civic Collective</p>
              </div>
              <div className="bg-white p-4 rounded border border-slate-200">
                <span className="text-slate-400 font-bold uppercase block mb-1">Verified Representative</span>
                <p className="font-bold text-slate-900 text-sm">{verificationData.representative_name}</p>
                <p className="text-slate-500 mt-0.5">ID Ref: {verificationData.extracted_id}</p>
              </div>
              <div className="bg-white p-4 rounded border border-slate-200">
                <span className="text-slate-400 font-bold uppercase block mb-1">Recognizing Body</span>
                <p className="font-bold text-slate-900 text-sm">Bahujan Queer Foundation</p>
                <p className="text-slate-500 mt-0.5">Delhi Reg. Section 8 NGO</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-xs uppercase tracking-wider">
                <Lock className="w-4 h-4 text-slate-500" /> Statutory Legal Disclaimer & Indemnity Agreement
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {verificationData.legal_disclaimer}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep(1)} className="text-xs">
                Re-verify / Update ID
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Verification Form Steps */
        <Card className="border border-slate-200 bg-white">
          <CardHeader className="border-b bg-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base text-slate-900 font-bold">
                {step === 1 ? 'Step 1: Representative Identity & Documents' : 'Step 2: AI Verification & Legal Indemnity'}
              </CardTitle>
              <span className="text-xs text-slate-500 font-medium">Step {step} of 2</span>
            </div>
            <CardDescription className="text-xs text-slate-500">
              Complete facial & document verification to unlock official BQF letterhead representations for your civic group.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {step === 1 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase text-slate-600">Lead Representative Name</Label>
                    <Input
                      placeholder="Full Name as on Govt ID"
                      value={repName}
                      onChange={(e) => setRepName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase text-slate-600">Official Mobile / WhatsApp</Label>
                    <Input
                      placeholder="+91 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase text-slate-600">Select Government Photo ID Type</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'aadhaar', label: 'Aadhaar Card' },
                      { id: 'passport', label: 'Passport' },
                      { id: 'voter_id', label: 'Voter ID' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setIdType(item.id as typeof idType)}
                        className={`p-3 text-xs font-semibold rounded border text-center transition-all ${
                          idType === item.id
                            ? 'border-purple-600 bg-purple-50 text-purple-900'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="border-2 border-dashed border-slate-200 rounded p-4 text-center hover:border-purple-300 transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <span className="text-xs font-semibold text-slate-700 block">Upload {idType.toUpperCase()} Document</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Scanned PDF or clear photo</span>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleIdUpload}
                      className="mt-3 text-xs"
                    />
                    {idPreview && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-2">✓ Document Attached</p>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-slate-200 rounded p-4 text-center hover:border-purple-300 transition-colors">
                    <Camera className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <span className="text-xs font-semibold text-slate-700 block">Facial Verification Selfie</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Clear front-facing photo</span>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleSelfieUpload}
                      className="mt-3 text-xs"
                    />
                    {selfiePreview && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-2">✓ Selfie Attached</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setStep(2)} className="bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs px-6">
                    Proceed to Verification & Legal Terms →
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Legal Indemnity Document Block */}
                <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Building className="w-4 h-4 text-purple-700" />
                    BAHUJAN QUEER FOUNDATION — Legal Recognition & Indemnity Covenant
                  </div>
                  <p className="text-xs text-slate-500 leading-normal">
                    CIN: <strong className="text-slate-800">U88900DL2025NPL452474</strong> • Registered Section 8 NGO under Government of NCT of Delhi.
                  </p>
                  <div className="bg-white p-3 rounded border text-xs text-slate-700 space-y-2 leading-relaxed max-h-48 overflow-y-auto font-mono">
                    <p className="font-bold text-slate-900">TERMS OF CIVIC RECOGNITION & LIABILITY DISCLAIMER:</p>
                    <p>
                      1. Bahujan Queer Foundation (BQF) grants official recognition to <strong>{orgName}</strong> as an unregistered grassroots civic collective solely for lodging civic complaints, representations, and local authority petitions.
                    </p>
                    <p>
                      2. <strong>INDEMNIFICATION:</strong> BQF is completely indemnified, shielded, and held harmless from any unlawful activities, unauthorized financial transactions, local disputes, or illegal actions committed by <strong>{orgName}</strong> or its representatives.
                    </p>
                    <p>
                      3. All representations issued under BQF letterheads must strictly adhere to Indian Law, public decency, and peaceful civic engagement.
                    </p>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="indemnity"
                      checked={indemnityAccepted}
                      onChange={(e) => setIndemnityAccepted(e.target.checked)}
                      className="w-4 h-4 text-purple-700 border-slate-300 rounded focus:ring-purple-500 mt-0.5"
                    />
                    <label htmlFor="indemnity" className="text-xs text-slate-800 font-medium cursor-pointer leading-tight">
                      I, <strong>{repName}</strong>, hereby declare under penalty of law that I am an authorized representative of <strong>{orgName}</strong> and explicitly agree to the BQF Legal Recognition & Indemnity terms.
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="text-xs">
                    ← Back
                  </Button>
                  <Button
                    onClick={handleSubmitVerification}
                    disabled={isSubmitting || !indemnityAccepted}
                    className="bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs px-6 gap-2"
                  >
                    {isSubmitting ? 'Verifying with AI...' : 'Submit AI Verification & Grant Recognition ✓'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

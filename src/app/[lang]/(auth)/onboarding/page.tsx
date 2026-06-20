'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { finalizeSignup } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, Loader2, ArrowRight, ShieldAlert } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { use } from 'react'

export default function OnboardingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const organizationName = formData.get('organizationName') as string
    const organizationType = formData.get('organizationType') as string
    const registrationStatus = formData.get('registrationStatus') as string

    // Send it to the action (note: finalizeSignup needs to be updated to handle this if saving to db)
    const result = await finalizeSignup({ organizationName, organizationType, registrationStatus })

    if (result.success) {
      router.push(`/${lang}/dashboard`)
    } else {
      setError(result.error || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Geometric Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-sm relative z-10 p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-slate-50 border border-slate-200 text-slate-900 rounded-sm flex items-center justify-center mx-auto mb-5">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {lang === 'hi' ? 'संगठन सेटअप करें' : 'Set Up Your Organisation'}
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            {lang === 'hi' 
              ? 'अंतिम चरण! हमें अपने संगठन के प्रकार और नाम के बारे में बताएं ताकि हम आपके डैशबोर्ड को अनुकूलित कर सकें।' 
              : "Final step! Tell us your organization's details so we can customize your secure dashboard."}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-sm text-sm font-medium flex items-start gap-2">
              <ShieldAlert size={16} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <Label htmlFor="organizationType" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {lang === 'hi' ? 'संगठन का प्रकार' : 'Organization Type'}
            </Label>
            <Select name="organizationType" required disabled={loading} defaultValue="ngo">
              <SelectTrigger className="w-full h-11 rounded-sm border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="rounded-sm border-slate-200 shadow-sm">
                <SelectItem value="ngo">NGO / Non-Profit</SelectItem>
                <SelectItem value="student_union">Student Union</SelectItem>
                <SelectItem value="workers_union">Workers Union</SelectItem>
                <SelectItem value="rwa">Resident Welfare Association (RWA)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="registrationStatus" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {lang === 'hi' ? 'पंजीकरण स्थिति' : 'Registration Status'}
            </Label>
            <Select name="registrationStatus" required disabled={loading} defaultValue="registered">
              <SelectTrigger className="w-full h-11 rounded-sm border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="rounded-sm border-slate-200 shadow-sm">
                <SelectItem value="registered">Registered</SelectItem>
                <SelectItem value="unregistered">Unregistered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="organizationName" className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              {lang === 'hi' ? 'संगठन का नाम' : 'Organisation Name'}
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                id="organizationName"
                name="organizationName"
                placeholder={lang === 'hi' ? 'उदा. जन सेवा फाउंडेशन' : 'e.g. Jan Seva Foundation'}
                className="pl-9 h-11 rounded-sm border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all"
                required
                disabled={loading}
              />
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              {lang === 'hi' 
                ? 'यह आपके सुरक्षित कार्यक्षेत्र का मुख्य नाम होगा।' 
                : 'This will be the primary name for your secure workspace.'}
            </p>
          </div>

          <Button type="submit" className="w-full h-11 rounded-sm bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors mt-2" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {lang === 'hi' ? 'सहेज रहे हैं...' : 'Saving...'}
              </>
            ) : (
              <>
                {lang === 'hi' ? 'डैशबोर्ड पर जाएं' : 'Complete Setup & Go to Dashboard'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

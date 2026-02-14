'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateOnboardingMetadata } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, User, Loader2, ArrowRight } from 'lucide-react'
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
    const fullName = formData.get('fullName') as string
    const organizationName = formData.get('organizationName') as string

    const result = await updateOnboardingMetadata({ fullName, organizationName })

    if (result.success) {
      router.push(`/${lang}/verify-phone`)
    } else {
      setError(result.error || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            {lang === 'hi' ? 'संगठन सेटअप करें' : 'Set Up Your Organisation'}
          </CardTitle>
          <CardDescription>
            {lang === 'hi' 
              ? 'आप बस एक कदम दूर हैं! शुरू करने के लिए हमें अपने समूह के बारे में थोड़ा और बताएं।' 
              : "You're almost there! Tell us a bit more about your group to get started."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="fullName">{lang === 'hi' ? 'आपका पूरा नाम' : 'Your Full Name'}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder={lang === 'hi' ? 'उदा. राहुल कुमार' : 'e.g. Rahul Kumar'}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizationName">{lang === 'hi' ? 'संगठन का नाम' : 'Organisation Name'}</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  id="organizationName"
                  name="organizationName"
                  placeholder={lang === 'hi' ? 'उदा. जन सेवा फाउंडेशन' : 'e.g. Jan Seva Foundation'}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-[10px] text-slate-500">
                {lang === 'hi' 
                  ? 'यह आपके सुरक्षित कार्यक्षेत्र का मुख्य नाम होगा।' 
                  : 'This will be the primary name for your secure workspace.'}
              </p>
            </div>

            <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {lang === 'hi' ? 'सहेज रहे हैं...' : 'Saving...'}
                </>
              ) : (
                <>
                  {lang === 'hi' ? 'फोन सत्यापन के लिए आगे बढ़ें' : 'Continue to Phone Verification'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

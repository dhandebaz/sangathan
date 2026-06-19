'use client'

import { useState, useTransition } from 'react'
import { Sparkles, Key, Hash, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react'
import { createTicket } from '@/actions/tickets/actions'

export function AiActivationForm({ lang }: { lang: string }) {
  const isHi = lang === 'hi'
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const provider = formData.get('provider') as string
    const apiKey = formData.get('apiKey') as string
    const txnId = formData.get('txnId') as string

    if (!provider || !apiKey || !txnId) return

    startTransition(async () => {
      setStatus('idle')
      setErrorMsg('')
      
      const description = `Provider: ${provider}\nAPI Key: ${apiKey}\nTransaction ID: ${txnId}`
      
      const result = await createTicket({
        title: 'Activate Sangathan AI',
        description,
        type: 'ai_activation'
      })

      if (result?.error) {
        setStatus('error')
        setErrorMsg(result.error)
      } else {
        setStatus('success')
        ;(e.target as HTMLFormElement).reset()
      }
    })
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl">
      <div className="mb-6 flex items-center gap-4 border-b border-border pb-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {isHi ? 'संगठन AI सक्रिय करें' : 'Activate Sangathan AI'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isHi ? 'वन-टाइम ₹5000 सेटअप शुल्क' : 'One-time ₹5000 setup fee'}
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
        <p>
          {isHi 
            ? 'संगठन AI आपके संगठन के लिए उन्नत सुविधाएँ लाता है। चूंकि हम कोई सदस्यता शुल्क नहीं लेते हैं, इसलिए आपको अपना स्वयं का API कुंजी (OpenAI, Gemini, आदि) प्रदान करना होगा ताकि आप केवल अपने उपयोग के लिए भुगतान करें।' 
            : 'Sangathan AI unlocks advanced organization features. Since we charge no recurring fees, you must bring your own API key (OpenAI, Gemini, etc.) so you only pay for what you use.'}
        </p>
      </div>

      {status === 'success' ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-emerald-500" />
          <h4 className="mb-1 font-bold text-emerald-900">
            {isHi ? 'सक्रियण अनुरोध प्राप्त हुआ' : 'Activation Request Received'}
          </h4>
          <p className="text-sm text-emerald-700">
            {isHi ? 'आपकी कुंजी और लेन-देन संदर्भ सफलतापूर्वक सबमिट कर दिया गया है। हमारा सिस्टम इसे संसाधित करेगा।' : 'Your key and transaction reference have been securely submitted. Our system will process it shortly.'}
          </p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-4 rounded-lg bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-200"
          >
            {isHi ? 'एक और सबमिट करें' : 'Submit Another'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="provider" className="mb-1.5 block text-sm font-semibold text-foreground">
              {isHi ? 'AI प्रदाता चुनें' : 'Select AI Provider'}
            </label>
            <div className="relative">
              <select 
                id="provider"
                name="provider" 
                required
                className="w-full appearance-none rounded-xl border border-border bg-muted px-4 py-3 text-sm text-foreground focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="">{isHi ? 'प्रदाता चुनें...' : 'Choose a provider...'}</option>
                <option value="gemini">Google Gemini</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic (Claude)</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
            </div>
          </div>

          <div>
            <label htmlFor="apiKey" className="mb-1.5 block text-sm font-semibold text-foreground">
              {isHi ? 'आपकी API कुंजी' : 'Your API Key'}
            </label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                id="apiKey"
                name="apiKey"
                type="password"
                required
                placeholder={isHi ? 'यहाँ पेस्ट करें' : 'Paste your API key here'}
                className="w-full rounded-xl border border-border bg-muted py-3 pl-11 pr-4 text-sm text-foreground focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="txnId" className="mb-1.5 block text-sm font-semibold text-foreground">
              {isHi ? 'UPI लेन-देन संदर्भ संख्या' : 'UPI Transaction Reference No.'}
            </label>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                id="txnId"
                name="txnId"
                type="text"
                required
                placeholder={isHi ? '₹5000 भुगतान के लिए 12 अंकों का संदर्भ' : '12-digit ref for the ₹5000 payment'}
                className="w-full rounded-xl border border-border bg-muted py-3 pl-11 pr-4 text-sm text-foreground focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-xl bg-foreground px-4 py-3.5 text-sm font-bold text-primary-foreground transition-all hover:bg-foreground/80 disabled:opacity-70"
          >
            {isPending 
              ? (isHi ? 'सबमिट किया जा रहा है...' : 'Submitting...') 
              : (isHi ? 'सक्रियण अनुरोध सबमिट करें' : 'Submit Activation Request')}
          </button>
        </form>
      )}
    </div>
  )
}

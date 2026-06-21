'use client'

import Image from 'next/image'
import { Server, Database, Shield, Heart, Copy, CheckCircle2, CreditCard, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { RazorpayScript } from '@/components/razorpay-script'

export function SupportSangathan({ lang, isPublic = false }: { lang: string, isPublic?: boolean }) {
  const isHi = lang === 'hi'
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [amount, setAmount] = useState<string>('500')
  const [isProcessing, setIsProcessing] = useState(false)
  const upiIds = ['sheikh.arsalan@okaxis', 'sheikh.arsalan@ybl', '8527976791@fam']

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(text)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRazorpayPayment = async () => {
    const numAmount = parseInt(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error(isHi ? 'कृपया एक मान्य राशि दर्ज करें' : 'Please enter a valid amount')
      return
    }

    try {
      setIsProcessing(true)
      
      // 1. Create order
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: numAmount }),
      })
      
      const orderData = await response.json()
      
      if (!response.ok) throw new Error(orderData.error || 'Failed to create order')

      // 2. Open Razorpay Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Sangathan',
        description: 'Voluntary Contribution',
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })
            
            const verifyData = await verifyRes.json()
            if (verifyRes.ok && verifyData.success) {
              toast.success(isHi ? 'भुगतान सफल रहा। आपके समर्थन के लिए धन्यवाद!' : 'Payment successful. Thank you for your support!')
              setAmount('')
            } else {
              toast.error(isHi ? 'भुगतान सत्यापन विफल रहा' : 'Payment verification failed')
            }
          } catch (e) {
            toast.error(isHi ? 'भुगतान सत्यापन में त्रुटि' : 'Error verifying payment')
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#0f172a',
        },
      }

      const paymentObject = new (window as any).Razorpay(options)
      paymentObject.open()

    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Something went wrong')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <RazorpayScript />
      <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500 py-12 px-4">
        <div className="w-full max-w-md rounded-sm border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold tracking-tight text-foreground mb-2">
              {isHi ? 'स्कैन करें और भुगतान करें' : 'Scan & Support'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {isHi ? 'किसी भी UPI ऐप का उपयोग करें' : 'Use any UPI app or credit/debit card to contribute securely'}
            </p>
          </div>

          <div className="mx-auto w-full max-w-[240px] aspect-square rounded-sm border border-border bg-muted p-2 mb-8 relative group overflow-hidden">
            <Image
              src="/UPIqrBQP.jpg"
              alt="Support Sangathan UPI QR Code"
              fill
              className="object-contain p-2"
              priority
            />
            <div className="absolute inset-0 bg-foreground/5 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <span className="bg-card/90 text-foreground font-semibold px-3 py-1.5 rounded-sm text-sm shadow-sm">
                {isHi ? 'स्कैन करें' : 'Scan Me'}
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-muted-foreground ml-1">
                {isHi ? 'अन्य तरीकों से भुगतान करें (डेबिट/क्रेडिट कार्ड)' : 'Pay via Cards / Netbanking'}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={isHi ? 'राशि दर्ज करें' : 'Enter amount'}
                    className="w-full rounded-sm border border-border bg-background px-3 py-2 pl-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-colors"
                  />
                </div>
                <button
                  onClick={handleRazorpayPayment}
                  disabled={isProcessing || !amount}
                  className="flex items-center gap-2 rounded-sm bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  {isHi ? 'भुगतान करें' : 'Pay'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-sm bg-muted p-4 border border-border">
              <div className="text-sm font-semibold text-muted-foreground mb-1">
                {isHi ? 'खाता नाम' : 'Account Name'}
              </div>
              <div className="font-bold text-foreground">Sheikh Arsalan Ullah Chishti</div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-semibold text-muted-foreground ml-1">
                {isHi ? 'उपलब्ध UPI आईडी' : 'Supported UPI IDs'}
              </div>
              {upiIds.map((id) => (
                <button
                  key={id}
                  onClick={() => copyToClipboard(id)}
                  className="flex w-full items-center justify-between rounded-sm border border-border bg-card p-3 hover:border-brand-300 hover:bg-brand-50 transition-colors group"
                >
                  <span className="font-medium text-foreground font-mono text-sm">{id}</span>
                  {copiedId === id ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <p className="mt-6 text-center text-xs text-muted-foreground">
            {isHi ? 'आपका समर्थन 100% संगठनों को सुरक्षित और ऑनलाइन रखने में जाता है।' : '100% of your support goes directly to keeping Sangathan organizations secure and online.'}
          </p>
        </div>
      </div>
    </>
  )
}

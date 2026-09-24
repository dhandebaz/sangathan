'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { RazorpayScript } from '@/components/razorpay-script'

interface SubscribeButtonProps {
  orgId: string
  lang: string
  isHindi: boolean
  label?: string
  className?: string
}

/**
 * Starts metered billing: creates the Razorpay quantity-subscription,
 * opens checkout for the UPI mandate, then polls our status endpoint
 * until the `subscription.authenticated` webhook activates the plan.
 */
export function SubscribeButton({ orgId, lang, isHindi, label, className }: SubscribeButtonProps) {
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  const pollStatus = async (timeoutMs = 180000): Promise<boolean> => {
    const start = Date.now()
    while (Date.now() - start < timeoutMs) {
      await new Promise((r) => setTimeout(r, 4000))
      try {
        const res = await fetch('/api/billing/subscription-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orgId, action: 'status' }),
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok && ['active', 'authenticated'].includes(data.status)) return true
      } catch {
        // keep polling
      }
    }
    return false
  }

  const handleSubscribe = async () => {
    try {
      setBusy(true)
      const res = await fetch('/api/billing/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgId }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Could not start billing')

      if (data.resumed) {
        toast.success(isHindi ? 'मीटर बिलिंग पहले से सक्रिय है।' : 'Metered billing is already active.')
        router.refresh()
        return
      }

      const RazorpayCtor = (
        window as unknown as { Razorpay: new (options: unknown) => { open: () => void } }
      ).Razorpay
      if (!RazorpayCtor) throw new Error('Payment widget failed to load')

      const rzp = new RazorpayCtor({
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        subscription_id: data.subscriptionId,
        name: 'Sangathan (Bahujan Queer Foundation)',
        description: `Metered billing — (actives − 5) × ₹11/month. Billable now: ${data.quantity}`,
        theme: { color: '#4f46e5' },
        handler: async () => {
          toast.message(
            isHindi ? 'मैंडेट स्वीकृत — सक्रियण की पुष्टि हो रही है…' : 'Mandate approved — confirming activation…',
          )
          const ok = await pollStatus()
          if (ok) {
            toast.success(
              isHindi ? 'मीटर बिलिंग सक्रिय! शुभकामनाएं।' : 'Metered billing is live. Welcome aboard.',
            )
            router.refresh()
          } else {
            toast.message(
              isHindi
                ? 'मैंडेट मिल गया है — सक्रियण कुछ मिनट में दिखेगा।'
                : 'Mandate received — activation will reflect shortly.',
            )
            router.refresh()
          }
        },
      })
      rzp.open()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  void lang
  return (
    <>
      <RazorpayScript />
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={busy}
        className={
          className ||
          'block w-full py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold text-center transition-colors shadow-2xs disabled:opacity-50'
        }
      >
        {busy ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {isHindi ? 'प्रसंस्करण…' : 'Processing…'}
          </span>
        ) : (
          label || (isHindi ? 'मीटर बिलिंग चालू करो' : 'Turn on metered billing')
        )}
      </button>
    </>
  )
}

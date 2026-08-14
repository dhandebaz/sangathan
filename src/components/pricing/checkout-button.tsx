'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { RazorpayScript } from '@/components/razorpay-script'

interface CheckoutButtonProps {
  amount: number
  planName: string
  planPeriod?: 'monthly' | 'yearly' | 'lifetime' | 'one_time'
  additionalSlots?: number
  targetMemberCount?: number
  labelEn: string
  labelHi: string
  isHindi: boolean
  orgId: string
  className?: string
  children?: React.ReactNode
  onSuccess?: () => void
}

export function CheckoutButton({
  amount,
  planName,
  planPeriod = 'monthly',
  additionalSlots = 0,
  targetMemberCount = 0,
  labelEn,
  labelHi,
  isHindi,
  orgId,
  className,
  children,
  onSuccess,
}: CheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      setIsProcessing(true)

      // 1. Create order
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          receipt: `rcpt_${planName.toLowerCase().slice(0, 8)}_${Date.now().toString().slice(-6)}`,
          orgId,
          planName,
          planPeriod,
          additionalSlots,
          targetMemberCount,
        }),
      })

      const orderData = await response.json()

      if (!response.ok) throw new Error(orderData.error || 'Failed to create order')

      // 2. Open Razorpay Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Sangathan (Bahujan Queer Foundation)',
        description:
          planName === 'Community'
            ? 'Community Access Contribution'
            : `Sustainer Access (${planPeriod === 'yearly' ? 'Annual' : 'Monthly'}${additionalSlots > 0 ? ` • +${additionalSlots} Slots` : ''})`,
        order_id: orderData.id,
        handler: async function (paymentResponse: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) {
          try {
            // 3. Verify Payment
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                orgId,
                planName,
                planPeriod,
                amount,
                additionalSlots,
              }),
            })

            const verifyData = await verifyRes.json()
            if (verifyRes.ok && verifyData.success) {
              toast.success(
                isHindi
                  ? 'योगदान सफल रहा! पहुंच सक्रिय कर दी गई है। नागरिक बुनियादी ढांचे का समर्थन करने के लिए धन्यवाद।'
                  : 'Contribution successful! Access is now active. Thank you for supporting open civic infrastructure.',
              )
              if (onSuccess) {
                onSuccess()
              } else {
                router.refresh()
              }
            } else {
              toast.error(
                isHindi
                  ? verifyData.error || 'सत्यापन विफल रहा'
                  : verifyData.error || 'Contribution verification failed',
              )
            }
          } catch {
            toast.error(isHindi ? 'सत्यापन में त्रुटि' : 'Error verifying contribution')
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: {
          color: '#4f46e5', // indigo-600
        },
      }

      const RazorpayConstructor = (
        window as unknown as { Razorpay: new (options: unknown) => { open: () => void } }
      ).Razorpay
      const paymentObject = new RazorpayConstructor(options)
      paymentObject.open()
    } catch (error: unknown) {
      console.error(error)
      const message = error instanceof Error ? error.message : 'Something went wrong'
      toast.error(message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <RazorpayScript />
      <button
        onClick={handleCheckout}
        disabled={isProcessing}
        className={
          className ||
          'w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center transition-colors mb-8 disabled:opacity-50'
        }
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{isHindi ? 'प्रसंस्करण...' : 'Processing...'}</span>
          </span>
        ) : (
          children || (isHindi ? labelHi : labelEn)
        )}
      </button>
    </>
  )
}

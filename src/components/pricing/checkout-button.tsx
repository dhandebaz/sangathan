'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { RazorpayScript } from '@/components/razorpay-script'

interface CheckoutButtonProps {
  amount: number
  planName: string
  labelEn: string
  labelHi: string
  isHindi: boolean
  orgId: string
  className?: string
  children?: React.ReactNode
}

export function CheckoutButton({
  amount,
  planName,
  labelEn,
  labelHi,
  isHindi,
  orgId,
  className,
  children
}: CheckoutButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    try {
      setIsProcessing(true)

      // 1. Create order
      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, receipt: `receipt_${planName.toLowerCase()}`, orgId, planName }),
      })

      const orderData = await response.json()

      if (!response.ok) throw new Error(orderData.error || 'Failed to create order')

      // 2. Open Razorpay Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Sangathan',
        description: `${planName} Plan Purchase`,
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
              toast.success(isHindi ? 'भुगतान सफल रहा। धन्यवाद!' : 'Payment successful. Thank you!')
              // Optionally redirect to dashboard or onboarding
            } else {
              toast.error(isHindi ? 'भुगतान सत्यापन विफल रहा' : 'Payment verification failed')
            }
          } catch (e) {
            toast.error(isHindi ? 'भुगतान सत्यापन में त्रुटि' : 'Error verifying payment')
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
      <button
        onClick={handleCheckout}
        disabled={isProcessing}
        className={className || "w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-center transition-colors mb-8 disabled:opacity-50"}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            {isHindi ? 'प्रतीक्षा करें...' : 'Processing...'}
          </span>
        ) : (
          children || (isHindi ? labelHi : labelEn)
        )}
      </button>
    </>
  )
}

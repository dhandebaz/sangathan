import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_API_KEY
    const key_secret = process.env.RAZORPAY_KEY_SECRET

    if (!key_id || !key_secret) {
      console.error('RAZORPAY keys are missing')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Creating our own signature to verify with razorpay's signature
    const bodyForSignature = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(bodyForSignature.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      // Payment is verified
      
      const razorpay = new Razorpay({
        key_id,
        key_secret,
      })

      const order = await razorpay.orders.fetch(razorpay_order_id)
      const notes = order.notes as Record<string, string> | undefined
      const orgId = notes?.orgId
      const planName = notes?.planName

      if (orgId && planName) {
        const supabase = await createClient()
        
        let updateData: any = {}
        if (planName === 'Institution') {
          updateData.plan_name = 'Institution'
        } else if (planName === 'White-label') {
          updateData.whitelabel_enabled = true
        }

        if (Object.keys(updateData).length > 0) {
          const { error } = await supabase
            .from('organisations')
            .update(updateData)
            .eq('id', orgId)
            
          if (error) {
            console.error('Failed to update organisation plan:', error)
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid signature', success: false },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error)
    return NextResponse.json(
      { error: error.message || 'Verification failed', success: false },
      { status: 500 }
    )
  }
}

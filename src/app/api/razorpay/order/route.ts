import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_API_KEY
    const key_secret = process.env.RAZORPAY_KEY_SECRET

    if (!key_id || !key_secret) {
      logger.error('razorpay', 'Razorpay credentials missing')
      return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 })
    }

    const instance = new Razorpay({
      key_id,
      key_secret,
    })

    const body = await request.json()
    const { amount, receipt, currency = 'INR', orgId, planName, planPeriod = 'monthly' } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        orgId: orgId || '',
        planName: planName || 'Institution',
        planPeriod: planPeriod || 'monthly',
      },
    }

    const order = await instance.orders.create(options)

    return NextResponse.json(order)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order'
    logger.error('razorpay', 'Failed to create Razorpay order', { error: errorMessage })
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}

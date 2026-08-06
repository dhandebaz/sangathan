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

    const { amount, receipt, currency = 'INR' } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    }

    const order = await instance.orders.create(options)

    return NextResponse.json(order)
  } catch (error: any) {
    logger.error('razorpay', 'Failed to create Razorpay order', { error: error?.message || error })
    return NextResponse.json({ error: error?.message || 'Failed to create order' }, { status: 500 })
  }
}

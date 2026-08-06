import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { logger } from '@/lib/logger'

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json()
    const key_secret = process.env.RAZORPAY_KEY_SECRET

    if (!key_secret) {
      logger.error('razorpay', 'Razorpay secret missing for verification')
      return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex')

    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      logger.info('razorpay', 'Payment signature verified successfully', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      })
      return NextResponse.json({ success: true, message: 'Payment verified successfully' })
    } else {
      logger.warn('razorpay', 'Invalid payment signature', {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      })
      return NextResponse.json({ success: false, error: 'Invalid payment signature' }, { status: 400 })
    }
  } catch (error: any) {
    logger.error('razorpay', 'Payment verification failed', { error: error?.message || error })
    return NextResponse.json({ success: false, error: 'Verification error' }, { status: 500 })
  }
}

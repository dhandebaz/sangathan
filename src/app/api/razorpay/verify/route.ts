import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

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

    const key_secret = process.env.RAZORPAY_KEY_SECRET

    if (!key_secret) {
      console.error('RAZORPAY_KEY_SECRET is missing')
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
      // Here you could update the database to mark the payment as successful
      
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

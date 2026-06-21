import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, currency = 'INR', receipt = 'receipt_order_1', orgId, planName } = body

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      )
    }

    if (!orgId || !planName) {
      return NextResponse.json(
        { error: 'Missing organisation or plan details' },
        { status: 400 }
      )
    }

    // Razorpay requires amounts in smallest unit (paise for INR)
    // The client should send amount in INR (whole numbers), and we convert it here:
    const amountInPaise = Math.round(amount * 100)

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_API_KEY
    const key_secret = process.env.RAZORPAY_KEY_SECRET

    if (!key_id || !key_secret) {
      console.error('Razorpay keys are missing from environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    })

    const options = {
      amount: amountInPaise,
      currency,
      receipt,
      notes: {
        orgId,
        planName
      }
    }

    const order = await razorpay.orders.create(options)

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    )
  }
}

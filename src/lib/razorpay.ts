import Razorpay from 'razorpay'

let razorpayClient: Razorpay | null = null

export function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET

  if (!key_id || !key_secret) {
    throw new Error('Razorpay is not configured. Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET.')
  }

  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id,
      key_secret,
    })
  }

  return razorpayClient
}

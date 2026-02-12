import Razorpay from 'razorpay'

const key_id = process.env.RAZORPAY_KEY_ID
const key_secret = process.env.RAZORPAY_KEY_SECRET

if (!key_id || !key_secret) {
  // Warn but don't crash in build time
  console.warn('Razorpay keys are missing. Subscription features will fail.')
}

export const razorpay = new Razorpay({
  key_id: key_id || 'dummy',
  key_secret: key_secret || 'dummy',
})

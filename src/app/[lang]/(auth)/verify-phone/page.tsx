'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase/client'
import { finalizeSignup } from '@/actions/auth'
import { Loader2, Phone, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

export default function VerifyPhonePage(props: { params: Promise<{ lang: string }> }) {
  const params = use(props.params)
  const router = useRouter()
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('') // E.164 format
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [verified, setVerified] = useState(false)

  // Initialize Recaptcha
  useEffect(() => {
    // Only initialize once per component mount
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear()
      window.recaptchaVerifier = undefined
    }

    const auth = firebaseAuth
    if (!auth) {
      setError("Phone verification service is unavailable (Auth not initialized).")
      return
    }

    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("Recaptcha solved automatically")
        },
        'expired-callback': () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          console.warn("Recaptcha expired")
        }
      })
    } catch (e) {
      console.error("Recaptcha init error:", e)
    }

    return () => {
      // Cleanup on unmount
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = undefined
      }
    }
  }, [])

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const auth = firebaseAuth
      if (!auth) {
        throw new Error("Phone verification service is unavailable.")
      }

      // Basic validation
      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error('Please enter a valid phone number')
      }

      // Ensure appVerifier exists
      if (!window.recaptchaVerifier) {
        // Try to re-initialize if missing (e.g. fast navigation or race condition)
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': () => {
          // reCAPTCHA solved
        }
      })
    } catch (e) {
      console.error('Recaptcha init failed:', e)
      throw new Error('Security check failed. Please refresh the page.')
    }
  }

  const appVerifier = window.recaptchaVerifier
  if (!appVerifier) {
    throw new Error('ReCAPTCHA not initialized.')
  }

  // Format phone: E.164 standard
  const cleaned = phoneNumber.replace(/[^\d+]/g, '') // Keep only digits and plus
  const formattedPhone = cleaned.startsWith('+') ? cleaned : `+91${cleaned}`
  
  console.log('Sending OTP to:', formattedPhone)

  const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier)
  setConfirmationResult(confirmation)
  setStep('otp')
} catch (err) {
  const error = err as { code?: string; message?: string }
  console.error('OTP Error:', error)
  if (error.code === 'auth/operation-not-allowed') {
    setError('Phone authentication is not enabled in the database configuration. Please contact support.')
  } else if (error.code === 'auth/argument-error') {
    setError('Invalid phone number format or security check failed.')
  } else {
    setError(error.message || 'Failed to send OTP. Try again.')
  }
      
      // Reset captcha if needed
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear()
        window.recaptchaVerifier = undefined 
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!confirmationResult) return
    
    setLoading(true)
    setError('')

    try {
      // 1. Confirm with Firebase (Client-side)
      const cleanOtp = otp.trim()
      const result = await confirmationResult.confirm(cleanOtp)
      const user = result.user
      const idToken = await user.getIdToken()

      // 2. Call Server Action (Server-side)
      const response = await finalizeSignup({ idToken })

      if (response.success) {
        setVerified(true)
        setTimeout(() => {
          router.push(`/${params.lang}/dashboard`)
        }, 2000)
      } else {
        throw new Error(response.error || 'Server verification failed')
      }
    } catch (err) {
      const error = err as { code?: string; message?: string }
      console.error('Verification Error:', error)
      
      // Distinguish between Firebase errors and Server errors
      if (error.code === 'auth/invalid-verification-code') {
        setError('The verification code is incorrect. Please check and try again.')
      } else if (error.code === 'auth/code-expired') {
        setError('The verification code has expired. Please request a new one.')
      } else if (error.message && error.message.includes('Server verification failed')) {
        setError(error.message) // Show server error directly
      } else {
        setError(error.message || 'Verification failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center animate-fade-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Verified!</h2>
          <p className="text-gray-500 mb-6">Your organisation is now active. Redirecting...</p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Phone className="w-6 h-6 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Mobile Number</h1>
          <p className="text-gray-500 mt-2 text-sm">
            To ensure accountability, all organisation admins must verify their phone number.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                required
              />
              <p className="text-xs text-gray-400 mt-2">
                We will send a 6-digit OTP for verification. Standard rates apply.
              </p>
            </div>

            <div id="recaptcha-container" className="flex justify-center my-4"></div>

            <button
              type="submit"
              disabled={loading || !phoneNumber}
              className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
             <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  Enter the code sent to <span className="font-semibold">{phoneNumber}</span>
                </p>
                <button 
                  type="button" 
                  onClick={() => setStep('phone')}
                  className="text-xs text-orange-600 hover:underline mt-1"
                >
                  Change Number
                </button>
             </div>

             <div>
               <input
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                maxLength={6}
                required
              />
             </div>

             <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-orange-600 text-white py-3 rounded-xl font-medium hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Continue'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
  }
}

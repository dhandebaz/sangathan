'use client'

import { useState, useEffect } from 'react'
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth'
import { firebaseAuth } from '@/lib/firebase/client'
import { phoneLogin, linkPhoneToAccount } from '@/actions/auth'
import { Loader2, Phone, ArrowRight, ShieldCheck } from 'lucide-react'

interface PhoneAuthProps {
  mode: 'login' | 'link'
  email?: string // Required for 'link' mode
  password?: string // Required for 'link' mode
  onSuccess?: () => void
}

export function PhoneAuth({ mode, email, password, onSuccess }: PhoneAuthProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationId, setVerificationId] = useState<ConfirmationResult | null>(null)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Initialize Recaptcha
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved
        }
      })
    }
  }, [])

  const sendOtp = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const appVerifier = window.recaptchaVerifier
      // Format phone: +91XXXXXXXXXX
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`
      
      const confirmationResult = await signInWithPhoneNumber(firebaseAuth, formattedPhone, appVerifier)
      setVerificationId(confirmationResult)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    if (!verificationId) return
    setLoading(true)
    setError(null)

    try {
      const result = await verificationId.confirm(otp)
      const idToken = await result.user.getIdToken()

      // Send to Server Action
      if (mode === 'login') {
        const res = await phoneLogin({ idToken })
        if (!res.success) {
          if (res.code === 'LINK_REQUIRED') {
             throw new Error('This phone number is not linked to any account. Please login with email first to link it.')
          }
          throw new Error(res.error)
        }
        
        if (res.redirectUrl) {
           window.location.href = res.redirectUrl
        }
      } else if (mode === 'link' && email && password) {
        const res = await linkPhoneToAccount({ email, password, idToken })
        if (!res.success) throw new Error(res.error)
        if (onSuccess) onSuccess()
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div id="recaptcha-container"></div>
      
      {!verificationId ? (
        <div className="space-y-4">
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <div className="relative">
                 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="tel" 
                   value={phoneNumber}
                   onChange={(e) => setPhoneNumber(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                   placeholder="+91 98765 43210"
                 />
              </div>
           </div>
           <button 
             onClick={sendOtp}
             disabled={loading || phoneNumber.length < 10}
             className="w-full bg-black text-white py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
           >
             {loading && <Loader2 size={18} className="animate-spin" />}
             Send OTP
           </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
              <div className="relative">
                 <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   value={otp}
                   onChange={(e) => setOtp(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none tracking-widest text-lg"
                   placeholder="123456"
                 />
              </div>
           </div>
           <button 
             onClick={verifyOtp}
             disabled={loading || otp.length < 6}
             className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center gap-2"
           >
             {loading && <Loader2 size={18} className="animate-spin" />}
             Verify & Login
           </button>
           <button 
             onClick={() => setVerificationId(null)}
             className="w-full text-sm text-gray-500 hover:text-black"
           >
             Change Number
           </button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
           {error}
        </div>
      )}
    </div>
  )
}

// Add types to window
declare global {
  interface Window {
    recaptchaVerifier: any
  }
}

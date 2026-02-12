'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login, otpLogin } from '@/actions/auth'
import { Loader2, Mail, Lock, ArrowRight, ShieldAlert } from 'lucide-react'

export default function LoginPage({ params }: { params: { lang: string } }) {
  const [isOtp, setIsOtp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const email = formData.get('email') as string
    
    try {
      if (isOtp) {
        const res = await otpLogin({ email })
        if (!res.success) throw new Error(res.error)
        setSuccess(res.message || 'OTP sent!')
      } else {
        const password = formData.get('password') as string
        const res = await login({ email, password })
        if (res?.success === false) throw new Error(res.error)
        // Redirect handled by server action or middleware, but for safety:
        // router.push('/dashboard') // Server action redirects
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl font-bold text-gray-900">
          {isOtp ? 'Login with Code' : 'Welcome back'}
        </h2>
        <p className="text-gray-500 mt-2">
          {isOtp 
            ? 'We will send a magic link to your email.' 
            : 'Enter your credentials to access your dashboard.'}
        </p>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               name="email" 
               type="email" 
               required 
               className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
               placeholder="name@organisation.org"
             />
          </div>
        </div>

        {!isOtp && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Link href="/forgot-password" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                Forgot?
              </Link>
            </div>
            <div className="relative">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input 
                 name="password" 
                 type="password" 
                 required 
                 className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                 placeholder="••••••••"
               />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-start gap-2">
             <ShieldAlert size={16} className="mt-0.5 shrink-0" />
             {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-lg bg-green-50 text-green-600 text-sm flex items-start gap-2">
             <div className="mt-0.5 shrink-0">✅</div>
             {success}
          </div>
        )}

        <button 
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {isOtp ? 'Send Magic Link' : 'Sign In'}
          {!loading && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        <button 
          type="button"
          onClick={() => { setIsOtp(!isOtp); setError(null); setSuccess(null); }}
          className="w-full text-sm text-gray-600 hover:text-black font-medium text-center border py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {isOtp ? 'Use Password instead' : 'Login with Email Code'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Don't have an organisation?{' '}
          <Link href="/signup" className="text-orange-600 font-bold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

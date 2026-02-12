'use client'

import { useState } from 'react'
import Link from 'next/link'
import { forgotPassword } from '@/actions/auth'
import { Loader2, Mail, ArrowLeft, ShieldAlert } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const email = formData.get('email') as string

    try {
      const res = await forgotPassword({ email })
      if (!res.success) throw new Error(res.error)
      setSuccess(res.message || 'Reset link sent!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <Link href="/login" className="text-sm text-gray-500 hover:text-black flex items-center gap-1 mb-6">
           <ArrowLeft size={16} /> Back to Login
        </Link>
        <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
        <p className="text-gray-500 mt-2">
          Enter your email to receive a password reset link.
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
          Send Reset Link
        </button>
      </form>
    </div>
  )
}

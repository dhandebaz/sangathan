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
        <Link href="/login" className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-6 transition-colors">
           <ArrowLeft size={16} /> Back to Login
        </Link>
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Reset Password</h2>
        <p className="text-slate-500 mt-2 text-sm">
          Enter your email to receive a password reset link.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
          <div className="relative">
             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               name="email" 
               type="email" 
               required 
               className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-sm border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-none transition-all text-sm"
               placeholder="name@organisation.org"
             />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm flex items-start gap-2 border border-red-100 rounded-sm">
             <ShieldAlert size={16} className="mt-0.5 shrink-0" />
             {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 text-green-700 text-sm flex items-start gap-2 border border-green-100 rounded-sm">
             <div className="mt-0.5 shrink-0">✅</div>
             {success}
          </div>
        )}

        <button 
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-slate-900 py-2.5 font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50 mt-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Send Reset Link
        </button>
      </form>
    </div>
  )
}

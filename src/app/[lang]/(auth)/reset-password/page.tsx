'use client'

import { useState } from 'react'
import { resetPassword } from '@/actions/auth'
import { Loader2, Lock, ShieldAlert } from 'lucide-react'

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const password = formData.get('password') as string

    try {
      const res = await resetPassword({ password })
      if (!res.success) throw new Error(res.error)
      // Action redirects to dashboard
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Set New Password</h2>
        <p className="text-slate-500 mt-2 text-sm">
          Secure your account with a strong password.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">New Password</label>
          <div className="relative">
             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               name="password" 
               type="password" 
               required 
               minLength={8}
               className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-sm border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-none transition-all text-sm"
               placeholder="Min 8 chars"
             />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Confirm Password</label>
          <div className="relative">
             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               name="confirmPassword" 
               type="password" 
               required 
               minLength={8}
               className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-sm border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-none transition-all text-sm"
               placeholder="Repeat password"
             />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-sm flex items-start gap-2 border border-red-100 rounded-sm">
             <ShieldAlert size={16} className="mt-0.5 shrink-0" />
             {error}
          </div>
        )}

        <button 
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-slate-900 py-2.5 font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-50 mt-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Update Password
        </button>
      </form>
    </div>
  )
}

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
    const confirmPassword = formData.get('confirmPassword') as string

    try {
      const res = await resetPassword({ password, confirmPassword })
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
        <h2 className="text-2xl font-bold text-gray-900">Set New Password</h2>
        <p className="text-gray-500 mt-2">
          Secure your account with a strong password.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <div className="relative">
             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               name="password" 
               type="password" 
               required 
               minLength={8}
               className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
               placeholder="Min 8 chars"
             />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               name="confirmPassword" 
               type="password" 
               required 
               minLength={8}
               className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
               placeholder="Repeat password"
             />
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-start gap-2">
             <ShieldAlert size={16} className="mt-0.5 shrink-0" />
             {error}
          </div>
        )}

        <button 
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          Update Password
        </button>
      </form>
    </div>
  )
}

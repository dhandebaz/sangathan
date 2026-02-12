'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signup } from '@/actions/auth'
import { Loader2, Mail, Lock, User, Building2, ShieldAlert } from 'lucide-react'

export default function SignupPage({ params }: { params: { lang: string } }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const fullName = formData.get('fullName') as string
    const organizationName = formData.get('organizationName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const terms = formData.get('terms') === 'on'

    try {
      const res = await signup({ fullName, organizationName, email, password, confirmPassword, terms })
      if (!res.success) throw new Error(res.error)
      
      router.push(`/${params.lang}/verify-email?email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-2xl font-bold text-gray-900">Start your movement</h2>
        <p className="text-gray-500 mt-2">
          Create a secure, isolated workspace for your organisation.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organisation Name</label>
          <div className="relative">
             <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               name="organizationName" 
               type="text" 
               required 
               className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
               placeholder="Bahujan Student Front"
             />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Full Name</label>
          <div className="relative">
             <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               name="fullName" 
               type="text" 
               required 
               className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
               placeholder="Dr. Ambedkar"
             />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               name="email" 
               type="email" 
               required 
               className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
               placeholder="admin@org.com"
             />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
            <div className="relative">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input 
                 name="confirmPassword" 
                 type="password" 
                 required 
                 minLength={8}
                 className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                 placeholder="Repeat"
               />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 pt-2">
           <input type="checkbox" name="terms" required id="terms" className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" />
           <label htmlFor="terms" className="text-sm text-gray-500">
              I agree to the <Link href="/terms" className="underline text-gray-700">Terms of Service</Link> and <Link href="/privacy" className="underline text-gray-700">Privacy Policy</Link>.
           </label>
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
          Create Organisation
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-600 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

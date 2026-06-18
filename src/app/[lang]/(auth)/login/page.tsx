'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { login, otpLogin, signup } from '@/actions/auth'
import { Loader2, Mail, Lock, ArrowRight, ShieldAlert, User } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export default function AuthPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  async function handleLoginSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const email = formData.get('email') as string
    const method = formData.get('authMethod') as string
    
    try {
      if (method === 'email-otp') {
        const res = await otpLogin({ email })
        if (!res.success) throw new Error(res.error)
        setSuccess(res.message || 'OTP sent! Please check your email.')
      } else {
        const password = formData.get('password') as string
        const res = await login({ email, password })
        if (res?.success === false) throw new Error(res.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleSignupSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const fullName = formData.get('fullName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const terms = formData.get('terms') === 'on'

    try {
      const res = await signup({ fullName, email, password, confirmPassword, terms })
      if (!res.success) throw new Error(res.error)

      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="login">Log In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-0">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-2">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form action={handleLoginSubmit} className="space-y-5">
            <Tabs defaultValue="password" className="w-full">
              <TabsList className="w-full mb-4 bg-transparent border-b rounded-none p-0 h-auto justify-start flex">
                <TabsTrigger
                  value="password"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none data-[state=active]:bg-transparent pb-3 pt-2 px-4"
                >
                  Password
                </TabsTrigger>
                <TabsTrigger
                  value="email-otp"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:shadow-none data-[state=active]:bg-transparent pb-3 pt-2 px-4"
                >
                  Magic Link
                </TabsTrigger>
              </TabsList>

              <TabsContent value="password" className="space-y-5 mt-0">
                <input type="hidden" name="authMethod" value="password" />
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
              </TabsContent>

              <TabsContent value="email-otp" className="space-y-5 mt-0">
                 <input type="hidden" name="authMethod" value="email-otp" />
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
              </TabsContent>
            </Tabs>

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
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-primary-foreground transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Continue
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </TabsContent>

        <TabsContent value="signup" className="mt-0">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-bold text-gray-900">Start your movement</h2>
            <p className="text-gray-500 mt-2">
              Create a secure, isolated workspace for your organisation.
            </p>
          </div>

          <form action={handleSignupSubmit} className="space-y-4">
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
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-primary-foreground transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Create Account
            </button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}

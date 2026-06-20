'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { login, otpLogin, signup } from '@/actions/auth'
import { Loader2, Mail, Lock, ArrowRight, ShieldAlert, User } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'

// Simple SVG Icons for Socials
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>
    </svg>
  )
}

function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login'
  
  const supabase = createClient()

  async function handleOAuthLogin(provider: 'google' | 'twitter') {
    try {
      setLoading(true)
      setError(null)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Social login failed')
      setLoading(false)
    }
  }

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
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1 rounded-sm">
          <TabsTrigger value="login" className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Log In</TabsTrigger>
          <TabsTrigger value="signup" className="rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-0">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-200 bg-white py-2.5 rounded-sm hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              <GoogleIcon className="w-4 h-4" />
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('twitter')}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-200 bg-white py-2.5 rounded-sm hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              <XIcon className="w-4 h-4" />
              X
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
              <span className="bg-white px-3 text-slate-400">Or continue with</span>
            </div>
          </div>

          <form action={handleLoginSubmit} className="space-y-5">
            <Tabs defaultValue="password" className="w-full">
              <TabsList className="w-full mb-4 bg-transparent border-b border-slate-200 rounded-none p-0 h-auto justify-start flex">
                <TabsTrigger
                  value="password"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:text-slate-900 text-slate-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent pb-3 pt-2 px-4 text-sm font-medium transition-colors"
                >
                  Password
                </TabsTrigger>
                <TabsTrigger
                  value="email-otp"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:text-slate-900 text-slate-500 data-[state=active]:shadow-none data-[state=active]:bg-transparent pb-3 pt-2 px-4 text-sm font-medium transition-colors"
                >
                  Magic Link
                </TabsTrigger>
              </TabsList>

              <TabsContent value="password" className="space-y-4 mt-0">
                <input type="hidden" name="authMethod" value="password" />
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

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
                    <Link href="/forgot-password" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                     <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     <input
                       name="password"
                       type="password"
                       required
                       className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-sm border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-none transition-all text-sm"
                       placeholder="••••••••"
                     />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="email-otp" className="space-y-4 mt-0">
                 <input type="hidden" name="authMethod" value="email-otp" />
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
              </TabsContent>
            </Tabs>

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
              Continue
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>
        </TabsContent>

        <TabsContent value="signup" className="mt-0">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Start your movement</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Create a secure, isolated workspace for your organisation.
            </p>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-200 bg-white py-2.5 rounded-sm hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              <GoogleIcon className="w-4 h-4" />
              Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('twitter')}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 border border-slate-200 bg-white py-2.5 rounded-sm hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 disabled:opacity-50"
            >
              <XIcon className="w-4 h-4" />
              X
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
              <span className="bg-white px-3 text-slate-400">Or register with email</span>
            </div>
          </div>

          <form action={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Your Full Name</label>
              <div className="relative">
                 <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input
                   name="fullName"
                   type="text"
                   required
                   className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-sm border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-none transition-all text-sm"
                   placeholder="Dr. Ambedkar"
                 />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                 <input 
                   name="email"
                   type="email"
                   required 
                   className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-sm border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-none transition-all text-sm"
                   placeholder="admin@org.com"
                 />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
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
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Confirm</label>
                <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input
                     name="confirmPassword"
                     type="password"
                     required
                     minLength={8}
                     className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-sm border border-slate-200 focus:border-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-400 outline-none transition-all text-sm"
                     placeholder="Repeat"
                   />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-2">
               <input type="checkbox" name="terms" required id="terms" className="mt-1 w-4 h-4 text-slate-900 bg-slate-50 border-slate-300 rounded-sm focus:ring-slate-900" />
               <label htmlFor="terms" className="text-sm text-slate-600">
                  I agree to the <Link href="/terms" className="underline decoration-slate-300 text-slate-900">Terms of Service</Link> and <Link href="/privacy" className="underline decoration-slate-300 text-slate-900">Privacy Policy</Link>.
               </label>
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
              Create Account
            </button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center py-12"><Loader2 className="animate-spin text-slate-400" size={32} /></div>}>
      <AuthForm />
    </Suspense>
  )
}

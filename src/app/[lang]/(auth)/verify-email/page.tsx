'use client'

import { Mail } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 text-orange-600 rounded-full mb-6">
         <Mail size={32} />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">
        We've sent a verification link to <strong>{email || 'your email address'}</strong>. 
        Please click the link to activate your organisation workspace.
      </p>
      
      <div className="text-sm text-gray-400">
         <p>Did not receive the email?</p>
         <p>Check your spam folder or <Link href="/login" className="text-orange-600 hover:underline">try logging in</Link> to resend.</p>
      </div>
    </div>
  )
}

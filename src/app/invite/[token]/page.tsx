import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { validateInvite, acceptInvite } from '@/actions/invites'
import { Button } from '@/components/ui/button'
import { Building2, Mail, ShieldCheck, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const validation = await validateInvite(token)

  if (!validation.valid) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-sm shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Invalid Invite</h1>
          <p className="text-sm text-slate-500 mb-6">{validation.error}</p>
          <Button asChild className="w-full">
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  const invite = validation.invite!
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    if (user.email !== invite.email) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-sm shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Wrong Account</h1>
            <p className="text-sm text-slate-500 mb-2">
              This invite was sent to <strong>{invite.email}</strong>
            </p>
            <p className="text-sm text-slate-500 mb-6">
              You are currently logged in as <strong>{user.email}</strong>. Please logout and login with the correct account.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">Switch Account</Link>
            </Button>
          </div>
        </div>
      )
    }

    const result = await acceptInvite(token)

    if (result.success) {
      redirect('/dashboard')
    }

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-sm shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Could Not Join</h1>
          <p className="text-sm text-slate-500 mb-6">{result.error}</p>
          <Button asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-sm shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">You&apos;re Invited!</h1>
        <p className="text-sm text-slate-500 mb-6">
          You&apos;ve been invited to join <strong>{invite.organisationName}</strong> on Sangathan.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 mb-6 text-left space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">{invite.organisationName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600">{invite.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span className="text-slate-600 capitalize">Role: {invite.role}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href={`/login?tab=signup&invite=${token}&email=${encodeURIComponent(invite.email)}`}>
              Create Account & Join
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href={`/login?invite=${token}&email=${encodeURIComponent(invite.email)}`}>
              Login & Join
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

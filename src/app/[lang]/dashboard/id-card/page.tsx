import { getSelectedOrganisationId } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { User, QrCode, School, Calendar, Building2, Award } from 'lucide-react'
import { MemberBadgeStudio } from '@/components/members/member-badge-studio'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DigitalIDPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()
  
  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const supabase = await createClient()

  // Get current user profile and org details
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      organisations (name, type, slug)
    `)
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) return <div className="p-8 text-center">Profile not found.</div>

  const orgName = profile.organisations?.name || 'Democratic Collective'
  const orgSlug = profile.organisations?.slug || 'collective'
  const memberName = profile.full_name || 'Member'
  const role = profile.role || 'Member'
  const memberId = `SAN-${new Date().getFullYear()}-${user.id.slice(0, 6).toUpperCase()}`

  return (
    <div className="space-y-10 max-w-5xl mx-auto py-6 px-4">
      {/* Top Banner */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Digital Identity & Verified Badges
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your official digital member ID and export verified graphics for social media.
          </p>
        </div>

        <Link
          href={`/${lang}/members/badge`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-sm hover:bg-indigo-100 transition-colors"
        >
          <Award className="w-3.5 h-3.5" />
          <span>Open Full Badge Studio</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Classic Official Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 self-start">
            Official Organization ID
          </h2>

          <Card className="w-full relative overflow-hidden border border-slate-200 shadow-md bg-white rounded-sm">
            {/* Header Ribbon */}
            <div className="h-20 bg-slate-900 flex items-center justify-between px-5 relative">
              <div className="flex items-center gap-2">
                <School className="w-6 h-6 text-white opacity-80" />
                <h2 className="text-white font-bold text-sm uppercase tracking-wider">
                  {orgName}
                </h2>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                {profile.organisations?.type || 'CIVIC'}
              </span>
            </div>

            {/* Photo and Details */}
            <div className="p-6 pt-10 relative flex flex-col items-center">
              <div className="absolute -top-10 w-20 h-20 bg-white rounded-full p-1 shadow border border-slate-200">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                  <User className="w-10 h-10 text-slate-400" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mt-2">{memberName}</h3>
              <p className="text-indigo-600 font-semibold uppercase tracking-wide text-xs mt-0.5 mb-4">
                {role}
              </p>

              <div className="w-full space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-sm">
                  <span className="text-slate-500 font-medium">ID Reference</span>
                  <span className="font-mono font-bold text-slate-800">{memberId}</span>
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-sm">
                  <span className="text-slate-500 font-medium">Member Since</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center">
                <div className="p-2 bg-white border border-slate-200 rounded-sm mb-1">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest">
                  CRYPTOGRAPHICALLY VERIFIED
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 text-center border-t text-[11px] text-slate-400 font-medium">
              Official Digital Identifier • Sangathan Network
            </div>
          </Card>
        </div>

        {/* Right: Embedded Social Badge Studio */}
        <div className="lg:col-span-7">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Social Media Graphic Generator
          </h2>
          <MemberBadgeStudio
            initialMemberName={memberName}
            initialOrgName={orgName}
            initialRole={role}
            initialOrgSlug={orgSlug}
            initialMemberId={memberId}
          />
        </div>
      </div>
    </div>
  )
}

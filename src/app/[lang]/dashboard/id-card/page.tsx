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
      organisations (name, org_type, slug, logo_url)
    `)
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) return <div className="p-8 text-center">Profile not found.</div>

  const orgName = profile.organisations?.name || 'Democratic Collective'
  const orgSlug = profile.organisations?.slug || 'collective'
  const orgType = profile.organisations?.org_type || 'civic_collective'
  const memberName = profile.full_name || 'Member'
  const role = profile.role || profile.designation || 'Member'
  const memberId = `SAN-${new Date().getFullYear()}-${user.id.slice(0, 6).toUpperCase()}`
  const avatarUrl = user.user_metadata?.avatar_url || null

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-6 px-4">
      {/* Top Banner */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Digital Identity & Verified Credential Studio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your official digital member pass, customize high-resolution verified badges, and export for WhatsApp, Twitter/X, or physical printing.
          </p>
        </div>

        <Link
          href={`/${lang}/members/badge`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-sm hover:bg-indigo-100 transition-colors"
        >
          <Award className="w-4 h-4" />
          <span>Open Full Standalone Studio</span>
        </Link>
      </div>

      <div>
        <MemberBadgeStudio
          initialMemberName={memberName}
          initialOrgName={orgName}
          initialRole={role}
          initialOrgSlug={orgSlug}
          initialMemberId={memberId}
          initialOrgType={orgType}
          initialAvatarUrl={avatarUrl}
          initialLang={lang === 'hi' ? 'hi' : 'en'}
        />
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { MemberBadgeStudio } from '@/components/members/member-badge-studio'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'सत्यापित सदस्य बैज | संगठन' : 'Verified Member Badge Studio | Sangathan',
    description: 'Generate dynamic, shareable social media badges as a verified member or protector.',
  }
}

export default async function MemberBadgePage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const orgId = await getSelectedOrganisationId()

  let profileData: any = null
  if (orgId) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, role, organisations(name, slug)')
      .eq('id', user.id)
      .maybeSingle()
    profileData = data
  }

  const memberName = profileData?.full_name || user.user_metadata?.full_name || 'Member'
  const orgName = profileData?.organisations?.name || 'Democratic Civic Collective'
  const orgSlug = profileData?.organisations?.slug || 'collective'
  const role = profileData?.role || 'Active Member'
  const memberId = `SAN-${new Date().getFullYear()}-${user.id.slice(0, 6).toUpperCase()}`

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      <MemberBadgeStudio
        initialMemberName={memberName}
        initialOrgName={orgName}
        initialRole={role}
        initialOrgSlug={orgSlug}
        initialMemberId={memberId}
      />
    </div>
  )
}

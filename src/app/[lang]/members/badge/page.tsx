import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { MemberBadgeStudio } from '@/components/members/member-badge-studio'
import { Metadata } from 'next'
import { Award, ShieldCheck, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'सत्यापित सदस्य बैज व डिजिटल पहचान पत्र | संगठन' : 'Verified Member Badge & Credential Studio | Sangathan',
    description: isHindi
      ? 'नागरिक समूहों, एनजीओ, छात्र संघों, श्रमिक संघों और आरडब्ल्यूए के लिए आधिकारिक सत्यापित सोशल बैज व डिजिटल आईडी बनाएं।'
      : 'Generate dynamic, cryptographically verified member credentials, social badges, and printable ID passes across all organization types.',
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
      .select('full_name, role, designation, organisations(name, slug, org_type, logo_url)')
      .eq('id', user.id)
      .maybeSingle()
    profileData = data
  }

  const memberName = profileData?.full_name || user.user_metadata?.full_name || 'Member'
  const orgName = profileData?.organisations?.name || 'Democratic Civic Collective'
  const orgSlug = profileData?.organisations?.slug || 'collective'
  const orgType = profileData?.organisations?.org_type || 'civic_collective'
  const role = profileData?.role || profileData?.designation || 'Active Member'
  const memberId = `SAN-${new Date().getFullYear()}-${user.id.slice(0, 6).toUpperCase()}`
  const avatarUrl = user.user_metadata?.avatar_url || null

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
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
  )
}

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { UnifiedPeopleHub } from '@/components/dashboard/people/unified-people-hub'
import { getSubgroups } from '@/actions/subgroups'
import { getVolunteerCertificates } from '@/actions/volunteer-certificates'
import { Metadata } from 'next'
import { Member } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'सदस्य एवं कार्यसमिति | संगठन' : 'People & Member Directory | Sangathan',
    description: 'Centralized directory for organization members, digital ID cards, committees, volunteers, and certificates.',
  }
}

export default async function PeoplePage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, role, display_name, full_name, designation')
    .eq('id', user.id)
    .maybeSingle()

  let selectedOrgId = profile?.organisation_id
  if (!selectedOrgId) {
    try {
      selectedOrgId = await getSelectedOrganisationId()
    } catch {
      // fallback
    }
  }

  if (!selectedOrgId) redirect(`/${lang}/onboarding`)

  const [orgRes, membersRes, subgroupsRes, certsRes, networksRes] = await Promise.all([
    supabase
      .from('organisations')
      .select('name, org_type, slug, logo_url')
      .eq('id', selectedOrgId)
      .maybeSingle(),
    supabase
      .from('profiles')
      .select('*')
      .eq('organisation_id', selectedOrgId)
      .order('created_at', { ascending: false }),
    getSubgroups(selectedOrgId),
    getVolunteerCertificates(selectedOrgId),
    supabase
      .from('network_memberships')
      .select('network:networks(*)')
      .eq('organisation_id', selectedOrgId)
      .eq('status', 'active')
  ])

  const org = orgRes.data
  const allMembers = (membersRes.data || []) as unknown as Member[]
  const subgroupsData = ((subgroupsRes.data || []) as any[]).map(sg => ({
    id: sg.id,
    name: sg.name,
    type: sg.type,
    description: sg.description,
    memberCount: sg.org_subgroup_members?.[0]?.count || 0
  }))

  const volunteers = allMembers.filter(m => m.role === 'member' || m.role === 'viewer')
  const certificates = certsRes.success ? (certsRes.certificates || []) : []
  const networks = (networksRes.data || []).map((m: any) => m.network).filter(Boolean)

  const isAdmin = ['admin', 'executive'].includes(profile?.role || '')

  return (
    <UnifiedPeopleHub
      lang={lang}
      orgId={selectedOrgId}
      orgType={org?.org_type || 'ngo'}
      orgName={org?.name || 'Sangathan Collective'}
      orgSlug={org?.slug || 'collective'}
      logoUrl={org?.logo_url || null}
      isAdmin={isAdmin}
      initialMembers={allMembers}
      totalMembersCount={allMembers.length}
      subgroups={subgroupsData}
      volunteers={volunteers}
      certificates={certificates}
      networks={networks}
      currentUserProfile={{
        id: user.id,
        full_name: profile?.full_name || profile?.display_name || user.email?.split('@')[0] || 'Member',
        role: profile?.role || 'member',
        designation: profile?.designation || undefined,
        avatar_url: user.user_metadata?.avatar_url || null
      }}
    />
  )
}

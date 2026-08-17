import { FieldAuditsClient } from '@/components/dashboard/civic/field-audits-client'
import { getFieldSpotAuditsAction } from '@/actions/field-audits'
import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Field Spot Audits & Sensor Logger | Sangathan',
    description: 'Ground evidence and citizen science testing desk for air quality, water tests, and statutory pollution notices.',
  }
}

export default async function FieldAuditsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .maybeSingle()

  let orgId = profile?.organisation_id
  if (!orgId) {
    try {
      orgId = await getSelectedOrganisationId()
    } catch {
      // fallback
    }
  }

  if (!orgId) {
    redirect(`/${lang}/onboarding`)
  }

  const { data: org } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', orgId)
    .maybeSingle()

  const auditsRes = await getFieldSpotAuditsAction(orgId)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <FieldAuditsClient
        orgId={orgId}
        orgName={org?.name || 'Civic Collective'}
        initialAudits={auditsRes.data || []}
      />
    </div>
  )
}

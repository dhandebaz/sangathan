import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { getComplianceItems } from '@/actions/compliance/items'
import { ComplianceTracker } from '@/components/compliance/compliance-tracker'

export const dynamic = 'force-dynamic'

export default async function CompliancePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const supabase = await createClient()
  const orgId = await getSelectedOrganisationId()

  let orgType = 'ngo'
  if (orgId) {
    const { data } = await supabase.from('organisations').select('org_type').eq('id', orgId).single()
    if (data?.org_type) orgType = data.org_type
  }

  const items = orgId ? await getComplianceItems(orgId) : []

  return <ComplianceTracker items={items} orgType={orgType} lang={lang} />
}

import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { ImportWizard } from '@/components/members/import-wizard'
import { getOrgPlanUsage } from '@/lib/plans/limits'

export const dynamic = 'force-dynamic'

export default async function MemberImportPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${lang}/login`)
  }

  const selectedOrgId = await getSelectedOrganisationId()
  if (!selectedOrgId) {
    redirect(`/${lang}/select-organisation`)
  }

  const { data: org } = await supabase
    .from('organisations')
    .select('org_type')
    .eq('id', selectedOrgId)
    .single()

  const usage = await getOrgPlanUsage(selectedOrgId)
  const remaining = Math.max(0, usage.maxMembers - usage.memberCount)

  return (
    <div className="py-4">
      <ImportWizard lang={lang} orgType={org?.org_type || 'ngo'} remainingCapacity={remaining} />
    </div>
  )
}

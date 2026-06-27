import { GrantsClient } from '@/components/dashboard/grants/grants-client'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'

export default async function GrantsPage() {
  const orgId = await getSelectedOrganisationId()
  
  if (!orgId) {
    redirect('/onboarding')
  }

  return (
    <div className="space-y-6">
      <GrantsClient orgId={orgId} />
    </div>
  )
}

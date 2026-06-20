import { GrantsClient } from '@/components/dashboard/grants/grants-client'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'

export default async function GrantsPage() {
  const orgId = await getSelectedOrganisationId()
  
  if (!orgId) {
    redirect('/onboarding')
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <GrantsClient />
    </div>
  )
}

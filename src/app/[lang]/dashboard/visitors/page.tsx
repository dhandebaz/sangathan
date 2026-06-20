import { VisitorsClient } from '@/components/dashboard/visitors/visitors-client'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'

export default async function VisitorsPage() {
  const orgId = await getSelectedOrganisationId()
  
  if (!orgId) {
    redirect('/onboarding')
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <VisitorsClient orgId={orgId} />
    </div>
  )
}

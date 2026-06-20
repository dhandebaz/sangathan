import { CBAClient } from '@/components/dashboard/cba/cba-client'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'

export default async function CBAPage() {
  const orgId = await getSelectedOrganisationId()
  
  if (!orgId) {
    redirect('/onboarding')
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <CBAClient />
    </div>
  )
}

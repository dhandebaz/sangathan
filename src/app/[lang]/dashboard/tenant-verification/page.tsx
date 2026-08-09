import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import TenantVerificationClient from '@/components/dashboard/tenant-verification/tenant-verification-client'

export default async function TenantVerificationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()
  if (!organisationId) redirect(`/${lang}/login`)
  
  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Tenant Verification Form
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate pre-filled police verification forms for tenants. Print and submit to your local SHO office.
        </p>
      </div>
      <TenantVerificationClient />
    </div>
  )
}

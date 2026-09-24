import { getSelectedOrganisationId } from '@/lib/auth/context'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import MunicipalLettersClient from '@/components/dashboard/municipal-letters/municipal-letters-client'

export default async function MunicipalLettersPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()

  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const adminClient = createServiceClient()
  const { data: org } = await adminClient
    .from('organisations')
    .select('name')
    .eq('id', organisationId)
    .maybeSingle()

  return (
    <div className="space-y-6">
      <div className="print:hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Municipal Letters & Representations
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate official colony letters to MLAs, Ward Councillors, MCD, DJB, BSES, and Police using pre-formatted templates.
          </p>
        </div>
      </div>

      <MunicipalLettersClient
        organisationId={organisationId}
        defaultOrgName={org?.name || 'Our Organisation'}
      />
    </div>
  )
}

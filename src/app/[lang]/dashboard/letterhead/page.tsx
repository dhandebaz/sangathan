import { getSelectedOrganisationId } from '@/lib/auth/context'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import LetterheadClient from '@/components/dashboard/letterhead/letterhead-client'

export default async function LetterheadPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()

  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const adminClient = createServiceClient()
  const { data: org } = await adminClient
    .from('organisations')
    .select('name, logo_url')
    .eq('id', organisationId)
    .maybeSingle()

  return (
    <div className="space-y-6">
      <div className="print:hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Official Letterhead & PDF Exporter
          </h1>
          <p className="text-slate-500 mt-1">
            Format formal representations, press releases, and RTI applications into official print-ready letterheads.
          </p>
        </div>
      </div>

      <LetterheadClient
        organisationId={organisationId}
        defaultOrgName={org?.name || 'My Organisation'}
        defaultLogoUrl={org?.logo_url || ''}
      />
    </div>
  )
}

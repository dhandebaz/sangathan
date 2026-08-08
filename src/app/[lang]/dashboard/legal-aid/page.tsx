import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import LegalAidClient from '@/components/dashboard/legal-aid/legal-aid-client'
import { getLegalLogs } from '@/actions/legal-aid'

export default async function LegalAidPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()

  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const { logs } = await getLegalLogs(organisationId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Legal Aid & Anti-Ragging Cell
          </h1>
          <p className="text-slate-500 mt-1">
            Protest detention SOS alerts, volunteer advocate directory, and UGC-compliant anti-ragging cell.
          </p>
        </div>
      </div>

      <LegalAidClient organisationId={organisationId} initialLogs={logs || []} />
    </div>
  )
}

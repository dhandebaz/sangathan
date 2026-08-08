import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import RtiAtrClient from '@/components/dashboard/rti-atr/rti-atr-client'
import { getRtiAtrLogs } from '@/actions/rti-atr'

export default async function RtiAtrPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()

  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const { logs } = await getRtiAtrLogs(organisationId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            RTI & Action Taken Report (ATR) Assistant
          </h1>
          <p className="text-slate-500 mt-1">
            File Right to Information (RTI Act 2005) queries & track Vice-Chancellor / Dean commitment deadlines.
          </p>
        </div>
      </div>

      <RtiAtrClient organisationId={organisationId} initialLogs={logs || []} />
    </div>
  )
}

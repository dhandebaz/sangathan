import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import HostelMessClient from '@/components/dashboard/hostel-mess/hostel-mess-client'
import { getHostelMessLogs } from '@/actions/hostel-mess'

export default async function HostelMessPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()

  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const { logs } = await getHostelMessLogs(organisationId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Hostel & Mess Quality Audit Portal
          </h1>
          <p className="text-slate-500 mt-1">
            Hostel room allotment tracking, mess food quality reviews, and 24x7 study hall status.
          </p>
        </div>
      </div>

      <HostelMessClient organisationId={organisationId} initialLogs={logs || []} />
    </div>
  )
}

import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import CountingClient from '@/components/dashboard/election-counting/counting-client'
import { getElectionTallyLogs } from '@/actions/election-counting'

export default async function ElectionCountingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()

  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const { logs } = await getElectionTallyLogs(organisationId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Live Campus Election Counting Tally Desk
          </h1>
          <p className="text-slate-500 mt-1">
            Real-time booth-by-booth vote counting tally logger and Central Panel leads tracker.
          </p>
        </div>
      </div>

      <CountingClient organisationId={organisationId} initialLogs={logs || []} />
    </div>
  )
}

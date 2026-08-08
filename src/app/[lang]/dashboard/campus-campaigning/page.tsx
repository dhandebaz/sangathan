import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import CampaigningClient from '@/components/dashboard/campus-campaigning/campaigning-client'
import { getCampaigningLogs } from '@/actions/campus-campaigning'

export default async function CampusCampaigningPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()

  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const { tasks, events } = await getCampaigningLogs(organisationId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Campus Campaigning & Mobilization Suite
          </h1>
          <p className="text-slate-500 mt-1">
            Hostel-to-Hostel (H2H) canvassing tracker, Class-to-Class (C2C) lecture campaign scheduler, and poster wall allocation.
          </p>
        </div>
      </div>

      <CampaigningClient
        organisationId={organisationId}
        initialTasks={tasks || []}
        initialEvents={events || []}
      />
    </div>
  )
}

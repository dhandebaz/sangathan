import { getSelectedOrganisationId } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import CollaborationClient from '@/components/dashboard/collaboration/collaboration-client'
import { getCollaboratingOrgs, getPendingRequests } from '@/actions/collaboration'

export default async function CollaborationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()

  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const partners = await getCollaboratingOrgs(organisationId)
  const pending = await getPendingRequests(organisationId)

  // Fetch available organizations on the same campus or platform to invite
  const adminClient = createServiceClient()
  const { data: availableOrgs } = await adminClient
    .from('organisations')
    .select('id, name, slug, org_type')
    .neq('id', organisationId)
    .limit(50)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Multi-Org Collaboration Hub (संयुक्त मोर्चा)
          </h1>
          <p className="text-slate-500 mt-1">
            Co-sign joint Gyapans, schedule joint protests/rallies, and manage campus student alliances.
          </p>
        </div>
      </div>

      <CollaborationClient
        organisationId={organisationId}
        activePartners={partners || []}
        pendingIncoming={pending.incoming || []}
        pendingOutgoing={pending.outgoing || []}
        availableOrgs={availableOrgs || []}
      />
    </div>
  )
}

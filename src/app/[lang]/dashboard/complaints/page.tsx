import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { TicketManager } from '@/components/dashboard/ticket-manager'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ComplaintsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  let orgId = profile?.organisation_id
  let role = profile?.role || 'member'

  if (!orgId) {
    try {
      orgId = await getSelectedOrganisationId()
    } catch {
      // fallback
    }
  }

  if (!orgId) {
    return (
      <TicketManager 
        type="complaint"
        title="Resident Complaints"
        description="Manage and resolve complaints from community members and residents."
        tickets={[]}
        role={role}
        isAdminOrEditor={false}
      />
    )
  }

  let tickets: any[] = []

  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('organisation_id', orgId)
    .eq('type', 'complaint')
    .order('created_at', { ascending: false })

  if (error) {
    try {
      const adminClient = createServiceClient()
      const fallbackRes = await adminClient
        .from('tickets')
        .select('*')
        .eq('organisation_id', orgId)
        .eq('type', 'complaint')
        .order('created_at', { ascending: false })

      if (!fallbackRes.error) {
        tickets = fallbackRes.data || []
      }
    } catch {
      tickets = []
    }
  } else {
    tickets = data || []
  }

  return (
    <TicketManager 
      type="complaint"
      title="Resident Complaints"
      description="Manage and resolve complaints from community members and residents."
      tickets={tickets}
      role={role}
      isAdminOrEditor={['admin', 'editor', 'executive'].includes(role)}
    />
  )
}

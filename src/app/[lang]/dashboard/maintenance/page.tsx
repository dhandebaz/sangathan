import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { TicketManager } from '@/components/dashboard/ticket-manager'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function MaintenancePage(props: { params: Promise<{ lang: string }> }) {
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
  const role = profile?.role || 'member'

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
        type="maintenance"
        title="Maintenance Requests"
        description="Track facility repairs, plumbing, electrical, and infrastructure requests."
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
    .eq('type', 'maintenance')
    .order('created_at', { ascending: false })

  if (error) {
    try {
      const adminClient = createServiceClient()
      const fallbackRes = await adminClient
        .from('tickets')
        .select('*')
        .eq('organisation_id', orgId)
        .eq('type', 'maintenance')
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
      type="maintenance"
      title="Maintenance Requests"
      description="Track facility repairs, plumbing, electrical, and infrastructure requests."
      tickets={tickets}
      role={role}
      isAdminOrEditor={['admin', 'editor', 'executive'].includes(role)}
    />
  )
}

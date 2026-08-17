import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { ComplaintPrintView } from '@/components/complaints/complaint-print-view'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ lang: string; id: string }>
}

export default async function ComplaintPrintPage({ params }: Props) {
  const { lang, id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .maybeSingle()

  const orgId = profile?.organisation_id
  const role = profile?.role || 'member'

  if (!orgId) {
    return <div className="p-8 text-center text-slate-500">Organisation not found</div>
  }

  let ticket: any = null

  const { data, error } = await supabase
    .from('tickets')
    .select('*, authority_contacts(*)')
    .eq('id', id)
    .eq('organisation_id', orgId)
    .maybeSingle()

  if (error) {
    try {
      const adminClient = createServiceClient()
      const fallbackRes = await adminClient
        .from('tickets')
        .select('*, authority_contacts(*)')
        .eq('id', id)
        .eq('organisation_id', orgId)
        .maybeSingle()

      if (!fallbackRes.error) {
        ticket = fallbackRes.data
      }
    } catch {
      ticket = null
    }
  } else {
    ticket = data
  }

  if (!ticket) {
    return <div className="p-8 text-center text-slate-500">Complaint not found</div>
  }

  // Check permissions
  const canView = ['admin', 'editor', 'executive', 'can_edit', 'can_comment', 'can_manage', 'second_admin'].includes(role)
  if (!canView) {
    return <div className="p-8 text-center text-slate-500">Access denied</div>
  }

  // Get org details for letterhead
  const { data: org } = await supabase
    .from('organisations')
    .select('name, logo_url, address, contact_phone, contact_email')
    .eq('id', orgId)
    .maybeSingle()

  return <ComplaintPrintView ticket={ticket} org={org} lang={lang} />
}
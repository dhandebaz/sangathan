import { createClient } from '@/lib/supabase/server'
import { getUserContext } from '@/lib/auth/context'
import { VolunteersClient } from '@/components/dashboard/volunteers-client'

export const dynamic = 'force-dynamic'

export default async function VolunteersPage() {
  const supabase = await createClient()
  const ctx = await getUserContext()

  // Fetch all active members for the NGO to act as the volunteer roster
  const { data: volunteers } = await supabase
    .from('members')
    .select('*')
    .eq('organisation_id', ctx.organizationId)
    .eq('status', 'active')

  const typedVolunteers = volunteers || []

  return <VolunteersClient initialVolunteers={typedVolunteers} />
}

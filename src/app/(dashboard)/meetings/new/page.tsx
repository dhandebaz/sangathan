import { createClient } from '@/lib/supabase/server'
import { CreateMeetingForm } from '@/components/meetings/create-meeting-form'

export const dynamic = 'force-dynamic'

export default async function NewMeetingPage() {
  const supabase = await createClient()

  // Fetch active members to populate the invite list
  const { data: members } = await supabase
    .from('members')
    .select('id, full_name')
    .eq('status', 'active')
    .order('full_name')

  return (
    <CreateMeetingForm members={members || []} />
  )
}

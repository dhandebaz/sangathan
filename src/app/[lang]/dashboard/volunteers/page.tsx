import { createClient } from '@/lib/supabase/server'
import { VolunteersClient } from '@/components/dashboard/volunteers-client'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function VolunteersPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${lang}/login`)
  }

  // Fast direct profile lookup to avoid Redis latency
  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  const orgId = profile?.organisation_id
  if (!orgId) {
    return <VolunteersClient initialVolunteers={[]} />
  }

  // Fetch active volunteers with lightweight columns & limit for fast response
  const { data: volunteers } = await supabase
    .from('members')
    .select('id, full_name, email, phone, created_at')
    .eq('organisation_id', orgId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(100)

  return <VolunteersClient initialVolunteers={volunteers || []} />
}

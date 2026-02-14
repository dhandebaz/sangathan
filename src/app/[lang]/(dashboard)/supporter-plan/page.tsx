import { createClient } from '@/lib/supabase/server'
import { getUserContext } from '@/lib/auth/context'
import { SupporterDashboard } from '@/components/supporter/supporter-dashboard'

export const dynamic = 'force-dynamic'

export default async function SupporterPlanPage() {
  const supabase = await createClient()
  const ctx = await getUserContext()

  // Fetch Organisation Details
  const { data: orgData } = await supabase
    .from('organisations')
    .select('remove_branding')
    .eq('id', ctx.organizationId)
    .single()
  
  const org = orgData as { remove_branding: boolean } | null

  // Fetch Subscription Status
  const { data: subData } = await supabase
    .from('supporter_subscriptions')
    .select('*')
    .eq('organisation_id', ctx.organizationId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  
  const subscription = subData as Record<string, unknown> | null

  return (
    <SupporterDashboard 
       subscription={subscription} 
       organisation={org} 
    />
  )
}

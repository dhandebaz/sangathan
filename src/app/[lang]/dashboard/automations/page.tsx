import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { AutomationsClient } from '@/components/dashboard/automations-client'
import { getAutomationsAction } from '@/actions/automations'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'नो-कोड वर्कफ़्लो ऑटोमेशन | संगठन' : 'No-Code Workflow Automations | Sangathan',
    description: 'Event-driven automation builder for member onboarding, digital IDs, and emergency alerts.',
  }
}

export default async function AutomationsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const orgId = await getSelectedOrganisationId()
  if (!orgId) redirect(`/${lang}/onboarding`)

  let orgName = 'Sangathan Collective'
  const { data: org } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', orgId)
    .maybeSingle()

  if (org?.name) orgName = org.name

  const res = await getAutomationsAction(orgId)
  const initialAutomations = res.data || []

  return <AutomationsClient initialAutomations={initialAutomations} orgName={orgName} />
}

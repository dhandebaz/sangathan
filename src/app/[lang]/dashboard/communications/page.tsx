import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { CommunicationsClient } from '@/components/dashboard/communications-client'
import { getOrgUnifiedCommunicationsAction } from '@/actions/bot-channels'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'एकीकृत संचार एवं डिस्पैच डेस्क | संगठन' : 'Unified Communications & Dispatch Desk | Sangathan',
    description: 'Centralized 2-way inbox for member communications across WhatsApp and Telegram.',
  }
}

export default async function CommunicationsPage(props: { params: Promise<{ lang: string }> }) {
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
    .single()

  if (org?.name) orgName = org.name

  const result = await getOrgUnifiedCommunicationsAction(orgId)

  return (
    <CommunicationsClient
      lang={lang}
      orgId={orgId}
      orgName={orgName}
      configs={result.configs || []}
      initialConversations={(result.conversations || []) as any}
      stats={result.stats || { totalConversations: 0, totalInboundMessages: 0, totalBotGrievances: 0, totalSosAlerts: 0 }}
    />
  )
}

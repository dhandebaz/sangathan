import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { UnifiedInboxHub } from '@/components/dashboard/inbox/unified-inbox-hub'
import { getOrgUnifiedCommunicationsAction } from '@/actions/bot-channels'
import { getEmergencySosAlerts } from '@/actions/emergency-sos'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'एकीकृत इनबॉक्स एवं संवाद | संगठन' : 'Unified Inbox & Communications | Sangathan',
    description: 'All-in-one unified inbox: 2-way member chats, Telegram Bot, Google Meet video calls, mass broadcasts, and emergency SOS.',
  }
}

export default async function InboxPage(props: { params: Promise<{ lang: string }> }) {
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

  // Fetch communications data, SOS alerts, and member list
  const [commsRes, sosAlerts, membersRes] = await Promise.all([
    getOrgUnifiedCommunicationsAction(orgId),
    getEmergencySosAlerts(orgId),
    supabase
      .from('members')
      .select('id, full_name, phone, role')
      .eq('organisation_id', orgId)
      .eq('status', 'active')
      .limit(100)
  ])

  return (
    <UnifiedInboxHub
      lang={lang}
      orgId={orgId}
      orgName={orgName}
      configs={commsRes.configs || []}
      initialConversations={(commsRes.conversations || []) as any}
      stats={commsRes.stats || { totalConversations: 0, totalInboundMessages: 0, totalBotGrievances: 0, totalSosAlerts: 0 }}
      initialSosAlerts={sosAlerts || []}
      members={membersRes.data || []}
    />
  )
}

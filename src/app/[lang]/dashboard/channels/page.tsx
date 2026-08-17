import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { ChannelsHub } from '@/components/dashboard/channels-hub'
import { getChannelConfigsAction } from '@/actions/bot-channels'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'टेलीग्राम बॉट एवं मैसेजिंग चैनल्स | संगठन' : 'Telegram Bot & Messaging Channels | Sangathan',
    description: 'Connect live Telegram Bots with grammY webhooks for automated grassroots civic engagement.',
  }
}

export default async function ChannelsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const orgId = await getSelectedOrganisationId()
  if (!orgId) redirect(`/${lang}/onboarding`)

  const result = await getChannelConfigsAction(orgId)

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    'https://sangathan.space'

  return (
    <ChannelsHub
      lang={lang}
      orgId={orgId}
      initialConfigs={result.configs || []}
      initialOutboundLogs={result.outboundLogs || []}
      appUrl={appUrl}
    />
  )
}

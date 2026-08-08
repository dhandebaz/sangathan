import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { BotSimulator } from '@/components/dashboard/bot-simulator'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'व्हाट्सएप एवं टेलीग्राम बॉट | संगठन' : 'WhatsApp & Telegram Bot Console | Sangathan',
    description: 'Ground-level low-bandwidth conversational interface for grievances, dues, attendance, and emergency alerts.',
  }
}

export default async function BotSimulatorPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const orgId = await getSelectedOrganisationId()
  if (!orgId) redirect(`/${lang}/onboarding`)

  let orgName = 'Democratic Collective'
  const { data: org } = await supabase
    .from('organisations')
    .select('name')
    .eq('id', orgId)
    .single()

  if (org?.name) orgName = org.name

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <BotSimulator orgId={orgId} orgName={orgName} />
    </div>
  )
}

import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function BotSimulatorPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  redirect(`/${lang}/dashboard/channels`)
}


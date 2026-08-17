import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { FieldModeClient } from '@/components/dashboard/field-mode-client'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'फील्ड मोड (ऑफलाइन) | संगठन' : 'Offline Field Mode PWA | Sangathan',
    description: 'Offline-first field organizer mode for door-to-door membership intake and rally check-ins.',
  }
}

export default async function FieldModePage(props: { params: Promise<{ lang: string }> }) {
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

  return <FieldModeClient orgName={orgName} />
}

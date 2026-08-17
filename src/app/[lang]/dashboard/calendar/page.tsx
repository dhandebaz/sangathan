import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { CentralizedCalendarHub } from '@/components/dashboard/calendar/centralized-calendar-hub'
import { getCentralizedCalendarData } from '@/actions/calendar-sync'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'कैलेंडर एवं समन्वय | संगठन' : 'Calendar & Synchronized Operations | Sangathan',
    description: 'Centralized organization calendar, field survey pairings, and Google & Apple Calendar auto-sync.',
  }
}

export default async function CalendarPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const orgId = await getSelectedOrganisationId()
  if (!orgId) redirect(`/${lang}/onboarding`)

  let orgName = 'Sangathan Collective'
  let orgType = 'ngo'
  const { data: org } = await supabase
    .from('organisations')
    .select('name, org_type')
    .eq('id', orgId)
    .maybeSingle()

  if (org?.name) orgName = org.name
  if (org?.org_type) orgType = org.org_type

  const result = await getCentralizedCalendarData(orgId)

  return (
    <CentralizedCalendarHub
      lang={lang}
      orgId={orgId}
      orgType={orgType}
      orgName={orgName}
      initialItems={result.items || []}
      members={result.members || []}
    />
  )
}

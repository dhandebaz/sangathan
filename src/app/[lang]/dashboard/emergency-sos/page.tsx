import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { EmergencySosClient } from '@/components/dashboard/emergency-sos-client'
import { getEmergencySosAlerts } from '@/actions/emergency-sos'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'आपातकालीन एसओएस एवं विधिक सहायता | संगठन' : 'Emergency SOS & Legal Rapid Response | Sangathan',
    description: '1-tap crisis alert and legal defense network for peaceful activists and detainees.',
  }
}

export default async function EmergencySosPage(props: { params: Promise<{ lang: string }> }) {
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

  const initialAlerts = await getEmergencySosAlerts(orgId)

  return <EmergencySosClient initialAlerts={initialAlerts} orgName={orgName} />
}

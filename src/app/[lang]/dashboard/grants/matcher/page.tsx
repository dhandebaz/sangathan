import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { GrantMatcherClient } from '@/components/dashboard/grant-matcher-client'
import { matchGrantOpportunitiesAction } from '@/actions/ai/grant-matcher'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'एआई ग्रांट एवं सीएसआर मैचर | संगठन' : 'AI Grant & CSR Matcher | Sangathan',
    description: 'Automated matching against Indian government and CSR grant databases with AI proposal drafting.',
  }
}

export default async function GrantMatcherPage(props: { params: Promise<{ lang: string }> }) {
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

  const matches = await matchGrantOpportunitiesAction()

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <GrantMatcherClient matches={matches} orgName={orgName} />
    </div>
  )
}

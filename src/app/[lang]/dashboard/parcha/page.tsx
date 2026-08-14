import { ParchaClient } from '@/components/dashboard/civic/parcha-client'
import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Printable Parcha & Physical Signature Sheets | Sangathan',
    description: '1-page printable black & white flyers (पर्चे) and physical pen-and-paper signature sheets for colony and basti mobilizations.',
  }
}

export default async function ParchaPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .single()

  let orgId = profile?.organisation_id
  if (!orgId) {
    try {
      orgId = await getSelectedOrganisationId()
    } catch {
      // fallback
    }
  }

  if (!orgId) {
    redirect(`/${lang}/onboarding`)
  }

  const { data: org } = await supabase
    .from('organisations')
    .select('name, slug')
    .eq('id', orgId)
    .single()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <ParchaClient
        orgName={org?.name || 'Colony Civic Action Collective'}
        orgSlug={org?.slug || 'collective'}
      />
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { ReferenceDataHub } from '@/components/reference/reference-data-hub'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'मास्टर संदर्भ डेटा | संगठन' : 'Master Reference Data | Sangathan',
    description: isHindi
      ? 'भारत के 28 राज्यों, 8 केंद्र शासित प्रदेशों, 780+ जिलों और संगठनात्मक मास्टर वर्गीकरण।'
      : 'National master reference datasets, Indian states and districts, and statutory taxonomies.',
  }
}

export default async function MasterReferenceDataPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${lang}/login`)
  }

  const selectedOrgId = await getSelectedOrganisationId()
  if (!selectedOrgId) {
    redirect(`/${lang}/select-organisation`)
  }

  const { data: org } = await supabase
    .from('organisations')
    .select('org_type')
    .eq('id', selectedOrgId)
    .maybeSingle()

  return (
    <div className="py-2">
      <ReferenceDataHub lang={lang} orgType={org?.org_type || 'ngo'} />
    </div>
  )
}

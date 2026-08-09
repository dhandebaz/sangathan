import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { StatutoryRegistersHub } from '@/components/registers/statutory-registers-hub'
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
    title: isHindi ? 'वैधानिक रजिस्टर्स | संगठन' : 'Statutory Registers | Sangathan',
    description: isHindi
      ? 'पंजीयक और सरकारी ऑडिट के लिए आधिकारिक प्रिंट-रेडी वैधानिक पुस्तकें।'
      : 'Official print-ready statutory registers and audit books for government inspections.',
  }
}

export default async function StatutoryRegistersPage({
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

  const adminClient = createServiceClient()

  const { data: org } = await adminClient
    .from('organisations')
    .select('id, name, org_type, registration_number, registration_status')
    .eq('id', selectedOrgId)
    .single()

  const { count: memberCount } = await adminClient
    .from('members')
    .select('*', { count: 'exact', head: true })
    .eq('organisation_id', selectedOrgId)

  const { data: donations, count: donationCount } = await adminClient
    .from('donations')
    .select('amount', { count: 'exact' })
    .eq('organisation_id', selectedOrgId)

  const totalDonations = donations?.reduce((acc, d) => acc + (d.amount || 0), 0) || 0

  return (
    <div className="py-2">
      <StatutoryRegistersHub
        org={org || { id: selectedOrgId, name: 'Organisation', org_type: 'ngo' }}
        memberCount={memberCount || 0}
        donationCount={donationCount || 0}
        totalDonations={totalDonations}
        lang={lang}
      />
    </div>
  )
}

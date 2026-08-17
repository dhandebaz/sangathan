import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BqfVerificationClient } from '@/components/dashboard/compliance/bqf-verification-client'

export const dynamic = 'force-dynamic'

export default async function BqfVerificationPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile?.organisation_id) redirect(`/${lang}/onboarding`)

  const { data: org } = await supabase
    .from('organisations')
    .select('name, compliance_documents')
    .eq('id', profile.organisation_id)
    .maybeSingle()

  const complianceDocs = (org?.compliance_documents as Record<string, unknown>) || {}
  const bqfVerification = (complianceDocs.bqf_verification as {
    verified: boolean
    verified_at: string
    verifier: string
    representative_name: string
    extracted_id: string
    legal_disclaimer: string
  }) || null

  return (
    <div className="py-6 px-4 md:px-8">
      <BqfVerificationClient
        orgId={profile.organisation_id}
        userId={user.id}
        orgName={org?.name || 'Civic Collective'}
        existingVerification={bqfVerification}
      />
    </div>
  )
}

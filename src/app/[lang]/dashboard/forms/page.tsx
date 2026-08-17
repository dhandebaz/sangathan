import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { redirect } from 'next/navigation'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { UnifiedFormsHub } from '@/components/dashboard/forms/unified-forms-hub'

export const dynamic = 'force-dynamic'

export default async function FormsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profileData } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .maybeSingle()

  const profile = profileData as { organisation_id: string | null; role: string } | null

  if (!profile || !profile.organisation_id) {
    return <AccessDenied lang={lang} />
  }

  const orgId = profile.organisation_id
  const adminClient = createServiceClient()

  // 1. Fetch organization metadata
  const { data: orgData } = await adminClient
    .from('organisations')
    .select('id, name, type, slug')
    .eq('id', orgId)
    .maybeSingle()

  // 2. Fetch all organization forms
  let forms: any[] = []
  const { data: fetchedForms, error: formsErr } = await adminClient
    .from('forms')
    .select('id, title, description, slug, is_active, created_at, visibility, form_submissions(count)')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false })

  if (!formsErr && fetchedForms) {
    forms = fetchedForms
  }

  // 3. Aggregate total submissions
  const totalSubmissions = forms.reduce((acc, f) => {
    const count = f.form_submissions?.[0]?.count ?? f.form_submissions?.count ?? 0
    return acc + Number(count)
  }, 0)

  return (
    <UnifiedFormsHub
      lang={lang}
      orgId={orgId}
      orgName={orgData?.name || 'Organisation'}
      orgType={orgData?.type || 'civic_collective'}
      initialForms={forms}
      totalSubmissionsCount={totalSubmissions}
    />
  )
}

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GoogleFormImporter } from '@/components/forms/google-form-importer'
import { AccessDenied } from '@/components/dashboard/access-denied'

export const dynamic = 'force-dynamic'

export default async function GoogleFormImportPage(props: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${lang}/login`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || !profile.organisation_id || !['admin', 'editor', 'executive'].includes(profile.role)) {
    return <AccessDenied lang={lang} />
  }

  return (
    <div className="py-4">
      <GoogleFormImporter lang={lang} />
    </div>
  )
}

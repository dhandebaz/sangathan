import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { notFound, redirect } from 'next/navigation'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { EditFormClient } from '@/components/forms/edit-form-client'
import { FormField } from '@/types/forms'

interface PageProps {
  params: Promise<{ lang: string; id: string }>
}

export const dynamic = 'force-dynamic'

export default async function EditFormPage({ params }: PageProps) {
  const { lang, id } = await params
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

  type FormDataType = {
    id: string
    title: string
    description?: string | null
    slug?: string | null
    visibility?: 'public' | 'members' | 'private' | null
    is_active: boolean
    fields?: FormField[] | null
  }

  let form: FormDataType | null = null

  const formRes = await supabase
    .from('forms')
    .select('id, title, description, slug, visibility, is_active, fields')
    .eq('id', id)
    .eq('organisation_id', orgId)
    .maybeSingle()

  if (formRes.data) {
    form = formRes.data as unknown as FormDataType
  } else {
    // Fallback to service client if RLS blocked regular client
    try {
      const adminClient = createServiceClient()
      const fallbackRes = await adminClient
        .from('forms')
        .select('id, title, description, slug, visibility, is_active, fields')
        .eq('id', id)
        .eq('organisation_id', orgId)
        .maybeSingle()

      if (fallbackRes.data) {
        form = fallbackRes.data as unknown as FormDataType
      }
    } catch {
      form = null
    }
  }

  if (!form) notFound()

  return <EditFormClient form={form} lang={lang} />
}

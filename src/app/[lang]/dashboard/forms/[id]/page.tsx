import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Trash2, Edit3 } from 'lucide-react'
import Link from 'next/link'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { SurveyAnalyticsDashboard } from '@/components/forms/survey-analytics-dashboard'
import { deleteForm } from '@/actions/forms/actions'
import { FormField } from '@/types/forms'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ lang: string; id: string }>
}

export const dynamic = 'force-dynamic'

export default async function FormDetailsPage({ params }: PageProps) {
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

  const [formRes, orgRes, subRes] = await Promise.all([
    supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .eq('organisation_id', orgId)
      .maybeSingle(),
    supabase
      .from('organisations')
      .select('name')
      .eq('id', orgId)
      .maybeSingle(),
    supabase
      .from('form_submissions')
      .select('*')
      .eq('form_id', id)
      .order('created_at', { ascending: false }),
  ])

  let form = formRes.data as {
    id: string
    title: string
    description?: string
    slug?: string | null
    is_active: boolean
    created_at: string
    visibility?: 'public' | 'members' | 'private' | null
    fields?: FormField[]
  } | null

  let submissions = (subRes.data || []) as Array<{
    id: string
    created_at: string
    data: Record<string, any>
    user_id?: string | null
  }>

  let orgName = orgRes.data?.name || 'Sangathan'

  if (formRes.error || !form) {
    try {
      const adminClient = createServiceClient()
      const [fallbackForm, fallbackOrg, fallbackSubs] = await Promise.all([
        adminClient.from('forms').select('*').eq('id', id).eq('organisation_id', orgId).maybeSingle(),
        adminClient.from('organisations').select('name').eq('id', orgId).maybeSingle(),
        adminClient.from('form_submissions').select('*').eq('form_id', id).order('created_at', { ascending: false }),
      ])
      if (fallbackForm.data) {
        form = fallbackForm.data as typeof form
        if (fallbackOrg.data?.name) orgName = fallbackOrg.data.name
        if (fallbackSubs.data) submissions = fallbackSubs.data as typeof submissions
      }
    } catch {
      form = null
    }
  }

  if (!form) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href={`/${lang}/dashboard/forms`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to All Forms & Surveys</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Link href={`/${lang}/dashboard/forms/${id}/edit`}>
              <Edit3 size={13} className="mr-1.5 text-slate-600" />
              <span>Edit Form & Questions</span>
            </Link>
          </Button>

          <form
            action={async () => {
              'use server'
              await deleteForm({ formId: id })
              redirect(`/${lang}/dashboard/forms`)
            }}
          >
            <button
              type="submit"
              className="text-xs font-bold text-red-600 hover:text-red-800 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 border border-red-200"
              title="Delete Form"
            >
              <Trash2 size={13} />
              <span>Delete Survey</span>
            </button>
          </form>
        </div>
      </div>

      <SurveyAnalyticsDashboard
        form={form}
        submissions={submissions}
        lang={lang}
        orgName={orgName}
      />
    </div>
  )
}


import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { AccessDenied } from '@/components/dashboard/access-denied'
import { SurveyAnalyticsDashboard } from '@/components/forms/survey-analytics-dashboard'
import { deleteForm } from '@/actions/forms/actions'
import { FormField } from '@/types/forms'

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

  if (!profile || !profile.organisation_id || !['admin', 'editor', 'executive'].includes(profile.role)) {
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

  const form = formRes.data as {
    id: string
    title: string
    description?: string
    is_active: boolean
    created_at: string
    visibility?: 'public' | 'members' | 'private' | null
    fields?: FormField[]
  } | null

  if (formRes.error || !form) notFound()

  const submissions = (subRes.data || []) as Array<{
    id: string
    created_at: string
    data: Record<string, any>
    user_id?: string | null
  }>

  const orgName = orgRes.data?.name || 'Sangathan'

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

        <form
          action={async () => {
            'use server'
            await deleteForm({ formId: id })
          }}
        >
          <button
            type="submit"
            className="text-xs font-bold text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1"
            title="Delete Form"
          >
            <Trash2 size={14} />
            <span>Delete Survey</span>
          </button>
        </form>
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

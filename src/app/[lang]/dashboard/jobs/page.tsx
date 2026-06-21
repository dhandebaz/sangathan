import { getTranslations } from 'next-intl/server'
import { getSelectedOrganisationId } from '@/lib/cookies'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import JobsClient from '@/components/dashboard/jobs/jobs-client'

export default async function JobsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()
  
  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const supabase = await createClient()

  // Get current user profile
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user?.id || '')
    .eq('organisation_id', organisationId)
    .single()

  const isAdmin = profile?.role === 'admin' || profile?.role === 'editor' || profile?.role === 'executive'

  // Fetch Jobs
  const { data: jobs } = await supabase
    .from('job_postings')
    .select(`
      *,
      job_applications (
        *,
        profiles (full_name, email, phone)
      )
    `)
    .eq('organisation_id', organisationId)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Worker Dispatch
        </h1>
      </div>

      <JobsClient 
        jobs={jobs || []}
        isAdmin={isAdmin}
        profileId={profile?.id || ''}
      />
    </div>
  )
}

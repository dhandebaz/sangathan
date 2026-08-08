import { getSelectedOrganisationId } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import PostsManagerClient from '@/components/dashboard/posts/posts-manager-client'
import { getUnionPostsFromDB } from '@/actions/union-posts'

export default async function UnionPostsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()

  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const supabase = await createClient()

  // Fetch active union members for assignment dropdown
  const { data: members } = await supabase
    .from('profiles')
    .select('id, full_name, email, designation')
    .eq('organisation_id', organisationId)
    .limit(100)

  const { roles } = await getUnionPostsFromDB(organisationId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Union Posts (पद) & Designation Registry
          </h1>
          <p className="text-slate-500 mt-1">
            Pre-configured designations (President, Vice President, General Secretary, etc.) and custom post creation.
          </p>
        </div>
      </div>

      <PostsManagerClient organisationId={organisationId} members={members || []} dbRoles={roles || []} />
    </div>
  )
}

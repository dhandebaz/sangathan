import { getSelectedOrganisationId, getUserContext } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LocalDirectoryClient from '@/components/dashboard/local-directory/local-directory-client'

export default async function LocalDirectoryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()

  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const context = await getUserContext(organisationId)
  const isAdmin = context.role === 'admin' || context.role === 'editor'

  const supabase = await createClient()

  // Fetch service contacts — members whose designation starts with [SERVICE]
  const { data: contacts } = await supabase
    .from('members')
    .select('*')
    .eq('organisation_id', organisationId)
    .like('designation', '[SERVICE]%')
    .eq('status', 'active')
    .order('full_name', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Local Services Directory
          </h1>
          <p className="text-muted-foreground mt-1">
            Essential phone numbers for electricity, water, police, medical, and local services. Tap to call.
          </p>
        </div>
      </div>

      <LocalDirectoryClient contacts={contacts || []} isAdmin={isAdmin} />
    </div>
  )
}

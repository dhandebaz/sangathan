import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRoles } from '@/actions/roles'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { RoleManager } from '@/components/dashboard/role-manager'

export default async function RolesPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params
  const lang = params.lang
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${lang}/login`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  const organisationId = await getSelectedOrganisationId()
  const isAdmin = profile?.role === 'admin' || profile?.role === 'executive'
  if (!isAdmin) {
    return <div className="p-6">You do not have permission to view this page.</div>
  }

  const { data: roles } = await getRoles(organisationId)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <RoleManager 
        initialRoles={roles || []} 
        organisationId={organisationId} 
        lang={lang} 
      />
    </div>
  )
}

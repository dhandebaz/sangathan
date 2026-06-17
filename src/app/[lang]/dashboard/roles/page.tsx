import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRoles } from '@/actions/roles'
import { RoleManager } from '@/components/dashboard/role-manager'

export default async function RolesPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params
  const lang = params.lang
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${lang}/login`)
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.organisation_id) {
    redirect(`/${lang}/onboarding`)
  }

  const isAdmin = profile.role === 'admin' || profile.role === 'executive'
  if (!isAdmin) {
    return <div className="p-6">You do not have permission to view this page.</div>
  }

  const { data: roles } = await getRoles(profile.organisation_id)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <RoleManager 
        initialRoles={roles || []} 
        organisationId={profile.organisation_id} 
        lang={lang} 
      />
    </div>
  )
}

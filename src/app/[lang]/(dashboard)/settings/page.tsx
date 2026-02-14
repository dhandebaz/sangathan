import { createClient } from '@/lib/supabase/server'
import { MembershipPolicyForm, TransparencyToggle } from '@/components/settings/membership-policy-form'
import { CollaborationManager } from '@/components/settings/collaboration-manager'
import { getCollaboratingOrgs, getPendingRequests } from '@/actions/collaboration'
import { redirect } from 'next/navigation'
import { getOrgCapabilities } from '@/lib/capabilities'
import { AccessDenied } from '@/components/dashboard/access-denied'

export default async function SettingsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profileData } = await supabase
    .from('profiles')
    .select('organization_id, role')
    .eq('id', user.id)
    .single()

  const profile = profileData as any

  if (!profile || !profile.organization_id || profile.role !== 'admin') {
      return <AccessDenied lang={lang} />
  }

  const { data: orgData } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', profile.organization_id)
    .single()

  const org = orgData as any

  const capabilities = await getOrgCapabilities(org.id)

  const [partners, pending] = await Promise.all([
    getCollaboratingOrgs(org.id),
    getPendingRequests(org.id)
  ])

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold mb-4">Membership Governance</h2>
          <MembershipPolicyForm orgId={org.id} currentPolicy={org.membership_policy || 'open_auto'} />
        </section>

        {capabilities.transparency_mode && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Public Transparency</h2>
            <TransparencyToggle orgId={org.id} enabled={org.public_transparency_enabled} />
          </section>
        )}

        {capabilities.federation_mode && (
          <section>
            <h2 className="text-lg font-semibold mb-4">Inter-Org Collaboration</h2>
            <CollaborationManager orgId={org.id} activePartners={partners} pendingRequests={pending} />
          </section>
        )}
      </div>
    </div>
  )
}

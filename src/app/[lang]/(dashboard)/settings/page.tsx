import { createClient } from '@/lib/supabase/server'
import { MembershipPolicyForm, TransparencyToggle } from '@/components/settings/membership-policy-form'
import { CollaborationManager } from '@/components/settings/collaboration-manager'
import { getCollaboratingOrgs, getPendingRequests } from '@/actions/collaboration'
import { redirect } from 'next/navigation'
import { getOrgCapabilities } from '@/lib/capabilities'
import { AccessDenied } from '@/components/dashboard/access-denied'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function SettingsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profileData } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  const profile = profileData as { organisation_id: string | null; role: string } | null

  if (!profile || !profile.organisation_id || profile.role !== 'admin') {
      return <AccessDenied lang={lang} />
  }

  const { data: orgData } = await supabase
    .from('organisations')
    .select('*')
    .eq('id', profile.organisation_id)
    .single()

  const org = orgData as { id: string; membership_policy: string; public_transparency_enabled: boolean } | null

  if (!org) return <div>Organisation not found</div>

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

        <section>
          <h2 className="text-lg font-semibold mb-2">Support</h2>
          <p className="text-sm text-gray-600 mb-4">
            Raise policy or moderation issues with the platform team.
          </p>
          <Button asChild variant="outline">
            <Link href={`/${lang}/appeals`}>Open Appeals</Link>
          </Button>
        </section>
      </div>
    </div>
  )
}

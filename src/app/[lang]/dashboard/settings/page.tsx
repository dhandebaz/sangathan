import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { MembershipPolicyForm, TransparencyToggle } from '@/components/settings/membership-policy-form'
import { CollaborationManager } from '@/components/settings/collaboration-manager'
import { deleteOrganisation } from '@/actions/compliance/actions'
import { Button } from '@/components/ui/button'

interface PageProps {
  params: Promise<{ lang: string }>
}

export const dynamic = 'force-dynamic'

export default async function SettingsPage(props: PageProps) {
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

  if (!profile || !profile.organisation_id) {
    redirect(`/${lang}/onboarding`)
  }

  const orgId = profile.organisation_id

  const { data: orgData } = await supabase
    .from('organisations')
    .select('id, name, slug, membership_policy, public_transparency_enabled')
    .eq('id', orgId)
    .single()

  const organisation = orgData as {
    id: string
    name: string
    slug: string
    membership_policy: 'open_auto' | 'admin_approval' | 'invite_only'
    public_transparency_enabled: boolean
  } | null

  if (!organisation) {
    redirect(`/${lang}/dashboard`)
  }

  const { data: partnersData } = await supabase
    .from('organisation_links')
    .select('id, status, requester:requester_org_id(id, name, slug), responder:responder_org_id(id, name, slug)')
    .or(`requester_org_id.eq.${orgId},responder_org_id.eq.${orgId}`)

  const partners = (partnersData || []).filter((link) => link.status === 'active')

  const activePartners = partners.map((link) => {
    const other =
      link.requester?.id === orgId
        ? link.responder
        : link.requester
    return other
  }).filter(Boolean) as { id: string; name: string; slug: string }[]

  const pendingIncoming = (partnersData || [])
    .filter((link) => link.status === 'pending' && link.responder?.id === orgId)
    .map((link) => ({
      id: link.id as string,
      requester: link.requester as { id: string; name: string; slug: string },
      responder: link.responder as { id: string; name: string; slug: string },
      created_at: link.created_at as string,
    }))

  const pendingOutgoing = (partnersData || [])
    .filter((link) => link.status === 'pending' && link.requester?.id === orgId)
    .map((link) => ({
      id: link.id as string,
      requester: link.requester as { id: string; name: string; slug: string },
      responder: link.responder as { id: string; name: string; slug: string },
      created_at: link.created_at as string,
    }))

  async function handleDelete(formData: FormData) {
    'use server'
    const confirmation = formData.get('confirmation') as string
    const result = await deleteOrganisation(orgId, confirmation)
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete organisation')
    }
    redirect(`/${lang}/goodbye`)
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/${lang}/dashboard`} className="text-gray-500 hover:text-black">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Organisation Settings</h1>
            <p className="text-sm text-gray-500">
              Manage your organisation identity, membership rules, transparency, and collaborations.
            </p>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-[2fr,minmax(0,1.3fr)] gap-6 items-start">
        <div className="space-y-6">
          <div className="bg-white border rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Organisation Identity</h2>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-500 mb-1">Organisation Name</div>
                <div className="text-base font-medium">{organisation.name}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Slug</div>
                <div className="inline-flex items-center gap-2 rounded-md border px-2 py-1 text-xs font-mono text-gray-700 bg-gray-50">
                  <span>@{organisation.slug}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Name and slug changes currently require support intervention to preserve links and audit history.
            </p>
          </div>

          <MembershipPolicyForm orgId={organisation.id} currentPolicy={organisation.membership_policy} />

          <TransparencyToggle orgId={organisation.id} enabled={organisation.public_transparency_enabled} />
        </div>

        <div className="space-y-6">
          <CollaborationManager 
            orgId={organisation.id} 
            activePartners={activePartners} 
            pendingRequests={{ incoming: pendingIncoming, outgoing: pendingOutgoing }} 
          />

          {profile.role === 'admin' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
              <h2 className="text-sm font-semibold text-red-700 uppercase tracking-wide">Delete Organisation</h2>
              <p className="text-sm text-red-700">
                This will soft-delete your organisation. Data is retained for a limited period for recovery and compliance,
                but the organisation will no longer be accessible to members.
              </p>
              <form action={handleDelete} className="space-y-3">
                <input
                  name="confirmation"
                  placeholder='Type "DELETE" to confirm'
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
                <Button type="submit" variant="destructive" className="w-full">
                  Permanently Delete Organisation
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}


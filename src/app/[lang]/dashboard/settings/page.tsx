import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { MembershipPolicyForm, TransparencyToggle } from '@/components/settings/membership-policy-form'
import { CollaborationManager } from '@/components/settings/collaboration-manager'
import { deleteOrganisation } from '@/actions/compliance/actions'
import { Button } from '@/components/ui/button'
import { OrgProfileForm } from '@/components/settings/org-profile-form'
import { OrgSlugForm } from '@/components/settings/org-slug-form'
import { ImageUpload } from '@/components/settings/image-upload'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ComplianceManager } from '@/components/settings/compliance-manager'
import { Database } from '@/types/database'

interface OrgLink {
  id: string
  status: string
  requester: { id: string; name: string; slug: string } | null
  responder: { id: string; name: string; slug: string } | null
  created_at?: string
}

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
    .select('id, name, slug, membership_policy, public_transparency_enabled, description, logo_url, cover_url, contact_email, contact_phone, website, social_links, address, registration_status, registration_number, incorporation_date, tax_id, darpan_id, compliance_documents')
    .eq('id', orgId)
    .single()

  const organisation = orgData as {
    id: string
    name: string
    slug: string
    membership_policy: 'open_auto' | 'admin_approval' | 'invite_only'
    public_transparency_enabled: boolean
    description: string | null
    logo_url: string | null
    cover_url: string | null
    contact_email: string | null
    contact_phone: string | null
    website: string | null
    social_links: Record<string, string> | null
    address: string | null
    registration_status: Database["public"]["Enums"]["registration_status"] | null
    registration_number: string | null
    incorporation_date: string | null
    tax_id: string | null
    darpan_id: string | null
    compliance_documents: unknown
  } | null

  if (!organisation) {
    redirect(`/${lang}/dashboard`)
  }

  const { data: partnersData } = await supabase
    .from('organisation_links')
    .select('id, status, requester:requester_org_id(id, name, slug), responder:responder_org_id(id, name, slug)')
    .or(`requester_org_id.eq.${orgId},responder_org_id.eq.${orgId}`)

  const partnersDataTyped = partnersData as unknown as OrgLink[] | null

  const partners = (partnersDataTyped || []).filter((link) => link.status === 'active')

  const activePartners = partners.map((link) => {
    const other =
      link.requester?.id === orgId
        ? link.responder
        : link.requester
    return other
  }).filter(Boolean) as { id: string; name: string; slug: string }[]

  const pendingIncoming = (partnersDataTyped || [])
    .filter((link) => link.status === 'pending' && link.responder?.id === orgId)
    .map((link) => ({
      id: link.id,
      requester: link.requester as { id: string; name: string; slug: string },
      responder: link.responder as { id: string; name: string; slug: string },
      created_at: link.created_at || '',
    }))

  const pendingOutgoing = (partnersDataTyped || [])
    .filter((link) => link.status === 'pending' && link.requester?.id === orgId)
    .map((link) => ({
      id: link.id,
      requester: link.requester as { id: string; name: string; slug: string },
      responder: link.responder as { id: string; name: string; slug: string },
      created_at: link.created_at || '',
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
              Manage your organisation identity, compliance, transparency, and collaborations.
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px] mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="public">Public Page</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="network">Network & Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <div className="bg-white border rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Organisation Identity & Branding</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <ImageUpload type="logo" currentUrl={organisation.logo_url} orgId={organisation.id} />
              <ImageUpload type="cover" currentUrl={organisation.cover_url} orgId={organisation.id} />
            </div>

            <div className="pt-4 border-t space-y-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Organisation Name</div>
                <div className="text-base font-medium flex items-center gap-2">
                  {organisation.name}
                  {organisation.registration_status === 'registered' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle2 className="w-3 h-3" /> Registered
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      <AlertCircle className="w-3 h-3" /> Unregistered
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Name changes currently require support intervention to preserve audit history.</p>
              </div>
            </div>
          </div>

          <OrgProfileForm initialData={organisation} />
          
          {profile.role === 'admin' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4 mt-12">
              <h2 className="text-sm font-semibold text-red-700 uppercase tracking-wide">Danger Zone</h2>
              <p className="text-sm text-red-700">
                This will soft-delete your organisation. Data is retained for a limited period for recovery and compliance,
                but the organisation will no longer be accessible to members.
              </p>
              <form action={handleDelete} className="space-y-3 max-w-md">
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
        </TabsContent>

        <TabsContent value="public" className="space-y-6">
          <OrgSlugForm currentSlug={organisation.slug} lang={lang} />
          <TransparencyToggle orgId={organisation.id} enabled={organisation.public_transparency_enabled} />
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <ComplianceManager org={organisation} />
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <MembershipPolicyForm orgId={organisation.id} currentPolicy={organisation.membership_policy} />
          <CollaborationManager 
            orgId={organisation.id} 
            activePartners={activePartners} 
            pendingRequests={{ incoming: pendingIncoming, outgoing: pendingOutgoing }} 
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ShieldCheck, BarChart3, Lock } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function TransparencyPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: org, error } = await supabase
    .from('organisations')
    .select('id, name, created_at, slug, public_transparency_enabled, status, legal_hold, is_suspended')
    .eq('slug', slug)
    .single()

  if (error || !org) {
    notFound()
  }

  if (!org.public_transparency_enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">Private Organisation</h1>
          <p className="text-gray-600 mt-2">
            This organisation has not enabled public transparency mode.
          </p>
        </div>
      </div>
    )
  }

  const [
    members,
    events,
    donations,
    publicAnnouncements,
    publicPolls,
    openAppeals,
    latestPlatformAction,
  ] = await Promise.all([
    supabase
      .from('members')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', org.id)
      .eq('status', 'active'),
    supabase
      .from('events')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', org.id),
    supabase
      .from('donations')
      .select('amount')
      .eq('organisation_id', org.id),
    supabase
      .from('announcements')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', org.id)
      .eq('visibility_level', 'public'),
    supabase
      .from('polls')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', org.id)
      .eq('is_public', true),
    supabase
      .from('appeals')
      .select('id', { count: 'exact', head: true })
      .eq('organisation_id', org.id)
      .in('status', ['pending', 'under_review']),
    supabase
      .from('platform_actions')
      .select('action_type, created_at')
      .eq('target_org_id', org.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const totalDonations = (donations.data || []).reduce((acc, curr) => acc + (curr.amount || 0), 0)
  const governanceStanding = org.is_suspended
    ? 'Suspended'
    : org.legal_hold
      ? 'Legal hold'
      : org.status === 'under_review'
        ? 'Under review'
        : 'Good standing'
  const latestActionLabel = latestPlatformAction.data
    ? `${latestPlatformAction.data.action_type} on ${new Date(latestPlatformAction.data.created_at).toLocaleDateString()}`
    : 'No platform actions on record'

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} /> Verified Transparency
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{org.name}</h1>
          <p className="text-gray-500 text-sm">
            Operating transparently since {new Date(org.created_at).getFullYear()}
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">{members.count || 0}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Active Members</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">{events.count || 0}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Events Hosted</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">INR {totalDonations.toLocaleString()}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Funds Raised</div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="text-gray-400" />
            <h2 className="text-lg font-bold text-gray-900">Governance Health</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Platform Standing</span>
              <span className="font-medium text-gray-900">{governanceStanding}</span>
            </div>

            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-gray-600">Public Announcements</span>
              <span className="text-gray-900 font-medium">{publicAnnouncements.count || 0}</span>
            </div>

            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-gray-600">Public Polls</span>
              <span className="text-gray-900 font-medium">{publicPolls.count || 0}</span>
            </div>

            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-gray-600">Open Appeals</span>
              <span className="text-gray-900 font-medium">{openAppeals.count || 0}</span>
            </div>

            <div className="flex justify-between items-center text-sm pt-2">
              <span className="text-gray-600">Latest Platform Action</span>
              <span className="text-gray-900 font-medium text-right">{latestActionLabel}</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            Public metrics are generated from live organisation, governance, and moderation records.
          </p>
        </div>
      </div>
    </div>
  )
}

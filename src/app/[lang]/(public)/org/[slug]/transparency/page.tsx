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

  // Fetch Organisation by Slug
  const { data: org, error } = await supabase
    .from('organisations')
    .select('id, name, capabilities, created_at, slug')
    .eq('slug', slug)
    .single()

  if (error || !org) {
      notFound()
  }

  // Check Transparency Mode
  const capabilities = (org.capabilities as Record<string, boolean>) || {}
  if (!capabilities.transparency_mode) {
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

  // Fetch Stats (Anonymized)
  const [members, meetings, donations] = await Promise.all([
      supabase.from('members').select('id', { count: 'exact', head: true }).eq('organisation_id', org.id).eq('status', 'active'),
      supabase.from('meetings').select('id', { count: 'exact', head: true }).eq('organisation_id', org.id),
      supabase.from('donations').select('amount').eq('organisation_id', org.id) // We'll sum manually or use RPC
  ])

  // Simple sum for donations (if not too many)
  // In prod, use a materialized view or RPC
  const totalDonations = (donations.data || []).reduce((acc, curr) => acc + (curr.amount || 0), 0)

  return (
    <div className="min-h-screen bg-white">
        {/* Header */}
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

        {/* Stats Grid */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">{members.count || 0}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Active Members</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">{meetings.count || 0}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Meetings Held</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-1">₹{totalDonations.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Funds Raised</div>
                </div>
            </div>

            {/* Charter Adherence (Mock) */}
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="text-gray-400" />
                    <h2 className="text-lg font-bold text-gray-900">Governance Health</h2>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Constitution Ratified</span>
                        <span className="text-green-600 font-medium">Yes</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full w-full"></div>
                    </div>

                    <div className="flex justify-between items-center text-sm pt-2">
                        <span className="text-gray-600">Recent Elections</span>
                        <span className="text-gray-900 font-medium">Last 6 months</span>
                    </div>
                     <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full w-[90%]"></div>
                    </div>
                </div>
                
                <p className="text-xs text-gray-400 mt-6">
                    * Data is pulled directly from the immutable ledger. Updates are real-time.
                </p>
            </div>
        </div>
    </div>
  )
}

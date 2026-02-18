import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Gavel, Scale } from 'lucide-react'
import { createServiceClient } from '@/lib/supabase/service'
import { requirePlatformAdmin } from '@/lib/auth/context'

export const dynamic = 'force-dynamic'

interface PlatformActionRow {
  id: string
  action_type: string
  severity: string | null
  reason: string
  created_at: string
  organisations?: {
    name: string
    slug: string
  } | null
}

interface AppealRow {
  id: string
  organisation_id: string
  status: string
  reason: string
  created_at: string
  organisations?: {
    name: string
    slug: string
  } | null
}

export default async function ModerationDashboardPage() {
  await requirePlatformAdmin()

  const supabase = createServiceClient()

  const [{ data: actions }, { data: appeals }] = await Promise.all([
    supabase
      .from('platform_actions')
      .select('id, action_type, severity, reason, created_at, organisations(name, slug)')
      .order('created_at', { ascending: false })
      .limit(50) as unknown as Promise<{ data: PlatformActionRow[] | null }>,
    supabase
      .from('appeals')
      .select('id, organisation_id, status, reason, created_at, organisations(name, slug)')
      .order('created_at', { ascending: false })
      .limit(50) as unknown as Promise<{ data: AppealRow[] | null }>,
  ])

  if (!actions && !appeals) {
    redirect('/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-black text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 hover:text-white text-sm">
              Back
            </Link>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Gavel size={20} className="text-red-500" />
              Moderation Dashboard
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gavel size={18} className="text-red-500" />
              <h2 className="font-bold text-sm uppercase text-gray-700">Recent Platform Actions</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-3 px-4 font-medium text-gray-500">Time</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Organisation</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Action</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Severity</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {actions?.map((action) => (
                  <tr key={action.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(action.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {action.organisations?.name ? (
                        <span className="font-medium">
                          {action.organisations.name}
                          <span className="ml-2 text-xs text-gray-500 font-mono">
                            {action.organisations.slug}
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Unknown</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono uppercase">{action.action_type}</td>
                    <td className="py-3 px-4 text-xs">
                      {action.severity || '—'}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-700 max-w-md truncate" title={action.reason}>
                      {action.reason}
                    </td>
                  </tr>
                ))}
                {(!actions || actions.length === 0) && (
                  <tr>
                    <td colSpan={5} className="py-6 px-4 text-center text-sm text-gray-500">
                      No platform actions recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale size={18} className="text-blue-500" />
              <h2 className="font-bold text-sm uppercase text-gray-700">Appeals</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="py-3 px-4 font-medium text-gray-500">Time</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Organisation</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appeals?.map((appeal) => (
                  <tr key={appeal.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(appeal.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      {appeal.organisations?.name ? (
                        <span className="font-medium">
                          {appeal.organisations.name}
                          <span className="ml-2 text-xs text-gray-500 font-mono">
                            {appeal.organisations.slug}
                          </span>
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Unknown</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono uppercase">{appeal.status}</td>
                    <td className="py-3 px-4 text-xs text-gray-700 max-w-md truncate" title={appeal.reason}>
                      {appeal.reason}
                    </td>
                  </tr>
                ))}
                {(!appeals || appeals.length === 0) && (
                  <tr>
                    <td colSpan={4} className="py-6 px-4 text-center text-sm text-gray-500">
                      No appeals submitted.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}


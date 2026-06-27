import { createServiceClient } from '@/lib/supabase/service'
import { Megaphone, Trash2 } from 'lucide-react'
import { requirePlatformAdmin } from '@/lib/auth/context'
import { createPlatformBroadcast, deleteBroadcast } from '@/actions/system/broadcasts'

export const dynamic = 'force-dynamic'

interface BroadcastRow {
  id: string
  title: string
  content: string
  is_pinned: boolean
  send_email: boolean
  expires_at: string | null
  created_at: string
  organisations?: { name: string } | null
}

export default async function BroadcastsPage() {
  await requirePlatformAdmin()

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('announcements')
    .select('*, organisations(name)')
    .order('created_at', { ascending: false })
    .limit(100)

  const broadcasts = (data || []) as BroadcastRow[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-3">
          <Megaphone className="text-red-600" />
          Platform broadcasts
        </h1>
        <p className="mt-2 text-sm text-slate-600">Create and manage platform-wide announcements.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-sm uppercase text-gray-700 mb-4">New broadcast</h2>
        <form action={async (formData: FormData) => {
          'use server'
          const title = formData.get('title') as string
          const content = formData.get('content') as string
          const priority = (formData.get('priority') as string) || 'normal'
          const targetOrgId = formData.get('target_org_id') as string
          const sendEmail = formData.get('send_email') === 'on'
          const expiresAt = formData.get('expires_at') as string
          await createPlatformBroadcast({
            title,
            content,
            priority: priority as 'low' | 'normal' | 'high' | 'critical',
            target_org_id: targetOrgId || null,
            send_email: sendEmail,
            expires_at: expiresAt || undefined,
          })
        }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Title *</label>
            <input name="title" required className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Priority</label>
            <select name="priority" defaultValue="normal" className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex flex-col md:col-span-2">
            <label className="text-xs text-gray-500 mb-1">Content *</label>
            <textarea name="content" required rows={3} className="rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Target organisation (UUID, optional)</label>
            <input name="target_org_id" placeholder="Leave empty for all" className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono" />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">Expires at</label>
            <input type="datetime-local" name="expires_at" className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </div>
          <div className="flex items-center gap-3 md:col-span-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="send_email" className="h-4 w-4" />
              Send email notification
            </label>
            <button type="submit" className="min-h-11 rounded-lg bg-green-700 px-6 py-2 font-bold text-white hover:bg-green-800">
              Create broadcast
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-bold text-sm uppercase text-gray-700">Existing broadcasts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Title</th>
                <th className="py-3 px-6 font-medium text-gray-500">Content</th>
                <th className="py-3 px-6 font-medium text-gray-500">Priority</th>
                <th className="py-3 px-6 font-medium text-gray-500">Target</th>
                <th className="py-3 px-6 font-medium text-gray-500">Created</th>
                <th className="py-3 px-6 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {broadcasts.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="py-3 px-6 font-medium">{b.title}</td>
                  <td className="py-3 px-6 text-xs text-gray-600 max-w-xs truncate">{b.content}</td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      b.is_pinned ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {b.is_pinned ? 'High/Critical' : 'Normal/Low'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-xs">{b.organisations?.name || 'All'}</td>
                  <td className="py-3 px-6 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(b.created_at).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <form action={async () => {
                      'use server'
                      await deleteBroadcast(b.id)
                    }}>
                      <button type="submit" className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline">
                        <Trash2 size={12} /> Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {broadcasts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-sm text-gray-500">No broadcasts created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

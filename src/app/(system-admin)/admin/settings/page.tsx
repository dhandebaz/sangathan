import { createServiceClient } from '@/lib/supabase/service'
import { Settings, Pencil, Trash2 } from 'lucide-react'
import { requirePlatformAdmin } from '@/lib/auth/context'
import { createSystemSetting, deleteSystemSetting, updateSystemSetting } from '@/actions/system/settings'

export const dynamic = 'force-dynamic'

interface SystemSetting {
  key: string
  value: Record<string, unknown>
  description: string | null
  updated_at: string
  updated_by: string | null
}

export default async function SystemSettingsPage() {
  await requirePlatformAdmin()

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('system_settings')
    .select('*')
    .order('key', { ascending: true })

  const settings = (data || []) as SystemSetting[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title flex items-center gap-3">
          <Settings className="text-red-600" />
          System settings
        </h1>
        <p className="mt-2 text-sm text-slate-600">Manage platform-wide system settings and configuration values.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-sm uppercase text-gray-700 mb-4">Add setting</h2>
        <form action={async (formData: FormData) => {
          'use server'
          const key = formData.get('key') as string
          const description = formData.get('description') as string
          let value: Record<string, unknown> = {}
          try {
            value = JSON.parse(formData.get('value') as string)
          } catch {}
          await createSystemSetting({ key, value, description: description || undefined })
        }} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            name="key"
            placeholder="Setting key"
            required
            className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
          />
          <input
            name="value"
            placeholder='JSON value (e.g. {"key": "val"})'
            defaultValue='{"enabled": true}'
            className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
          />
          <input
            name="description"
            placeholder="Description (optional)"
            className="min-h-11 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
          <button type="submit" className="min-h-11 rounded-lg bg-green-700 px-4 py-2 font-bold text-white hover:bg-green-800">
            Add setting
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-medium text-gray-500">Key</th>
                <th className="py-3 px-6 font-medium text-gray-500">Value</th>
                <th className="py-3 px-6 font-medium text-gray-500">Description</th>
                <th className="py-3 px-6 font-medium text-gray-500">Updated</th>
                <th className="py-3 px-6 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {settings.map((setting) => (
                <tr key={setting.key} className="hover:bg-gray-50">
                  <td className="py-3 px-6 font-mono text-xs font-medium">{setting.key}</td>
                  <td className="py-3 px-6">
                    <details className="group">
                      <summary className="cursor-pointer text-xs text-blue-600 hover:underline">View JSON</summary>
                      <pre className="mt-2 text-xs bg-gray-50 p-2 rounded border overflow-x-auto max-w-xs">
                        {JSON.stringify(setting.value, null, 2)}
                      </pre>
                    </details>
                  </td>
                  <td className="py-3 px-6 text-xs text-gray-600">{setting.description || '-'}</td>
                  <td className="py-3 px-6 text-xs text-gray-500 whitespace-nowrap">
                    {setting.updated_at ? new Date(setting.updated_at).toLocaleString() : '-'}
                  </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <form action={async (formData: FormData) => {
                        'use server'
                        let value: Record<string, unknown> = {}
                        try {
                          value = JSON.parse(formData.get('value') as string)
                        } catch {}
                        await updateSystemSetting({ key: setting.key, value })
                      }}>
                        <input name="value" defaultValue={JSON.stringify(setting.value)} className="hidden" />
                        <button type="submit" className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline">
                          <Pencil size={12} /> Edit
                        </button>
                      </form>
                      <form action={async () => {
                        'use server'
                        await deleteSystemSetting(setting.key)
                      }}>
                        <button type="submit" className="inline-flex items-center gap-1 text-xs text-red-600 hover:underline">
                          <Trash2 size={12} /> Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {settings.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 px-4 text-center text-sm text-gray-500">No system settings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

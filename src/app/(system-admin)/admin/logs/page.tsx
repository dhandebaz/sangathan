import { createServiceClient } from '@/lib/supabase/service'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from 'date-fns'
import { SystemLog } from '@/types/dashboard'
import { requirePlatformAdmin } from '@/lib/auth/context'
 
export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{
    level?: string
    organisation_id?: string
    from?: string
    to?: string
    page?: string
  }>
}
 
export default async function SystemLogsPage({ searchParams }: PageProps) {
  await requirePlatformAdmin()

  const supabase = createServiceClient()

  const params = await searchParams
  const level = params.level || ''
  const organisationId = params.organisation_id || ''
  const from = params.from || ''
  const to = params.to || ''
  const page = Number(params.page || '1')
  const pageSize = 50
  const currentPage = Number.isFinite(page) && page > 0 ? page : 1
  const offset = (currentPage - 1) * pageSize

  let query = supabase
    .from('system_logs')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (level) {
    query = query.eq('level', level)
  }

  if (organisationId) {
    query = query.eq('organisation_id', organisationId)
  }

  if (from) {
    query = query.gte('created_at', from)
  }

  if (to) {
    query = query.lte('created_at', to)
  }

  const { data: logs, error, count } = await query as unknown as {
    data: SystemLog[] | null
    error: { message: string } | null
    count: number | null
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading logs: {error.message}</div>
  }

  const total = count || 0
  const totalPages = total > 0 ? Math.ceil(total / pageSize) : 1

  const getBadgeVariant = (level: SystemLog['level']) => {
    switch (level) {
      case 'info': return 'secondary'
      case 'warn': return 'warning'
      case 'error': return 'destructive'
      case 'security': return 'default' // blue/primary
      case 'critical': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">System Logs</h1>
        <div className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      <form className="bg-white rounded-md border shadow-sm p-4 flex flex-wrap gap-4 text-sm">
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Level</label>
          <select
            name="level"
            defaultValue={level}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">All</option>
            <option value="info">info</option>
            <option value="warn">warn</option>
            <option value="error">error</option>
            <option value="security">security</option>
            <option value="critical">critical</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">Organisation ID</label>
          <input
            name="organisation_id"
            defaultValue={organisationId}
            className="border rounded px-2 py-1 text-sm w-64 font-mono"
            placeholder="UUID"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">From</label>
          <input
            type="datetime-local"
            name="from"
            defaultValue={from}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1">To</label>
          <input
            type="datetime-local"
            name="to"
            defaultValue={to}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="px-3 py-1.5 bg-black text-white rounded text-xs font-semibold"
          >
            Apply
          </button>
        </div>
      </form>

      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Metadata</TableHead>
              <TableHead className="text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Badge variant={getBadgeVariant(log.level)} className="uppercase text-[10px]">
                    {log.level}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">{log.source}</TableCell>
                <TableCell className="max-w-md truncate" title={log.message}>
                  {log.message}
                </TableCell>
                <TableCell className="font-mono text-xs text-gray-400 max-w-xs truncate">
                  {JSON.stringify(log.metadata)}
                </TableCell>
                <TableCell className="text-right text-xs text-gray-500 whitespace-nowrap">
                  {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
            {(!logs || logs.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center text-xs text-gray-600">
        <div>
          Total: {total} logs
        </div>
        <div className="flex gap-2">
          <a
            href={`?${new URLSearchParams({
              ...params,
              page: String(Math.max(1, currentPage - 1)),
            } as Record<string, string>).toString()}`}
            className={`px-3 py-1 border rounded ${currentPage <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
          >
            Previous
          </a>
          <a
            href={`?${new URLSearchParams({
              ...params,
              page: String(Math.min(totalPages, currentPage + 1)),
            } as Record<string, string>).toString()}`}
            className={`px-3 py-1 border rounded ${currentPage >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
          >
            Next
          </a>
        </div>
      </div>
    </div>
  )
}

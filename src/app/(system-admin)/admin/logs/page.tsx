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

export const dynamic = 'force-dynamic'

export default async function SystemLogsPage() {
  const supabase = createServiceClient()
  
  // Fetch latest 50 logs
  const { data: logs, error } = await supabase
    .from('system_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50) as { data: SystemLog[] | null, error: { message: string } | null }

  if (error) {
    return <div className="p-4 text-red-500">Error loading logs: {error.message}</div>
  }

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
        <div className="text-sm text-gray-500">Last 50 entries</div>
      </div>

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
    </div>
  )
}

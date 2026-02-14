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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Scale } from 'lucide-react'
import { DataRequest } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export default async function GovernanceDashboard() {
  const supabase = createServiceClient()

  // 1. Fetch Stats
  const { count: legalHoldCount } = await supabase
    .from('organisations')
    .select('*', { count: 'exact', head: true })
    .eq('legal_hold', true)

  const { count: deletionRequests } = await supabase
    .from('data_requests')
    .select('*', { count: 'exact', head: true })
    .eq('request_type', 'deletion')
    .eq('status', 'pending')

  // 2. Fetch Recent Requests
  const { data: requests } = await supabase
    .from('data_requests')
    .select('*, organisations(name), profiles:user_id(email)')
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Scale className="w-6 h-6" /> Governance & Compliance
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Legal Holds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{legalHoldCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Deletion Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{deletionRequests}</div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-md border shadow-sm">
        <div className="p-4 border-b font-medium">Recent Data Requests</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Organisation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(requests as unknown as DataRequest[])?.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="capitalize font-medium">{req.request_type}</TableCell>
                <TableCell>{req.profiles?.email}</TableCell>
                <TableCell>{req.organisations?.name || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={req.status === 'pending' ? 'warning' : 'outline'}>
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-gray-500">
                  {new Date(req.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

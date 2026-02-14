import { createClient } from '@/lib/supabase/server'
import { AddMemberDialog } from '@/components/members/add-member-dialog'
import { MemberTable } from '@/components/members/member-table'
import { Search, Printer } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic' // Ensure we fetch fresh data on navigation

interface PageProps {
  searchParams: Promise<{
    q?: string
    status?: string
    page?: string
  }>
}

export default async function MembersPage({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.q || ''
  const status = params.status || 'all'
  const page = Number(params.page) || 1
  const pageSize = 20

  const supabase = await createClient()

  // Base query with organisation isolation via RLS
  let dbQuery = supabase
    .from('members')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  // Apply Search
  if (query) {
    dbQuery = dbQuery.or(`full_name.ilike.%${query}%,phone.ilike.%${query}%`)
  }

  // Apply Status Filter
  if (status !== 'all') {
    dbQuery = dbQuery.eq('status', status)
  }

  // Apply Pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  dbQuery = dbQuery.range(from, to)

  const { data, error, count } = await dbQuery
  const members = data as any[]

  if (error) {
    console.error('Error fetching members:', error)
    return <div className="p-4 text-destructive">Error loading members. Please try again.</div>
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-foreground">Members</h1>
           <p className="text-muted-foreground mt-1">Manage your organisation's members and staff.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" asChild>
                <a href="/members/print" target="_blank">
                    <Printer className="mr-2 h-4 w-4" />
                    Print List
                </a>
            </Button>
            <AddMemberDialog />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <form className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            name="q"
            defaultValue={query}
            placeholder="Search by name or phone..."
            className="pl-10"
          />
          {/* Hidden submit to enable Enter key search */}
          <button type="submit" className="hidden" />
        </form>

        <form className="w-full md:w-48 flex gap-2">
            <Select
                name="status"
                defaultValue={status}
                className="w-full"
            >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </Select>
            <Button type="submit" variant="secondary">Filter</Button>
        </form>
      </div>

      <Card>
        <CardContent className="p-0">
            <MemberTable members={members || []} />
        </CardContent>
      </Card>
      
      {/* Pagination */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
         <div>
            Showing {from + 1}-{Math.min(to + 1, count || 0)} of {count} members
         </div>
         <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} asChild>
                {page > 1 ? (
                    <a href={`/members?page=${page - 1}&q=${query}&status=${status}`}>Previous</a>
                ) : (
                    <span>Previous</span>
                )}
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
                {page < totalPages ? (
                    <a href={`/members?page=${page + 1}&q=${query}&status=${status}`}>Next</a>
                ) : (
                    <span>Next</span>
                )}
            </Button>
         </div>
      </div>
    </div>
  )
}

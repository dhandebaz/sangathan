import { createClient } from '@/lib/supabase/server'
import { AddMemberDialog } from '@/components/members/add-member-dialog'
import { MemberTable } from '@/components/members/member-table'
import { Search, Printer } from 'lucide-react'

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

  const { data: members, error, count } = await dbQuery

  if (error) {
    console.error('Error fetching members:', error)
    return <div className="p-4 text-red-500">Error loading members. Please try again.</div>
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 1

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Members</h1>
           <p className="text-gray-500 mt-1">Manage your organisation's members and staff.</p>
        </div>
        <div className="flex gap-2">
            <a 
                href="/members/print" 
                target="_blank"
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
                <Printer size={16} />
                Print List
            </a>
            <AddMemberDialog />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <form className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            name="q"
            defaultValue={query}
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
          />
          {/* Hidden submit to enable Enter key search */}
          <button type="submit" className="hidden" />
        </form>

        <form className="w-full md:w-48">
            <select
                name="status"
                defaultValue={status}
                // Auto-submit on change is tricky without JS, but standard form submission works
                // Better to use a Client Component for filters if we want auto-submit
                // For now, we rely on the user pressing Enter or we can wrap this in a simple client component later.
                // Let's keep it simple: Add a filter button or just let them pick.
                // Actually, a simple client component wrapper for the filter is better UX.
                // But per "Minimal", standard form works.
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-orange-500 outline-none bg-white"
            >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
            </select>
            <button type="submit" className="ml-2 bg-gray-100 px-3 py-2 rounded text-sm hover:bg-gray-200">Filter</button>
        </form>
      </div>

      <div className="content-card rounded-lg p-0 overflow-hidden">
        <MemberTable members={members || []} />
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
         <div>
            Showing {from + 1}-{Math.min(to + 1, count || 0)} of {count} members
         </div>
         <div className="flex gap-2">
            {page > 1 && (
                <a href={`/members?page=${page - 1}&q=${query}&status=${status}`} className="px-3 py-1 border rounded hover:bg-gray-50">Previous</a>
            )}
            {page < totalPages && (
                <a href={`/members?page=${page + 1}&q=${query}&status=${status}`} className="px-3 py-1 border rounded hover:bg-gray-50">Next</a>
            )}
         </div>
      </div>
    </div>
  )
}

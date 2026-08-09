import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { AddMemberDialog } from '@/components/members/add-member-dialog'
import { MemberTable } from '@/components/members/member-table'
import { Printer, FileSpreadsheet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MemberFilters } from '@/components/members/member-filters'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Member } from '@/types/dashboard'
import { getOrgPlanUsage } from '@/lib/plans/limits'
import { PlanUsageBanner } from '@/components/dashboard/plan-usage-banner'

export const dynamic = 'force-dynamic'

async function getOrgType(supabase: Awaited<ReturnType<typeof createClient>>, orgId: string): Promise<string> {
  if (!orgId) return 'default'
  const { data } = await supabase.from('organisations').select('org_type').eq('id', orgId).single()
  return data?.org_type || 'default'
}

function getOrgLabels(orgType: string) {
  const labels: Record<string, { title: string; description: string }> = {
    ngo: { title: 'Members & Supporters', description: 'Manage your community of supporters, volunteers, and beneficiaries.' },
    student_union: { title: 'Student Body', description: 'Manage the student community, class representatives, and club members.' },
    workers_union: { title: 'Worker Registry', description: 'Manage union members, shop stewards, and workplace delegates.' },
    rwa: { title: 'Residents', description: 'Manage resident directory, owner and tenant records.' },
  }
  return labels[orgType] || { title: 'Members', description: 'Manage your organisation members.' }
}

interface PageProps {
  searchParams: Promise<{
    q?: string
    status?: string
    page?: string
  }>
}

export default async function MembersPage({ searchParams, params }: PageProps & { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const p = await searchParams
  const query = p.q || ''
  const status = p.status || 'all'
  const page = Number(p.page) || 1
  const pageSize = 20

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${lang}/login`)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  let selectedOrgId = profile?.organisation_id
  if (!selectedOrgId) {
    try {
      selectedOrgId = await getSelectedOrganisationId()
    } catch {
      // Ignore fallback error
    }
  }

  if (!selectedOrgId) {
    return (
      <div className="p-8 text-center border border-border bg-card rounded-xl">
        <h2 className="text-xl font-bold">No Organisation Selected</h2>
        <p className="text-muted-foreground mt-2">Please join or set up an organisation to manage members.</p>
      </div>
    )
  }

  const orgType = await getOrgType(supabase, selectedOrgId)
  const { title, description } = getOrgLabels(orgType)
  const usage = await getOrgPlanUsage(selectedOrgId)

  let dbQuery = supabase
    .from('members')
    .select('*', { count: 'exact' })
    .eq('organisation_id', selectedOrgId)
    .order('created_at', { ascending: false })

  if (query) {
    dbQuery = dbQuery.or(`full_name.ilike.%${query}%,phone.ilike.%${query}%,designation.ilike.%${query}%,area.ilike.%${query}%`)
  }

  if (status !== 'all') {
    dbQuery = dbQuery.eq('status', status)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  dbQuery = dbQuery.range(from, to)

  let { data: members, error, count } = await dbQuery as { data: Member[] | null, error: { message: string } | null, count: number | null }

  if (error) {
    try {
      const adminClient = createServiceClient()
      let fallbackQuery = adminClient
        .from('members')
        .select('*', { count: 'exact' })
        .eq('organisation_id', selectedOrgId)
        .order('created_at', { ascending: false })

      if (query) {
        fallbackQuery = fallbackQuery.or(`full_name.ilike.%${query}%,phone.ilike.%${query}%`)
      }
      if (status !== 'all') {
        fallbackQuery = fallbackQuery.eq('status', status)
      }
      fallbackQuery = fallbackQuery.range(from, to)

      const fallbackRes = await fallbackQuery as { data: Member[] | null, error: { message: string } | null, count: number | null }
      if (!fallbackRes.error) {
        members = fallbackRes.data
        count = fallbackRes.count
        error = null
      }
    } catch (e) {
      console.error('Fallback query error:', e)
    }
  }

  if (error) {
    console.error('Error fetching members:', error)
    members = []
    count = 0
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
           <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
                <Link href={`/${lang}/dashboard/members/import`}>
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-orange-700" />
                    {lang === 'hi' ? 'आयात (CSV / Excel)' : 'Import (CSV / Excel)'}
                </Link>
            </Button>
            <Button variant="outline" asChild>
                <a href={`/${lang}/dashboard/members/print`} target="_blank">
                    <Printer className="mr-2 h-4 w-4" />
                    {lang === 'hi' ? 'सूची प्रिंट करें' : 'Print List'}
                </a>
            </Button>
            <AddMemberDialog />
        </div>
      </div>

      <PlanUsageBanner usage={usage} lang={lang} />

      <MemberFilters initialQuery={query} initialStatus={status} />

      <Card>
        <CardContent className="p-0">
            <MemberTable members={members || []} />
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center text-sm text-muted-foreground">
         <div>
            Showing {from + 1}-{Math.min(to + 1, count || 0)} of {count} members
         </div>
         <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} asChild>
                {page > 1 ? (
                    <Link href={`/${lang}/dashboard/members?page=${page - 1}&q=${query}&status=${status}`}>Previous</Link>
                ) : (
                    <span>Previous</span>
                )}
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} asChild>
                {page < totalPages ? (
                    <Link href={`/${lang}/dashboard/members?page=${page + 1}&q=${query}&status=${status}`}>Next</Link>
                ) : (
                    <span>Next</span>
                )}
            </Button>
         </div>
      </div>
    </div>
  )
}

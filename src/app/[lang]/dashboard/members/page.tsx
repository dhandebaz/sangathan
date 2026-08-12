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
            <Button variant="outline" asChild className="border-slate-200">
                <Link href={`/${lang}/dashboard/members/import?source=csv`}>
                    <FileSpreadsheet className="mr-2 h-4 w-4 text-slate-600" />
                    {lang === 'hi' ? 'मैनुअल आयात (CSV / Excel)' : 'Manual Import (CSV / Excel)'}
                </Link>
            </Button>
            <Button variant="outline" asChild className="border-orange-200 bg-orange-50/50 text-orange-950 hover:bg-orange-100 font-semibold">
                <Link href={`/${lang}/dashboard/members/import?source=google`}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    {lang === 'hi' ? 'Google Contacts से आयात' : 'Google Contacts Import'}
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

import { PageHeader } from '@/components/public/page-header'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DuesClient from '@/components/dashboard/dues/dues-client'

export default async function DuesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params

  const organisationId = await getSelectedOrganisationId()
  
  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const supabase = await createClient()

  // Fetch billing plans
  const { data: plans } = await supabase
    .from('billing_plans')
    .select('*')
    .eq('organisation_id', organisationId)
    .order('created_at', { ascending: false })

  // Fetch dues with member details
  const { data: dues } = await supabase
    .from('membership_dues')
    .select(`
      *,
      profiles:member_profile_id (
        full_name,
        email
      ),
      billing_plans:plan_id (
        name
      )
    `)
    .eq('organisation_id', organisationId)
    .order('due_date', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Membership Dues
          </h1>
          <p className="text-muted-foreground mt-1">Track and manage member dues and billing plans.</p>
        </div>
      </div>

      <DuesClient plans={plans || []} dues={dues || []} lang={lang} />
    </div>
  )
}

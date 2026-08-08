import { getSelectedOrganisationId } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LyngdohClient from '@/components/dashboard/lyngdoh/lyngdoh-client'

export default async function LyngdohCompliancePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()

  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const supabase = await createClient()

  // Fetch real candidates nominated in elections from Supabase
  const { data: candidates } = await supabase
    .from('candidates')
    .select(`
      *,
      profiles:profile_id (
        id,
        full_name,
        email,
        phone,
        area
      ),
      election_positions (
        title,
        elections (
          title
        )
      )
    `)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Lyngdoh Committee Compliance Audit
          </h1>
          <p className="text-slate-500 mt-1">
            Automated Supreme Court mandate audit for candidate nominations, age limits, attendance thresholds, and campaign expenditure caps.
          </p>
        </div>
      </div>

      <LyngdohClient initialCandidates={candidates || []} organisationId={organisationId} />
    </div>
  )
}

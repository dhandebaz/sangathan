import { getSelectedOrganisationId } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InductionClient from '@/components/dashboard/induction/induction-client'

export default async function MemberInductionPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()

  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const supabase = await createClient()

  // Fetch recently inducted members from Supabase profiles table
  const { data: members } = await supabase
    .from('profiles')
    .select('id, full_name, phone, area, designation, created_at')
    .eq('organisation_id', organisationId)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Member Induction Drive (सदस्यता अभियान)
          </h1>
          <p className="text-slate-500 mt-1">
            On-ground kiosk desk entry, scannable booth QR posters, and paper slip batch intake for campus membership drives.
          </p>
        </div>
      </div>

      <InductionClient organisationId={organisationId} initialMembers={members || []} />
    </div>
  )
}

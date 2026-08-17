import { GrantsClient } from '@/components/dashboard/grants/grants-client'
import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, DollarSign, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function GrantsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id')
    .eq('id', user.id)
    .maybeSingle()

  let orgId = profile?.organisation_id
  if (!orgId) {
    try {
      orgId = await getSelectedOrganisationId()
    } catch {
      // fallback
    }
  }

  if (!orgId) {
    redirect(`/${lang}/onboarding`)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner to AI Grant Matcher */}
      <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="text-sm font-bold text-indigo-950">
              AI Grant & CSR Opportunity Matcher
            </div>
            <p className="text-xs text-indigo-800">
              Scan open Indian government schemes & CSR funds matched to your cause with automated AI proposal drafting.
            </p>
          </div>
        </div>

        <Button asChild size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shrink-0">
          <Link href={`/${lang}/dashboard/grants/matcher`}>
            <span>Open Matcher & AI Proposals</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </Button>
      </div>

      <GrantsClient orgId={orgId} />
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { TransparencyClient } from '@/components/dashboard/transparency-client'
import { getTransparencyLedgerAction } from '@/actions/transparency-ledger'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'वित्तीय पारदर्शिता एवं बहीखाता | संगठन' : 'Financial Transparency & Trust Ledger | Sangathan',
    description: 'Cryptographically audited expense ledger with verified SHA-256 integrity receipts.',
  }
}

export default async function TransparencyPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const orgId = await getSelectedOrganisationId()
  if (!orgId) redirect(`/${lang}/onboarding`)

  const result = await getTransparencyLedgerAction(orgId)
  if (!result || !result.success) {
    redirect(`/${lang}/dashboard`)
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <TransparencyClient
        lang={lang}
        orgSlug={result.org?.slug || 'org'}
        orgName={result.org?.name || 'Collective'}
        entries={result.entries || []}
        totalExpenditure={result.totalExpenditure ?? 0}
        programmaticRatio={result.programmaticRatio ?? 0}
        transparencyScore={result.transparencyScore ?? 96}
      />
    </div>
  )
}

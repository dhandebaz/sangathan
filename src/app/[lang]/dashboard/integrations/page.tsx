import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PlugZap, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { listProviders, isProviderConfigured } from '@/lib/integrations/providers'
import { listIntegrationStatuses } from '@/lib/integrations/store'
import { IntegrationsClient } from './integrations-client'

export const dynamic = 'force-dynamic'

export default async function IntegrationsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/${lang}/login`)

  const orgId = await getSelectedOrganisationId()
  if (!orgId) redirect(`/${lang}/select-organisation`)

  const { planEligible, items } = await listIntegrationStatuses(orgId)
  const providers = listProviders().map((p) => ({
    id: p.id,
    name: p.name,
    tagline: p.tagline,
    docsUrl: p.docsUrl,
    configured: isProviderConfigured(p),
    connected: items[p.id]?.connected || false,
    lastError: items[p.id]?.status?.lastError || null,
  }))

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
          <PlugZap className="h-6 w-6 text-indigo-600" />
          {isHindi ? 'इंटीग्रेशन व प्लगइन्स' : 'Integrations & Plugins'}
        </h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-600">
          {isHindi
            ? 'बाहरी ऐप्स (पहले Canva) से OAuth से जुड़ें। प्लगइन्स सिर्फ मीटर बिलिंग वाली संस्थाओं के लिए हैं।'
            : 'Connect external apps (Canva first) via OAuth. Plugins unlock on metered billing.'}
        </p>
      </div>

      {!planEligible && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
          <Lock className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div className="text-sm text-amber-900">
            <p className="font-bold">
              {isHindi ? 'प्लगइन्स मीटर बिलिंग पर अनलॉक होते हैं' : 'Plugins unlock on metered billing'}
            </p>
            <p className="mt-1">
              {isHindi ? (
                <>
                  UPI ऑटोपे से मीटर चालू करें — <Link href={`/${lang}/dashboard/billing`} className="font-bold underline">बिलिंग खोलो</Link>
                </>
              ) : (
                <>
                  Turn on the meter with UPI autopay — <Link href={`/${lang}/dashboard/billing`} className="font-bold underline">open billing</Link>
                </>
              )}
            </p>
          </div>
        </div>
      )}

      <IntegrationsClient
        orgId={orgId}
        lang={lang}
        isHindi={isHindi}
        planEligible={planEligible}
        providers={providers}
      />
    </div>
  )
}

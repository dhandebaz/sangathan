import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { UnifiedAdministrationHub } from '@/components/dashboard/administration/unified-administration-hub'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'प्रशासन, वैधानिक अनुपालन एवं तिजोरी | संगठन' : 'Administration & Vault Hub | Sangathan',
    description: isHindi
      ? 'वैधानिक दस्तावेज़ वॉल्ट, आधिकारिक रजिस्टर, विवाद निवारण और ऑडिट लॉग।'
      : 'Institutional document vault, statutory registers, legal compliance, and audit logs.',
  }
}

interface PageProps {
  params: Promise<{ lang: string }>
  searchParams: Promise<{
    tab?: string
    category?: string
    q?: string
  }>
}

export default async function AdministrationPage({ params, searchParams }: PageProps) {
  const { lang } = await params
  const sp = await searchParams
  const initialTab = sp.tab || 'vault'

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/${lang}/login`)
  }

  const selectedOrgId = await getSelectedOrganisationId()
  if (!selectedOrgId) {
    redirect(`/${lang}/select-organisation`)
  }

  // Get user profile & org details
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .eq('organisation_id', selectedOrgId)
    .maybeSingle()

  const { data: org } = await supabase
    .from('organisations')
    .select('name, organisation_type')
    .eq('id', selectedOrgId)
    .single()

  const isAdmin = profile?.role === 'admin' || profile?.role === 'owner'
  const orgName = org?.name || 'Organisation'
  const orgType = org?.organisation_type || 'civic_collective'

  // Fetch Documents
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('organisation_id', selectedOrgId)
    .order('created_at', { ascending: false })

  // Fetch Grievances / Disputes
  const { data: grievances } = await supabase
    .from('grievances')
    .select('*')
    .eq('organisation_id', selectedOrgId)
    .order('created_at', { ascending: false })

  // Fetch Audit Logs
  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('organisation_id', selectedOrgId)
    .order('created_at', { ascending: false })
    .limit(20)

  const stats = {
    totalDocuments: documents?.length || 0,
    activeRegisters: 4,
    complianceScore: 100,
    openGrievances: grievances?.filter(g => g.status !== 'resolved').length || grievances?.length || 0,
    totalLetters: 0,
    auditEvents: auditLogs?.length || 0,
  }

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 space-y-6">
      <UnifiedAdministrationHub
        lang={lang}
        orgId={selectedOrgId}
        orgName={orgName}
        orgType={orgType}
        isAdmin={isAdmin}
        initialTab={initialTab}
        documents={documents || []}
        grievances={grievances || []}
        auditLogs={auditLogs || []}
        stats={stats}
      />
    </div>
  )
}

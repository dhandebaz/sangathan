import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import { getDocuments } from '@/actions/documents'
import { DocumentVault } from '@/components/documents/document-vault'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'दस्तावेज़ वॉल्ट | संगठन' : 'Document Vault | Sangathan',
    description: isHindi
      ? 'वैधानिक पंजीकरण, 12A/80G, CBA समझौते, और स्वामित्व विलेखों का सुरक्षित डिजिटल भंडार।'
      : 'Sovereign institutional document cloud for legal acts, registered deeds, and agreements.',
  }
}

interface PageProps {
  params: Promise<{ lang: string }>
  searchParams: Promise<{
    category?: string
    q?: string
  }>
}

export default async function DocumentsPage({ params, searchParams }: PageProps) {
  const { lang } = await params
  const p = await searchParams
  const category = p.category || 'all'
  const search = p.q || ''

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

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .eq('organisation_id', selectedOrgId)
    .single()

  const { data: org } = await supabase
    .from('organisations')
    .select('org_type')
    .eq('id', selectedOrgId)
    .single()

  const isAdmin = ['admin', 'executive'].includes(profile?.role || '')
  const documents = await getDocuments(selectedOrgId, category, search)

  return (
    <div className="py-2">
      <DocumentVault
        documents={documents}
        orgId={selectedOrgId}
        orgType={org?.org_type || 'ngo'}
        lang={lang}
        isAdmin={isAdmin}
      />
    </div>
  )
}

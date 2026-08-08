import { getSelectedOrganisationId } from '@/lib/auth/context'
import { redirect } from 'next/navigation'
import MemorandumClient from '@/components/dashboard/memorandums/memorandum-client'
import { getMemorandums } from '@/actions/memorandums'

export default async function MemorandumsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()

  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const { memorandums } = await getMemorandums(organisationId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Memorandums & Gyapan (ज्ञापन)
          </h1>
          <p className="text-slate-500 mt-1">
            Formal representations, demand charters, and petition sign-ons for Vice-Chancellors and University Administration.
          </p>
        </div>
      </div>

      <MemorandumClient initialMemorandums={memorandums || []} organisationId={organisationId} />
    </div>
  )
}

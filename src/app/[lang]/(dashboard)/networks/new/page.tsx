import { createClient } from '@/lib/supabase/server'
import { NetworkForm } from '@/components/networks/network-form'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { checkCapability } from '@/lib/capabilities'

export default async function NewNetworkPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: profile } = await supabase
    .from('profiles')
    .select('organisation_id, role')
    .eq('id', user.id)
    .single()

  if (!profile || !['admin', 'executive'].includes(profile.role)) {
    return <div>Access Denied</div>
  }

  const canFederate = await checkCapability(profile.organisation_id, 'federation_mode')
  if (!canFederate) return <div>Federation Mode not enabled for your organisation.</div>

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/${lang}/dashboard/networks`} className="flex items-center text-sm text-gray-500 hover:text-black mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Networks
        </Link>
        <h1 className="text-2xl font-bold">Create New Network</h1>
      </div>
      <NetworkForm />
    </div>
  )
}

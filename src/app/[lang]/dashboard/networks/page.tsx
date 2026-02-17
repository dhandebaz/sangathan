import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Plus, Globe } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { checkCapability } from '@/lib/capabilities'
import { Network } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

export default async function NetworksPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <div>Please login</div>

  const { data: profileData } = await supabase.from('profiles').select('organisation_id, role').eq('id', user.id).single()
  const profile = profileData as { organisation_id: string | null; role: string } | null

  if (!profile?.organisation_id) return <div>No Organisation</div>

  const canFederate = await checkCapability(profile.organisation_id, 'federation_mode')
  if (!canFederate) return <div className="p-8 text-center text-gray-500">Federation Mode is not enabled for your organisation.</div>

  const { data: memberships } = await supabase
    .from('network_memberships')
    .select('network:networks(*)')
    .eq('organisation_id', profile.organisation_id)
    .eq('status', 'active') as { data: { network: Network }[] | null }

  const networks = memberships?.map((m) => m.network) || []

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Networks</h1>
          <p className="text-muted-foreground mt-1">Manage federated alliances and coalitions.</p>
        </div>
        <Button asChild>
          <Link href={`/${lang}/dashboard/networks/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Create Network
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {networks.map((network) => (
          <div key={network.id} className="bg-white p-6 rounded-xl border shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{network.name}</h3>
                <Badge variant={network.visibility === 'public' ? 'default' : 'secondary'}>
                  {network.visibility || 'private'}
                </Badge>
             </div>
             <p className="text-gray-500 mb-6">{network.description}</p>
             <div className="flex justify-between items-center">
                <Link href={`/${lang}/network/${network.slug}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                   <Globe className="w-4 h-4" />
                   View Public Page
                </Link>
             </div>
          </div>
        ))}

        {networks.length === 0 && (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-xl border border-dashed">
            <p className="text-gray-500">Your organisation is not part of any networks.</p>
          </div>
        )}
      </div>
    </div>
  )
}


import { notFound } from 'next/navigation'
import { getNetworkDetails } from '@/actions/networks'
import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'
import { Calendar, Users, Globe } from 'lucide-react'
import { Network, NetworkMember } from '@/types/dashboard'

export default async function PublicNetworkPage(props: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang } = await props.params

  const networkData = await getNetworkDetails(slug)
  if (!networkData) notFound()
  const network = networkData as unknown as Network
  const activeMembers = network.members.filter((member) => member.status === 'active')

  const supabase = createServiceClient()
  const { data: eventsData } = await supabase
    .from('events')
    .select('id, title, description, start_time, location, organisation_id, organisation:organisations(slug)')
    .eq('network_id', network.id)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })

  const memberCounts = await Promise.all(
    activeMembers.map(async (member) => {
      const { count } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('organisation_id', member.organisation.id)
        .eq('status', 'active')

      return {
        ...member,
        organisation: {
          ...member.organisation,
          member_count: count || 0,
        },
      }
    })
  )

  const events = (eventsData || []) as {
    id: string
    title: string
    description?: string | null
    start_time: string
    location?: string | null
    organisation_id: string
    organisation?: { slug?: string | null } | null
  }[]

  const totalMembers = memberCounts.reduce((sum, member) => sum + member.organisation.member_count, 0)
  const orgCount = memberCounts.length

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-900 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4 text-blue-400">
            <Globe className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Federated Network</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{network.name}</h1>
          <p className="text-xl text-gray-300 max-w-2xl">{network.description}</p>

          <div className="flex gap-8 mt-12">
            <div>
              <div className="text-3xl font-bold">{orgCount}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Organisations</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{totalMembers.toLocaleString()}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">Total Members</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-4 space-y-16">
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-gray-400" />
            Member Organisations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memberCounts.map((member: NetworkMember & { organisation: NetworkMember['organisation'] & { member_count: number } }) => (
              <Link href={`/${lang}/org/${member.organisation.slug}`} key={member.organisation.id} className="group">
                <div className="border rounded-xl p-6 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{member.organisation.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">@{member.organisation.slug}</p>
                  <p className="text-xs text-gray-400 mt-3">{member.organisation.member_count.toLocaleString()} active members</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {events.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-gray-400" />
              Network Events
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/${lang}/org/${event.organisation?.slug || slug}/events/${event.id}`}
                  className="border rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50 block"
                >
                  <div className="text-sm text-gray-500 mb-2">
                    {new Date(event.start_time).toLocaleDateString()} | {event.location || 'Online'}
                  </div>
                  <h3 className="font-bold text-xl mb-2">{event.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{event.description}</p>
                  <div className="mt-4">
                    <span className="text-blue-600 text-sm font-medium">View Details</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

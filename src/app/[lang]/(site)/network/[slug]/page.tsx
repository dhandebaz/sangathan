import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getNetworkDetails } from '@/actions/networks'
import { createServiceClient } from '@/lib/supabase/service'
import Link from 'next/link'
import { Calendar, Users, Globe } from 'lucide-react'
import { Network } from '@/types/dashboard'
import { NetworkJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata(props: {
  params: Promise<{ slug: string; lang: string }>
}): Promise<Metadata> {
  const { slug, lang } = await props.params
  const networkData = await getNetworkDetails(slug)
  if (!networkData) {
    return {
      title: 'Federation Not Found',
      description: 'The requested civic coalition or federation could not be found.',
    }
  }

  const network = networkData as unknown as Network
  const isHindi = lang === 'hi'
  const title = `${network.name} | ${isHindi ? 'संयुक्त मोर्चा और नागरिक महासंघ' : 'Civic Coalition & Federation'} | Sangathan`
  const description =
    network.description ||
    `${network.name} is a democratic alliance uniting ${network.members?.length || 0} organizations on Sangathan.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://sangathan.space/${lang}/network/${slug}`,
      languages: {
        en: `https://sangathan.space/en/network/${slug}`,
        hi: `https://sangathan.space/hi/network/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sangathan.space/${lang}/network/${slug}`,
      siteName: 'Sangathan',
      locale: isHindi ? 'hi_IN' : 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function PublicNetworkPage(props: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang } = await props.params
  const isHindi = lang === 'hi'

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
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'नेटवर्क' : 'Network', url: `https://sangathan.space/${lang}/network` },
          { name: network.name, url: `https://sangathan.space/${lang}/network/${network.slug}` },
        ]}
      />
      <NetworkJsonLd
        network={network}
        memberOrgs={memberCounts.map((m) => ({ name: m.organisation.name, slug: m.organisation.slug }))}
        totalMembers={totalMembers}
        lang={lang}
      />

      <div className="bg-slate-50 border-b border-slate-200 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-4 text-indigo-600">
            <Globe className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isHindi ? 'नागरिक गठबंधन व मोर्चा' : 'Civic Alliance & Federation'}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">{network.name}</h1>
          {network.description && (
            <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">{network.description}</p>
          )}

          <div className="flex gap-6 mt-8">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              <span className="font-bold text-slate-900">{orgCount}</span>
              <span className="text-slate-500 text-sm">{isHindi ? 'संगठन' : 'Organisations'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-slate-400" />
              <span className="font-bold text-slate-900">{totalMembers}</span>
              <span className="text-slate-500 text-sm">{isHindi ? 'सक्रिय सदस्य' : 'Total Members'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto py-12 px-4 space-y-12">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            {isHindi ? 'गठबंधन सदस्य संगठन' : 'Member Organisations'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {memberCounts.map((member) => (
              <Link
                key={member.organisation.id || member.organisation.slug}
                href={`/${lang}/org/${member.organisation.slug}`}
                className="p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all flex items-center justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-900">{member.organisation.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {member.organisation.member_count} {isHindi ? 'सक्रिय सदस्य' : 'Active Members'}
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg">
                  {isHindi ? 'प्रोफ़ाइल देखें' : 'View Profile'} &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>

        {events.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {isHindi ? 'संयुक्त कार्यक्रम' : 'Joint Public Events'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event) => (
                <div key={event.id} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>{new Date(event.start_time).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{event.title}</h3>
                  {event.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 mb-4">{event.description}</p>
                  )}
                  {event.organisation?.slug && (
                    <Link
                      href={`/${lang}/org/${event.organisation.slug}/events/${event.id}`}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      {isHindi ? 'विवरण और RSVP' : 'View Details & RSVP'} &rarr;
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

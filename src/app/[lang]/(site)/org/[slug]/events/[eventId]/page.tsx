import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/service'
import { createClient } from '@/lib/supabase/server'
import { RSVPButton } from '@/components/events/rsvp-button'
import { TicketView } from '@/components/events/ticket-view'
import { generateQRData } from '@/actions/events'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Event, Organisation, RSVP } from '@/types/events'
import { EventJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata(props: {
  params: Promise<{ slug: string; eventId: string; lang: string }>
}): Promise<Metadata> {
  const { slug, eventId, lang } = await props.params
  const supabaseAdmin = createServiceClient()

  const { data: event } = await supabaseAdmin
    .from('events')
    .select('title, description, start_time, location, organisation:organisations(name, logo_url)')
    .eq('id', eventId)
    .maybeSingle()

  if (!event) {
    return {
      title: 'Event Not Found | Sangathan',
      description: 'The requested event could not be found.',
    }
  }

  const orgData = event.organisation as unknown as { name?: string; logo_url?: string | null } | null
  const orgName = orgData?.name || 'Organisation'
  const title = `${event.title} - ${orgName} | Sangathan Events`
  const description =
    event.description ||
    `Join ${event.title} organized by ${orgName} on ${new Date(event.start_time).toLocaleDateString()}. RSVP and access democratic community events on Sangathan.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://sangathan.space/${lang}/org/${slug}/events/${eventId}`,
      languages: {
        en: `https://sangathan.space/en/org/${slug}/events/${eventId}`,
        hi: `https://sangathan.space/hi/org/${slug}/events/${eventId}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sangathan.space/${lang}/org/${slug}/events/${eventId}`,
      siteName: 'Sangathan',
      type: 'article',
      images: [
        {
          url: `https://sangathan.space/api/og/org/${slug}`,
          width: 1200,
          height: 630,
          alt: `${event.title} - ${orgName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`https://sangathan.space/api/og/org/${slug}`],
    },
  }
}

export default async function EventPage(props: {
  params: Promise<{ slug: string; eventId: string; lang: string }>
}) {
  const { slug, eventId, lang } = await props.params
  const isHindi = lang === 'hi'
  const supabaseAdmin = createServiceClient()

  // 1. Fetch Event
  const { data: eventData } = await supabaseAdmin
    .from('events')
    .select('*, organisation_id')
    .eq('id', eventId)
    .maybeSingle()

  const event = eventData as Event | null

  if (!event) notFound()

  // 2. Fetch Org (for branding/verification)
  const { data: orgData } = await supabaseAdmin
    .from('organisations')
    .select('id, name, slug, logo_url')
    .eq('id', event.organisation_id)
    .maybeSingle()

  const org = orgData as (Organisation & { logo_url?: string | null }) | null
  if (!org || org.slug !== slug) notFound()

  // 3. Check User Status
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let rsvp: RSVP | null = null
  if (user) {
    const { data } = await supabaseAdmin
      .from('event_rsvps')
      .select('*, user:user_id(full_name)')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .maybeSingle()
    rsvp = data as RSVP | null
  }

  // 4. Generate QR if RSVPed
  let qrToken = ''
  if (rsvp) {
    qrToken = await generateQRData(event.id, user?.id, rsvp.id)
  }

  // 5. Check Capacity
  let remainingSpots: number | null = null
  if (event.capacity) {
    const { count } = await supabaseAdmin
      .from('event_rsvps')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .eq('status', 'registered')

    remainingSpots = Math.max(0, event.capacity - (count || 0))
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: org.name, url: `https://sangathan.space/${lang}/org/${org.slug}` },
          { name: event.title, url: `https://sangathan.space/${lang}/org/${org.slug}/events/${event.id}` },
        ]}
      />
      <EventJsonLd event={event} org={org} lang={lang} />

      <div className="mb-8">
        <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">
          {org.name} {isHindi ? 'प्रस्तुत करता है' : 'Presents'}
        </span>
        <h1 className="text-4xl font-extrabold mt-2 tracking-tight text-slate-900">{event.title}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start gap-4">
              <Calendar className="w-5 h-5 text-slate-500 mt-1" />
              <div>
                <p className="font-semibold text-slate-900">{isHindi ? 'दिनांक और समय' : 'Date & Time'}</p>
                <p className="text-slate-600">
                  {new Date(event.start_time).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  <br />
                  {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {event.end_time &&
                    ` - ${new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-slate-500 mt-1" />
                <div>
                  <p className="font-semibold text-slate-900">{isHindi ? 'स्थान' : 'Location'}</p>
                  <p className="text-slate-600">{event.location}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-4">
              <Users className="w-5 h-5 text-slate-500 mt-1" />
              <div>
                <p className="font-semibold text-slate-900">{isHindi ? 'पहुंच प्रकार' : 'Access'}</p>
                <p className="text-slate-600 capitalize">{event.event_type} {isHindi ? 'कार्यक्रम' : 'Event'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h2 className="text-xl font-bold text-slate-900">{isHindi ? 'विवरण' : 'About Event'}</h2>
              <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">{event.description}</div>
            </div>
          )}
        </div>

        {/* Sidebar / RSVP */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-slate-900">{isHindi ? 'उपस्थिति दर्ज करें' : 'RSVP & Entry'}</h3>
            {event.capacity && (
              <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                <span className="text-slate-500">{isHindi ? 'उपलब्ध सीटें' : 'Remaining Spots'}</span>
                <span className="font-bold text-slate-900">{remainingSpots}</span>
              </div>
            )}

            {!user && event.event_type !== 'public' ? (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-slate-500">
                  {isHindi ? 'RSVP करने के लिए लॉगिन करें' : 'Please log in to RSVP for this event'}
                </p>
                <a
                  href={`/${lang}/login`}
                  className="block w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-center text-sm hover:bg-indigo-500 transition-colors shadow-sm"
                >
                  {isHindi ? 'लॉगिन करें' : 'Log In'}
                </a>
              </div>
            ) : rsvp ? (
              <TicketView event={event} rsvp={rsvp} qrToken={qrToken} />
            ) : (
              <RSVPButton event={event} isAuthenticated={Boolean(user)} lang={lang} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

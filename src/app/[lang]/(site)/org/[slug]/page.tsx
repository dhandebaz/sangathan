import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { JoinButton } from '@/components/org/join-button'
import { getCollaboratingOrgs } from '@/actions/collaboration'
import Link from 'next/link'
import { Calendar, MapPin, Video } from 'lucide-react'
import { Organisation, DashboardEvent, DashboardAnnouncement, Meeting } from '@/types/dashboard'

export default async function OrgPage(props: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang } = await props.params
  const supabaseAdmin = createServiceClient()

  const { data: orgData } = await supabaseAdmin
    .from('organisations')
    .select('id, name, membership_policy, created_at, slug, public_transparency_enabled, description, logo_url, cover_url, contact_email, contact_phone, website, social_links, address, registration_status, registration_number, incorporation_date')
    .eq('slug', slug)
    .single()

  const org = orgData as Organisation & {
    membership_policy: string
    created_at: string
    public_transparency_enabled: boolean
    description: string | null
    logo_url: string | null
    cover_url: string | null
    contact_email: string | null
    contact_phone: string | null
    website: string | null
    social_links: Record<string, string> | null
    address: string | null
    registration_status: string | null
    registration_number: string | null
    incorporation_date: string | null
  } | null

  if (!org) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let memberStatus: string | null = null
  if (user) {
    const { data: profileData } = await supabaseAdmin
      .from('profiles')
      .select('status')
      .eq('id', user.id)
      .eq('organisation_id', org.id)
      .single()

    const profile = profileData as { status: string } | null
    if (profile) memberStatus = profile.status
  }

  const { data: announcements } = await supabaseAdmin
    .from('announcements')
    .select('*')
    .eq('organisation_id', org.id)
    .eq('visibility_level', 'public')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: ownedEvents } = await supabaseAdmin
    .from('events')
    .select('*')
    .eq('organisation_id', org.id)
    .eq('event_type', 'public')
    .gte('start_time', new Date().toISOString())

  const { data: jointMappings } = await supabaseAdmin
    .from('joint_events')
    .select('event:events(*)')
    .eq('organisation_id', org.id)

  const jointEvents =
    (jointMappings as unknown as { event: DashboardEvent }[])
      ?.map((mapping) => mapping.event)
      .filter((event) => event.event_type === 'public' && new Date(event.start_time) >= new Date()) || []

  const allEvents = [...((ownedEvents as DashboardEvent[]) || []), ...jointEvents].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  )

  const { data: publicMeetingsData } = await supabaseAdmin
    .from('meetings')
    .select('id, organisation_id, title, description, date, end_time, location, visibility, meeting_link')
    .eq('organisation_id', org.id)
    .eq('visibility', 'public')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })

  const publicMeetings = (publicMeetingsData as Meeting[] | null) || []

  const partners = (await getCollaboratingOrgs(org.id)) as (Organisation & { id: string })[]

  let metrics: { members: number; events: number; hours: number } | null = null

  if (org.public_transparency_enabled) {
    const [members, events, hours] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('organisation_id', org.id)
        .eq('status', 'active'),
      supabaseAdmin
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('organisation_id', org.id),
      supabaseAdmin
        .from('task_logs')
        .select('hours_logged, task:tasks!inner(organisation_id)')
        .eq('task.organisation_id', org.id),
    ])

    const totalHours = ((hours.data as { hours_logged: number }[] | null) || []).reduce(
      (sum, log) => sum + (Number(log.hours_logged) || 0),
      0
    )

    metrics = {
      members: members.count || 0,
      events: events.count || 0,
      hours: Math.round(totalHours),
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 min-h-screen space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {org.cover_url ? (
          <div className="w-full h-48 md:h-64 relative bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={org.cover_url} alt={`${org.name} cover`} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />
        )}
        
        <div className="p-8 relative">
          {org.logo_url && (
            <div className="absolute -top-16 left-8 bg-white p-1 rounded-full shadow-md z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={org.logo_url} alt={`${org.name} logo`} className="w-24 h-24 rounded-full object-cover" />
            </div>
          )}

          <div className={`flex flex-col md:flex-row justify-between items-start gap-4 mb-6 ${org.logo_url ? 'mt-10' : ''}`}>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{org.name}</h1>
                {org.registration_status === 'registered' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200" title={`Reg No: ${org.registration_number || 'N/A'}`}>
                    Registered
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm">Established {new Date(org.created_at).toLocaleDateString()}</p>
            {partners.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Part of a coalition with:
                {partners.map((partner, index) => (
                  <span key={partner.id}>
                    {index > 0 && ', '}
                    <Link href={`/${lang}/org/${partner.slug}`} className="text-blue-600 hover:underline ml-1">
                      {partner.name}
                    </Link>
                  </span>
                ))}
              </div>
            )}
          </div>
          {org.public_transparency_enabled && (
            <div className="flex flex-col items-end gap-2">
              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border border-blue-100">
                Verified Transparent
              </div>
              <Link href={`/${lang}/governance/platform-charter`} className="text-xs text-gray-400 hover:underline">
                Platform Charter Adherent
              </Link>
            </div>
          )}
        </div>

        {metrics && (
          <div className="grid grid-cols-3 gap-4 mb-8 border-b pb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{metrics.members}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Members</div>
            </div>
            <div className="text-center border-l border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{metrics.events}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Events</div>
            </div>
            <div className="text-center border-l border-gray-100">
              <div className="text-2xl font-bold text-gray-900">{metrics.hours}+</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Vol. Hours</div>
            </div>
          </div>
        )}

        {memberStatus === 'active' ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-600"></span>
            You are a member of this organisation.
          </div>
        ) : memberStatus === 'pending' ? (
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg mb-6 border border-yellow-200 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-600 animate-pulse"></span>
            Your membership request is pending approval.
          </div>
        ) : memberStatus === 'rejected' ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            Your membership request was rejected.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {org.membership_policy === 'invite_only' ? (
              <div className="bg-gray-50 text-gray-600 p-4 rounded-lg border border-gray-200 font-medium text-center">
                Membership to this organisation is by invitation only.
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-6 rounded-xl border border-gray-200 gap-4">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Become a Member</h3>
                  <p className="text-gray-600 text-sm mt-1">Join our community to access resources and participate.</p>
                </div>
                <JoinButton orgId={org.id} policy={org.membership_policy} isAuthenticated={!!user} lang={lang} />
              </div>
            )}
          </div>
        )}

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4 text-sm text-gray-700">
              {org.contact_email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    📧
                  </div>
                  <a href={`mailto:${org.contact_email}`} className="hover:underline hover:text-blue-600 break-all">{org.contact_email}</a>
                </div>
              )}
              {org.contact_phone && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
                    📱
                  </div>
                  <span>{org.contact_phone}</span>
                </div>
              )}
              {org.website && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
                    🌐
                  </div>
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-600 break-all">
                    {org.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {org.address && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 flex-shrink-0 mt-0.5">
                    📍
                  </div>
                  <span>{org.address}</span>
                </div>
              )}
              {!org.contact_email && !org.contact_phone && !org.website && !org.address && (
                <p className="text-gray-500 italic">No contact information provided.</p>
              )}
            </div>

            {org.social_links && Object.keys(org.social_links).length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Social Profiles</h4>
                <div className="flex gap-3 flex-wrap">
                  {Object.entries(org.social_links).map(([platform, url]) => (
                    <a 
                      key={platform} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border rounded-md text-xs font-medium text-gray-700 capitalize transition-colors"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

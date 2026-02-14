import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { JoinButton } from '@/components/org/join-button'
import { getCollaboratingOrgs } from '@/actions/collaboration'
import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'

export default async function OrgPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params
  const supabaseAdmin = createServiceClient()
  
  const { data: org } = await supabaseAdmin
    .from('organisations')
    .select('id, name, membership_policy, created_at, slug')
    .eq('slug', slug)
    .single()

  if (!org) notFound()

  // Check User Status
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let memberStatus = null
  if (user) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('status')
      .eq('id', user.id)
      .eq('organisation_id', org.id)
      .single()
    
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

  // Fetch Events (Owned + Joint)
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
  
  const jointEvents = jointMappings?.map((j: any) => j.event).filter((e: any) => e.event_type === 'public' && new Date(e.start_time) >= new Date()) || []
  
  const allEvents = [...(ownedEvents || []), ...jointEvents].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

  // Fetch Partners
  const partners = await getCollaboratingOrgs(org.id)

  // Transparency Metrics (if enabled)
  let metrics = null
  let governanceSummary = null
  
  if (org.public_transparency_enabled) {
    const [members, events, hours] = await Promise.all([
      supabaseAdmin.from('members').select('*', { count: 'exact', head: true }).eq('organisation_id', org.id),
      supabaseAdmin.from('events').select('*', { count: 'exact', head: true }).eq('organisation_id', org.id),
      supabaseAdmin.from('task_logs').select('hours_logged, task:tasks!inner(organisation_id)').eq('task.organisation_id', org.id)
    ])
    
    const totalHours = (hours.data || []).reduce((sum: number, log: any) => sum + (Number(log.hours_logged) || 0), 0)
    
    metrics = {
      members: members.count || 0,
      events: events.count || 0,
      hours: Math.round(totalHours)
    }
    
    governanceSummary = {
      status: 'active', // Should fetch from org.status
      lastAudit: new Date().toLocaleDateString(), // Placeholder
      charterLink: '/governance/platform-charter'
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-4 min-h-screen">
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">{org.name}</h1>
            <p className="text-gray-500 text-sm">Established {new Date(org.created_at).toLocaleDateString()}</p>
            {partners.length > 0 && (
               <div className="mt-2 text-sm text-gray-600">
                 Part of a coalition with: 
                 {partners.map((p: any, i: number) => (
                   <span key={p.id}>
                     {i > 0 && ', '}
                     <Link href={`/${slug.split('/')[0] || 'en'}/org/${p.slug}`} className="text-blue-600 hover:underline ml-1">
                       {p.name}
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
              <Link href="/governance/platform-charter" className="text-xs text-gray-400 hover:underline">
                Platform Charter Adherent
              </Link>
            </div>
          )}
        </div>

        {/* Transparency Stats */}
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
                 <JoinButton orgId={org.id} policy={org.membership_policy} isAuthenticated={!!user} />
               </div>
             )}
           </div>
        )}
      </div>

      <div className="space-y-12">
        {/* Events Section */}
        {allEvents.length > 0 && (
          <section>
             <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
             <div className="grid gap-4 md:grid-cols-2">
               {allEvents.map((e: any) => (
                 <div key={e.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex justify-between items-start mb-2">
                     <span className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
                        {e.organisation_id !== org.id ? 'Co-Hosted Event' : 'Event'}
                     </span>
                     <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                       {e.event_type}
                     </span>
                   </div>
                   <h3 className="font-bold text-lg mb-2">{e.title}</h3>
                   <div className="space-y-1 text-sm text-gray-600 mb-4">
                     <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4" />
                       {new Date(e.start_time).toLocaleDateString()}
                     </div>
                     {e.location && (
                       <div className="flex items-center gap-2">
                         <MapPin className="w-4 h-4" />
                         {e.location}
                       </div>
                     )}
                   </div>
                   <Link href={`/${slug.split('/')[0] || 'en'}/org/${slug}/events/${e.id}`} className="text-blue-600 font-medium hover:underline text-sm">
                     View Details & RSVP &rarr;
                   </Link>
                 </div>
               ))}
             </div>
          </section>
        )}

        {announcements && announcements.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Public Announcements</h2>
            <div className="space-y-4">
              {announcements.map((a: any) => (
                <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    {a.is_pinned && <span className="text-orange-500 font-bold text-xs uppercase tracking-wide">Pinned</span>}
                    <span className="text-xs text-gray-400">{new Date(a.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{a.title}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{a.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

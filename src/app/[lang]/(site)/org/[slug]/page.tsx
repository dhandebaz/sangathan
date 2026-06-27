import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { JoinButton } from '@/components/org/join-button'
import { getCollaboratingOrgs } from '@/actions/collaboration'
import Link from 'next/link'
import { Organisation } from '@/types/dashboard'
import { Mail, Phone, Globe, MapPin, Calendar, Clock, ShieldCheck, ArrowUpRight, BadgeCheck, AlertCircle } from 'lucide-react'

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-slate-200 bg-slate-50">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {org.cover_url && (
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={org.cover_url} alt="" className="w-full h-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 via-slate-50/90 to-slate-50" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {org.logo_url && (
              <div className="mb-6 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={org.logo_url} alt={`${org.name} logo`} className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover" />
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
                {org.name}
              </h1>
              {org.registration_status === 'registered' && (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                  title={`Reg No: ${org.registration_number || 'N/A'}`}
                >
                  <BadgeCheck className="w-3.5 h-3.5 text-slate-500" />
                  Registered
                </span>
              )}
            </div>

            {org.description && (
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed mb-4">
                {org.description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Established {new Date(org.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>

              {org.public_transparency_enabled && (
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Transparent
                </span>
              )}
            </div>

            {partners.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-sm text-slate-500">
                <span>Part of a coalition with:</span>
                {partners.map((partner, index) => (
                  <span key={partner.id}>
                    {index > 0 && <span className="mx-1 text-slate-300">·</span>}
                    <Link href={`/${lang}/org/${partner.slug}`} className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                      {partner.name}
                    </Link>
                  </span>
                ))}
              </div>
            )}

            {org.public_transparency_enabled && (
              <Link
                href={`/${lang}/governance/platform-charter`}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Platform Charter Adherent
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {metrics && (
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4">ORGANISATION METRICS</p>
            <div className="grid grid-cols-3 gap-0 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
              <div className="p-6 md:p-8 text-center border-r border-slate-200">
                <div className="text-3xl md:text-4xl font-black text-slate-900">{metrics.members}</div>
                <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-1">Active Members</div>
              </div>
              <div className="p-6 md:p-8 text-center border-r border-slate-200">
                <div className="text-3xl md:text-4xl font-black text-slate-900">{metrics.events}</div>
                <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-1">Events Hosted</div>
              </div>
              <div className="p-6 md:p-8 text-center">
                <div className="text-3xl md:text-4xl font-black text-slate-900">{metrics.hours}+</div>
                <div className="text-xs font-mono uppercase tracking-widest text-slate-400 mt-1">Volunteer Hours</div>
              </div>
            </div>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {org.description && (
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
                <p className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4">ABOUT</p>
                <p className="text-slate-600 leading-relaxed">{org.description}</p>
              </div>
            )}

            {/* Membership Section */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8">
              <p className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4">MEMBERSHIP</p>
              {memberStatus === 'active' ? (
                <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200 font-medium">
                  <BadgeCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  You are a member of this organisation.
                </div>
              ) : memberStatus === 'pending' ? (
                <div className="flex items-center gap-3 bg-amber-50 text-amber-700 p-4 rounded-xl border border-amber-200 font-medium">
                  <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  Your membership request is pending approval.
                </div>
              ) : memberStatus === 'rejected' ? (
                <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 font-medium">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  Your membership request was rejected.
                </div>
              ) : org.membership_policy === 'invite_only' ? (
                <div className="bg-slate-50 text-slate-600 p-4 rounded-xl border border-slate-200 font-medium text-center text-sm">
                  Membership to this organisation is by invitation only.
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-6 rounded-xl border border-slate-200 gap-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">Become a Member</h3>
                    <p className="text-slate-500 text-sm mt-1">Join this community to access resources and participate.</p>
                  </div>
                  <JoinButton orgId={org.id} policy={org.membership_policy} isAuthenticated={!!user} lang={lang} />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 mt-8 lg:mt-0">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-4">CONTACT</p>
              <div className="space-y-4">
                {org.contact_email && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <a href={`mailto:${org.contact_email}`} className="text-sm text-slate-600 hover:text-indigo-600 hover:underline break-all leading-relaxed">
                      {org.contact_email}
                    </a>
                  </div>
                )}
                {org.contact_phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-slate-600 leading-relaxed">{org.contact_phone}</span>
                  </div>
                )}
                {org.website && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline break-all leading-relaxed">
                      {org.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {org.address && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-slate-600 leading-relaxed">{org.address}</span>
                  </div>
                )}
                {!org.contact_email && !org.contact_phone && !org.website && !org.address && (
                  <p className="text-sm text-slate-400 italic">No contact information provided.</p>
                )}
              </div>

              {org.social_links && Object.keys(org.social_links).length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="font-mono text-xs uppercase tracking-widest text-slate-400 mb-3">SOCIAL</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(org.social_links).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 capitalize transition-colors"
                      >
                        {platform}
                        <ArrowUpRight className="w-3 h-3" />
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

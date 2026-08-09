import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { JoinButton } from '@/components/org/join-button'
import { getCollaboratingOrgs } from '@/actions/collaboration'
import Link from 'next/link'
import { Organisation } from '@/types/dashboard'
import {
  Mail, Phone, Globe, MapPin, Calendar, Clock, ShieldCheck,
  ArrowUpRight, BadgeCheck, AlertCircle, Megaphone, ArrowRight,
  Sparkles
} from 'lucide-react'
import { OrgProfileJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata(props: {
  params: Promise<{ slug: string; lang: string }>
}): Promise<Metadata> {
  const { slug, lang } = await props.params
  const supabaseAdmin = createServiceClient()
  const { data: org } = await supabaseAdmin
    .from('organisations')
    .select('name, description, logo_url, org_type, registration_status, address')
    .eq('slug', slug)
    .single()

  if (!org) {
    return {
      title: 'Organisation Not Found | Sangathan',
      description: 'The requested organisation profile could not be found.',
    }
  }

  const isHindi = lang === 'hi'
  const typeLabel =
    org.org_type === 'ngo'
      ? isHindi ? 'गैर-सरकारी संगठन (NGO)' : 'Non-Governmental Organisation'
      : org.org_type === 'student_union'
        ? isHindi ? 'छात्र संघ' : 'Student Union'
        : org.org_type === 'workers_union'
          ? isHindi ? 'कर्मचारी संघ' : 'Workers Union'
          : isHindi ? 'रेजिडेंट वेलफेयर एसोसिएशन' : 'Resident Welfare Association'

  const title = `${org.name} | ${typeLabel} | Sangathan`
  const description =
    org.description ||
    `${org.name} is a verified ${typeLabel.toLowerCase()} on Sangathan, digital public infrastructure for collective democratic governance.`

  const ogImageUrl = `https://sangathan.space/api/og/org/${slug}`

  return {
    title,
    description,
    keywords: [
      org.name,
      typeLabel,
      'Sangathan',
      'Civil Society',
      'Grassroots Democracy',
      'NGO India',
      'Student Union',
      'Civic Infrastructure',
    ],
    alternates: {
      canonical: `https://sangathan.space/${lang}/org/${slug}`,
      languages: {
        en: `https://sangathan.space/en/org/${slug}`,
        hi: `https://sangathan.space/hi/org/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://sangathan.space/${lang}/org/${slug}`,
      siteName: 'Sangathan',
      locale: isHindi ? 'hi_IN' : 'en_IN',
      type: 'profile',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${org.name} - Sangathan Public Record`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@areynetaji',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function OrgPage(props: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang } = await props.params
  const isHindi = lang === 'hi'
  const supabaseAdmin = createServiceClient()

  const { data: orgData } = await supabaseAdmin
    .from('organisations')
    .select(
      'id, name, org_type, membership_policy, created_at, slug, public_transparency_enabled, description, logo_url, cover_url, contact_email, contact_phone, website, social_links, address, registration_status, registration_number, incorporation_date'
    )
    .eq('slug', slug)
    .single()

  const org = orgData as (Organisation & {
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
  }) | null

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

  // Query Upcoming Public Events
  const { data: upcomingEventsData } = await supabaseAdmin
    .from('events')
    .select('id, title, start_time, location, event_type')
    .eq('organisation_id', org.id)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(3)

  const upcomingEvents = (upcomingEventsData || []) as {
    id: string
    title: string
    start_time: string
    location: string | null
    event_type: string
  }[]

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
    <div className="min-h-screen bg-slate-50">
      <BreadcrumbJsonLd
        items={[
          { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
          { name: isHindi ? 'नेटवर्क' : 'Network', url: `https://sangathan.space/${lang}/network` },
          { name: org.name, url: `https://sangathan.space/${lang}/org/${org.slug}` },
        ]}
      />
      <OrgProfileJsonLd
        org={org}
        lang={lang}
        memberCount={metrics?.members}
        eventCount={metrics?.events}
        partners={partners.map((p) => ({ name: p.name, slug: p.slug }))}
      />

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {org.cover_url && (
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={org.cover_url} alt="" className="w-full h-full object-cover opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/90 to-white" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {org.logo_url && (
              <div className="mb-6 bg-white p-1.5 rounded-2xl shadow-xs border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={org.logo_url}
                  alt={`${org.name} logo`}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
                {org.name}
              </h1>
              {org.registration_status === 'registered' && (
                <span
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-sm text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                  title={`Reg No: ${org.registration_number || 'N/A'}`}
                >
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {isHindi ? 'पंजीकृत संगठन' : 'Registered Organisation'}
                </span>
              )}
            </div>

            {org.description && (
              <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed mb-4">
                {org.description}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs md:text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                {isHindi ? 'स्थापना' : 'Established'}{' '}
                {new Date(org.created_at).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>

              {org.public_transparency_enabled && (
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  {isHindi ? 'सत्यापित पारदर्शी' : 'Verified Transparent'}
                </span>
              )}
            </div>

            {partners.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs md:text-sm text-slate-500">
                <span>{isHindi ? 'गठबंधन साझेदार:' : 'Part of a coalition with:'}</span>
                {partners.map((partner, index) => (
                  <span key={partner.id}>
                    {index > 0 && <span className="mx-1 text-slate-300">·</span>}
                    <Link
                      href={`/${lang}/org/${partner.slug}`}
                      className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                    >
                      {partner.name}
                    </Link>
                  </span>
                ))}
              </div>
            )}

            {org.public_transparency_enabled && (
              <Link
                href={`/${lang}/governance/platform-charter`}
                className="mt-4 inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
              >
                {isHindi ? 'मंच चार्टर का पालनकर्ता' : 'Platform Charter Adherent'}
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {metrics && (
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              {isHindi ? 'संगठन के आंकड़े' : 'Organisation Metrics'}
            </p>
            <div className="grid grid-cols-3 gap-0 border border-slate-200 rounded-sm overflow-hidden bg-white shadow-xs">
              <div className="p-5 md:p-7 text-center border-r border-slate-200">
                <div className="text-2xl md:text-3xl font-black text-slate-900">{metrics.members}</div>
                <div className="text-xs font-medium text-slate-500 mt-1">
                  {isHindi ? 'सक्रिय सदस्य' : 'Active Members'}
                </div>
              </div>
              <div className="p-5 md:p-7 text-center border-r border-slate-200">
                <div className="text-2xl md:text-3xl font-black text-slate-900">{metrics.events}</div>
                <div className="text-xs font-medium text-slate-500 mt-1">
                  {isHindi ? 'आयोजित कार्यक्रम' : 'Events Hosted'}
                </div>
              </div>
              <div className="p-5 md:p-7 text-center">
                <div className="text-2xl md:text-3xl font-black text-slate-900">{metrics.hours}+</div>
                <div className="text-xs font-medium text-slate-500 mt-1">
                  {isHindi ? 'स्वयंसेवक घंटे' : 'Volunteer Hours'}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {org.description && (
              <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-6 md:p-8">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-3">
                  {isHindi ? 'संगठन के बारे में' : 'About the Organisation'}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">{org.description}</p>
              </div>
            )}

            {/* Upcoming Public Events Section */}
            {upcomingEvents.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-6 md:p-8 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                    {isHindi ? 'आगामी सार्वजनिक कार्यक्रम' : 'Upcoming Public Events'}
                  </h2>
                </div>

                <div className="space-y-3">
                  {upcomingEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-4 border border-slate-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-200 transition bg-slate-50/50"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-xs">
                            {evt.event_type}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(evt.start_time).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">{evt.title}</h3>
                        {evt.location && (
                          <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {evt.location}
                          </p>
                        )}
                      </div>

                      <Link
                        href={`/${lang}/org/${org.slug}/events/${evt.id}`}
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-sm transition self-start sm:self-center shrink-0"
                      >
                        {isHindi ? 'विवरण और RSVP' : 'View & RSVP'} <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Membership Section */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-6 md:p-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 mb-4">
                {isHindi ? 'सदस्यता' : 'Membership'}
              </h2>
              {memberStatus === 'active' ? (
                <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 p-4 rounded-sm border border-emerald-200 text-xs font-medium">
                  <BadgeCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  {isHindi
                    ? 'आप इस संगठन के सक्रिय सदस्य हैं।'
                    : 'You are an active verified member of this organisation.'}
                </div>
              ) : memberStatus === 'pending' ? (
                <div className="flex items-center gap-3 bg-amber-50 text-amber-700 p-4 rounded-sm border border-amber-200 text-xs font-medium">
                  <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  {isHindi
                    ? 'आपका सदस्यता अनुरोध विचाराधीन है।'
                    : 'Your membership request is currently pending administrative approval.'}
                </div>
              ) : memberStatus === 'rejected' ? (
                <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-sm border border-red-200 text-xs font-medium">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  {isHindi
                    ? 'आपका सदस्यता अनुरोध अस्वीकार कर दिया गया था।'
                    : 'Your membership request was declined.'}
                </div>
              ) : org.membership_policy === 'invite_only' ? (
                <div className="bg-slate-50 text-slate-600 p-4 rounded-sm border border-slate-200 font-medium text-center text-xs">
                  {isHindi
                    ? 'इस संगठन की सदस्यता केवल आमंत्रण द्वारा उपलब्ध है।'
                    : 'Membership to this organisation is by invitation only.'}
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-6 rounded-sm border border-slate-200 gap-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      {isHindi ? 'सदस्य बनें' : 'Become a Member'}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      {isHindi
                        ? 'संगठन के संसाधनों और अभियानों में भाग लेने के लिए जुड़ें।'
                        : 'Join this organisation to access resources, campaigns, and democratic voting.'}
                    </p>
                  </div>
                  <JoinButton
                    orgId={org.id}
                    policy={org.membership_policy}
                    isAuthenticated={!!user}
                    lang={lang}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6 mt-8 lg:mt-0">
            {/* Public Civic Portals */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-6 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                {isHindi ? 'लोकतांत्रिक सहभागिता' : 'Civic Portals'}
              </p>

              <Link
                href={`/${lang}/org/${org.slug}/petitions`}
                className="flex items-center justify-between p-3 rounded-sm bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-indigo-100 flex items-center justify-center text-indigo-700">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition">
                      {isHindi ? 'याचिकाएं और अभियान' : 'Petitions & Campaigns'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {isHindi ? 'सार्वजनिक पत्र और मांगें' : 'Sign democratic open letters'}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
              </Link>

              {org.public_transparency_enabled && (
                <Link
                  href={`/${lang}/org/${org.slug}/transparency`}
                  className="flex items-center justify-between p-3 rounded-sm bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-sm bg-emerald-100 flex items-center justify-center text-emerald-700">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition">
                        {isHindi ? 'सार्वजनिक पारदर्शिता लेज़र' : 'Public Transparency'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {isHindi ? 'खर्च और फंड का ब्यौरा' : 'Audited expense & fund ledger'}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
                </Link>
              )}
            </div>

            {/* Contact Details Card */}
            <div className="bg-white border border-slate-200 rounded-sm shadow-xs p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                {isHindi ? 'संपर्क सूत्र' : 'Contact Information'}
              </p>
              <div className="space-y-4">
                {org.contact_email && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-sm bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <a
                      href={`mailto:${org.contact_email}`}
                      className="text-xs text-slate-600 hover:text-indigo-600 hover:underline break-all leading-relaxed"
                    >
                      {org.contact_email}
                    </a>
                  </div>
                )}
                {org.contact_phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-sm bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-slate-600 leading-relaxed">{org.contact_phone}</span>
                  </div>
                )}
                {org.website && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-sm bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <Globe className="w-4 h-4" />
                    </div>
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline break-all leading-relaxed"
                    >
                      {org.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {org.address && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-sm bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-slate-600 leading-relaxed">{org.address}</span>
                  </div>
                )}
                {!org.contact_email && !org.contact_phone && !org.website && !org.address && (
                  <p className="text-xs text-slate-400 italic">
                    {isHindi ? 'कोई संपर्क जानकारी प्रदान नहीं की गई।' : 'No contact information provided.'}
                  </p>
                )}
              </div>

              {org.social_links && Object.keys(org.social_links).length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    {isHindi ? 'सोशल मीडिया' : 'Social Channels'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(org.social_links).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-sm text-xs font-medium text-slate-600 capitalize transition-colors"
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

import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getCollaboratingOrgs } from '@/actions/collaboration'
import { OrgProfileJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'
import { PwaProvider } from '@/components/pwa/pwa-install-prompt'
import {
  PublicOrgPortal,
  PublicOrgData,
  PublicAnnouncement,
  PublicPetition,
  PublicEvent,
  PublicLeader,
  PublicPartner,
} from '@/components/org/public-org-portal'

export const dynamic = 'force-dynamic'

export async function generateMetadata(props: {
  params: Promise<{ slug: string; lang: string }>
}): Promise<Metadata> {
  const { slug, lang } = await props.params
  const supabaseAdmin = createServiceClient()
  const { data: org } = await supabaseAdmin
    .from('organisations')
    .select('name, description, logo_url, org_type, registration_status, address')
    .eq('slug', slug)
    .maybeSingle()

  if (!org) {
    return {
      title: 'Organisation Not Found | Sangathan',
      description: 'The requested organisation profile could not be found.',
    }
  }

  const isHindi = lang === 'hi'
  const typeLabel =
    org.org_type === 'civic_collective'
      ? isHindi ? 'नागरिक समूह व जमीनी आंदोलन' : 'Civic Collective & Movement'
      : org.org_type === 'ngo'
        ? isHindi ? 'गैर-सरकारी संगठन (NGO)' : 'Non-Governmental Organisation'
        : isHindi ? 'नागरिक समूह' : 'Civic Collective'

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

  // 1. Fetch Complete Organization Data & Statutory Fields
  const { data: orgData } = await supabaseAdmin
    .from('organisations')
    .select(
      `id, name, slug, org_type, legal_entity_type, governing_law, registrar_authority,
       registration_state, membership_policy, created_at, public_transparency_enabled,
       description, logo_url, cover_url, contact_email, contact_phone, website,
       social_links, address, registration_status, registration_number, incorporation_date,
       tax_id, darpan_id, tan, gstin, cin, fcra_registration, certificate_12a, certificate_80g`
    )
    .eq('slug', slug)
    .maybeSingle()

  const org = orgData as PublicOrgData | null
  if (!org) notFound()

  // 2. Fetch Authenticated User & Member Status
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
      .maybeSingle()

    if (profileData) {
      memberStatus = profileData.status
    }
  }

  // 3. Fetch Public Announcements / Bulletins
  const { data: announcementsData } = await supabaseAdmin
    .from('announcements')
    .select('id, title, content, is_pinned, created_at')
    .eq('organisation_id', org.id)
    .eq('visibility_level', 'public')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(10)

  const announcements: PublicAnnouncement[] = (announcementsData || []).map((a) => ({
    id: a.id,
    title: a.title,
    content: a.content,
    is_pinned: a.is_pinned ?? false,
    created_at: a.created_at,
  }))

  // 4. Fetch Active Public Petitions
  const { data: petitionsData } = await supabaseAdmin
    .from('petitions')
    .select('id, title, slug, description, target_decision_maker, signature_goal, current_signatures, created_at')
    .eq('organisation_id', org.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6)

  const petitions: PublicPetition[] = (petitionsData || []).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    target_decision_maker: p.target_decision_maker,
    signature_goal: p.signature_goal || 500,
    current_signatures: p.current_signatures || 0,
    created_at: p.created_at,
  }))

  // 5. Fetch Upcoming Public Events
  const { data: eventsData } = await supabaseAdmin
    .from('events')
    .select('id, title, start_time, location, event_type')
    .eq('organisation_id', org.id)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true })
    .limit(6)

  const events: PublicEvent[] = (eventsData || []).map((e) => ({
    id: e.id,
    title: e.title,
    start_time: e.start_time,
    location: e.location,
    event_type: e.event_type || 'Assembly',
  }))

  // 6. Fetch Executive Leadership
  const { data: leadersData } = await supabaseAdmin
    .from('profiles')
    .select('id, full_name, designation, role, avatar_url')
    .eq('organisation_id', org.id)
    .in('role', ['admin', 'executive'])
    .limit(6)

  const leaders: PublicLeader[] = (leadersData || []).map((l) => ({
    id: l.id,
    full_name: l.full_name || 'Leader',
    designation: l.designation,
    role: l.role,
    avatar_url: l.avatar_url,
  }))

  // 7. Fetch Collaborating Partners
  const rawPartners = await getCollaboratingOrgs(org.id)
  const partners: PublicPartner[] = (rawPartners || []).map((p: { id: string; name: string; slug: string; logo_url?: string | null }) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    logo_url: p.logo_url,
  }))

  // 8. Fetch Metrics
  let metrics: { members: number; events: number; hours: number } | null = null

  if (org.public_transparency_enabled) {
    const [membersRes, eventsRes, hoursRes] = await Promise.all([
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

    const totalHours = ((hoursRes.data as { hours_logged: number }[] | null) || []).reduce(
      (sum, log) => sum + (Number(log.hours_logged) || 0),
      0
    )

    metrics = {
      members: membersRes.count || 0,
      events: eventsRes.count || 0,
      hours: Math.round(totalHours),
    }
  }

  return (
    <PwaProvider lang={lang}>
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

      <PublicOrgPortal
        org={org}
        lang={lang}
        memberStatus={memberStatus}
        isAuthenticated={!!user}
        partners={partners}
        announcements={announcements}
        petitions={petitions}
        events={events}
        leaders={leaders}
        metrics={metrics}
      />
    </PwaProvider>
  )
}

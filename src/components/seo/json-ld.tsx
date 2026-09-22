import React from 'react'
import { Organisation } from '@/types/dashboard'

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sangathan',
    alternateName: 'संगठन',
    url: 'https://sangathan.space',
    description: 'Digital public infrastructure for NGOs and civic collectives to manage members, funds, and democratic governance.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@sangathan.space',
      telephone: '+918527976791',
      contactType: 'customer support',
      availableLanguage: ['English', 'Hindi'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Street 8, Ghaffar Manzil, Jamia Nagar, Okhla',
      addressLocality: 'Delhi',
      postalCode: '110025',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://twitter.com/areynetaji',
      'https://instagram.com/areynetaji',
      'https://peerlist.io/areynetaji/project/sangathan',
      'https://www.indiehackers.com/product/sangathan',
      'https://www.saashub.com/sangathan-alternatives',
      'https://www.uneed.best/tool/sangathan',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function WebSiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Sangathan',
    alternateName: 'संगठन',
    url: 'https://sangathan.space',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://sangathan.space/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['en-IN', 'hi-IN'],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function SoftwareApplicationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Sangathan',
    alternateName: 'संगठन',
    operatingSystem: 'Web, Progressive Web App (PWA)',
    applicationCategory: 'CivicGovernanceApplication',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
        name: 'Community Plan (Free Forever)',
        description: 'Free civic infrastructure for grassroots collectives up to 20 users.',
      },
      {
        '@type': 'Offer',
        price: '1000',
        priceCurrency: 'INR',
        name: 'Institution Plan (Monthly)',
        description: 'Solidarity patronage for funded NGOs and civic collectives with unlimited members and AI tools.',
      },
      {
        '@type': 'Offer',
        price: '10000',
        priceCurrency: 'INR',
        name: 'Institution Plan (Annual)',
        description: 'Annual patronage with 2 months free.',
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function FAQJsonLd({ questions }: { questions: { question: string; answer: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export interface OrgProfileJsonLdProps {
  org: Organisation & {
    org_type?: string | null
    description?: string | null
    logo_url?: string | null
    cover_url?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    website?: string | null
    social_links?: Record<string, string> | null
    address?: string | null
    registration_status?: string | null
    registration_number?: string | null
    incorporation_date?: string | null
    tax_id?: string | null
    darpan_id?: string | null
  }
  lang: string
  memberCount?: number
  eventCount?: number
  partners?: { name: string; slug: string }[]
}

export function OrgProfileJsonLd({ org, lang, memberCount, eventCount, partners }: OrgProfileJsonLdProps) {
  const schemaType =
    org.org_type === 'ngo'
      ? 'NGO'
      : 'Organization'

  const sameAsList: string[] = []
  if (org.website) sameAsList.push(org.website)
  if (org.social_links) {
    for (const url of Object.values(org.social_links)) {
      if (url && typeof url === 'string') sameAsList.push(url)
    }
  }

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: org.name,
    url: `https://sangathan.space/${lang}/org/${org.slug}`,
    description: org.description || `${org.name} on Sangathan - Digital Civic Infrastructure.`,
    ...(org.logo_url ? { logo: org.logo_url } : {}),
    ...(org.cover_url ? { image: org.cover_url } : {}),
    ...(org.incorporation_date ? { foundingDate: org.incorporation_date } : {}),
    ...(org.tax_id ? { taxID: org.tax_id } : {}),
    ...(org.registration_number ? { identifier: org.registration_number } : {}),
    ...(org.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: org.address,
            addressCountry: 'IN',
          },
        }
      : {}),
    ...(org.contact_email || org.contact_phone
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            ...(org.contact_email ? { email: org.contact_email } : {}),
            ...(org.contact_phone ? { telephone: org.contact_phone } : {}),
            contactType: 'general inquiries',
          },
        }
      : {}),
    ...(sameAsList.length > 0 ? { sameAs: sameAsList } : {}),
    ...(memberCount !== undefined ? { member: { '@type': 'QuantitativeValue', value: memberCount } } : {}),
    ...(partners && partners.length > 0
      ? {
          memberOf: partners.map((p) => ({
            '@type': 'Organization',
            name: p.name,
            url: `https://sangathan.space/${lang}/org/${p.slug}`,
          })),
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export interface EventJsonLdProps {
  event: {
    id: string
    title: string
    description?: string | null
    start_time: string
    end_time?: string | null
    location?: string | null
    event_type?: string
  }
  org: {
    name: string
    slug: string
    logo_url?: string | null
  }
  lang: string
}

export function EventJsonLd({ event, org, lang }: EventJsonLdProps) {
  const isOnline = event.event_type === 'online' || event.location?.toLowerCase().includes('online')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description || `${event.title} organized by ${org.name}`,
    startDate: event.start_time,
    ...(event.end_time ? { endDate: event.end_time } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: isOnline
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: isOnline
      ? {
          '@type': 'VirtualLocation',
          url: `https://sangathan.space/${lang}/org/${org.slug}/events/${event.id}`,
        }
      : {
          '@type': 'Place',
          name: event.location || org.name,
          address: event.location || 'India',
        },
    organizer: {
      '@type': 'Organization',
      name: org.name,
      url: `https://sangathan.space/${lang}/org/${org.slug}`,
      ...(org.logo_url ? { logo: org.logo_url } : {}),
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `https://sangathan.space/${lang}/org/${org.slug}/events/${event.id}`,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export interface NetworkJsonLdProps {
  network: {
    name: string
    description?: string | null
    slug: string
  }
  memberOrgs: { name: string; slug: string }[]
  totalMembers?: number
  lang: string
}

export function NetworkJsonLd({ network, memberOrgs, totalMembers, lang }: NetworkJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: network.name,
    url: `https://sangathan.space/${lang}/network/${network.slug}`,
    description: network.description || `${network.name} - Joint Civic Federation & Coalition on Sangathan.`,
    ...(totalMembers !== undefined ? { member: { '@type': 'QuantitativeValue', value: totalMembers } } : {}),
    ...(memberOrgs.length > 0
      ? {
          subOrganization: memberOrgs.map((m) => ({
            '@type': 'Organization',
            name: m.name,
            url: `https://sangathan.space/${lang}/org/${m.slug}`,
          })),
        }
      : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export function SolutionJsonLd({
  title,
  description,
  url,
  category,
  features,
  faqs,
}: {
  title: string
  description: string
  url: string
  category: string
  features: { name: string; description: string }[]
  faqs: { question: string; answer: string }[]
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    alternateName: 'संगठन',
    url,
    description,
    applicationCategory: category || 'CivicGovernanceApplication',
    operatingSystem: 'Web, Progressive Web App (PWA), iOS, Android',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
        name: 'Community Plan (Free Forever)',
        description: '₹0 forever civic infrastructure for grassroots collectives and community activists.',
      },
      {
        '@type': 'Offer',
        price: '1000',
        priceCurrency: 'INR',
        name: 'Institution Plan',
        description: 'Patronage tier for funded NGOs, civic collectives, and formal institutions.',
      },
    ],
    featureList: features.map((f) => `${f.name}: ${f.description}`),
  }

  const faqJsonLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </>
  )
}

export function ComparisonJsonLd({
  title,
  description,
  url,
  competitorName,
  faqs,
}: {
  title: string
  description: string
  url: string
  competitorName: string
  faqs: { question: string; answer: string }[]
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `Sangathan vs ${competitorName}`,
    url,
    description,
    applicationCategory: 'CivicGovernanceApplication',
    operatingSystem: 'Web, Progressive Web App (PWA)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
      name: 'Sangathan Community Tier',
      description: '₹0 Forever Free for Grassroots Collectives',
    },
  }

  const faqJsonLd = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  } : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </>
  )
}

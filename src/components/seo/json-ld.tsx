import React from 'react'

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Sangathan',
    url: 'https://sangathan.space',
    description: 'Digital infrastructure for NGOs, student unions, and community groups to manage members, funds, and governance.',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@sangathan.space',
      telephone: '+918527976791',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Street 8, Ghaffar Manzil, Jamia Nagar, Okhla',
      addressLocality: 'Delhi',
      postalCode: '110025',
      addressCountry: 'IN',
    },
    sameAs: ['https://twitter.com/areynetaji', 'https://instagram.com/areynetaji'],
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
    operatingSystem: 'Web',
    applicationCategory: 'GovernmentApplication',
    offers: [
      {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR',
        name: 'Free Tier',
      },
      {
        '@type': 'Offer',
        price: '999',
        priceCurrency: 'INR',
        name: 'Pro Tier',
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

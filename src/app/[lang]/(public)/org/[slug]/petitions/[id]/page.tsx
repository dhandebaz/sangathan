import { notFound } from 'next/navigation'
import { getPetitionDetails } from '@/actions/petitions'
import { PetitionView } from '@/components/public/petition-view'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{
    lang: string
    slug: string
    id: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, id, lang } = await params
  const data = await getPetitionDetails(slug, id)
  if (!data) return { title: 'Petition Not Found | Sangathan' }

  const ogImageUrl = `https://sangathan.space/api/og?title=${encodeURIComponent(data.petition.title)}&desc=${encodeURIComponent(data.petition.description.slice(0, 150))}&type=petition&tag=Public+Petition`

  return {
    title: `${data.petition.title} | ${data.org.name} | Sangathan`,
    description: data.petition.description.slice(0, 160),
    alternates: {
      canonical: `https://sangathan.space/${lang}/org/${slug}/petitions/${id}`,
      languages: {
        en: `https://sangathan.space/en/org/${slug}/petitions/${id}`,
        hi: `https://sangathan.space/hi/org/${slug}/petitions/${id}`,
      },
    },
    openGraph: {
      title: data.petition.title,
      description: data.petition.description.slice(0, 160),
      type: 'article',
      url: `https://sangathan.space/${lang}/org/${slug}/petitions/${id}`,
      siteName: data.org.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${data.petition.title} - ${data.org.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.petition.title,
      description: data.petition.description.slice(0, 160),
      images: [ogImageUrl],
      creator: '@areynetaji',
    },
  }
}

export default async function PublicPetitionPage({ params }: PageProps) {
  const { lang, slug, id } = await params
  const data = await getPetitionDetails(slug, id)

  if (!data) {
    notFound()
  }

  return (
    <PetitionView
      lang={lang}
      org={data.org}
      petition={data.petition}
      recentSignatures={data.recentSignatures}
      endorsements={data.endorsements}
    />
  )
}

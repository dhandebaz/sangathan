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

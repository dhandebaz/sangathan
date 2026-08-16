import { Metadata } from 'next'
import CompetitorComparisonPage, { generateMetadata as generateCompMetadata } from '../compare/[competitor]/page'

interface PageProps {
  params: Promise<{
    lang: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params
  const meta = await generateCompMetadata({
    params: Promise.resolve({ lang, competitor: 'action-network' }),
  })
  return {
    ...meta,
    alternates: {
      canonical: `https://sangathan.space/${lang}/compare/action-network`,
      languages: {
        en: `https://sangathan.space/en/compare/action-network`,
        hi: `https://sangathan.space/hi/compare/action-network`,
      },
    },
  }
}

export default async function SangathanVsActionNetworkPage({ params }: PageProps) {
  const { lang } = await params
  return CompetitorComparisonPage({
    params: Promise.resolve({ lang, competitor: 'action-network' }),
  })
}

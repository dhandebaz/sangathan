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
    params: Promise.resolve({ lang, competitor: 'nationbuilder' }),
  })
  return {
    ...meta,
    alternates: {
      canonical: `https://sangathan.space/${lang}/compare/nationbuilder`,
      languages: {
        en: `https://sangathan.space/en/compare/nationbuilder`,
        hi: `https://sangathan.space/hi/compare/nationbuilder`,
      },
    },
  }
}

export default async function SangathanVsNationbuilderPage({ params }: PageProps) {
  const { lang } = await params
  return CompetitorComparisonPage({
    params: Promise.resolve({ lang, competitor: 'nationbuilder' }),
  })
}

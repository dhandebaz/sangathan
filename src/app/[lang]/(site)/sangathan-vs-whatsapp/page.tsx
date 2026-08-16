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
    params: Promise.resolve({ lang, competitor: 'whatsapp-sheets' }),
  })
  return {
    ...meta,
    alternates: {
      canonical: `https://sangathan.space/${lang}/compare/whatsapp-sheets`,
      languages: {
        en: `https://sangathan.space/en/compare/whatsapp-sheets`,
        hi: `https://sangathan.space/hi/compare/whatsapp-sheets`,
      },
    },
  }
}

export default async function SangathanVsWhatsappPage({ params }: PageProps) {
  const { lang } = await params
  return CompetitorComparisonPage({
    params: Promise.resolve({ lang, competitor: 'whatsapp-sheets' }),
  })
}

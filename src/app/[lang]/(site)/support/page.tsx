import { SupportSangathan } from '@/components/dashboard/support-sangathan'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'संगठन का समर्थन करें' : 'Support Sangathan - Civic Infrastructure',
    description: isHindi ? 'उच्च-उपलब्धता सर्वर और सुरक्षा बनाए रखने के लिए संगठन का समर्थन करें।' : 'Contribute to Sangathan to help maintain high-availability civic infrastructure and strict security.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/support`,
      languages: {
        en: 'https://sangathan.space/en/support',
        hi: 'https://sangathan.space/hi/support',
      },
    },
  }
}

export default async function SupportPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <SupportSangathan lang={lang} isPublic={true} />
    </div>
  )
}

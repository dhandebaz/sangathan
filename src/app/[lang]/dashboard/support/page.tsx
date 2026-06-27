import { Metadata } from 'next'
import { SupportSangathan } from '@/components/dashboard/support-sangathan'

export const metadata: Metadata = {
  title: 'Support Sangathan | Dashboard',
  description: 'Support the infrastructure that powers Sangathan.',
}

export default async function SupportPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params

  return (
    <div className="space-y-6 mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {lang === 'hi' ? 'संगठन का समर्थन करें' : 'Support Sangathan'}
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          {lang === 'hi'
            ? 'मंच को चालू रखने के लिए हमारे बुनियादी ढांचे की लागतों को कवर करने में हमारी सहायता करें।'
            : 'Help us cover our infrastructure costs to keep the platform running.'}
        </p>
      </div>

      <SupportSangathan lang={lang} />
    </div>
  )
}

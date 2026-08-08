import { OnboardingWizard } from '@/components/dashboard/onboarding-wizard'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'संगठन सेटअप विज़ार्ड | संगठन' : 'Set Up Organisation | Sangathan',
    description: 'Guided 5-minute setup flow for new organization administrators.',
  }
}

export default async function OnboardingPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  return <OnboardingWizard lang={lang} />
}

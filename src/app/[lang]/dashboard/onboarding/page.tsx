import { OnboardingWizard } from '@/components/dashboard/onboarding-wizard'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  return {
    title: lang === 'hi' ? 'संगठन सेटअप विज़ार्ड | संगठन' : 'Organisation Setup Wizard | Sangathan',
    description: 'Guided 5-minute setup flow for new organization administrators.',
  }
}

export default async function DashboardOnboardingPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  return <OnboardingWizard lang={lang} />
}

import { SupportSangathan } from '@/components/dashboard/support-sangathan'

export const metadata = {
  title: 'Support Sangathan - Keep the platform secure and free',
  description: 'Contribute to Sangathan to help us maintain high-availability servers and strict security for all organizations.',
}

export default async function SupportPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <SupportSangathan lang={lang} isPublic={true} />
    </div>
  )
}

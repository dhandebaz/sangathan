import { PwaProvider } from '@/components/pwa/pwa-install-prompt'

export default async function LocalisedLayout(props: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await props.params
  return (
    <PwaProvider lang={lang}>
      {props.children}
    </PwaProvider>
  )
}

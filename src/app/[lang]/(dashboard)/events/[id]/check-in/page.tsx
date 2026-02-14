import { createClient } from '@/lib/supabase/server'
import { QRScanner } from '@/components/events/qr-scanner'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function CheckInPage(props: { params: Promise<{ lang: string, id: string }> }) {
  const { lang, id } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/${lang}/login`)

  const { data: event } = await supabase
    .from('events')
    .select('title')
    .eq('id', id)
    .single()

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/${lang}/dashboard/events/${id}`} className="flex items-center text-sm text-gray-500 hover:text-black mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Event
        </Link>
        <h1 className="text-2xl font-bold">Check-in: {event?.title}</h1>
      </div>
      
      <QRScanner eventId={id} userId={user.id} />
    </div>
  )
}

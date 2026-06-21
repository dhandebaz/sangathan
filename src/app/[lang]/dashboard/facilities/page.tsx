import { getSelectedOrganisationId } from '@/lib/auth/context'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FacilitiesClient from '@/components/dashboard/facilities/facilities-client'

export default async function FacilitiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const organisationId = await getSelectedOrganisationId()
  
  if (!organisationId) {
    redirect(`/${lang}/login`)
  }

  const supabase = await createClient()

  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user?.id || '')
    .eq('organisation_id', organisationId)
    .single()

  // Fetch facilities
  const { data: facilities } = await supabase
    .from('facilities')
    .select('*')
    .eq('organisation_id', organisationId)
    .order('name')

  // Fetch bookings
  // If admin, fetch all bookings. If member, fetch own bookings
  const isAdmin = profile?.role === 'admin' || profile?.role === 'editor'
  
  let bookingsQuery = supabase
    .from('facility_bookings')
    .select(`
      *,
      facilities (name),
      profiles (full_name, email)
    `)
    .eq('organisation_id', organisationId)
    .order('start_time', { ascending: false })

  if (!isAdmin && profile) {
    bookingsQuery = bookingsQuery.eq('profile_id', profile.id)
  }

  const { data: bookings } = await bookingsQuery

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Facility Booking
        </h1>
      </div>

      <FacilitiesClient 
        facilities={facilities || []} 
        bookings={bookings || []}
        isAdmin={isAdmin}
      />
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { Plus, Calendar, MapPin, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Meeting } from '@/types/dashboard'

export const dynamic = 'force-dynamic'

async function getOrgType(supabase: Awaited<ReturnType<typeof createClient>>): Promise<string> {
  const orgId = await getSelectedOrganisationId()
  const { data } = await supabase.from('organisations').select('org_type').eq('id', orgId).single()
  return data?.org_type || 'default'
}

function getOrgLabels(orgType: string) {
  const labels: Record<string, { title: string; description: string }> = {
    ngo: { title: 'Meetings', description: 'Track board meetings, team syncs, and stakeholder gatherings.' },
    student_union: { title: 'Union Meetings', description: 'Schedule council meetings, club assemblies, and student forums.' },
    workers_union: { title: 'Union Meetings', description: 'Organize collective bargaining sessions, shop floor meetings, and member assemblies.' },
    rwa: { title: 'Society Meetings', description: 'Manage AGMs, committee meetings, and resident gatherings.' },
  }
  return labels[orgType] || { title: 'Meetings', description: 'Schedule and track organisational gatherings.' }
}

export default async function MeetingsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const selectedOrgId = await getSelectedOrganisationId()
  const orgType = await getOrgType(supabase)
  const { title, description } = getOrgLabels(orgType)

  const { data, error } = await supabase
    .from('meetings')
    .select('id, title, date, location, meeting_attendance(count)')
    .eq('organisation_id', selectedOrgId)
    .order('date', { ascending: false })
  
  const meetings = data as Meeting[] | null

  if (error) {
    return <div className="p-4 text-red-500">Error loading meetings</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
           <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <Link 
            href={`/${lang}/dashboard/meetings/new`} 
            className="flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-brand-700"
        >
            <Plus size={16} />
            Schedule Meeting
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {meetings?.map((meeting) => (
          <div key={meeting.id} className="content-card rounded-lg p-6 hover:shadow-md transition-shadow">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div className="space-y-6">
                   <h3 className="text-xl font-bold mb-1">{meeting.title}</h3>
                   <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                         <Calendar size={14} />
                         <span>{new Date(meeting.date).toLocaleString()}</span>
                      </div>
                      {meeting.location && (
                        <div className="flex items-center gap-1">
                           <MapPin size={14} />
                           <span>{meeting.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                         <Users size={14} />
                         <span>{meeting.meeting_attendance?.[0]?.count || 0} Attendees</span>
                      </div>
                   </div>
                </div>
                
                <Link 
                   href={`/${lang}/dashboard/meetings/${meeting.id}`} 
                    className="bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent flex items-center gap-2"
                >
                   View Details
                   <ArrowRight size={16} />
                </Link>
             </div>
          </div>
        ))}

        {meetings?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                <p>No meetings scheduled yet.</p>
            </div>
        )}
      </div>
    </div>
  )
}

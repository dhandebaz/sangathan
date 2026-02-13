import { createClient } from '@/lib/supabase/server'
import { Users, FileText, Calendar } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Parallel Fetching with Safe Defaults
  // We use Promise.allSettled to ensure that one failure doesn't crash the entire dashboard
  const results = await Promise.allSettled([
    supabase.from('members').select('*', { count: 'exact', head: true }),
    supabase.from('forms').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('meetings').select('*', { count: 'exact', head: true }),
    supabase.from('forms').select('id, title, form_submissions(count)').order('created_at', { ascending: false }).limit(5),
    supabase.from('meetings').select('id, title, start_time').gte('start_time', new Date().toISOString()).order('start_time', { ascending: true }).limit(5)
  ])

  // Helper to extract data or default
  const getResult = (index: number) => {
    const res = results[index]
    return res.status === 'fulfilled' ? res.value : { count: 0, data: [] }
  }

  const memberRes = getResult(0) as any
  const formRes = getResult(1) as any
  const meetingRes = getResult(2) as any
  const recentFormsRes = getResult(3) as any
  const upcomingMeetingsRes = getResult(4) as any

  // Log failures for debugging (only in server logs)
  results.forEach((res, i) => {
    if (res.status === 'rejected') {
      console.error(`Dashboard fetch failed at index ${i}:`, res.reason)
    } else if (res.value.error) {
      console.error(`Dashboard query error at index ${i}:`, res.value.error)
    }
  })

  const memberCount = memberRes.data !== null ? memberRes.count : 0
  const formCount = formRes.data !== null ? formRes.count : 0
  const meetingCount = meetingRes.data !== null ? meetingRes.count : 0
  const recentForms = recentFormsRes.data || []
  const upcomingMeetings = upcomingMeetingsRes.data || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your organisation's activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Total Members</p>
              <h3 className="text-3xl font-bold">{memberCount || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Active Forms</p>
              <h3 className="text-3xl font-bold">{formCount || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase">Total Meetings</p>
              <h3 className="text-3xl font-bold">{meetingCount || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Forms */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h3 className="font-bold text-lg">Recent Forms</h3>
             <Link href="/dashboard/forms" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="divide-y">
            {recentForms?.map((form: any) => (
               <Link href={`/dashboard/forms/${form.id}`} key={form.id} className="block p-4 hover:bg-gray-50 transition-colors">
                 <div className="flex justify-between items-center">
                    <span className="font-medium">{form.title}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                       {form.form_submissions?.[0]?.count || 0} submissions
                    </span>
                 </div>
               </Link>
            ))}
            {(!recentForms || recentForms.length === 0) && (
               <div className="p-8 text-center text-gray-400 italic">No forms created yet.</div>
            )}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
             <h3 className="font-bold text-lg">Upcoming Meetings</h3>
             <Link href="/dashboard/meetings" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="divide-y">
            {upcomingMeetings?.map((meeting: any) => (
               <Link href={`/dashboard/meetings/${meeting.id}`} key={meeting.id} className="block p-4 hover:bg-gray-50 transition-colors">
                 <div className="flex justify-between items-center">
                    <span className="font-medium">{meeting.title}</span>
                    <span className="text-sm text-gray-500">
                       {new Date(meeting.start_time).toLocaleDateString()} {new Date(meeting.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                 </div>
               </Link>
            ))}
            {(!upcomingMeetings || upcomingMeetings.length === 0) && (
               <div className="p-8 text-center text-gray-400 italic">No upcoming meetings.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getGoogleProviderToken, googleApiFetch } from '@/lib/google/google-client'
import { generateSecureString } from '@/lib/utils'

export type UnifiedCalendarItem = {
  id: string
  title: string
  type: 'event' | 'meeting' | 'field_survey' | 'task'
  start_time: string
  end_time?: string
  location?: string
  description?: string
  meeting_link?: string
  assigned_members?: Array<{ id: string; name: string; role?: string }>
  role_target?: 'all' | 'executive' | 'cadre' | 'volunteers' | 'public'
  status?: string
  badge_color?: string
}

// 1. Fetch Centralized Calendar Data
export async function getCentralizedCalendarData(orgId: string) {
  const supabase = await createClient()
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  try {
    const [eventsRes, meetingsRes, tasksRes, membersRes] = await Promise.all([
      supabase
        .from('events')
        .select('*')
        .eq('organisation_id', orgId)
        .gte('start_time', thirtyDaysAgo.toISOString())
        .order('start_time', { ascending: true }),
      supabase
        .from('meetings')
        .select('*')
        .eq('organisation_id', orgId)
        .gte('date', thirtyDaysAgo.toISOString())
        .order('date', { ascending: true }),
      supabase
        .from('tasks')
        .select('*, task_assignments(member:members(id, full_name, role))')
        .eq('organisation_id', orgId)
        .order('due_date', { ascending: true }),
      supabase
        .from('profiles')
        .select('id, full_name, role, designation, phone')
        .eq('organisation_id', orgId)
        .eq('status', 'active')
        .limit(100)
    ])

    const calendarItems: UnifiedCalendarItem[] = []

    // Map Events
    if (eventsRes.data) {
      for (const ev of eventsRes.data) {
        calendarItems.push({
          id: `ev-${ev.id}`,
          title: ev.title,
          type: 'event',
          start_time: ev.start_time,
          end_time: ev.end_time || undefined,
          location: ev.location || undefined,
          description: ev.description || undefined,
          role_target: ev.visibility === 'public' ? 'public' : 'all',
          status: new Date(ev.start_time) < now ? 'completed' : 'upcoming',
          badge_color: 'orange'
        })
      }
    }

    // Map Meetings
    if (meetingsRes.data) {
      for (const mt of meetingsRes.data) {
        calendarItems.push({
          id: `mt-${mt.id}`,
          title: mt.title,
          type: 'meeting',
          start_time: mt.date,
          end_time: mt.end_time || undefined,
          location: mt.location || 'Online Video Sync',
          description: mt.description || undefined,
          meeting_link: mt.meeting_link || undefined,
          role_target: mt.visibility === 'private' ? 'executive' : 'all',
          status: new Date(mt.date) < now ? 'completed' : 'upcoming',
          badge_color: 'indigo'
        })
      }
    }

    // Map Field Surveys & Assigned Tasks
    if (tasksRes.data) {
      for (const tk of tasksRes.data) {
        if (!tk.due_date) continue
        const isSurveyOrField = tk.title?.toLowerCase().includes('survey') || 
                                tk.title?.toLowerCase().includes('field') ||
                                tk.title?.toLowerCase().includes('audit') ||
                                tk.title?.toLowerCase().includes('visit')
        
        const assigned = (tk.task_assignments || []).map((ta: { member?: { id?: string; full_name?: string; role?: string } | null }) => ({
          id: ta.member?.id || '',
          name: ta.member?.full_name || 'Assigned Member',
          role: ta.member?.role || 'Member'
        })).filter((m: { id: string }) => m.id)

        calendarItems.push({
          id: `tk-${tk.id}`,
          title: tk.title,
          type: isSurveyOrField ? 'field_survey' : 'task',
          start_time: tk.due_date,
          location: tk.description?.includes('Location:') ? tk.description.split('Location:')[1]?.split('\n')[0]?.trim() : 'Field Territory',
          description: tk.description || undefined,
          assigned_members: assigned,
          role_target: 'cadre',
          status: tk.status,
          badge_color: isSurveyOrField ? 'emerald' : 'cyan'
        })
      }
    }

    // Sort chronologically
    calendarItems.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())

    return {
      success: true,
      items: calendarItems,
      members: membersRes.data || [],
      orgId
    }
  } catch (err: unknown) {
    console.error('Error fetching calendar data:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch calendar items',
      items: [],
      members: [],
      orgId
    }
  }
}

// 2. Schedule Field Survey / Deployment Pairing
const ScheduleFieldDeploymentSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  surveyFormName: z.string().optional(),
  targetArea: z.string().min(2, 'Target area / ward is required'),
  date: z.string(),
  memberIds: z.array(z.string()).min(1, 'Select at least one member or pair'),
  instructions: z.string().optional()
})

export const scheduleFieldDeployment = createSafeAction(
  ScheduleFieldDeploymentSchema,
  async (input, context) => {
    const supabase = await createClient()

    const taskTitle = `[Field Survey] ${input.title} • ${input.targetArea}`
    const taskDesc = `Target Area: ${input.targetArea}\nForm/Protocol: ${input.surveyFormName || 'Grassroots Intake'}\nInstructions: ${input.instructions || 'Conduct door-to-door or spot intake.'}`

    const { data: task, error: taskErr } = await supabase
      .from('tasks')
      .insert({
        organisation_id: context.organizationId,
        title: taskTitle,
        description: taskDesc,
        status: 'open',
        priority: 'high',
        due_date: new Date(input.date).toISOString(),
        created_by: context.user.id
      } as never)
      .select('id')
      .maybeSingle()

    if (taskErr || !task) {
      return { success: false, error: taskErr?.message || 'Failed to create field deployment' }
    }

    // Assign members
    if (input.memberIds.length > 0) {
      const assignments = input.memberIds.map((mId) => ({
        task_id: task.id,
        member_id: mId
      }))
      await supabase.from('task_assignments').insert(assignments as never)
    }

    revalidatePath('/', 'layout')
    return { success: true, taskId: task.id }
  },
  { allowedRoles: ['admin', 'editor', 'executive'] }
)

// 3. Instant Google Meet Room Creator
export async function createInstantGoogleMeetRoom(title?: string) {
  const roomName = title 
    ? title.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20)
    : `sangathan-meet-${generateSecureString(6)}`
  
  // Format standardized Google Meet link or dedicated secure Jitsi/Meet room
  const meetUrl = `https://meet.google.com/lookup/${roomName}`
  const directMeetUrl = `https://meet.jit.si/${roomName}`

  return {
    success: true,
    roomName,
    meetUrl,
    directMeetUrl
  }
}

// 4. Sync Organization Calendar to Google Calendar API
export async function syncOrgToGoogleCalendarAction(orgId: string) {
  const providerToken = await getGoogleProviderToken()
  if (!providerToken) {
    return {
      success: false,
      needsAuth: true,
      error: 'Google Account not connected or missing Calendar permissions. Click Connect Google Calendar to grant permission.'
    }
  }

  const calData = await getCentralizedCalendarData(orgId)
  if (!calData.success || calData.items.length === 0) {
    return {
      success: false,
      error: 'No upcoming calendar items to sync.'
    }
  }

  let syncedCount = 0
  const upcomingItems = calData.items.filter((item) => new Date(item.start_time) >= new Date())

  for (const item of upcomingItems.slice(0, 15)) {
    const startDate = new Date(item.start_time)
    const endDate = item.end_time 
      ? new Date(item.end_time) 
      : new Date(startDate.getTime() + 60 * 60 * 1000) // default 1 hr

    const googleEventPayload = {
      summary: `[Sangathan] ${item.title}`,
      description: `${item.description || ''}\n\nType: ${item.type.toUpperCase()}\nRole Target: ${item.role_target || 'All Members'}\nManaged via Sangathan Platform (https://sangathan.space)`,
      location: item.location || 'Sangathan Space',
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'Asia/Kolkata'
      },
      conferenceData: item.meeting_link ? undefined : {
        createRequest: {
          requestId: `sangathan-${item.id}-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' }
        }
      }
    }

    const apiRes = await googleApiFetch<{ id: string; htmlLink: string }>(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
      providerToken,
      {
        method: 'POST',
        body: JSON.stringify(googleEventPayload)
      }
    )

    if (apiRes.ok) {
      syncedCount++
    }
  }

  return {
    success: true,
    syncedCount,
    totalUpcoming: upcomingItems.length,
    googleCalendarUrl: 'https://calendar.google.com'
  }
}

// 5. Generate Apple iCal / Webcal Subscription Feed URL
export async function getCalendarSubscriptionDetails(orgId: string, _lang: string = 'en') {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Unauthorized' }

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sangathan.space'
  
  // Format token for secure subscription
  const token = Buffer.from(`${orgId}:${user.id}`).toString('base64url')
  
  const webcalUrl = `${appBaseUrl.replace(/^https?:\/\//, 'webcal://')}/api/calendar/feed?orgId=${orgId}&userId=${user.id}&token=${token}`
  const icsUrl = `${appBaseUrl}/api/calendar/feed?orgId=${orgId}&userId=${user.id}&token=${token}`

  return {
    success: true,
    webcalUrl,
    icsUrl,
    instructions: {
      appleIos: 'Tap "Subscribe on Apple Calendar" to automatically add the live Sangathan schedule to your iPhone/iPad calendar app with background updates.',
      googleCal: 'Copy the Feed URL, open Google Calendar on PC -> Other Calendars (+) -> "From URL" -> Paste feed URL.',
      macOs: 'Click the webcal link to open Apple Calendar on macOS and click Subscribe.'
    }
  }
}

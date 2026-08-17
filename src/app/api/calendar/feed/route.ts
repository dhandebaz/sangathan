import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

function formatIcsDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

function escapeIcsText(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const orgId = searchParams.get('orgId')
  const userId = searchParams.get('userId')
  const token = searchParams.get('token')

  if (!orgId) {
    return new NextResponse('Missing organisation ID', { status: 400 })
  }

  // Verify token if present (base64 of orgId:userId)
  if (token) {
    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf-8')
      const [tokenOrgId, tokenUserId] = decoded.split(':')
      if (tokenOrgId !== orgId) {
        return new NextResponse('Invalid calendar feed signature', { status: 403 })
      }
    } catch {
      // Allow fallback if valid orgId
    }
  }

  try {
    const supabase = createServiceClient()

    // Fetch org details
    const { data: org } = await supabase
      .from('organisations')
      .select('name')
      .eq('id', orgId)
      .maybeSingle()

    const orgName = org?.name || 'Sangathan Organisation'

    const now = new Date()
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

    // Fetch events, meetings, and assigned tasks
    const [eventsRes, meetingsRes, tasksRes] = await Promise.all([
      supabase
        .from('events')
        .select('*')
        .eq('organisation_id', orgId)
        .gte('start_time', ninetyDaysAgo.toISOString())
        .order('start_time', { ascending: true }),
      supabase
        .from('meetings')
        .select('*')
        .eq('organisation_id', orgId)
        .gte('date', ninetyDaysAgo.toISOString())
        .order('date', { ascending: true }),
      supabase
        .from('tasks')
        .select('id, title, description, due_date, status')
        .eq('organisation_id', orgId)
        .not('due_date', 'is', null)
        .order('due_date', { ascending: true })
    ])

    const icsLines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Sangathan Collective//Calendar Feed//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:${escapeIcsText(orgName)} - Schedule`,
      'X-WR-TIMEZONE:Asia/Kolkata',
      'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
      'X-PUBLISHED-TTL:PT1H',
    ]

    // 1. Events
    if (eventsRes.data) {
      for (const ev of eventsRes.data) {
        const dtStart = formatIcsDate(ev.start_time)
        const dtEnd = ev.end_time 
          ? formatIcsDate(ev.end_time) 
          : formatIcsDate(new Date(new Date(ev.start_time).getTime() + 2 * 60 * 60 * 1000).toISOString())
        const dtStamp = formatIcsDate(ev.created_at || new Date().toISOString())

        icsLines.push(
          'BEGIN:VEVENT',
          `UID:ev-${ev.id}@sangathan.space`,
          `DTSTAMP:${dtStamp}`,
          `DTSTART:${dtStart}`,
          `DTEND:${dtEnd}`,
          `SUMMARY:${escapeIcsText(ev.title)}`,
          `DESCRIPTION:${escapeIcsText((ev.description || '') + `\\n\\nType: ${ev.event_type || 'Event'}\\nManaged by Sangathan`)}`,
          `LOCATION:${escapeIcsText(ev.location || 'Sangathan Gathering')}`,
          'STATUS:CONFIRMED',
          'END:VEVENT'
        )
      }
    }

    // 2. Meetings
    if (meetingsRes.data) {
      for (const mt of meetingsRes.data) {
        const dtStart = formatIcsDate(mt.date)
        const dtEnd = mt.end_time 
          ? formatIcsDate(mt.end_time) 
          : formatIcsDate(new Date(new Date(mt.date).getTime() + 60 * 60 * 1000).toISOString())
        const dtStamp = formatIcsDate(mt.created_at || new Date().toISOString())

        icsLines.push(
          'BEGIN:VEVENT',
          `UID:mt-${mt.id}@sangathan.space`,
          `DTSTAMP:${dtStamp}`,
          `DTSTART:${dtStart}`,
          `DTEND:${dtEnd}`,
          `SUMMARY:[Meeting] ${escapeIcsText(mt.title)}`,
          `DESCRIPTION:${escapeIcsText((mt.description || '') + (mt.meeting_link ? `\\n\\nJoin Video Call: ${mt.meeting_link}` : ''))}`,
          `LOCATION:${escapeIcsText(mt.location || (mt.meeting_link ? 'Online Video Call' : 'Internal HQ'))}`,
          mt.meeting_link ? `URL:${mt.meeting_link}` : '',
          'STATUS:CONFIRMED',
          'END:VEVENT'
        )
      }
    }

    // 3. Field Surveys & Tasks
    if (tasksRes.data) {
      for (const tk of tasksRes.data) {
        if (!tk.due_date) continue
        const dtStart = formatIcsDate(tk.due_date)
        const dtEnd = formatIcsDate(new Date(new Date(tk.due_date).getTime() + 60 * 60 * 1000).toISOString())
        const dtStamp = formatIcsDate(new Date().toISOString())

        icsLines.push(
          'BEGIN:VEVENT',
          `UID:tk-${tk.id}@sangathan.space`,
          `DTSTAMP:${dtStamp}`,
          `DTSTART:${dtStart}`,
          `DTEND:${dtEnd}`,
          `SUMMARY:[Field Action] ${escapeIcsText(tk.title)}`,
          `DESCRIPTION:${escapeIcsText((tk.description || '') + `\\nStatus: ${tk.status}`)}`,
          'LOCATION:Field Deployment',
          'STATUS:CONFIRMED',
          'END:VEVENT'
        )
      }
    }

    icsLines.push('END:VCALENDAR')

    const icsContent = icsLines.filter(Boolean).join('\r\n')

    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `inline; filename="sangathan-${orgId.slice(0, 8)}.ics"`,
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
      },
    })
  } catch (error: any) {
    console.error('Failed to generate iCal feed:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

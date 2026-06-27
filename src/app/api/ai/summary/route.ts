import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateText } from 'ai'
import { nvidia, SMART_MODEL, checkAiAccess } from '@/lib/ai/nvidia'
import { checkRateLimit } from '@/lib/ratelimit'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')

    if (!orgId) {
      return NextResponse.json({ error: 'Missing orgId' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allowed = await checkRateLimit(`ai_summary:${user.id}`, 'API')
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const { data: membership } = await supabase
      .from('members')
      .select('id')
      .eq('user_id', user.id)
      .eq('organisation_id', orgId)
      .eq('status', 'active')
      .maybeSingle()

    if (!membership) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weekAgoStr = oneWeekAgo.toISOString()

    const [{ count: newTickets }, { count: resolvedTickets }, { count: newMembers }, { count: upcomingEvents }, { count: activePolls }] = await Promise.all([
      supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).gte('created_at', weekAgoStr),
      supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).eq('status', 'resolved').gte('updated_at', weekAgoStr),
      supabase.from('members').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).gte('created_at', weekAgoStr),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).gte('start_time', weekAgoStr),
      supabase.from('polls').select('*', { count: 'exact', head: true }).eq('organisation_id', orgId).eq('status', 'active'),
    ])

    const stats = {
      newTickets: newTickets || 0,
      resolvedTickets: resolvedTickets || 0,
      newMembers: newMembers || 0,
      upcomingEvents: upcomingEvents || 0,
      activePolls: activePolls || 0,
    }

    if (!(await checkAiAccess(orgId))) {
      return NextResponse.json({
        summary: `${stats.newMembers} new members joined this week. ${stats.newTickets} issues were reported, ${stats.resolvedTickets} resolved. ${stats.upcomingEvents} events and ${stats.activePolls} active polls.`,
        isAi: false,
        stats,
      })
    }

    const { text } = await generateText({
      model: nvidia(SMART_MODEL),
      prompt: `You are a strategic advisor for a civic organization. Write a brief, encouraging 3-4 sentence weekly summary based on these stats from the last 7 days:
- ${stats.newTickets} new tickets/grievances
- ${stats.resolvedTickets} tickets resolved
- ${stats.newMembers} new members joined
- ${stats.upcomingEvents} upcoming events
- ${stats.activePolls} active polls

Highlight achievements, note areas needing attention, and end with a forward-looking statement. Do not use bullet points. Do not mention you are an AI.`,
    })

    return NextResponse.json({ summary: text, isAi: true, stats })
  } catch {
    return NextResponse.json(
      { summary: 'Unable to load insights at this time.', isAi: false },
      { status: 500 },
    )
  }
}

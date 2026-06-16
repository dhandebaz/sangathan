import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkCapability } from '@/lib/capabilities'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')

    if (!orgId) {
      return NextResponse.json({ error: 'Missing orgId' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Get stats from exactly 7 days ago
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weekAgoStr = oneWeekAgo.toISOString()

    // 1. Fetch new tickets
    const { count: newTickets } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .gte('created_at', weekAgoStr)

    // 2. Fetch resolved tickets
    const { count: resolvedTickets } = await supabase
      .from('tickets')
      .select('*', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .eq('status', 'resolved')
      .gte('updated_at', weekAgoStr)

    // 3. Fetch new members
    const { count: newMembers } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('organisation_id', orgId)
      .gte('created_at', weekAgoStr)

    const stats = {
      newTickets: newTickets || 0,
      resolvedTickets: resolvedTickets || 0,
      newMembers: newMembers || 0
    }

    // Check capability
    const hasAiFeatures = await checkCapability(orgId, 'ai_features')

    // If no AI, return standard fallback summary
    if (!hasAiFeatures || !process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        summary: `You had ${stats.newTickets} new issues reported this week and resolved ${stats.resolvedTickets} of them. ${stats.newMembers} new members joined your organization.`,
        isAi: false
      })
    }

    // AI Generation
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Write a brief, encouraging 2-sentence weekly strategic summary for an organization's dashboard based on these stats from the last 7 days:
      - ${stats.newTickets} new tickets/grievances reported
      - ${stats.resolvedTickets} tickets resolved
      - ${stats.newMembers} new members joined
      Do not use bullet points. Make it sound professional and motivating.`
    })

    return NextResponse.json({ summary: text, isAi: true })
  } catch (error) {
    console.error('Summary API Error:', error)
    return NextResponse.json(
      { summary: 'Unable to load insights at this time.', isAi: false },
      { status: 500 }
    )
  }
}

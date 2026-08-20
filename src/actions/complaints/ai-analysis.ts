'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { logAction } from '@/lib/audit/log'
import { checkRateLimitByKey } from '@/lib/ratelimit'

// --- Schemas ---

const AnalyzeComplaintImageSchema = z.object({
  ticketId: z.string().uuid(),
  imageUrl: z.string().url(),
})

const UpdateComplaintAuthoritySchema = z.object({
  ticketId: z.string().uuid(),
  authorityId: z.string().uuid().nullable(),
})

const MarkComplaintPrintedSchema = z.object({
  ticketId: z.string().uuid(),
})

const MarkComplaintDeliveredSchema = z.object({
  ticketId: z.string().uuid(),
  deliveryMethod: z.enum(['hand', 'post', 'email', 'portal']),
})

// --- Actions ---

export const analyzeComplaintImage = createSafeAction(
  AnalyzeComplaintImageSchema,
  async (input, context) => {
    // Rate limit AI analysis
    const rlKey = `ai_analysis:${context.user.id}`
    const allowed = await checkRateLimitByKey(rlKey, 10, 3600) // 10 per hour
    if (!allowed) {
      return { error: 'Too many AI analysis requests. Please try again later.' }
    }

    const supabase = await createClient()
    const adminClient = createServiceClient()

    // Get the ticket
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', input.ticketId)
      .eq('organisation_id', context.organizationId)
      .maybeSingle()

    if (ticketError || !ticket) {
      return { error: 'Complaint not found' }
    }

    if (ticket.type !== 'complaint') {
      return { error: 'This action is only for complaints' }
    }

    // Call AI to analyze image
    const analysis = await analyzeImageWithAI(input.imageUrl, context.organizationId)

    // Update ticket with AI analysis
    const { error: updateError } = await adminClient
      .from('tickets')
      .update({
        ai_analysis: analysis,
        authority_id: analysis.suggested_authority_id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.ticketId)

    if (updateError) {
      console.error('Update ticket AI analysis error:', updateError)
      return { error: 'Failed to save AI analysis' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'COMPLAINT_AI_ANALYSIS',
      resource_table: 'tickets',
      resource_id: input.ticketId,
      details: { analysis }
    })

    revalidatePath('/', 'layout')
    return { success: true, analysis }
  },
  { allowedRoles: ['admin', 'editor', 'can_edit', 'can_manage', 'second_admin'] }
)

export const updateComplaintAuthority = createSafeAction(
  UpdateComplaintAuthoritySchema,
  async (input, context) => {
    const adminClient = createServiceClient()

    const { error } = await adminClient
      .from('tickets')
      .update({
        authority_id: input.authorityId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.ticketId)
      .eq('organisation_id', context.organizationId)

    if (error) {
      return { error: 'Failed to update authority' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'COMPLAINT_AUTHORITY_UPDATED',
      resource_table: 'tickets',
      resource_id: input.ticketId,
      details: { authority_id: input.authorityId }
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor', 'can_manage', 'second_admin'] }
)

export const markComplaintPrinted = createSafeAction(
  MarkComplaintPrintedSchema,
  async (input, context) => {
    const adminClient = createServiceClient()

    const { error } = await adminClient
      .from('tickets')
      .update({
        printed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.ticketId)
      .eq('organisation_id', context.organizationId)

    if (error) {
      return { error: 'Failed to mark as printed' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'COMPLAINT_PRINTED',
      resource_table: 'tickets',
      resource_id: input.ticketId,
      details: {}
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor', 'can_edit', 'can_manage', 'second_admin'] }
)

export const markComplaintDelivered = createSafeAction(
  MarkComplaintDeliveredSchema,
  async (input, context) => {
    const adminClient = createServiceClient()

    const { error } = await adminClient
      .from('tickets')
      .update({
        delivered_at: new Date().toISOString(),
        delivery_method: input.deliveryMethod,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.ticketId)
      .eq('organisation_id', context.organizationId)

    if (error) {
      return { error: 'Failed to mark as delivered' }
    }

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'COMPLAINT_DELIVERED',
      resource_table: 'tickets',
      resource_id: input.ticketId,
      details: { delivery_method: input.deliveryMethod }
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor', 'can_manage', 'second_admin'] }
)

// --- AI Analysis Helper ---

async function analyzeImageWithAI(
  imageUrl: string,
  orgId: string
): Promise<{
  department: string
  issue_type: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  confidence: number
  tags: string[]
  suggested_authority_id: string | null
  description: string
}> {
  try {
    // Get authority contacts for context
    const adminClient = createServiceClient()
    const { data: authorities } = await adminClient
      .from('authority_contacts')
      .select('*')
      .eq('organisation_id', orgId)
      .eq('is_active', true)

    const authorityList = authorities?.map(a => 
      `${a.department} - ${a.authority_name} (${a.designation || ''}) - ${a.jurisdiction || ''}`
    ).join('\n') || 'No authority contacts configured'

    // Call InsForge AI (OpenAI-compatible)
    const baseUrl = process.env.INSFORGE_BASE_URL || 'https://api.insforge.app'
    const anonKey = process.env.INSFORGE_ANON_KEY

    if (!anonKey) {
      console.warn('InsForge AI not configured, using fallback')
      return getFallbackAnalysis()
    }

    const prompt = `Analyze this civic complaint image. Identify:
1. Department (Roads, Water Supply, Sanitation, Streetlights, Parks, Drainage, Encroachment, Traffic, Electricity, Other)
2. Issue type (Pothole, Leakage, Garbage Overflow, Broken Light, Illegal Construction, Water Logging, Damaged Road, Missing Manhole Cover, Stray Animals, Other)
3. Urgency (low, medium, high, critical)
4. Suggested authority from this list:
${authorityList}
5. Brief description of what you see
6. Tags (array of relevant keywords)

Return ONLY valid JSON:
{
  "department": "string",
  "issue_type": "string",
  "urgency": "low|medium|high|critical",
  "confidence": 0.0-1.0,
  "tags": ["string"],
  "suggested_authority_id": "uuid|null",
  "description": "string"
}`

    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a civic complaint analyzer for Indian municipalities. Analyze images and return structured JSON only.' },
          { role: 'user', content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]}
        ],
        max_tokens: 500,
        temperature: 0.1,
      }),
    })

    if (!response.ok) {
      console.error('AI analysis failed:', await response.text())
      return getFallbackAnalysis()
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return getFallbackAnalysis()
    }

    try {
      const parsed = JSON.parse(content)
      // Validate and sanitize
      return {
        department: parsed.department || 'Other',
        issue_type: parsed.issue_type || 'Other',
        urgency: ['low', 'medium', 'high', 'critical'].includes(parsed.urgency) ? parsed.urgency : 'medium',
        confidence: Math.min(1, Math.max(0, parsed.confidence || 0.5)),
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        suggested_authority_id: parsed.suggested_authority_id || null,
        description: parsed.description || 'AI analysis completed',
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return getFallbackAnalysis()
    }
  } catch (error) {
    console.error('AI analysis error:', error)
    return getFallbackAnalysis()
  }
}

function getFallbackAnalysis() {
  return {
    department: 'Other',
    issue_type: 'Other',
    urgency: 'medium' as const,
    confidence: 0.3,
    tags: [],
    suggested_authority_id: null,
    description: 'AI analysis unavailable - manual review required',
  }
}
'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { sendAgentMail } from '@/lib/agentmail'
import { captureMessage, captureException } from '@/lib/sentry'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'support@sangathan.space'

export async function submitSupportTicket(message: string, orgId: string, userId: string) {
  try {
    const supabase = createServiceClient()
    
    let rawIntent: 'bug' | 'feature_request' | 'help' = 'help'
    let title = message.slice(0, 50) + (message.length > 50 ? '...' : '')
    let priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'

    // 1. AI Intent Classification (Fail-safe try/catch)
    if (process.env.OPENAI_API_KEY) {
      try {
        const { object } = await generateObject({
          model: openai('gpt-4o'),
          schema: z.object({
            intent: z.enum(['bug', 'feature_request', 'help']),
            title: z.string().describe('A short, 3-5 word summary of the issue'),
            priority: z.enum(['low', 'medium', 'high', 'critical']).describe('Estimated priority based on the request severity')
          }),
          prompt: `Analyze the following support request from a user.
          Determine the intent (bug, feature request, or general help).
          Assign a short title and a priority.
          
          User Request: "${message}"`
        })

        if (object) {
          rawIntent = object.intent
          title = object.title
          priority = object.priority
        }
      } catch (aiError) {
        console.warn('AI classification skipped or failed, using intelligent fallback:', aiError)
      }
    }

    // 2. Map AI intent to valid ticket type
    const intentToType: Record<string, 'grievance' | 'complaint' | 'maintenance'> = {
      bug: 'complaint',
      feature_request: 'maintenance',
      help: 'grievance',
    }
    const type = intentToType[rawIntent] || 'grievance'

    // 3. Save to Database
    const { data: ticket, error: dbError } = await supabase.from('tickets').insert({
      title,
      description: message,
      type,
      priority,
      status: 'open',
      organisation_id: orgId,
      created_by: userId
    }).select().maybeSingle()

    if (dbError) {
      console.error('Database insert error for ticket:', dbError)
      throw new Error(dbError.message || 'Failed to save ticket')
    }

    // 4. Sentry Logging for Bugs
    if (rawIntent === 'bug' || priority === 'critical') {
      captureMessage(`Support Ticket [${rawIntent.toUpperCase()}]: ${title}`, rawIntent === 'bug' ? 'warning' : 'error', {
        source: 'helpdesk',
        organisationId: orgId,
        user: { id: userId },
        tags: { ticket_type: type, priority },
        extra: { message }
      })
    }

    // 5. Send Email Notification via Unified AgentMail
    await sendAgentMail({
      to: [ADMIN_EMAIL],
      subject: `[Support - ${rawIntent.toUpperCase()}] ${title}`,
      text: `New Support Ticket\nType: ${rawIntent} (mapped to ${type})\nPriority: ${priority}\nOrganization ID: ${orgId}\nUser ID: ${userId}\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0;">New Support Ticket</h2>
          <p><strong>Type:</strong> <span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${rawIntent}</span> (mapped to ${type})</p>
          <p><strong>Priority:</strong> <strong>${priority}</strong></p>
          <p><strong>Organization ID:</strong> <code>${orgId}</code></p>
          <p><strong>User ID:</strong> <code>${userId}</code></p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="white-space: pre-wrap; color: #334155;">${message}</p>
        </div>
      `,
      tags: ['support_ticket', rawIntent, priority],
      orgId,
      userId,
      metadata: { ticketId: ticket.id, rawIntent, priority }
    })

    return { success: true, ticket }

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error submitting support ticket:', errorMsg)
    captureException(error, { source: 'helpdesk_submit', organisationId: orgId, user: { id: userId } })
    return { success: false, error: errorMsg }
  }
}

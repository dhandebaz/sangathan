'use server'

import { createServiceClient } from '@/lib/supabase/service'
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { AgentMailClient } from 'agentmail'
import * as Sentry from '@sentry/nextjs'

const agentmail = new AgentMailClient({ 
  apiKey: process.env.AGENTMAIL_API_KEY || 're_dummy_123' 
})
const INBOX_ID = process.env.AGENTMAIL_INBOX_ID || 'dummy_inbox_id'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'support@sangathan.com'

export async function submitSupportTicket(message: string, orgId: string, userId: string) {
  try {
    const supabase = createServiceClient()
    
    // 1. AI Intent Classification
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

    const { intent, title, priority } = object

    // 2. Save to Database
    // We map intent to ticket 'type'
    const { error: dbError } = await supabase.from('tickets').insert({
      title,
      description: message,
      type: intent,
      priority,
      status: 'open',
      organisation_id: orgId,
      created_by: userId
    })

    if (dbError) throw dbError

    // 3. Sentry Logging for Bugs
    if (intent === 'bug') {
      Sentry.captureMessage(`Bug Report: ${title}`, { 
        level: 'warning', 
        tags: { orgId, userId },
        extra: { message }
      })
    }

    // 4. Send Email to Admin via AgentMail
    try {
      if (process.env.AGENTMAIL_API_KEY && process.env.AGENTMAIL_INBOX_ID) {
        await agentmail.inboxes.messages.send(INBOX_ID, {
          to: [ADMIN_EMAIL],
          subject: `[${intent.toUpperCase()}] ${title}`,
          text: `New Support Ticket\nType: ${intent}\nPriority: ${priority}\nOrganization ID: ${orgId}\nUser ID: ${userId}\nMessage:\n${message}`,
          html: `
            <h2>New Support Ticket</h2>
            <p><strong>Type:</strong> ${intent}</p>
            <p><strong>Priority:</strong> ${priority}</p>
            <p><strong>Organization ID:</strong> ${orgId}</p>
            <p><strong>User ID:</strong> ${userId}</p>
            <hr />
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          `
        })
      }
    } catch (emailError) {
      console.error('Failed to send email with agentmail:', emailError)
      // We don't throw here to avoid failing the user request if email fails
    }

    return { success: true, intent }

  } catch (error) {
    console.error('Error submitting support ticket:', error)
    return { success: false, error: 'Failed to process support ticket' }
  }
}

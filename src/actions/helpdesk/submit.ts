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
    }).select().single()

    if (dbError) {
      console.error('Database insert error for ticket:', dbError)
      throw new Error(dbError.message || 'Failed to save ticket')
    }

    // 4. Sentry Logging for Bugs
    if (rawIntent === 'bug') {
      try {
        Sentry.captureMessage(`Bug Report: ${title}`, { 
          level: 'warning', 
          tags: { orgId, userId },
          extra: { message }
        })
      } catch (sentryErr) {
        console.warn('Sentry logging skipped:', sentryErr)
      }
    }

    // 5. Send Email Notification via AgentMail (Optional & Safe)
    try {
      if (process.env.AGENTMAIL_API_KEY && process.env.AGENTMAIL_INBOX_ID) {
        await agentmail.inboxes.messages.send(INBOX_ID, {
          to: [ADMIN_EMAIL],
          subject: `[${rawIntent.toUpperCase()}] ${title}`,
          text: `New Support Ticket\nType: ${rawIntent} (mapped to ${type})\nPriority: ${priority}\nOrganization ID: ${orgId}\nUser ID: ${userId}\nMessage:\n${message}`,
          html: `
            <h2>New Support Ticket</h2>
            <p><strong>Type:</strong> ${rawIntent} (mapped to ${type})</p>
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
      console.warn('Failed to send email notification:', emailError)
    }

    return { success: true, ticket }

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error submitting support ticket:', errorMsg)
    return { success: false, error: errorMsg }
  }
}

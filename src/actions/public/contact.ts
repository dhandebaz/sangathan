'use server'

import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { AgentMailClient } from 'agentmail'
import * as Sentry from '@sentry/nextjs'

const agentmail = new AgentMailClient({ 
  apiKey: process.env.AGENTMAIL_API_KEY || 're_dummy_123' 
})
const INBOX_ID = process.env.AGENTMAIL_INBOX_ID || 'dummy_inbox_id'

export async function submitPublicContact(email: string, message: string) {
  try {
    // 1. AI Intent Classification (invisible to user)
    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        intent: z.enum(['support', 'abuse', 'billing', 'press']),
        title: z.string().describe('A short, 3-5 word summary of the inquiry'),
        urgency: z.enum(['normal', 'urgent']).describe('Estimated urgency based on the request content')
      }),
      prompt: `Analyze the following contact form submission from a user.
      Determine the intent (general support, trust/safety/abuse, billing/refunds, or media/press).
      Assign a short title and urgency.
      
      User Email: ${email}
      Message: "${message}"`
    })

    const { intent, title, urgency } = object

    // Map intent to specific support emails for routing
    let targetEmail = 'support@sangathan.space'
    if (intent === 'abuse') targetEmail = 'abuse@sangathan.space'
    else if (intent === 'billing') targetEmail = 'billing@sangathan.space'
    else if (intent === 'press') targetEmail = 'press@sangathan.space'

    // Override with a single admin email for testing if needed
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || targetEmail

    // 2. Sentry Logging for Abuse/Urgent matters
    if (intent === 'abuse' || urgency === 'urgent') {
      Sentry.captureMessage(`[${intent.toUpperCase()}] ${title}`, { 
        level: intent === 'abuse' ? 'warning' : 'info', 
        tags: { contactEmail: email, intent },
        extra: { message }
      })
    }

    // 3. Send Email via AgentMail
    if (process.env.AGENTMAIL_API_KEY && process.env.AGENTMAIL_INBOX_ID) {
      await agentmail.inboxes.messages.send(INBOX_ID, {
        to: [ADMIN_EMAIL],
        replyTo: [email],
        subject: `[Website Contact - ${intent.toUpperCase()}] ${title}`,
        text: `New Contact Submission\nFrom: ${email}\nIntent: ${intent}\nUrgency: ${urgency}\n\nMessage:\n${message}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Categorized Intent:</strong> ${intent}</p>
          <p><strong>Urgency:</strong> ${urgency}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      })
    } else {
      console.warn('AgentMail credentials missing. Contact form submission logged but not sent via email.')
    }

    return { success: true }
  } catch (error) {
    console.error('Error processing contact submission:', error)
    return { success: false, error: 'Failed to process your message. Please try again later.' }
  }
}

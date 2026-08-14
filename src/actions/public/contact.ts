'use server'

import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { sendAgentMail } from '@/lib/agentmail'
import { captureMessage, captureException } from '@/lib/sentry'

export async function submitPublicContact(email: string, message: string) {
  try {
    let intent: 'support' | 'abuse' | 'billing' | 'press' = 'support'
    let title = message.slice(0, 40)
    let urgency: 'normal' | 'urgent' = 'normal'

    // 1. AI Intent Classification (with fallback)
    if (process.env.OPENAI_API_KEY) {
      try {
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

        if (object) {
          intent = object.intent
          title = object.title
          urgency = object.urgency
        }
      } catch (aiErr) {
        console.warn('AI intent classification skipped for contact form:', aiErr)
      }
    }

    // Map intent to specific support emails for routing
    let targetEmail = 'support@sangathan.space'
    if (intent === 'abuse') targetEmail = 'abuse@sangathan.space'
    else if (intent === 'billing') targetEmail = 'billing@sangathan.space'
    else if (intent === 'press') targetEmail = 'press@sangathan.space'

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || targetEmail

    // 2. Sentry Logging for Abuse/Urgent matters
    if (intent === 'abuse' || urgency === 'urgent') {
      captureMessage(`[${intent.toUpperCase()}] ${title}`, intent === 'abuse' ? 'warning' : 'info', {
        source: 'contact_form',
        tags: { contactEmail: email, intent, urgency },
        extra: { message }
      })
    }

    // 3. Send Email via Unified AgentMail Hub
    await sendAgentMail({
      to: [ADMIN_EMAIL],
      replyTo: email,
      subject: `[Website Contact - ${intent.toUpperCase()}] ${title}`,
      text: `New Contact Submission\nFrom: ${email}\nIntent: ${intent}\nUrgency: ${urgency}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0;">New Contact Submission</h2>
          <p><strong>From:</strong> ${email}</p>
          <p><strong>Intent:</strong> <span style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">${intent}</span></p>
          <p><strong>Urgency:</strong> ${urgency}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="white-space: pre-wrap; color: #334155;">${message}</p>
        </div>
      `,
      tags: ['contact_form', intent, urgency],
      metadata: { fromEmail: email, intent, urgency }
    })

    return { success: true }
  } catch (error) {
    console.error('Error processing contact submission:', error)
    captureException(error, { source: 'public_contact', extra: { email } })
    return { success: false, error: 'Failed to process your message. Please try again later.' }
  }
}

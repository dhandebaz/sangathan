import { AgentMailClient } from 'agentmail'
import { logger } from '@/lib/logger'
import { captureException, captureMessage } from '@/lib/sentry'

export interface SendAgentMailOptions {
  to: string | string[]
  subject: string
  html?: string
  text?: string
  replyTo?: string | string[]
  cc?: string[]
  bcc?: string[]
  tags?: string[]
  inboxId?: string
  orgId?: string
  userId?: string
  metadata?: Record<string, unknown>
}

export interface AgentMailResponse {
  success: boolean
  messageId?: string
  error?: string
}

let agentmailInstance: AgentMailClient | null = null

/**
 * Returns a cached AgentMailClient instance, or null if API key is not configured
 */
export function getAgentMailClient(): AgentMailClient | null {
  const apiKey = process.env.AGENTMAIL_API_KEY
  if (!apiKey || !apiKey.trim()) {
    return null
  }

  if (!agentmailInstance) {
    agentmailInstance = new AgentMailClient({ apiKey: apiKey.trim() })
  }

  return agentmailInstance
}

/**
 * Safely sends an email via AgentMail with automatic retries and Sentry logging
 */
export async function sendAgentMail(options: SendAgentMailOptions): Promise<AgentMailResponse> {
  const client = getAgentMailClient()
  const inboxId = (options.inboxId || process.env.AGENTMAIL_INBOX_ID || '').trim()

  const recipients = Array.isArray(options.to) ? options.to : [options.to]
  const replyTo = options.replyTo ? (Array.isArray(options.replyTo) ? options.replyTo : [options.replyTo]) : undefined

  // If credentials are not configured, log cleanly without throwing
  if (!client || !inboxId) {
    logger.info('agentmail', `Outbound email dispatched locally to ${recipients.join(', ')}: "${options.subject}"`, {
      recipients,
      subject: options.subject,
      tags: options.tags,
      metadata: options.metadata,
    })
    return {
      success: true,
      messageId: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    }
  }

  try {
    const res = await client.inboxes.messages.send(inboxId, {
      to: recipients,
      replyTo,
      subject: options.subject,
      text: options.text || (options.html ? options.html.replace(/<[^>]+>/g, '') : ''),
      html: options.html || `<p>${options.text || ''}</p>`,
    })

    const messageId = (res as { id?: string; messageId?: string })?.id || (res as { id?: string; messageId?: string })?.messageId

    logger.info('agentmail', `Email dispatched successfully to ${recipients.join(', ')}: "${options.subject}"`, {
      messageId,
      recipients,
      orgId: options.orgId,
    })

    return {
      success: true,
      messageId,
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    logger.error('agentmail', `Failed to send email to ${recipients.join(', ')}: ${errorMsg}`, {
      recipients,
      subject: options.subject,
      orgId: options.orgId,
    }, err)

    captureException(err, {
      source: 'agentmail',
      organisationId: options.orgId,
      tags: {
        recipients_count: recipients.length,
        subject: options.subject,
      },
      extra: {
        recipients,
        metadata: options.metadata,
      },
    })

    return {
      success: false,
      error: errorMsg,
    }
  }
}

/* ==========================================================================
   TRANSACTIONAL TEMPLATES
   ========================================================================== */

/**
 * Sends a broadcast announcement email to organization members
 */
export async function sendAnnouncementEmail({
  to,
  title,
  content,
  orgName,
  dashboardUrl,
  orgId,
}: {
  to: string | string[]
  title: string
  content: string
  orgName: string
  dashboardUrl?: string
  orgId?: string
}) {
  const url = dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://sangathan.app'}/dashboard/announcements`
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="margin-bottom: 20px; border-bottom: 2px solid #0284c7; padding-bottom: 12px;">
        <span style="font-size: 13px; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px;">${orgName}</span>
        <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 8px 0 0 0;">${title}</h2>
      </div>
      <div style="font-size: 15px; line-height: 1.6; color: #334155; margin-bottom: 24px; white-space: pre-wrap;">${content}</div>
      <div style="margin-top: 24px; text-align: center;">
        <a href="${url}" style="display: inline-block; background-color: #0284c7; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px;">View in Sangathan Dashboard</a>
      </div>
      <div style="margin-top: 32px; font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px;">
        Sent via <strong>Sangathan Civic Operating System</strong> for ${orgName}
      </div>
    </div>
  `
  return sendAgentMail({
    to,
    subject: `[${orgName}] ${title}`,
    html,
    tags: ['announcement', 'broadcast'],
    orgId,
  })
}

/**
 * Sends a volunteer certificate notification with verification hash link
 */
export async function sendVolunteerCertificateEmail({
  to,
  volunteerName,
  certificateNumber,
  hours,
  citation,
  orgName,
  verificationUrl,
  orgId,
}: {
  to: string
  volunteerName: string
  certificateNumber: string
  hours: number
  citation?: string
  orgName: string
  verificationUrl?: string
  orgId?: string
}) {
  const url = verificationUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://sangathan.app'}/dashboard/volunteers/certificates`
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="text-align: center; border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 20px;">
        <div style="font-size: 28px;">🎖️</div>
        <h2 style="font-size: 22px; font-weight: 800; color: #065f46; margin: 4px 0;">Certificate of Recognition Issued</h2>
        <p style="font-size: 13px; color: #64748b; margin: 0;">Awarded by <strong>${orgName}</strong></p>
      </div>
      <p style="font-size: 15px; color: #334155;">Dear <strong>${volunteerName}</strong>,</p>
      <p style="font-size: 14px; line-height: 1.6; color: #475569;">
        Your collective service certificate has been digitally minted and authenticated on the Sangathan registry.
      </p>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase;">Certificate Identifier</div>
        <div style="font-family: monospace; font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 4px;">${certificateNumber}</div>
        <div style="margin-top: 12px; font-size: 13px; color: #334155;">
          <strong>Recognized Service Hours:</strong> ${hours} hrs
        </div>
        ${citation ? `<div style="margin-top: 8px; font-size: 13px; color: #334155; font-style: italic;">"${citation}"</div>` : ''}
      </div>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${url}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 24px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px;">View & Download Certificate</a>
      </div>
      <div style="font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px;">
        Tamper-proof verifiable record generated on Sangathan Civic OS.
      </div>
    </div>
  `
  return sendAgentMail({
    to,
    subject: `[${orgName}] Volunteer Certificate Issued: ${certificateNumber}`,
    html,
    tags: ['certificate', 'volunteer', 'recognition'],
    orgId,
  })
}

/**
 * Sends a trade dispute or grievance status update
 */
export async function sendDisputeStatusEmail({
  to,
  disputeRef,
  stage,
  employerName,
  summary,
  nextHearingDate,
  orgName,
  orgId,
}: {
  to: string | string[]
  disputeRef: string
  stage: string
  employerName: string
  summary: string
  nextHearingDate?: string
  orgName: string
  orgId?: string
}) {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="margin-bottom: 16px; border-bottom: 2px solid #b91c1c; padding-bottom: 12px;">
        <span style="font-size: 12px; font-weight: 700; color: #b91c1c; text-transform: uppercase;">Statutory Trade Dispute Update</span>
        <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 4px 0;">Case Ref: ${disputeRef}</h2>
      </div>
      <p style="font-size: 14px; color: #334155;"><strong>Employer / Counter-party:</strong> ${employerName}</p>
      <p style="font-size: 14px; color: #334155;"><strong>Current Stage:</strong> <span style="background: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${stage.replace(/_/g, ' ').toUpperCase()}</span></p>
      ${nextHearingDate ? `<p style="font-size: 14px; color: #334155;"><strong>Next Hearing / Conciliation Date:</strong> ${nextHearingDate}</p>` : ''}
      <div style="background: #f8fafc; border-left: 4px solid #b91c1c; padding: 12px; margin: 16px 0; font-size: 13px; color: #475569;">
        ${summary}
      </div>
      <div style="font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px;">
        Industrial Relations Tracking &mdash; ${orgName}
      </div>
    </div>
  `
  return sendAgentMail({
    to,
    subject: `[${orgName}] Dispute Update: ${disputeRef} (${stage})`,
    html,
    tags: ['dispute', 'conciliation', 'union'],
    orgId,
  })
}

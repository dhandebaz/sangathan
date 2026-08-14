import { createServiceClient } from '@/lib/supabase/service'
import { sendAgentMail } from '@/lib/agentmail'
import { logger } from '@/lib/logger'
import { captureException } from '@/lib/sentry'

export interface WeeklyDigestData {
  timeframe: {
    startDate: string
    endDate: string
  }
  stats: {
    totalErrors: number
    criticalErrors: number
    securityEvents: number
    openTickets: number
    complaintsCount: number
    grievancesCount: number
  }
  errors: Array<{
    id: string
    source: string
    level: string
    message: string
    metadata: Record<string, unknown> | null
    created_at: string
    organisation_id?: string
  }>
  tickets: Array<{
    id: string
    title: string
    description: string
    type: string
    priority: string
    status: string
    created_at: string
    organisation_id: string
    created_by?: string
  }>
  idePromptBlock: string
}

/**
 * Gathers error logs, security events, and user complaints from the past 7 days
 * and generates both structured data and ready-to-copy IDE AI prompt blocks.
 */
export async function generateWeeklyEngineeringDigest(days: number = 7): Promise<WeeklyDigestData> {
  const supabase = createServiceClient()
  const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  const nowStr = new Date().toISOString()

  // 1. Query Error & Security Logs
  const { data: logs, error: logsError } = await supabase
    .from('system_logs')
    .select('*')
    .gte('created_at', sinceDate)
    .in('level', ['error', 'critical', 'security', 'warn'])
    .order('created_at', { ascending: false })
    .limit(50)

  if (logsError) {
    logger.warn('weekly_digest', 'Failed to fetch system logs for digest', { error: logsError.message })
  }

  // 2. Query Recent Tickets & Complaints
  const { data: tickets, error: ticketsError } = await supabase
    .from('tickets')
    .select('*')
    .gte('created_at', sinceDate)
    .order('created_at', { ascending: false })
    .limit(50)

  if (ticketsError) {
    logger.warn('weekly_digest', 'Failed to fetch tickets for digest', { error: ticketsError.message })
  }

  const rawLogs = logs || []
  const rawTickets = tickets || []

  // Compute Stats
  const criticalCount = rawLogs.filter((l) => l.level === 'critical').length
  const errorCount = rawLogs.filter((l) => l.level === 'error').length
  const securityCount = rawLogs.filter((l) => l.level === 'security').length
  const complaintsCount = rawTickets.filter((t) => t.type === 'complaint').length
  const grievancesCount = rawTickets.filter((t) => t.type === 'grievance').length
  const openTickets = rawTickets.filter((t) => t.status === 'open' || t.status === 'in_progress').length

  // Build IDE-Ready Prompt Block
  let promptBlock = `# WEEKLY SANGATHAN ENGINEERING & COMPLAINTS DIGEST\n`
  promptBlock += `Period: ${sinceDate.split('T')[0]} to ${nowStr.split('T')[0]}\n`
  promptBlock += `Summary: ${criticalCount + errorCount} Errors, ${securityCount} Security Events, ${rawTickets.length} Complaints/Tickets\n\n`
  promptBlock += `Use the context below to diagnose root causes, fix broken logic, and resolve reported user issues.\n\n`

  promptBlock += `================================================================================\n`
  promptBlock += `SECTION 1: HIGH PRIORITY RUNTIME ERRORS & EXCEPTIONS (${rawLogs.length} items)\n`
  promptBlock += `================================================================================\n\n`

  if (rawLogs.length === 0) {
    promptBlock += `No errors recorded during this timeframe. All systems operational.\n\n`
  } else {
    rawLogs.slice(0, 20).forEach((err, idx) => {
      promptBlock += `### [ERR-${String(idx + 1).padStart(2, '0')}] [${err.level.toUpperCase()}] Source: ${err.source}\n`
      promptBlock += `- Message: ${err.message}\n`
      promptBlock += `- Timestamp: ${err.created_at}\n`
      if (err.organisation_id) promptBlock += `- Org ID: ${err.organisation_id}\n`
      if (err.metadata && Object.keys(err.metadata).length > 0) {
        promptBlock += `- Metadata / Trace:\n\`\`\`json\n${JSON.stringify(err.metadata, null, 2)}\n\`\`\`\n`
      }
      promptBlock += `\n`
    })
  }

  promptBlock += `================================================================================\n`
  promptBlock += `SECTION 2: USER COMPLAINTS, BUGS & GRIEVANCES (${rawTickets.length} items)\n`
  promptBlock += `================================================================================\n\n`

  if (rawTickets.length === 0) {
    promptBlock += `No user grievances or tickets logged during this timeframe.\n\n`
  } else {
    rawTickets.slice(0, 20).forEach((ticket, idx) => {
      promptBlock += `### [TICKET-${String(idx + 1).padStart(2, '0')}] Type: ${ticket.type.toUpperCase()} | Priority: ${ticket.priority.toUpperCase()} | Status: ${ticket.status}\n`
      promptBlock += `- Title: ${ticket.title}\n`
      promptBlock += `- Description: ${ticket.description}\n`
      promptBlock += `- Org ID: ${ticket.organisation_id}\n`
      promptBlock += `- Created: ${ticket.created_at}\n`
      promptBlock += `\n`
    })
  }

  promptBlock += `================================================================================\n`
  promptBlock += `ACTION INSTRUCTIONS FOR AI ASSISTANT:\n`
  promptBlock += `1. Review the errors in Section 1 and find the relevant source files in the Sangathan codebase.\n`
  promptBlock += `2. Formulate concise fixes and type-safe patches for any unhandled exceptions.\n`
  promptBlock += `3. Review user complaints in Section 2 and check if feature enhancements or UI updates are required.\n`
  promptBlock += `================================================================================\n`

  return {
    timeframe: {
      startDate: sinceDate.split('T')[0],
      endDate: nowStr.split('T')[0],
    },
    stats: {
      totalErrors: errorCount + criticalCount,
      criticalErrors: criticalCount,
      securityEvents: securityCount,
      openTickets,
      complaintsCount,
      grievancesCount,
    },
    errors: rawLogs.map((l) => ({
      id: l.id,
      source: l.source,
      level: l.level,
      message: l.message,
      metadata: l.metadata as Record<string, unknown> | null,
      created_at: l.created_at,
      organisation_id: l.organisation_id,
    })),
    tickets: rawTickets.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      type: t.type,
      priority: t.priority,
      status: t.status,
      created_at: t.created_at,
      organisation_id: t.organisation_id,
      created_by: t.created_by,
    })),
    idePromptBlock: promptBlock,
  }
}

/**
 * Dispatches the formatted weekly engineering & complaints digest email via AgentMail.
 */
export async function sendWeeklyEngineeringDigestEmail(recipients?: string[]): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const digest = await generateWeeklyEngineeringDigest(7)

    // Determine target recipient list: admin emails from env or supplied args
    const superAdminEmails = (process.env.SUPER_ADMIN_EMAILS || '').split(',').map((e) => e.trim()).filter(Boolean)
    const adminEmail = process.env.ADMIN_EMAIL || 'support@sangathan.space'
    const targetRecipients = recipients && recipients.length > 0 ? recipients : Array.from(new Set([adminEmail, ...superAdminEmails]))

    const subject = `[Sangathan Weekly IDE Digest] ${digest.stats.criticalErrors} Criticals, ${digest.stats.totalErrors} Errors, ${digest.tickets.length} Complaints (${digest.timeframe.startDate} - ${digest.timeframe.endDate})`

    // Generate HTML Email
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 720px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff; color: #0f172a;">
        
        <!-- Header -->
        <div style="border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 12px; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.5px;">Sangathan Civic OS &bull; Automated Weekly Ops</span>
            <span style="font-size: 12px; color: #64748b;">${digest.timeframe.startDate} &rarr; ${digest.timeframe.endDate}</span>
          </div>
          <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 8px 0 0 0;">Weekly Engineering &amp; Complaints Digest</h1>
          <p style="font-size: 14px; color: #64748b; margin: 4px 0 0 0;">Pre-formatted for direct copy-pasting into your IDE AI assistant (Cursor, Trae, Antigravity) to fix or upgrade.</p>
        </div>

        <!-- Executive Metrics Grid -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 20px; font-weight: 800; color: #dc2626;">${digest.stats.criticalErrors}</div>
            <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">Critical Errors</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 20px; font-weight: 800; color: #ea580c;">${digest.stats.totalErrors}</div>
            <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">Total Errors</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 20px; font-weight: 800; color: #2563eb;">${digest.stats.openTickets}</div>
            <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">Open Complaints</div>
          </div>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
            <div style="font-size: 20px; font-weight: 800; color: #059669;">${digest.stats.securityEvents}</div>
            <div style="font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">Security Logs</div>
          </div>
        </div>

        <!-- Section 1: Errors -->
        <div style="margin-bottom: 28px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; border-left: 4px solid #dc2626; padding-left: 8px;">
            1. Sentry &amp; Runtime Errors (${digest.errors.length})
          </h2>
          ${digest.errors.length === 0 ? '<p style="font-size: 13px; color: #64748b;">No runtime errors recorded this week. Systems healthy.</p>' : ''}
          ${digest.errors.slice(0, 10).map((err, i) => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span style="font-family: monospace; font-size: 11px; font-weight: 700; background: ${err.level === 'critical' ? '#fee2e2; color: #991b1b' : '#f1f5f9; color: #334155'}; padding: 2px 6px; border-radius: 4px;">
                  [${err.level.toUpperCase()}] ${err.source}
                </span>
                <span style="font-size: 11px; color: #94a3b8;">${new Date(err.created_at).toLocaleString()}</span>
              </div>
              <div style="font-size: 13px; font-weight: 600; color: #1e293b; margin: 6px 0 4px 0;">${err.message}</div>
              ${err.metadata ? `<pre style="background: #0f172a; color: #f8fafc; padding: 8px; border-radius: 6px; font-size: 11px; overflow-x: auto; margin: 6px 0 0 0;">${JSON.stringify(err.metadata, null, 2)}</pre>` : ''}
            </div>
          `).join('')}
        </div>

        <!-- Section 2: Complaints & Tickets -->
        <div style="margin-bottom: 28px;">
          <h2 style="font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; border-left: 4px solid #2563eb; padding-left: 8px;">
            2. Member Complaints &amp; Grievance Reports (${digest.tickets.length})
          </h2>
          ${digest.tickets.length === 0 ? '<p style="font-size: 13px; color: #64748b;">No user grievances or tickets logged this week.</p>' : ''}
          ${digest.tickets.slice(0, 10).map((t) => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-bottom: 10px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-size: 11px; font-weight: 700; background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                  ${t.type} &bull; ${t.priority}
                </span>
                <span style="font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase;">${t.status}</span>
              </div>
              <div style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 6px 0 2px 0;">${t.title}</div>
              <div style="font-size: 13px; color: #475569; white-space: pre-wrap;">${t.description}</div>
            </div>
          `).join('')}
        </div>

        <!-- Section 3: IDE Copy-Paste Block -->
        <div style="margin-bottom: 20px; background: #0f172a; border-radius: 8px; padding: 16px; color: #f8fafc;">
          <div style="font-size: 12px; font-weight: 700; color: #38bdf8; text-transform: uppercase; margin-bottom: 8px;">
            📋 Raw Markdown Block (Copy-Paste to IDE / AI Chat)
          </div>
          <pre style="white-space: pre-wrap; font-family: monospace; font-size: 12px; line-height: 1.5; color: #e2e8f0; max-height: 250px; overflow-y: auto;">${digest.idePromptBlock}</pre>
        </div>

        <!-- Footer -->
        <div style="font-size: 12px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px;">
          Generated automatically by <strong>Sangathan Civic Operating System</strong> &bull; Telemetry &amp; Sentry Sync
        </div>
      </div>
    `

    const res = await sendAgentMail({
      to: targetRecipients,
      subject,
      html,
      text: digest.idePromptBlock,
      tags: ['weekly_digest', 'engineering_ops', 'sentry'],
      metadata: {
        totalErrors: digest.stats.totalErrors,
        totalTickets: digest.tickets.length,
      },
    })

    logger.info('weekly_digest', `Weekly digest email dispatched to ${targetRecipients.join(', ')}`, {
      messageId: res.messageId,
      recipientCount: targetRecipients.length,
    })

    return res

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    logger.error('weekly_digest', `Failed to send weekly engineering digest: ${errorMsg}`, {}, err)
    captureException(err, { source: 'weekly_engineering_digest' })
    return { success: false, error: errorMsg }
  }
}

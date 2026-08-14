import { createServiceClient } from '@/lib/supabase/service'
import type { Json } from '@/types/database'
import { captureMessage, captureException } from '@/lib/sentry'

export type LogLevel = 'info' | 'warn' | 'error' | 'security' | 'critical'

export interface LogEntry {
  level: LogLevel
  source: string
  message: string
  metadata?: Json
  user_id?: string
  organisation_id?: string
  ip_address?: string
}

export async function log(entry: LogEntry) {
  try {
    const supabase = createServiceClient()
    const { error } = await supabase.from('system_logs').insert(entry)
    
    if (error) {
      console.error('Failed to write log to DB:', error)
      console.log(JSON.stringify(entry))
    }
  } catch (err) {
    console.error('Logger threw error:', err)
  }

  // Forward critical, error, and security logs to Sentry
  try {
    if (entry.level === 'critical' || entry.level === 'error') {
      captureMessage(`[${entry.source.toUpperCase()}] ${entry.message}`, 'error', {
        source: entry.source,
        organisationId: entry.organisation_id,
        user: entry.user_id ? { id: entry.user_id } : undefined,
        extra: { metadata: entry.metadata, ip_address: entry.ip_address },
      })
    } else if (entry.level === 'security') {
      captureMessage(`[SECURITY] [${entry.source.toUpperCase()}] ${entry.message}`, 'warning', {
        source: entry.source,
        organisationId: entry.organisation_id,
        user: entry.user_id ? { id: entry.user_id } : undefined,
        tags: { security_alert: true },
        extra: { metadata: entry.metadata, ip_address: entry.ip_address },
      })
    }
  } catch (sentryErr) {
    // Non-blocking fallback
    console.warn('Sentry forwarding failed in logger:', sentryErr)
  }
}

export const logger = {
  info: (source: string, message: string, meta?: Record<string, unknown>) => 
    log({ level: 'info', source, message, metadata: meta as Json }),
    
  warn: (source: string, message: string, meta?: Record<string, unknown>) => 
    log({ level: 'warn', source, message, metadata: meta as Json }),
    
  error: (source: string, message: string, meta?: Record<string, unknown>, err?: unknown) => {
    if (err) {
      captureException(err, { source, extra: meta })
    }
    return log({ level: 'error', source, message, metadata: meta as Json })
  },
    
  security: (source: string, message: string, meta?: Record<string, unknown>, userId?: string, ip?: string) => 
    log({ level: 'security', source, message, metadata: meta as Json, user_id: userId, ip_address: ip }),

  critical: (source: string, message: string, meta?: Record<string, unknown>, err?: unknown) => {
    if (err) {
      captureException(err, { source, extra: meta, level: 'fatal' })
    }
    return log({ level: 'critical', source, message, metadata: meta as Json })
  },
}

import { createServiceClient } from '@/lib/supabase/service'

export type LogLevel = 'info' | 'warn' | 'error' | 'security' | 'critical'

export interface LogEntry {
  level: LogLevel
  source: string
  message: string
  metadata?: Record<string, unknown>
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
      // Fallback to console
      console.log(JSON.stringify(entry))
    }
  } catch (err) {
    console.error('Logger threw error:', err)
  }
}

export const logger = {
  info: (source: string, message: string, meta?: Record<string, unknown>) => 
    log({ level: 'info', source, message, metadata: meta }),
    
  warn: (source: string, message: string, meta?: Record<string, unknown>) => 
    log({ level: 'warn', source, message, metadata: meta }),
    
  error: (source: string, message: string, meta?: Record<string, unknown>) => 
    log({ level: 'error', source, message, metadata: meta }),
    
  security: (source: string, message: string, meta?: Record<string, unknown>, userId?: string, ip?: string) => 
    log({ level: 'security', source, message, metadata: meta, user_id: userId, ip_address: ip }),

  critical: (source: string, message: string, meta?: Record<string, unknown>) => 
    log({ level: 'critical', source, message, metadata: meta }),
}

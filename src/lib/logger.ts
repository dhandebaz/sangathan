import { createServiceClient } from '@/lib/supabase/service'
import type { Json } from '@/types/database'

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
      // Fallback to console
      console.log(JSON.stringify(entry))
    }
  } catch (err) {
    console.error('Logger threw error:', err)
  }
}

export const logger = {
  info: (source: string, message: string, meta?: Record<string, unknown>) => 
    log({ level: 'info', source, message, metadata: meta as Json }),
    
  warn: (source: string, message: string, meta?: Record<string, unknown>) => 
    log({ level: 'warn', source, message, metadata: meta as Json }),
    
  error: (source: string, message: string, meta?: Record<string, unknown>) => 
    log({ level: 'error', source, message, metadata: meta as Json }),
    
  security: (source: string, message: string, meta?: Record<string, unknown>, userId?: string, ip?: string) => 
    log({ level: 'security', source, message, metadata: meta as Json, user_id: userId, ip_address: ip }),

  critical: (source: string, message: string, meta?: Record<string, unknown>) => 
    log({ level: 'critical', source, message, metadata: meta as Json }),
}

import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'

export interface RateLimitConfig {
  points: number // Max requests
  duration: number // In seconds
}

export const RATE_LIMITS = {
  LOGIN: { points: 5, duration: 60 * 15 }, // 5 attempts per 15 mins
  SIGNUP: { points: 3, duration: 60 * 60 }, // 3 signups per hour
  API: { points: 100, duration: 60 }, // 100 req/min
  OTP: { points: 3, duration: 60 * 10 }, // 3 OTP requests per 10 mins
}

/**
 * Checks if a key has exceeded its rate limit.
 * Uses a simple fixed window counter in Postgres.
 * Returns true if allowed, false if blocked.
 */
export async function checkRateLimit(key: string, config: RateLimitConfig): Promise<boolean> {
  const supabase = createServiceClient()
  const now = new Date()
  const windowStart = new Date(now.getTime() - config.duration * 1000)

  try {
    // 1. Clean up old windows (opportunistic cleanup)
    // In production, this should be a scheduled job, but for now we do it lazily
    // We only clean up THIS key if it's expired
    const { data: current } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('key', key)
      .single()

    if (current && new Date(current.updated_at) < windowStart) {
      // Reset if window passed
      await supabase
        .from('rate_limits')
        .update({ points: 1, updated_at: now.toISOString(), window_start: now.toISOString() })
        .eq('key', key)
      return true
    }

    if (current) {
      if (current.points >= config.points) {
        // Limit exceeded
        await logger.security('ratelimit', `Rate limit exceeded for ${key}`, { config: config as unknown as Record<string, unknown> })
        return false
      }

      // Increment
      await supabase.rpc('increment_rate_limit', { key_param: key })
      return true
    } else {
      // Create new
      await supabase.from('rate_limits').insert({
        key,
        points: 1,
        window_start: now.toISOString(),
        updated_at: now.toISOString()
      })
      return true
    }
  } catch (err) {
    console.error('Rate limit error', err)
    // Fail open if DB is down to avoid blocking legitimate users
    return true 
  }
}

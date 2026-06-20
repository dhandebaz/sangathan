import { Ratelimit } from '@upstash/ratelimit'
import { redis } from './redis'

// Simple fixed window rate limits
export const rateLimiters = {
  login: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
  }),
  signup: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    analytics: true,
  }),
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
  }),
  otp: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '10 m'),
    analytics: true,
  })
}

export interface RateLimitConfig {
  points: number // Max requests
  duration: number // In seconds
}

export const RATE_LIMITS = {
  LOGIN: { points: 5, duration: 60 * 15 },
  SIGNUP: { points: 3, duration: 60 * 60 },
  API: { points: 100, duration: 60 },
  OTP: { points: 3, duration: 60 * 10 },
}

/**
 * Checks if a key has exceeded its rate limit using Upstash Redis.
 * Returns true if allowed, false if blocked.
 */
export async function checkRateLimit(key: string, configType: 'LOGIN' | 'SIGNUP' | 'API' | 'OTP'): Promise<boolean> {
  try {
    let limiter;
    switch(configType) {
      case 'LOGIN': limiter = rateLimiters.login; break;
      case 'SIGNUP': limiter = rateLimiters.signup; break;
      case 'API': limiter = rateLimiters.api; break;
      case 'OTP': limiter = rateLimiters.otp; break;
      default: limiter = rateLimiters.api;
    }
    
    const { success } = await limiter.limit(key)
    return success
  } catch {
    return false
  }
}

export async function checkRateLimitWithGrace(key: string, configType: 'LOGIN' | 'SIGNUP' | 'API' | 'OTP'): Promise<{ allowed: boolean; degraded: boolean }> {
  try {
    const allowed = await checkRateLimit(key, configType)
    return { allowed, degraded: false }
  } catch {
    return { allowed: true, degraded: true }
  }
}

/**
 * Generic key-based rate limit check using Upstash Redis.
 * Used internally by createSafeAction and for custom rate limit scenarios.
 */
export async function checkRateLimitByKey(key: string, points: number, duration: number): Promise<boolean> {
  try {
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(points, `${duration} s`),
      analytics: true,
    })
    const { success } = await limiter.limit(key)
    return success
  } catch {
    return true // Fail open: if Redis is down, allow the request
  }
}

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
  } catch (err) {
    console.error('Upstash rate limit error', err)
    // Fail open if Redis is down to avoid blocking legitimate users
    return true 
  }
}

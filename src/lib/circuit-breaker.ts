import { createServiceClient } from '@/lib/supabase/service'
import { logger } from '@/lib/logger'

// Simple in-memory state for circuit breakers
// In serverless (Vercel), this state resets on cold starts, which is acceptable 
// as it prevents long-term locking. Ideally, this would use Redis.
const breakers: Record<string, {
  failures: number
  lastFailure: number
  isOpen: boolean
}> = {}

const CONFIG = {
  THRESHOLD: 5, // 5 failures
  RESET_TIMEOUT: 60000, // 1 minute
}

export async function withCircuitBreaker<T>(
  service: string,
  fn: () => Promise<T>
): Promise<T> {
  const now = Date.now()
  
  if (!breakers[service]) {
    breakers[service] = { failures: 0, lastFailure: 0, isOpen: false }
  }

  const breaker = breakers[service]

  // Check if open
  if (breaker.isOpen) {
    if (now - breaker.lastFailure > CONFIG.RESET_TIMEOUT) {
      // Half-open: Try once
      breaker.isOpen = false
      breaker.failures = 0
    } else {
      throw new Error(`Service ${service} is temporarily unavailable (Circuit Breaker Open)`)
    }
  }

  try {
    const result = await fn()
    // Success resets failures
    breaker.failures = 0
    return result
  } catch (error) {
    breaker.failures++
    breaker.lastFailure = now
    
    if (breaker.failures >= CONFIG.THRESHOLD) {
      breaker.isOpen = true
      logger.critical('resilience', `Circuit breaker opened for ${service}`, { error })
    }
    
    throw error
  }
}

import { Redis } from '@upstash/redis'

// Initialize Upstash Redis client with graceful fallback logging for local development
const getRedisClient = () => {
  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      return Redis.fromEnv()
    } else {
      if (process.env.NODE_ENV === 'production') {
        console.error('[Redis] Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN in production environment.')
      }
    }
  } catch (error) {
    console.error('[Redis] Failed to initialize Redis client:', error)
  }
  
  // Safe fallback client for offline/local dev environments missing credentials
  return {
    get: async () => null,
    set: async () => 'OK',
    del: async () => 1,
    incr: async () => 1,
    expire: async () => 1,
  } as unknown as Redis
}

export const redis = getRedisClient()

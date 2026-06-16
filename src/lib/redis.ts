import { Redis } from '@upstash/redis'

// Fallback to a mock instance if ENV vars are missing during local development
// This ensures the app doesn't crash before the user links Vercel ENV vars
const getRedisClient = () => {
  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      return Redis.fromEnv()
    }
  } catch (error) {
    console.warn('Failed to initialize Redis. Ensure UPSTASH_REDIS_REST_URL is set.', error)
  }
  
  // Return a dummy client that fails gracefully for local dev
  return {
    get: async () => null,
    set: async () => 'OK',
    del: async () => 1,
    incr: async () => 1,
    expire: async () => 1,
  } as unknown as Redis
}

export const redis = getRedisClient()

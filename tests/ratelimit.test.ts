import { test } from 'node:test'
import assert from 'node:assert'
import { checkRateLimit, checkRateLimitWithGrace } from '../src/lib/ratelimit'

test('checkRateLimit throws on error', async () => {
  // We know it will fail because UPSTASH_REDIS_REST_URL is missing or it uses dummy client
  await assert.rejects(
    async () => {
      await checkRateLimit('test-key', 'API')
    },
    {
      name: 'TypeError',
      message: /ctx.redis.evalsha is not a function/
    }
  )
})

test('checkRateLimitWithGrace should return degraded: true on error', async () => {
  const result = await checkRateLimitWithGrace('test-key', 'API')

  // Now this should PASS
  assert.strictEqual(result.degraded, true, 'Should be degraded when rate limiter fails')
  assert.strictEqual(result.allowed, true, 'Should allow request when in degraded mode (fail open)')
})

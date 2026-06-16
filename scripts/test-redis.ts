import { redis } from '../src/lib/redis'

async function testRedis() {
  try {
    console.log('Testing Upstash Redis Connection...')
    await redis.set('test_key', 'Hello Upstash!', { ex: 10 })
    const value = await redis.get('test_key')
    console.log('Result from Redis:', value)
    
    if (value === 'Hello Upstash!') {
      console.log('✅ Upstash Redis successfully configured and working!')
    } else {
      console.error('❌ Redis returned unexpected value.')
    }
  } catch (err) {
    console.error('❌ Failed to connect to Upstash Redis:', err)
  }
}

testRedis()

// scripts/test-email.ts
// Run with: npx ts-node --project tsconfig.json scripts/test-email.ts
// Or better: create a temporary API route

import { enqueueJob } from '@/lib/queue'
import { welcomeAdminEmail } from '@/lib/email/templates'

// Mocking Next.js request context isn't easy in scripts, so we'll simulate via an API route if needed.
// For now, let's just log what we WOULD do.

async function test() {
  console.log('🚀 Testing Email System...')

  const emailHtml = welcomeAdminEmail('Test User', 'Test Org', 'https://sangathan.space/dashboard')
  
  console.log('📧 Generated HTML Preview (First 100 chars):', emailHtml.substring(0, 100))

  const jobPayload = {
    to: 'test@example.com',
    subject: 'Welcome to Sangathan (Test)',
    html: emailHtml,
    tags: ['test', 'welcome']
  }

  console.log('📦 Enqueuing Job:', jobPayload)
  
  // This requires DB connection which might not work in standalone script without setup
  // So we will just explain how to test it in the app.
  /*
  const success = await enqueueJob('send_email', jobPayload)
  if (success) {
    console.log('✅ Job enqueued successfully!')
  } else {
    console.error('❌ Failed to enqueue job.')
  }
  */
}

test()

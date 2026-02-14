import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

// Simple KV-based rate limiter using Supabase if we had a Redis.
// Since we only have Postgres, we'll use a table 'rate_limits' or 'audit_logs' to count.
// For now, let's use a simple in-memory map if serverless wasn't ephemeral, but it is.
// So we must use DB. We'll reuse 'otp_attempts' logic or create 'request_logs'.

// Actually, Supabase has built-in rate limiting for Auth.
// We need to rate limit "Org Creation" specifically.

export async function checkRateLimit(action: string, identifier: string, limit: number, windowSeconds: number) {
  // Use a dedicated table for rate limiting
  // CREATE TABLE rate_limits (key text primary key, count int, expires_at timestamptz);
  // This is complex to implement robustly in SQL without Redis.
  
  // Alternative: Check 'organisations' table creation time for this user/IP.
  // We can't check IP easily against orgs.
  // We can check user_id if they are logged in.
  
  // For public signup (IP based), we can use 'request_logs' if we had one.
  // Let's implement a simple DB-backed limiter.
  
  const supabase = await createClient()
  
  // Clean up old entries
  // This should be a cron, but we can do it lazily or use TTL if supported.
  
  // Let's just count how many orgs this IP/User created in last 24h
  // This assumes we log the creator IP or we trust user_id.
  
  // For Unauthenticated Signup (Step 1):
  // We rely on Supabase Auth rate limits for signUp.
  
  // For Org Creation (Step 2 - Authenticated):
  // We check 'organisations' table where created_by = user.id
  
  if (action === 'create_org') {
     const { count } = await supabase
       .from('organisations')
       .select('*', { count: 'exact', head: true })
       .eq('created_by', identifier) // user_id
       .gte('created_at', new Date(Date.now() - windowSeconds * 1000).toISOString())
       
     if ((count || 0) >= limit) {
        return { allowed: false, error: 'Too many organisations created. Please wait.' }
     }
  }
  
  return { allowed: true }
}

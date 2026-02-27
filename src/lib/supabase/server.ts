import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { withCircuitBreaker } from '@/lib/circuit-breaker'

// Custom fetch with Circuit Breaker to prevent hanging on latent DB
const resilientFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  return withCircuitBreaker('supabase', async () => {
    // Add 15s timeout to prevent hanging
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)
    
    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal
      })
      
      if (response.status >= 500) {
         // Treat 5xx as failure for circuit breaker
         throw new Error(`Supabase Service Error: ${response.status}`)
      }
      return response
    } finally {
      clearTimeout(timeoutId)
    }
  })
}

export async function createClient() {
  const cookieStore = await cookies()

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase Environment Variables')
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
      global: {
        fetch: resilientFetch,
      },
    }
  )
}

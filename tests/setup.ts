import { vi } from 'vitest'

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    getAll: vi.fn(() => []),
    setAll: vi.fn(),
  })),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key'

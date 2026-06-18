import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`Redirected to ${url}`)
  }),
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(),
}))

// Mock next/headers
vi.mock('next/headers', () => ({
  headers: vi.fn(async () => {
    const headerMap = new Map()
    headerMap.set('referer', 'http://localhost:3000/en/login')
    headerMap.set('origin', 'http://localhost:3000')
    headerMap.set('x-forwarded-for', '127.0.0.1')
    return {
      get: (key: string) => headerMap.get(key),
    }
  }),
  cookies: vi.fn(),
}))

// Standard mock for Supabase clients to be overridden in tests
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: vi.fn(),
}))

// Mock Redis
vi.mock('@/lib/redis', () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    expire: vi.fn(),
  },
}))

// Mock Logger
vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock Rate Limiter
vi.mock('@/lib/rate-limit/db-limiter', () => ({
  checkRateLimit: vi.fn(),
}))

// Mock Risk Engine
vi.mock('@/lib/risk-engine', () => ({
  detectOTPRisk: vi.fn(),
}))

import { vi } from 'vitest'

process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-anon-key'

// Mock next/cache
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    getAll: vi.fn(),
    delete: vi.fn(),
  })),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  usePathname: vi.fn(),
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}))

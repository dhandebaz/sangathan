import { vi } from 'vitest'

interface MockResult {
  data: unknown;
  error: unknown;
  count: number | null;
  [key: string]: unknown;
}

export const createMockResult = (data: unknown = null, error: unknown = null, count: number | null = null): MockResult => {
  const promise = Promise.resolve({ data, error, count }) as unknown as MockResult
  const methods = ['from', 'select', 'insert', 'update', 'delete', 'eq', 'or', 'order', 'limit', 'single', 'maybeSingle', 'rpc', 'head', 'range']
  methods.forEach(m => {
    promise[m] = vi.fn().mockImplementation(() => promise)
  })
  return promise
}

export const mockSupabase = {
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
  },
  from: vi.fn().mockImplementation(() => createMockResult()),
  rpc: vi.fn().mockImplementation(() => createMockResult()),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => mockSupabase),
}))

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: vi.fn(() => mockSupabase),
}))

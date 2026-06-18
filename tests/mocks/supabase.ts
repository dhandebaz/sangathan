import { vi } from 'vitest'

export const mockSupabaseResponse = (data: unknown = null, error: unknown = null) => ({
  data,
  error,
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data, error }),
  maybeSingle: vi.fn().mockResolvedValue({ data, error }),
  gt: vi.fn().mockReturnThis(),
})

export const mockSupabaseClient = {
  from: vi.fn().mockReturnValue(mockSupabaseResponse()),
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  },
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabaseClient),
}))

vi.mock('@/lib/supabase/service', () => ({
  createServiceClient: vi.fn().mockReturnValue(mockSupabaseClient),
}))

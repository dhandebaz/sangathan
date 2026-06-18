import { vi } from 'vitest'

export const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
}

export const mockRedis = {
  get: vi.fn(),
  set: vi.fn(),
  expire: vi.fn(),
}

export const mockLogger = {
  error: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => mockSupabase),
}))

vi.mock('@/lib/redis', () => ({
  redis: mockRedis,
}))

vi.mock('@/lib/logger', () => ({
  logger: mockLogger,
}))

vi.mock('@/lib/audit/log', () => ({
  logAction: vi.fn(),
}))

vi.mock('@/lib/auth/context', () => ({
  getSelectedOrganisationId: vi.fn(),
  getUserContext: vi.fn(),
  requireRole: vi.fn(),
}))

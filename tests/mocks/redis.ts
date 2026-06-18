import { vi } from 'vitest'

export const mockRedis = {
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue('OK'),
  expire: vi.fn().mockResolvedValue(1),
}

vi.mock('@/lib/redis', () => ({
  redis: mockRedis,
}))

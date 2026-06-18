import { vi } from 'vitest'
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn().mockResolvedValue(undefined),
    info: vi.fn().mockResolvedValue(undefined),
    warn: vi.fn().mockResolvedValue(undefined),
  }
}))

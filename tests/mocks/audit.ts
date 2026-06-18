import { vi } from 'vitest'

vi.mock('@/lib/audit/log', () => ({
  logAction: vi.fn().mockResolvedValue(undefined),
}))

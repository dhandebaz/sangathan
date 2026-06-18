import './supabase'
import './next'
import './redis'
import './audit'
import './auth'
import './logger'

import { vi } from 'vitest'
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
  }
}))

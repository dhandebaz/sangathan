import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createSafeAction } from './actions'
import { z } from 'zod'

// Mock dependencies
vi.mock('@/lib/auth/context', () => ({
  getSelectedOrganisationId: vi.fn(),
  getUserContext: vi.fn(),
  requireRole: vi.fn(),
}))

vi.mock('@/lib/redis', () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    expire: vi.fn(),
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}))

import { getSelectedOrganisationId, getUserContext, requireRole } from '@/lib/auth/context'
import { redis } from '@/lib/redis'
import { logger } from '@/lib/logger'

describe('createSafeAction', () => {
  const schema = z.object({
    name: z.string().min(3),
  })

  const handler = vi.fn(async (input) => {
    return { greeting: `Hello ${input.name}` }
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(redis.get).mockResolvedValue(0)
  })

  it('should call handler with valid input and context', async () => {
    const action = createSafeAction(schema, handler)

    vi.mocked(getSelectedOrganisationId).mockResolvedValue('org-123')
    vi.mocked(getUserContext).mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      organizationId: 'org-123',
      role: 'admin',
      memberships: [],
    })

    const result = await action({ name: 'World' })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toEqual({ greeting: 'Hello World' })
    }
    expect(handler).toHaveBeenCalledWith({ name: 'World' }, expect.objectContaining({
      organizationId: 'org-123',
    }))
  })

  it('should return error for invalid input', async () => {
    const action = createSafeAction(schema, handler)

    const result = await action({ name: 'Wo' })

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
    expect(handler).not.toHaveBeenCalled()
  })

  it('should return error when unauthorized', async () => {
    const action = createSafeAction(schema, handler)

    vi.mocked(getSelectedOrganisationId).mockRejectedValue(new Error('Unauthorized'))

    const result = await action({ name: 'World' })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Unauthorized')
  })

  it('should enforce roles when specified', async () => {
    const action = createSafeAction(schema, handler, { allowedRoles: ['admin'] })

    vi.mocked(requireRole).mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      organizationId: 'org-123',
      role: 'admin',
      memberships: [],
    })

    const result = await action({ name: 'World' })

    expect(result.success).toBe(true)
    expect(requireRole).toHaveBeenCalledWith(['admin'])
  })

  it('should rate limit requests', async () => {
    const action = createSafeAction(schema, handler, { actionName: 'test-action' })

    vi.mocked(getSelectedOrganisationId).mockResolvedValue('org-123')
    vi.mocked(getUserContext).mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      organizationId: 'org-123',
      role: 'admin',
      memberships: [],
    })
    vi.mocked(redis.get).mockResolvedValue(60)

    const result = await action({ name: 'World' })

    expect(result.success).toBe(false)
    expect(result.error).toContain('Too many requests')
    expect(handler).not.toHaveBeenCalled()
  })

  it('should log and return generic error on handler failure', async () => {
    const action = createSafeAction(schema, handler, { actionName: 'fail-action' })

    vi.mocked(getSelectedOrganisationId).mockResolvedValue('org-123')
    vi.mocked(getUserContext).mockResolvedValue({
      user: { id: 'user-123', email: 'test@example.com' },
      organizationId: 'org-123',
      role: 'admin',
      memberships: [],
    })

    handler.mockRejectedValueOnce(new Error('Database explosion'))

    const result = await action({ name: 'World' })

    expect(result.success).toBe(false)
    expect(result.error).toBe('An unexpected error occurred. Please try again later.')
    expect(logger.error).toHaveBeenCalledWith(
      'server_action',
      'Action failed: fail-action',
      expect.objectContaining({
        action: 'fail-action',
      })
    )
  })
})

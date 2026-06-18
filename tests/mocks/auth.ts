import { vi } from 'vitest'

vi.mock('@/lib/auth/actions', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/auth/actions')>()
  return {
    ...actual,
    // We keep createSafeAction as is since it's a wrapper we want to test through
    // but we might need to mock getUserContext etc which it calls
  }
})

vi.mock('@/lib/auth/context', () => ({
  getSelectedOrganisationId: vi.fn().mockResolvedValue('test-org-id'),
  getUserContext: vi.fn().mockResolvedValue({
    user: { id: 'test-user-id', email: 'test@example.com' },
    organizationId: 'test-org-id',
    role: 'admin',
    memberships: [],
  }),
  requireRole: vi.fn().mockResolvedValue({
    user: { id: 'test-user-id', email: 'test@example.com' },
    organizationId: 'test-org-id',
    role: 'admin',
    memberships: [],
  }),
}))

vi.mock('@/lib/auth/cookie', () => ({
  verifySignedCookie: vi.fn().mockResolvedValue(null),
  createSignedCookie: vi.fn().mockResolvedValue('mock-token'),
}))

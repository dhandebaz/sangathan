import { describe, it, expect, vi, beforeEach } from 'vitest'
import '@/../tests/mocks' // Load all mocks
import { createForm, updateForm, toggleFormStatus, deleteForm, submitFormResponse } from './actions'
import { mockSupabaseClient, mockSupabaseResponse } from '@/../tests/mocks/supabase'


import { verifySignedCookie } from '@/lib/auth/cookie'
import { revalidatePath } from 'next/cache'
import { logAction } from '@/lib/audit/log'

describe('Forms Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset default mock behaviors
    mockSupabaseClient.from.mockReturnValue(mockSupabaseResponse())
  })

  describe('createForm', () => {
    it('successfully creates a form', async () => {
      const input = {
        title: 'Test Form',
        description: 'Test Description',
        fields: [{ id: 'f1', label: 'Name', type: 'text' as const, required: true }],
        visibility: 'public' as const,
      }

      mockSupabaseClient.from.mockReturnValue(mockSupabaseResponse({ id: 'new-form-id' }))

      const result = await createForm(input)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({ formId: 'new-form-id' })
      }
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('forms')
      expect(revalidatePath).toHaveBeenCalled()
      expect(logAction).toHaveBeenCalledWith(expect.objectContaining({
        action: 'FORM_CREATED',
        resource_id: 'new-form-id'
      }))
    })

    it('fails when database insert fails', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseResponse(null, { message: 'DB Error' }))

      const result = await createForm({
        title: 'Test Form',
        fields: [{ id: 'f1', label: 'Name', type: 'text' as const, required: true }],
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('An unexpected error occurred. Please try again later.')
    })
  })

  describe('updateForm', () => {
    it('successfully updates a form', async () => {
      const input = {
        formId: '00000000-0000-0000-0000-000000000000',
        title: 'Updated Title',
      }

      mockSupabaseClient.from.mockReturnValue(mockSupabaseResponse({ success: true }))

      const result = await updateForm(input)

      expect(result.success).toBe(true)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('forms')
      expect(logAction).toHaveBeenCalledWith(expect.objectContaining({
        action: 'FORM_UPDATED',
        resource_id: input.formId
      }))
    })
  })

  describe('submitFormResponse', () => {
    const validToken = { formId: '00000000-0000-0000-0000-000000000000', ts: Date.now() - 5000 }
    const validForm = {
      id: '00000000-0000-0000-0000-000000000000',
      organisation_id: 'test-org-id',
      fields: [{ id: 'f1', label: 'Name', type: 'text', required: true }],
      is_active: true,
      visibility: 'public',
      deleted_at: null,
    }

    it('fails if honeypot is filled', async () => {
      const result = await submitFormResponse({
        formId: validForm.id,
        data: {},
        honeypot: 'i am a bot',
      })
      expect(result.success).toBe(false)
      expect(result.error).toBe('Spam detected')
    })

    it('fails if CSRF token is missing', async () => {
      const result = await submitFormResponse({
        formId: validForm.id,
        data: {},
      })
      expect(result.success).toBe(false)
      expect(result.error).toBe('Missing security token')
    })

    it('fails if CSRF token is invalid', async () => {
      vi.mocked(verifySignedCookie).mockResolvedValue(null)
      const result = await submitFormResponse({
        formId: validForm.id,
        data: {},
        csrfToken: 'invalid',
      })
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid security token')
    })

    it('fails if submission is too fast', async () => {
      vi.mocked(verifySignedCookie).mockResolvedValue({ formId: validForm.id, ts: Date.now() - 500 })
      const result = await submitFormResponse({
        formId: validForm.id,
        data: {},
        csrfToken: 'valid-but-fast',
      })
      expect(result.success).toBe(false)
      expect(result.error).toBe('Submission too fast')
    })

    it('successfully submits a valid response', async () => {
      vi.mocked(verifySignedCookie).mockResolvedValue(validToken)
      mockSupabaseClient.from.mockImplementation((table) => {
        if (table === 'forms') return mockSupabaseResponse(validForm)
        if (table === 'rate_limits') return mockSupabaseResponse(null) // Mock count for rate limit
        return mockSupabaseResponse({ id: 'sub-id' })
      })

      const result = await submitFormResponse({
        formId: validForm.id,
        data: { f1: 'John Doe' },
        csrfToken: 'valid-token',
      })

      expect(result.success).toBe(true)
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('form_submissions')
    })

    it('fails validation for missing required fields', async () => {
      vi.mocked(verifySignedCookie).mockResolvedValue(validToken)
      mockSupabaseClient.from.mockReturnValueOnce(mockSupabaseResponse(validForm))

      const result = await submitFormResponse({
        formId: validForm.id,
        data: {},
        csrfToken: 'valid-token',
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('Validation failed')
      expect(result.fieldErrors).toHaveProperty('f1')
    })
  })
})

  describe('submitFormResponse - Auth & Visibility', () => {
    const validToken = { formId: '00000000-0000-0000-0000-000000000000', ts: Date.now() - 5000 }

    it('fails if form is members-only and user is not logged in', async () => {
      vi.mocked(verifySignedCookie).mockResolvedValue(validToken)
      const membersForm = {
        id: '00000000-0000-0000-0000-000000000000',
        organisation_id: 'test-org-id',
        fields: [],
        is_active: true,
        visibility: 'members',
        deleted_at: null,
      }

      mockSupabaseClient.from.mockReturnValue(mockSupabaseResponse(membersForm))
      mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })

      const result = await submitFormResponse({
        formId: membersForm.id,
        data: {},
        csrfToken: 'valid-token',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Authentication required')
    })

    it('fails if form is private and user is not staff', async () => {
      vi.mocked(verifySignedCookie).mockResolvedValue(validToken)
      const privateForm = {
        id: '00000000-0000-0000-0000-000000000000',
        organisation_id: 'test-org-id',
        fields: [],
        is_active: true,
        visibility: 'private',
        deleted_at: null,
      }

      mockSupabaseClient.from.mockImplementation((table) => {
        if (table === 'forms') return mockSupabaseResponse(privateForm)
        if (table === 'profiles') return mockSupabaseResponse({ role: 'member', status: 'active', organisation_id: 'test-org-id' })
        return mockSupabaseResponse()
      })
      mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } as unknown }, error: null })

      const result = await submitFormResponse({
        formId: privateForm.id,
        data: {},
        csrfToken: 'valid-token',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Access denied')
    })
  })

  describe('submitFormResponse - Rate Limiting', () => {
    const validToken = { formId: '00000000-0000-0000-0000-000000000000', ts: Date.now() - 5000 }
    const validForm = {
      id: '00000000-0000-0000-0000-000000000000',
      organisation_id: 'test-org-id',
      fields: [],
      is_active: true,
      visibility: 'public',
      deleted_at: null,
    }

    it('fails if rate limit is exceeded', async () => {
      vi.mocked(verifySignedCookie).mockResolvedValue(validToken)

      mockSupabaseClient.from.mockImplementation((table) => {
        if (table === 'forms') return mockSupabaseResponse(validForm)
        if (table === 'rate_limits') {
           // This is tricky because the code calls .select('*', { count: 'exact', head: true })
           // and then checks count.
           return {
             ...mockSupabaseResponse(),
             select: vi.fn().mockReturnThis(),
             eq: vi.fn().mockReturnThis(),
             gt: vi.fn().mockResolvedValue({ count: 10, error: null })
           } as unknown
        }
        return mockSupabaseResponse()
      })

      const result = await submitFormResponse({
        formId: validForm.id,
        data: {},
        csrfToken: 'valid-token',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Too many submissions')
    })
  })

  describe('toggleFormStatus', () => {
    it('successfully toggles form status', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseResponse({ success: true }))
      const result = await toggleFormStatus({ formId: '00000000-0000-0000-0000-000000000000', isActive: false })
      expect(result.success).toBe(true)
      expect(logAction).toHaveBeenCalledWith(expect.objectContaining({ action: 'FORM_STATUS_CHANGED' }))
    })
  })

  describe('deleteForm', () => {
    it('successfully deletes a form', async () => {
      mockSupabaseClient.from.mockReturnValue(mockSupabaseResponse({ success: true }))
      const result = await deleteForm({ formId: '00000000-0000-0000-0000-000000000000' })
      expect(result.success).toBe(true)
      expect(logAction).toHaveBeenCalledWith(expect.objectContaining({ action: 'FORM_DELETED' }))
    })
  })

  describe('submitFormResponse - Field Validation', () => {
    const validToken = { formId: '00000000-0000-0000-0000-000000000000', ts: Date.now() - 5000 }
    const formWithTypes = {
      id: '00000000-0000-0000-0000-000000000000',
      organisation_id: 'test-org-id',
      fields: [
        { id: 'f1', label: 'Number', type: 'number', required: false },
        { id: 'f2', label: 'Phone', type: 'phone', required: false },
      ],
      is_active: true,
      visibility: 'public',
      deleted_at: null,
    }

    it('fails for invalid number', async () => {
      vi.mocked(verifySignedCookie).mockResolvedValue(validToken)
      mockSupabaseClient.from.mockReturnValue(mockSupabaseResponse(formWithTypes))
      const result = await submitFormResponse({
        formId: formWithTypes.id,
        data: { f1: 'not-a-number' },
        csrfToken: 'valid-token',
      })
      expect(result.success).toBe(false)
      expect(result.fieldErrors?.f1).toBe('Invalid number')
    })

    it('fails for invalid phone', async () => {
      vi.mocked(verifySignedCookie).mockResolvedValue(validToken)
      mockSupabaseClient.from.mockReturnValue(mockSupabaseResponse(formWithTypes))
      const result = await submitFormResponse({
        formId: formWithTypes.id,
        data: { f2: '123' },
        csrfToken: 'valid-token',
      })
      expect(result.success).toBe(false)
      expect(result.fieldErrors?.f2).toBe('Invalid phone number')
    })
  })

  describe('submitFormResponse - Error states', () => {
    it('fails if form session is expired', async () => {
      vi.mocked(verifySignedCookie).mockResolvedValue({ formId: '00000000-0000-0000-0000-000000000000', ts: Date.now() - (3601 * 1000) })
      const result = await submitFormResponse({
        formId: '00000000-0000-0000-0000-000000000000',
        data: {},
        csrfToken: 'expired-token',
      })
      expect(result.success).toBe(false)
      expect(result.error).toBe('Form session expired. Please refresh.')
    })

    it('fails if form is not found', async () => {
      vi.mocked(verifySignedCookie).mockResolvedValue({ formId: '00000000-0000-0000-0000-000000000000', ts: Date.now() - 5000 })
      mockSupabaseClient.from.mockReturnValue(mockSupabaseResponse(null, { message: 'Not found' }))
      const result = await submitFormResponse({
        formId: '00000000-0000-0000-0000-000000000000',
        data: {},
        csrfToken: 'valid-token',
      })
      expect(result.success).toBe(false)
      expect(result.error).toBe('Form not found')
    })

    it('fails if form is inactive', async () => {
      vi.mocked(verifySignedCookie).mockResolvedValue({ formId: '00000000-0000-0000-0000-000000000000', ts: Date.now() - 5000 })
      mockSupabaseClient.from.mockReturnValue(mockSupabaseResponse({ is_active: false, deleted_at: null }))
      const result = await submitFormResponse({
        formId: '00000000-0000-0000-0000-000000000000',
        data: {},
        csrfToken: 'valid-token',
      })
      expect(result.success).toBe(false)
      expect(result.error).toBe('Form is no longer active')
    })
  })

  describe('submitFormResponse - Staff check', () => {
     it('fails if private form and profile fetch fails', async () => {
      const validToken = { formId: '00000000-0000-0000-0000-000000000000', ts: Date.now() - 5000 }
      vi.mocked(verifySignedCookie).mockResolvedValue(validToken)
      const privateForm = {
        id: '00000000-0000-0000-0000-000000000000',
        organisation_id: 'test-org-id',
        fields: [],
        is_active: true,
        visibility: 'private',
        deleted_at: null,
      }

      mockSupabaseClient.from.mockImplementation((table) => {
        if (table === 'forms') return mockSupabaseResponse(privateForm)
        if (table === 'profiles') return mockSupabaseResponse(null, { message: 'Profile error' })
        return mockSupabaseResponse()
      })
      mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } as unknown }, error: null })

      const result = await submitFormResponse({
        formId: privateForm.id,
        data: {},
        csrfToken: 'valid-token',
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Access denied')
    })
  })

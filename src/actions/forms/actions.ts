'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { headers } from 'next/headers'
import { verifySignedCookie } from '@/lib/auth/cookie'

import { FormFieldSchema } from '@/types/forms'

const CreateFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  fields: z.array(FormFieldSchema).min(1, "At least one field is required"),
  visibility: z.enum(['public', 'members', 'private']).default('public'),
})

const UpdateFormSchema = CreateFormSchema.partial().extend({
  formId: z.string().uuid(),
  visibility: z.enum(['public', 'members', 'private']).optional(),
})

const ToggleFormStatusSchema = z.object({
  formId: z.string().uuid(),
  isActive: z.boolean(),
})

const DeleteFormSchema = z.object({
  formId: z.string().uuid(),
})

const SubmitFormSchema = z.object({
  formId: z.string().uuid(),
  data: z.record(z.string(), z.any()), // Field ID -> Value
  honeypot: z.string().optional(), // Spam protection
  csrfToken: z.string().optional(),
})

// --- Dashboard Actions ---

export const createForm = createSafeAction(
  CreateFormSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('forms')
      .insert({
        organisation_id: context.organizationId,
        title: input.title,
        description: input.description,
        visibility: input.visibility,
        fields: input.fields,
        is_active: true,
        created_by: context.user.id,
      })
      .select('id')
      .single()

    const form = data

    if (error || !form) throw new Error(error?.message || 'Failed to create form')

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'FORM_CREATED',
      resource_table: 'forms',
      resource_id: form.id,
      details: { title: input.title }
    })

    revalidatePath('/', 'layout')
    return { formId: form.id }
  },
  { allowedRoles: ['admin', 'editor', 'executive'] }
)

export const updateForm = createSafeAction(
  UpdateFormSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('forms')
      .update({
        title: input.title,
        description: input.description,
        visibility: input.visibility,
        fields: input.fields,
        updated_at: new Date().toISOString(),
      })
      .eq('id', input.formId)
      .eq('organisation_id', context.organizationId)

    if (error) throw new Error(error.message)

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'FORM_UPDATED',
      resource_table: 'forms',
      resource_id: input.formId,
      details: { changes: input }
    })

    revalidatePath('/', 'layout')
    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor', 'executive'] }
)

export const toggleFormStatus = createSafeAction(
  ToggleFormStatusSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('forms')
      .update({ is_active: input.isActive })
      .eq('id', input.formId)
      .eq('organisation_id', context.organizationId)

    if (error) throw new Error(error.message)

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'FORM_STATUS_CHANGED',
      resource_table: 'forms',
      resource_id: input.formId,
      details: { is_active: input.isActive }
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor', 'executive'] }
)

export const deleteForm = createSafeAction(
  DeleteFormSchema,
  async (input, context) => {
    const supabase = await createClient()

    const { error } = await supabase
      .from('forms')
      .delete()
      .eq('id', input.formId)
      .eq('organisation_id', context.organizationId)

    if (error) throw new Error(error.message)

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'FORM_DELETED',
      resource_table: 'forms',
      resource_id: input.formId
    })

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor', 'executive'] }
)

// --- Public Submission Action ---
// NOTE: This does NOT use createSafeAction because it's public (no auth context)

export async function submitFormResponse(input: z.infer<typeof SubmitFormSchema>) {
  const result = SubmitFormSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid form submission' }
  }

  const safeInput = result.data

  if (safeInput.honeypot && safeInput.honeypot.length > 0) {
    return { success: false, error: 'Spam detected' }
  }

  // CSRF / Token Verification
  if (!safeInput.csrfToken) {
      return { success: false, error: 'Missing security token' }
  }

  const tokenData = await verifySignedCookie(safeInput.csrfToken) as { formId: string; ts: number } | null
  if (!tokenData || tokenData.formId !== safeInput.formId) {
      return { success: false, error: 'Invalid security token' }
  }

  const now = Date.now()
  if (now - tokenData.ts < 2000) { // 2 seconds minimum
      return { success: false, error: 'Submission too fast' }
  }

  if (now - tokenData.ts > 3600 * 1000) { // 1 hour expiry
      return { success: false, error: 'Form session expired. Please refresh.' }
  }

  // 2. Fetch Form Definition
  const supabase = createServiceClient()

  const { data, error: formError } = await supabase
    .from('forms')
    .select('id, organisation_id, fields, is_active, visibility, deleted_at')
    .eq('id', safeInput.formId)
    .single()

  const form = data

  if (formError || !form || form.deleted_at !== null) {
    return { success: false, error: 'Form not found' }
  }

  if (!form.is_active) {
    return { success: false, error: 'Form is no longer active' }
  }

  // Auth context and Visibility check
  const userClient = await createClient()
  const { data: { user } } = await userClient.auth.getUser()

  if (form.visibility === 'members') {
    if (!user) {
      return { success: false, error: 'Authentication required. Please log in to fill this form.' }
    }
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, organisation_id, status, role')
      .eq('id', user.id)
      .maybeSingle()

    if (profileError || !profile || profile.status !== 'active' || profile.organisation_id !== form.organisation_id) {
      return { success: false, error: 'Only active members of this organization can fill this form.' }
    }
  } else if (form.visibility === 'private') {
    if (!user) {
      return { success: false, error: 'Access denied. You must be logged in.' }
    }
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, organisation_id, status, role')
      .eq('id', user.id)
      .maybeSingle()

    if (
      profileError ||
      !profile ||
      profile.status !== 'active' ||
      profile.organisation_id !== form.organisation_id ||
      !['admin', 'editor', 'executive'].includes(profile.role)
    ) {
      return { success: false, error: 'Access denied. Only staff can submit responses to this form.' }
    }
  }

  // 3. Dynamic Validation
  const fields = form.fields as z.infer<typeof FormFieldSchema>[]
  const errors: Record<string, string> = {}

  fields.forEach(field => {
    const value = safeInput.data[field.id]

    if (field.required && (value === undefined || value === '' || value === null)) {
      errors[field.id] = `${field.label} is required`
    }

    // Basic Type Checks
    if (value) {
      if (field.type === 'number' && isNaN(Number(value))) {
        errors[field.id] = 'Invalid number'
      }
      if (field.type === 'phone' && String(value).length < 10) {
        errors[field.id] = 'Invalid phone number'
      }
    }
  })

  if (Object.keys(errors).length > 0) {
    return { success: false, error: 'Validation failed', fieldErrors: errors }
  }

  // 4. Rate Limiting
  try {
    const headerStore = await headers()
    const ip = headerStore.get('x-forwarded-for') || 'unknown'
    const key = `submission:${safeInput.formId}:${ip}`

    const { count, error: rateError } = await supabase.from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('key', key)
      .gt('window_start', new Date(Date.now() - 3600 * 1000).toISOString())

    if (!rateError && count !== null && count >= 5) {
      return { success: false, error: 'Too many submissions. Please try again later.' }
    }

    // Record attempt
    if (!rateError) {
      await supabase.from('rate_limits').insert({ key })
    }
  } catch (err) {
    // Fail open
    console.warn('Rate limit check failed:', err)
  }

  // 5. Insert Submission
  const { error: submissionError } = await supabase
    .from('form_submissions')
    .insert({
      form_id: form.id,
      organisation_id: form.organisation_id,
      user_id: user?.id || null,
      data: safeInput.data,
    })

  if (submissionError) {
    console.error('Submission Error:', submissionError)
    return { success: false, error: 'Failed to submit form' }
  }

  return { success: true }
}

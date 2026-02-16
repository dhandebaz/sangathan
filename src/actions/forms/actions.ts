'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { headers } from 'next/headers'

// --- Types & Schemas ---

const FieldTypeSchema = z.enum(['text', 'number', 'phone', 'textarea', 'dropdown'])

const FormFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  type: FieldTypeSchema,
  required: z.boolean(),
  options: z.array(z.string()).optional(), // For dropdowns
})

const CreateFormSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().optional(),
  fields: z.array(FormFieldSchema).min(1, "At least one field is required"),
})

const UpdateFormSchema = CreateFormSchema.partial().extend({
  formId: z.string().uuid(),
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

    revalidatePath('/dashboard/forms')
    return { formId: form.id }
  },
  { allowedRoles: ['admin', 'editor'] }
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

    revalidatePath(`/dashboard/forms/${input.formId}`)
    revalidatePath('/dashboard/forms')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'] }
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

    revalidatePath('/dashboard/forms')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'] }
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

    revalidatePath('/dashboard/forms')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'] }
)

// --- Public Submission Action ---
// NOTE: This does NOT use createSafeAction because it's public (no auth context)

export async function submitFormResponse(input: z.infer<typeof SubmitFormSchema>) {
  // 1. Spam Check
  if (input.honeypot && input.honeypot.length > 0) {
    return { success: false, error: 'Spam detected' }
  }

  // 2. Fetch Form Definition
  const supabase = createServiceClient()

  const { data, error: formError } = await supabase
    .from('forms')
    .select('id, organisation_id, fields, is_active')
    .eq('id', input.formId)
    .single()

  const form = data

  if (formError || !form) {
    return { success: false, error: 'Form not found' }
  }

  if (!form.is_active) {
    return { success: false, error: 'Form is no longer active' }
  }

  // 3. Dynamic Validation
  const fields = form.fields as z.infer<typeof FormFieldSchema>[]
  const errors: Record<string, string> = {}

  fields.forEach(field => {
    const value = input.data[field.id]

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
    const key = `submission:${input.formId}:${ip}`

    const { count, error: rateError } = await supabase.from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('key', key)
      .gt('created_at', new Date(Date.now() - 3600 * 1000).toISOString())

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
      user_id: null, // Public submissions are anonymous or we don't force auth here
      data: input.data,
    })

  if (submissionError) {
    console.error('Submission Error:', submissionError)
    return { success: false, error: 'Failed to submit form' }
  }

  return { success: true }
}

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'

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
        fields: input.fields, // JSONB
        is_active: true,
        created_by: context.user.id
      })
      .select('id')
      .single()

    if (error) throw new Error(error.message)

    await logAction({
      organisation_id: context.organizationId,
      user_id: context.user.id,
      action: 'FORM_CREATED',
      resource_table: 'forms',
      resource_id: data.id,
      details: { title: input.title }
    })

    revalidatePath('/dashboard/forms')
    return { formId: data.id }
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
        updated_at: new Date().toISOString()
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

const SubmitFormSchema = z.object({
  formId: z.string().uuid(),
  data: z.record(z.string(), z.any()), // Field ID -> Value
  honeypot: z.string().optional(), // Spam protection
})

export async function submitFormResponse(input: z.infer<typeof SubmitFormSchema>) {
  // 1. Spam Check
  if (input.honeypot && input.honeypot.length > 0) {
    return { success: false, error: 'Spam detected' }
  }

  // 2. Fetch Form Definition (using Service Client to bypass RLS for public read if needed, or anon if policy allows)
  // Actually, 'forms' table should be readable by public? No, "Public form must not expose organisation_id".
  // But we need to know the organisation_id to insert the submission correctly.
  // The 'forms' table policy says: "View forms in organisation" -> requires Auth.
  // So for public access, we MUST use Service Client to fetch the form details and validate.
  
  const supabase = createServiceClient()

  const { data: form, error: formError } = await supabase
    .from('forms')
    .select('id, organisation_id, fields, is_active')
    .eq('id', input.formId)
    .single()

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

  // 4. Rate Limiting (Basic Placeholder)
  // In production, check Redis or a DB log.
  // Here we assume Vercel/Next.js edge protection or basic spam prevention is enough for "Simple".
  
  // 5. Insert Submission
  // We use Service Client because 'form_submissions' insert policy is "Public can submit forms" (TRUE).
  // BUT we need to set 'organisation_id'. The client doesn't send it. We derived it from the form.
  // The RLS policy "with check (true)" allows insert, but we need to ensure the `organisation_id` is correct.
  // If we rely on Anon client, we can't force `organisation_id` easily without exposing it in the payload.
  // So using Service Client here is SAFER to enforce the correct org ID.
  
  const { error: submissionError } = await supabase
    .from('form_submissions')
    .insert({
      form_id: form.id,
      organisation_id: form.organisation_id, // Derived from form
      data: input.data,
    })

  if (submissionError) {
    console.error('Submission Error:', submissionError)
    return { success: false, error: 'Failed to submit form' }
  }

  return { success: true }
}

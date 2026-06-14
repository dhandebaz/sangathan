import { z } from 'zod'

export const FieldTypeSchema = z.enum(['text', 'number', 'phone', 'textarea', 'dropdown'])

export const FormFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  type: FieldTypeSchema,
  required: z.boolean(),
  options: z.array(z.string()).optional(), // For dropdowns
})

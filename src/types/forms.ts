import { z } from 'zod'

export const FieldTypeSchema = z.enum([
  'text',
  'textarea',
  'phone',
  'email',
  'number',
  'rating',
  'scale',
  'radio',
  'checkbox',
  'dropdown',
  'date',
  'yes_no',
  'heading',
])

export const FormFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Label is required'),
  type: FieldTypeSchema,
  required: z.boolean().optional().default(false),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(), // For dropdown, radio, checkbox
  minLabel: z.string().optional(), // For scale (e.g. Strongly Disagree / Very Poor)
  maxLabel: z.string().optional(), // For scale (e.g. Strongly Agree / Excellent)
  maxRating: z.number().optional(), // 5 or 10
})

export interface FormField {
  id: string
  label: string
  type: FieldType
  required?: boolean
  description?: string
  placeholder?: string
  options?: string[]
  minLabel?: string
  maxLabel?: string
  maxRating?: number
}

export type FieldType = z.infer<typeof FieldTypeSchema>

export interface FormTemplate {
  id: string
  title: string
  description: string
  category: 'ngo' | 'civic_collective' | 'general'
  orgTypeLabel: string
  fields: FormField[]
}

export interface SentimentAnalysisResult {
  overallScore: number // -100 to +100
  sentiment: 'positive' | 'neutral' | 'negative' | 'critical'
  positiveCount: number
  neutralCount: number
  negativeCount: number
  urgencyCount: number
  topThemes: Array<{ theme: string; count: number; sentiment: 'positive' | 'negative' | 'neutral' }>
  goalAlignmentScore: number // 0 to 100%
  averageRating: number | null // out of 5
}

export const FormSlugSchema = z.string()
  .min(3, 'Slug must be at least 3 characters')
  .max(60, 'Slug must be at most 60 characters')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')

export interface FormRecord {
  id: string
  organisation_id: string
  title: string
  description?: string | null
  slug?: string | null
  fields: FormField[]
  is_active: boolean
  visibility: 'public' | 'members' | 'private'
  created_by?: string | null
  created_at: string
  updated_at?: string
  deleted_at?: string | null
}


'use server'

import { generateObject } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createSafeAction } from '@/lib/auth/actions'
import { nvidia, FAST_MODEL, checkAiAccess } from '@/lib/ai/nvidia'

const FormAnalysisSchema = z.object({
  formId: z.string().uuid(),
  submissionIds: z.array(z.string().uuid()).optional(),
})

export const analyzeFormSubmissions = createSafeAction(
  FormAnalysisSchema,
  async (input, context) => {
    if (!(await checkAiAccess(context.organizationId))) {
      return { error: 'AI features not available' }
    }

    const supabase = await createClient()
    const { data: form } = await supabase
      .from('forms')
      .select('title')
      .eq('id', input.formId)
      .eq('organisation_id', context.organizationId)
      .single()

    if (!form) return { error: 'Form not found' }

    let query = supabase
      .from('form_submissions')
      .select('id, data, created_at')
      .eq('form_id', input.formId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (input.submissionIds?.length) {
      query = query.in('id', input.submissionIds)
    }

    const { data: submissions } = await query
    if (!submissions?.length) return { error: 'No submissions to analyze' }

    const { object } = await generateObject({
      model: nvidia(FAST_MODEL),
      schema: z.object({
        total_analyzed: z.number(),
        trends: z.array(z.string()),
        common_patterns: z.array(z.string()),
        urgent_flags: z.array(z.object({
          submission_id: z.string(),
          reason: z.string(),
        })),
        suggestions: z.array(z.string()),
      }),
      prompt: `Analyze these form submissions for "${form.title}". Identify trends, common patterns, urgent flags, and provide actionable suggestions.

Submissions (ID: data):
${submissions.map(s => `${s.id}: ${JSON.stringify(s.data)}`).join('\n')}

Return structured analysis.`,
    })

    return { success: true, analysis: object, totalSubmissions: submissions.length }
  },
  { allowedRoles: ['admin', 'editor', 'executive'], actionName: 'ai_analyze_form' },
)

export const flagUrgentSubmissions = createSafeAction(
  FormAnalysisSchema,
  async (input, context) => {
    if (!(await checkAiAccess(context.organizationId))) return { error: 'AI features not available' }

    const supabase = await createClient()
    const { data: form } = await supabase
      .from('forms')
      .select('title, fields')
      .eq('id', input.formId)
      .eq('organisation_id', context.organizationId)
      .single()

    if (!form) return { error: 'Form not found' }

    let query = supabase
      .from('form_submissions')
      .select('id, data, created_at')
      .eq('form_id', input.formId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (input.submissionIds?.length) {
      query = query.in('id', input.submissionIds)
    }

    const { data: submissions } = await query
    if (!submissions?.length) return { error: 'No submissions' }

    const { object } = await generateObject({
      model: nvidia(FAST_MODEL),
      schema: z.object({
        urgent: z.array(z.object({
          submission_id: z.string(),
          severity: z.enum(['low', 'medium', 'high', 'critical']),
          reason: z.string(),
          suggested_action: z.string(),
        })),
      }),
      prompt: `Review these form submissions for "${form.title}" and flag any that need urgent attention.

Form fields: ${JSON.stringify(form.fields)}
Submissions: ${submissions.map(s => `${s.id}: ${JSON.stringify(s.data)}`).join('\n')}

Flag submissions containing distress signals, urgent requests, or high-priority issues.`,
    })

    return { success: true, urgent: object.urgent }
  },
  { allowedRoles: ['admin', 'editor', 'executive'], actionName: 'ai_flag_urgent' },
)

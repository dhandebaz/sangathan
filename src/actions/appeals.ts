'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { logAction } from '@/lib/audit/log'

const SubmitAppealSchema = z.object({
  organisationId: z.string().uuid(),
  type: z.enum(['suspension', 'restriction', 'other']),
  reason: z.string().min(20, "Please provide a detailed reason (min 20 chars)."),
  contactEmail: z.string().email(),
  evidenceLink: z.string().url().optional(),
})

// This is a PUBLIC action (no auth required context) because suspended users might be locked out
// BUT we verify they own the org if possible, or we treat it as an unverified appeal that admins review.
// However, the prompt says "bypassing standard support channels", implies direct DB insert.
// We should use a rate-limited public endpoint or a safe action if they can still login.
// If suspended, they might not be able to access dashboard?
// Usually suspension blocks WRITEs but allows READ/LOGIN or blocks LOGIN.
// If blocks LOGIN, this needs to be public.
// Assuming they can login to a "Suspended" view.

export async function submitAppeal(input: z.infer<typeof SubmitAppealSchema>) {
  const result = SubmitAppealSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid appeal' }
  }

  const supabase = await createClient()
  
  // Verify Org Exists
  const { data: org } = await supabase.from('organisations').select('id').eq('id', result.data.organisationId).single()
  
  if (!org) {
      return { success: false, error: 'Organisation not found' }
  }

  // Insert Appeal
  const { error } = await supabase.from('appeals').insert({
    organisation_id: result.data.organisationId,
    type: result.data.type,
    reason: result.data.reason,
    status: 'pending',
    metadata: {
        contact_email: result.data.contactEmail,
        evidence_link: result.data.evidenceLink
    }
  } as never)

  if (error) {
      console.error('Appeal Error:', error)
      return { success: false, error: 'Failed to submit appeal' }
  }

  return { success: true }
}

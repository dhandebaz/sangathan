'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createServiceClient } from '@/lib/supabase/service'
import { generateStructuredCompletion } from '@/lib/ai/resilient-router'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const LogReceivingSchema = z.object({
  letterRefNumber: z.string().min(2, 'Letter Ref number required'),
  subject: z.string().min(3, 'Subject required'),
  authorityName: z.string().min(2, 'Authority name required'),
  recipientOfficial: z.string().optional(),
  submissionDate: z.string().default(() => new Date().toISOString().split('T')[0]),
  receivingPhotoUrl: z.string().optional(),
  receivingNumber: z.string().optional(),
  statutoryDeadlineDays: z.number().min(1).default(30),
  notes: z.string().optional(),
})

export const logPhysicalReceivingAction = createSafeAction(
  LogReceivingSchema,
  async (input, context) => {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('civic_receiving_trackers')
      .insert({
        organisation_id: context.organizationId,
        created_by: context.user.id,
        letter_ref_number: input.letterRefNumber,
        subject: input.subject,
        authority_name: input.authorityName,
        recipient_official: input.recipientOfficial || null,
        submission_date: input.submissionDate,
        receiving_photo_url: input.receivingPhotoUrl || null,
        receiving_number: input.receivingNumber || null,
        statutory_deadline_days: input.statutoryDeadlineDays,
        notes: input.notes || null,
        escalation_status: 'pending_response',
      })
      .select()
      .maybeSingle()

    if (error) {
      console.error('Failed to log physical receiving:', error)
      return { error: 'Database insert failed: ' + error.message }
    }

    await context.logAction({
      action: 'LOG_PHYSICAL_RECEIVING',
      resourceTable: 'civic_receiving_trackers',
      resourceId: data.id,
      details: { ref: input.letterRefNumber, authority: input.authorityName },
    })

    revalidatePath('/', 'layout')
    return { success: true, data }
  },
  {
    actionName: 'log_physical_receiving',
  }
)

export async function getReceivingTrackersAction(orgId: string) {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('civic_receiving_trackers')
      .select('*')
      .eq('organisation_id', orgId)
      .order('submission_date', { ascending: false })

    if (error) throw error

    const now = new Date().getTime()
    const enriched = (data || []).map((rec) => {
      const subTime = new Date(rec.submission_date).getTime()
      const elapsedDays = Math.floor((now - subTime) / (1000 * 60 * 60 * 24))
      const remainingDays = rec.statutory_deadline_days - elapsedDays
      const isOverdue = remainingDays <= 0 && rec.escalation_status === 'pending_response'

      return {
        ...rec,
        elapsedDays,
        remainingDays,
        isOverdue,
      }
    })

    return { success: true, data: enriched }
  } catch (error) {
    console.error('Error fetching receiving trackers:', error)
    return { success: false, error: 'Failed to fetch receiving trackers', data: [] }
  }
}

const rtiApplicationSchema = z.object({
  rtiSubject: z.string(),
  publicInformationOfficer: z.string(),
  feeDetails: z.string(),
  applicantPreamble: z.string(),
  specificInformationRequested: z.array(z.string()),
  groundsForInspection: z.string(),
  statutoryAppealNotice: z.string(),
  applicationBodyFormatted: z.string(),
})

export type RTIApplicationResult = z.infer<typeof rtiApplicationSchema>

export async function generateRtiEscalationAction(
  trackerId: string,
  applicantName: string,
  applicantAddress: string,
  applicantPhone: string
) {
  try {
    const supabase = createServiceClient()

    const { data: tracker, error: trackerErr } = await supabase
      .from('civic_receiving_trackers')
      .select('*')
      .eq('id', trackerId)
      .maybeSingle()

    if (trackerErr || !tracker) {
      return { success: false, error: 'Receiving tracker not found' }
    }

    const prompt = `You are a Right to Information (RTI) legal expert in India specializing in Section 6(1) and Section 7(1) of the RTI Act, 2005 for municipal and civic accountability.

Representation Details:
- Original Letter Ref: ${tracker.letter_ref_number}
- Submission Date: ${tracker.submission_date}
- Receiving Stamped Number: ${tracker.receiving_number || 'Official Stamped Diary Entry'}
- Addressed To Authority: ${tracker.authority_name}
- Official Concerned: ${tracker.recipient_official || 'Public Information Officer (PIO)'}
- Subject / Issue: ${tracker.subject}
- Applicant: ${applicantName}, Address: ${applicantAddress}, Phone: ${applicantPhone}

Since the representation above is still pending a written status update, draft a formal RTI Application under Section 6(1) of the RTI Act, 2005 asking only for recorded information (file status, notings, timelines). Remember the PIO must reply within 30 days under Section 7(1). Do not promise penalties or guaranteed action.

Queries to format:
1. Daily progress report and file notings on representation ${tracker.letter_ref_number}.
2. Names, designations, and employee codes of all officers/engineers through whose desk the file moved.
3. Statutory time-limit as per Citizens' Charter for this grievance and reasons recorded in writing for the delay.
4. Certified copies of all work orders, tender allocations, or contractor penalties issued regarding this site.
5. Date and time for certified physical file inspection under Section 2(j)(i) of the RTI Act.

Return ONLY valid JSON matching the schema.`

    const result = await generateStructuredCompletion(
      {
        prompt,
        temperature: 0.15,
        maxTokens: 2500,
      },
      rtiApplicationSchema
    )

    const rtiRef = `RTI/${new Date().getFullYear()}/${tracker.letter_ref_number.replace(/[^A-Za-z0-9]/g, '')}`

    await supabase
      .from('civic_receiving_trackers')
      .update({
        escalation_status: 'rti_filed',
        rti_ref_number: rtiRef,
        rti_filed_date: new Date().toISOString().split('T')[0],
      })
      .eq('id', trackerId)

    return {
      success: true,
      data: {
        ...result.object,
        rtiRef,
      },
    }
  } catch (error) {
    console.error('Error generating RTI escalation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate RTI application',
    }
  }
}

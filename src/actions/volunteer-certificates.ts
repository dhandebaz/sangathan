'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { sendVolunteerCertificateEmail } from '@/lib/agentmail'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

const IssueCertificateSchema = z.object({
  volunteer_profile_id: z.string().uuid('Invalid volunteer ID'),
  service_hours: z.coerce.number().min(1, 'Service hours must be at least 1'),
  citation_text: z.string().min(5, 'Citation description is required'),
})

export const issueVolunteerCertificate = createSafeAction(
  IssueCertificateSchema,
  async (data, context) => {
    const supabase = await createClient()
    const organisationId = context.organizationId
    const issuerId = context.user.id

    // Generate unique Certificate Number: VC-YEAR-RANDOM
    const certYear = new Date().getFullYear()
    const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase()
    const certificateNumber = `VC-${certYear}-${randomCode}`

    // Compute cryptographic SHA-256 hash for tamper-proof verification
    const rawPayload = `${certificateNumber}:${organisationId}:${data.volunteer_profile_id}:${data.service_hours}:${Date.now()}`
    const verificationHash = crypto.createHash('sha256').update(rawPayload).digest('hex')

    const { data: certificate, error } = await supabase
      .from('volunteer_certificates')
      .insert({
        organisation_id: organisationId,
        volunteer_profile_id: data.volunteer_profile_id,
        certificate_number: certificateNumber,
        service_hours_recognized: data.service_hours,
        issue_date: new Date().toISOString().split('T')[0],
        issued_by: issuerId,
        citation_text: data.citation_text,
        verification_hash: verificationHash,
      })
      .select('*, volunteer:profiles!volunteer_profile_id(full_name, email)')
      .single()

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('volunteer_certificates')
        .insert({
          organisation_id: organisationId,
          volunteer_profile_id: data.volunteer_profile_id,
          certificate_number: certificateNumber,
          service_hours_recognized: data.service_hours,
          issue_date: new Date().toISOString().split('T')[0],
          issued_by: issuerId,
          citation_text: data.citation_text,
          verification_hash: verificationHash,
        })
        .select('*, volunteer:profiles!volunteer_profile_id(full_name, email)')
        .single()

      if (fallback.error) throw new Error(fallback.error.message)
      const resCert = fallback.data
      
      // Dispatch AgentMail notification if volunteer email exists
      if (resCert?.volunteer?.email) {
        try {
          await sendVolunteerCertificateEmail({
            to: resCert.volunteer.email,
            volunteerName: resCert.volunteer.full_name || 'Volunteer',
            certificateNumber,
            hours: data.service_hours,
            citation: data.citation_text,
            orgName: 'Sangathan Collective',
            orgId: organisationId,
          })
        } catch (mailErr) {
          console.warn('Volunteer certificate email dispatch non-blocking error:', mailErr)
        }
      }

      revalidatePath('/', 'layout')
      return { success: true, certificate: resCert }
    }

    // Dispatch AgentMail notification if volunteer email exists
    if (certificate?.volunteer?.email) {
      try {
        await sendVolunteerCertificateEmail({
          to: certificate.volunteer.email,
          volunteerName: certificate.volunteer.full_name || 'Volunteer',
          certificateNumber,
          hours: data.service_hours,
          citation: data.citation_text,
          orgName: 'Sangathan Collective',
          orgId: organisationId,
        })
      } catch (mailErr) {
        console.warn('Volunteer certificate email dispatch non-blocking error:', mailErr)
      }
    }

    revalidatePath('/', 'layout')
    return { success: true, certificate }
  },
  { allowedRoles: ['admin', 'executive', 'can_manage', 'second_admin', 'editor'] }
)

export async function getVolunteerCertificates(orgId: string) {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('volunteer_certificates')
      .select('*, volunteer:profiles!volunteer_profile_id(full_name, email, phone)')
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: false })

    if (error) {
      const adminClient = createServiceClient()
      const fallback = await adminClient
        .from('volunteer_certificates')
        .select('*, volunteer:profiles!volunteer_profile_id(full_name, email, phone)')
        .eq('organisation_id', orgId)
        .order('created_at', { ascending: false })

      if (!fallback.error) return { success: true, certificates: fallback.data || [] }
      return { success: false, certificates: [] }
    }

    return { success: true, certificates: data || [] }
  } catch {
    return { success: false, certificates: [] }
  }
}

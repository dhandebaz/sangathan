'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createServiceClient } from '@/lib/supabase/service'
import { generateStructuredCompletion } from '@/lib/ai/resilient-router'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export type SensorReadings = {
  pm2_5?: number
  pm10?: number
  aqi_category?: string
  tds_ppm?: number
  ph_level?: number
  noise_db?: number
  temperature_c?: number
}

const LogFieldAuditSchema = z.object({
  auditType: z.enum([
    'air_quality',
    'water_quality',
    'waste_burning',
    'industrial_emissions',
    'construction_dust',
    'tree_felling',
    'civic_infrastructure',
  ]),
  locationName: z.string().min(2, 'Location is required'),
  landmark: z.string().optional(),
  wardNo: z.string().optional(),
  district: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  sensorReadings: z.object({
    pm2_5: z.number().optional(),
    pm10: z.number().optional(),
    aqi_category: z.string().optional(),
    tds_ppm: z.number().optional(),
    ph_level: z.number().optional(),
    noise_db: z.number().optional(),
    temperature_c: z.number().optional(),
  }).optional(),
  sourceIdentified: z.string().optional(),
  severity: z.enum(['moderate', 'high', 'severe', 'hazardous']).default('high'),
  photoUrls: z.array(z.string()).default([]),
  remarks: z.string().optional(),
})

export const logFieldSpotAuditAction = createSafeAction(
  LogFieldAuditSchema,
  async (input, context) => {
    const supabase = createServiceClient()

    // Determine default auditor name from user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', context.user.id)
      .single()

    const auditorName = profile?.full_name || 'Field Researcher / Citizen Auditor'

    const { data, error } = await supabase
      .from('field_spot_audits')
      .insert({
        organisation_id: context.organizationId,
        auditor_id: context.user.id,
        auditor_name: auditorName,
        audit_type: input.auditType,
        location_name: input.locationName,
        landmark: input.landmark || null,
        ward_no: input.wardNo || null,
        district: input.district || null,
        latitude: input.latitude || null,
        longitude: input.longitude || null,
        sensor_readings: input.sensorReadings || {},
        source_identified: input.sourceIdentified || null,
        severity: input.severity,
        photo_urls: input.photoUrls,
        remarks: input.remarks || null,
        status: 'logged',
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to log field audit:', error)
      return { error: 'Database insert failed: ' + error.message }
    }

    await context.logAction({
      action: 'LOG_FIELD_SPOT_AUDIT',
      resourceTable: 'field_spot_audits',
      resourceId: data.id,
      details: { location: input.locationName, type: input.auditType, severity: input.severity },
    })

    revalidatePath('/[lang]/dashboard/field-audits', 'page')
    return { success: true, data }
  },
  {
    actionName: 'log_field_spot_audit',
  }
)

const statutoryNoticeSchema = z.object({
  noticeTitle: z.string(),
  referenceNumber: z.string(),
  recipientAuthority: z.string(),
  statutoryActsCited: z.array(z.string()),
  violationsSummary: z.string(),
  evidenceList: z.array(z.string()),
  statutoryDemands: z.array(z.string()),
  legalNoticeBody: z.string(),
  urgentActionsRequired: z.string(),
})

export type StatutoryNoticeResult = z.infer<typeof statutoryNoticeSchema>

export async function generateStatutoryNoticeAction(auditId: string, orgName: string) {
  try {
    const supabase = createServiceClient()

    const { data: audit, error: auditErr } = await supabase
      .from('field_spot_audits')
      .select('*')
      .eq('id', auditId)
      .single()

    if (auditErr || !audit) {
      return { success: false, error: 'Field audit record not found' }
    }

    const sensorSummary = JSON.stringify(audit.sensor_readings || {})
    const prompt = `You are a senior environmental advocate and administrative law expert in India specializing in the Air (Prevention & Control of Pollution) Act 1981, Water Act 1974, Environment Protection Act 1986, CAQM GRAP directives, and NGT compliance orders.

Collective Information:
- Organization Name: ${orgName} (Citizen Science & Environmental Defense Collective)
- Audit Violation Type: ${audit.audit_type}
- Location: ${audit.location_name}, Landmark: ${audit.landmark || 'N/A'}, Ward: ${audit.ward_no || 'N/A'}, District: ${audit.district || 'N/A'}
- Severity: ${audit.severity}
- Suspected Source / Polluter: ${audit.source_identified || 'Multiple unmitigated local sources'}
- Sensor / Test Readings: ${sensorSummary}
- Field Remarks: ${audit.remarks || 'Documented during citizen ground inspection'}

Draft a highly formal, legally structured Statutory Violation Representation and Urgent Cease & Desist Notice addressed to the relevant regulatory authority (e.g., Member Secretary - DPCC / CPCB / CAQM Task Force / Zonal Deputy Commissioner - MCD / SDM).

Requirements:
1. Cite precise statutory provisions (e.g., Section 21/31A of Air Act 1981, CAQM GRAP Stage IV guidelines, NGT order on open burning fines).
2. Clearly formulate the recipient block.
3. List factual field evidence with quantitative readings.
4. Issue actionable statutory demands with a strict 48-hour to 7-day inspection and ATR (Action Taken Report) deadline.
5. Provide a reference number prefix (e.g. DS/ENV/2026/XXX).

Return ONLY valid JSON matching the schema.`

    const result = await generateStructuredCompletion(
      {
        prompt,
        temperature: 0.15,
        maxTokens: 2500,
      },
      statutoryNoticeSchema
    )

    // Update the audit record with notice ref
    await supabase
      .from('field_spot_audits')
      .update({
        statutory_notice_ref: result.object.referenceNumber,
        status: 'notice_dispatched',
      })
      .eq('id', auditId)

    return {
      success: true,
      data: result.object,
    }
  } catch (error) {
    console.error('Error generating statutory notice:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate statutory notice',
    }
  }
}

const healthBulletinSchema = z.object({
  headlineEn: z.string(),
  headlineHi: z.string(),
  locationTag: z.string(),
  measuredMetric: z.string(),
  healthRiskLevel: z.enum(['Moderate', 'Poor', 'Very Poor', 'Severe', 'Hazardous']),
  advisoryTextEn: z.string(),
  advisoryTextHi: z.string(),
  legalActionStatus: z.string(),
  whatsappFormattedText: z.string(),
})

export type HealthBulletinResult = z.infer<typeof healthBulletinSchema>

export async function generatePublicHealthBulletinAction(auditId: string, orgName: string) {
  try {
    const supabase = createServiceClient()

    const { data: audit, error: auditErr } = await supabase
      .from('field_spot_audits')
      .select('*')
      .eq('id', auditId)
      .single()

    if (auditErr || !audit) {
      return { success: false, error: 'Field audit record not found' }
    }

    const sensorSummary = JSON.stringify(audit.sensor_readings || {})
    const prompt = `You are a public health and environmental communication specialist for an Indian civic collective (${orgName}).

Field Inspection Data:
- Location: ${audit.location_name} (${audit.district || 'Delhi NCR'})
- Audit Type: ${audit.audit_type}
- Severity: ${audit.severity}
- Readings: ${sensorSummary}
- Suspected Source: ${audit.source_identified || 'Local hotspot'}

Generate a crisp, high-impact bilingual public health bulletin and ready-to-forward WhatsApp advisory for morning walkers, school children, elderly residents, and local communities.

Requirements:
1. Provide punchy English and Hindi headlines.
2. Formulate clear, medically sound precautionary advice.
3. Include statutory action reference.
4. Format whatsappFormattedText cleanly with emojis (*bold*, bullet points, warning sirens) ready to 1-tap copy and send.

Return ONLY valid JSON matching the schema.`

    const result = await generateStructuredCompletion(
      {
        prompt,
        temperature: 0.2,
        maxTokens: 1800,
      },
      healthBulletinSchema
    )

    await supabase
      .from('field_spot_audits')
      .update({ public_bulletin_shared: true })
      .eq('id', auditId)

    return {
      success: true,
      data: result.object,
    }
  } catch (error) {
    console.error('Error generating health bulletin:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate health bulletin',
    }
  }
}

export async function getFieldSpotAuditsAction(orgId: string) {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('field_spot_audits')
      .select('*')
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching field spot audits:', error)
    return { success: false, error: 'Failed to fetch field spot audits', data: [] }
  }
}

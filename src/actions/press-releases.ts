'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createServiceClient } from '@/lib/supabase/service'
import { generateStructuredCompletion } from '@/lib/ai/resilient-router'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const DraftPressReleaseSchema = z.object({
  topic: z.string().min(5, 'Topic / Context required'),
  orgName: z.string().min(2),
  locationHeader: z.string().default('NEW DELHI'),
  embargoType: z.enum(['immediate', 'timed']).default('immediate'),
  embargoDatetime: z.string().optional(),
  keyDemands: z.array(z.string()).default([]),
  spokespersonName: z.string().min(2, 'Spokesperson name required'),
  spokespersonPhone: z.string().min(8, 'Phone number required'),
  spokespersonDesignation: z.string().min(2, 'Designation required'),
})

const aiPressReleaseSchema = z.object({
  titleEn: z.string(),
  titleHi: z.string(),
  locationHeader: z.string(),
  bodyEn: z.string(),
  bodyHi: z.string(),
  spokespersonQuoteEn: z.string(),
  spokespersonQuoteHi: z.string(),
  editorNotes: z.string(),
  whatsappBroadcastText: z.string(),
})

export type AIPressReleaseResult = z.infer<typeof aiPressReleaseSchema>

export async function generateAIPressRelease(input: z.infer<typeof DraftPressReleaseSchema>) {
  try {
    const prompt = `You are a chief media officer and communications strategist for Indian civic movements, grassroots collectives, and environmental defense groups.

Draft a highly professional, bilingual (English and Hindi) Press Release based on:
- Organization Name: ${input.orgName}
- Location: ${input.locationHeader}
- Embargo: ${input.embargoType === 'immediate' ? 'FOR IMMEDIATE RELEASE' : `EMBARGOED UNTIL ${input.embargoDatetime}`}
- Topic / Key Development: "${input.topic}"
- Key Demands: ${input.keyDemands.length > 0 ? input.keyDemands.join(', ') : 'Urgent accountability and systemic reform'}
- Spokesperson: ${input.spokespersonName} (${input.spokespersonDesignation}, ${input.spokespersonPhone})

Requirements:
1. Standard journalistic inverted pyramid style (Who, What, When, Where, Why in opening paragraph).
2. Punchy, newsworthy headlines in English and Hindi.
3. Authentic, authoritative quotes from the spokesperson in both languages.
4. Clean bulleted list of demands.
5. "Notes to Editors" section summarizing the collective's background.
6. WhatsApp broadcast copy with clean emojis and bold formatting ready to drop into media press reporter WhatsApp groups.

Return ONLY valid JSON matching the schema.`

    const result = await generateStructuredCompletion(
      {
        prompt,
        temperature: 0.2,
        maxTokens: 2800,
      },
      aiPressReleaseSchema
    )

    return { success: true, data: result.object }
  } catch (error) {
    console.error('Failed to generate AI press release:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate press release',
    }
  }
}

const SavePressReleaseSchema = z.object({
  titleEn: z.string().min(3),
  titleHi: z.string().optional(),
  locationHeader: z.string().default('NEW DELHI'),
  embargoType: z.enum(['immediate', 'timed']).default('immediate'),
  embargoDatetime: z.string().optional(),
  bodyEn: z.string().min(10),
  bodyHi: z.string().optional(),
  spokespersonName: z.string().min(2),
  spokespersonPhone: z.string().min(8),
  spokespersonDesignation: z.string().min(2),
  isPublished: z.boolean().default(false),
})

export const savePressReleaseAction = createSafeAction(
  SavePressReleaseSchema,
  async (input, context) => {
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('press_releases')
      .insert({
        organisation_id: context.organizationId,
        created_by: context.user.id,
        title_en: input.titleEn,
        title_hi: input.titleHi || null,
        location_header: input.locationHeader,
        embargo_type: input.embargoType,
        embargo_datetime: input.embargoDatetime ? new Date(input.embargoDatetime).toISOString() : null,
        body_en: input.bodyEn,
        body_hi: input.bodyHi || null,
        spokesperson_name: input.spokespersonName,
        spokesperson_phone: input.spokespersonPhone,
        spokesperson_designation: input.spokespersonDesignation,
        is_published: input.isPublished,
        published_at: input.isPublished ? new Date().toISOString() : null,
      })
      .select()
      .maybeSingle()

    if (error) {
      console.error('Failed to save press release:', error)
      return { error: 'Database insert failed: ' + error.message }
    }

    await context.logAction({
      action: 'SAVE_PRESS_RELEASE',
      resourceTable: 'press_releases',
      resourceId: data.id,
      details: { title: input.titleEn, published: input.isPublished },
    })

    revalidatePath('/[lang]/dashboard/press-releases', 'page')
    return { success: true, data }
  },
  {
    actionName: 'save_press_release',
  }
)

export async function getPressReleasesAction(orgId: string) {
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('press_releases')
      .select('*')
      .eq('organisation_id', orgId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data: data || [] }
  } catch (error) {
    console.error('Error fetching press releases:', error)
    return { success: false, error: 'Failed to fetch press releases', data: [] }
  }
}

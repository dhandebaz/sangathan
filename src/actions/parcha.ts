'use server'

import { generateStructuredCompletion } from '@/lib/ai/resilient-router'
import { z } from 'zod'

const ParchaInputSchema = z.object({
  orgName: z.string().min(2),
  localityName: z.string().min(2),
  issueTitle: z.string().min(3),
  issueContext: z.string().min(5),
  demands: z.array(z.string()).min(1),
  spokespersonContact: z.string().min(5),
  rallyOrMeetingInfo: z.string().optional(),
})

const parchaOutputSchema = z.object({
  mainBannerHeadingHi: z.string(),
  mainBannerHeadingEn: z.string(),
  taglineHi: z.string(),
  taglineEn: z.string(),
  problemStatementHi: z.string(),
  problemStatementEn: z.string(),
  bulletedDemandsHi: z.array(z.string()),
  bulletedDemandsEn: z.array(z.string()),
  callToActionHi: z.string(),
  callToActionEn: z.string(),
  slogans: z.array(z.string()),
  signatureSheetPreambleHi: z.string(),
  signatureSheetPreambleEn: z.string(),
  whatsappDistributionText: z.string(),
})

export type ParchaOutputResult = z.infer<typeof parchaOutputSchema>

export async function generateParchaAndSignatureSheetAction(input: z.infer<typeof ParchaInputSchema>) {
  try {
    const prompt = `You are a veteran grassroots organizer and mass mobilization writer for Indian colony collectives, basti unions, and civic action groups.

Generate high-impact content for a 1-page A4 physical printable pamphlet (आंदोलन पर्चा) and physical signature sheet (हस्ताक्षर अभियान पत्र) formatted for low-cost black & white photocopying/photostat.

Input details:
- Collective Name: ${input.orgName}
- Locality / Colony / Ward: ${input.localityName}
- Civic Issue: ${input.issueTitle}
- Context & Grievance: ${input.issueContext}
- Core Demands: ${input.demands.join('; ')}
- Meeting / Gathering details: ${input.rallyOrMeetingInfo || 'Colony General Meeting this Sunday'}
- Contact: ${input.spokespersonContact}

Requirements:
1. Slogans & Headings must be punchy, relatable, and direct in Hindi (Devanagari) and English.
2. Problem statement must plainly explain why this civic breakdown hurts daily life (women safety, children health, foul water, open garbage, road accidents).
3. Clear numbered demands.
4. Signature sheet preamble must be legally sound (e.g. "हम वार्ड / कॉलोनी के समस्त निवासीगण नगर निगम एवं प्रशासन से मांग करते हैं...").
5. WhatsApp distribution text ready to forward in colony groups.

Return ONLY valid JSON matching the schema.`

    const result = await generateStructuredCompletion(
      {
        prompt,
        temperature: 0.25,
        maxTokens: 2500,
      },
      parchaOutputSchema
    )

    return {
      success: true,
      data: result.object,
    }
  } catch (error) {
    console.error('Failed to generate Parcha and Signature Sheet:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate printable parcha',
    }
  }
}

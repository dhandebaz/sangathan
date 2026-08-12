'use server'

import { generateStructuredCompletion } from '@/lib/ai/resilient-router'
import { z } from 'zod'

const templateSchema = z.object({
  title: z.string(),
  titleHi: z.string(),
  category: z.enum(['elected_representative', 'municipal_civic', 'utility', 'police', 'revenue', 'bqf_official', 'labour_rights', 'student_campus']),
  description: z.string(),
  recipient: z.string(),
  subject: z.string(),
  body: z.string(),
  signatory1: z.string(),
  signatory2: z.string(),
  refPrefix: z.string(),
})

export type GeneratedTemplateResult = z.infer<typeof templateSchema>

export async function generateLegalGovernmentTemplate(prompt: string, orgName: string, orgType?: string) {
  try {
    const aiPrompt = `You are a senior Indian administrative law and civic affairs expert specializing in drafting official government representations, petitions, and complaints for civic collectives, NGOs, RWAs, and unions in India.

The user wants an official representation template based on this request:
"${prompt}"

Organization context:
- Organization Name: ${orgName}
- Organization Type: ${orgType || 'Civic Collective'}

Draft a highly professional, legally structured, and formal Indian government representation letter.

Requirements:
1. Category must be one of: 'elected_representative', 'municipal_civic', 'utility', 'police', 'revenue', 'bqf_official', 'labour_rights', 'student_campus'
2. Format the recipient block cleanly with official titles (e.g. To, The Sub-Divisional Magistrate / SHO / Municipal Commissioner / Executive Engineer).
3. Subject line must be formal, uppercase, concise, and clear.
4. Body must include:
   - Respectful salutation
   - Clear statement of problem with bullet points
   - Specific statutory/policy references where relevant (e.g. Delhi Municipal Corporation Act, Motor Vehicles Act, RTI Act 2005, Factories Act, etc.)
   - Clear list of actionable demands ((a), (b), (c))
   - Respectful closing
5. Provide signatories (e.g., President / General Secretary or Convener / Secretary).
6. Provide a clean reference prefix (e.g. BQF/CIVIC, NGO/GOV, RWA/LEG).

Return ONLY valid JSON matching the required schema. Do not include markdown fences.`

    const result = await generateStructuredCompletion(
      {
        prompt: aiPrompt,
        temperature: 0.2,
        maxTokens: 2500,
      },
      templateSchema
    )

    return { success: true, template: result.object }
  } catch (error) {
    console.error('Error generating legal government template:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate template',
    }
  }
}

import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'
import { checkCapability } from '@/lib/capabilities'

export async function triageTicketContent(content: string, orgId: string) {
  try {
    const hasAiFeatures = await checkCapability(orgId, 'ai_features')

    // Non-AI Fallback if AI features are disabled or no key is provided
    if (!hasAiFeatures || !process.env.OPENAI_API_KEY) {
      return runKeywordFallback(content)
    }

    const { object } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        severity: z.enum(['low', 'medium', 'high', 'critical']),
        tags: z.array(z.string()).max(3),
        summary: z.string().describe('A 10-word summary of the core issue'),
      }),
      prompt: `Analyze the following incoming complaint/grievance for an organization. 
      Determine its severity, assign 1-3 relevant tags, and summarize it in under 10 words.
      
      Content: "${content}"`,
    })

    return object
  } catch (error) {
    console.error('AI Triage Error:', error)
    return runKeywordFallback(content)
  }
}

function runKeywordFallback(content: string) {
  const lowerContent = content.toLowerCase()
  let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  const tags: string[] = ['untriaged']

  // Simple keyword matching for severity
  if (/(harassment|danger|police|urgent|immediate|blood|violence|death|emergency)/.test(lowerContent)) {
    severity = 'critical'
    tags.push('urgent')
  } else if (/(broken|leak|repair|outage|down|fix|not working)/.test(lowerContent)) {
    tags.push('maintenance_issue')
  } else if (/(slow|delay|wait|feedback|suggestion)/.test(lowerContent)) {
    severity = 'low'
  }

  // Deduplicate and trim tags
  const uniqueTags = Array.from(new Set(tags.filter(t => t !== 'untriaged' || tags.length === 1))).slice(0, 3)

  return {
    severity,
    tags: uniqueTags,
    summary: content.slice(0, 50) + (content.length > 50 ? '...' : '')
  }
}

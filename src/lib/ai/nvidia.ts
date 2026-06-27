import { createOpenAI } from '@ai-sdk/openai'
import { createServiceClient } from '@/lib/supabase/service'

const BASE_URL = process.env.NVIDIA_API_BASE || 'https://integrate.api.nvidia.com/v1'
const API_KEY = process.env.NVIDIA_API_KEY

export const nvidia = createOpenAI({
  baseURL: BASE_URL,
  apiKey: API_KEY,
})

export const FAST_MODEL = 'meta/llama-3.1-8b-instruct'
export const SMART_MODEL = 'meta/llama-3.3-70b-instruct'

export function isAiConfigured() {
  return !!API_KEY
}

export async function checkAiAccess(orgId: string): Promise<boolean> {
  if (!API_KEY) return false

  let supabase
  try {
    supabase = createServiceClient()
  } catch {
    return false
  }

  const { data } = await supabase
    .from('organisations')
    .select('plan_name, capabilities')
    .eq('id', orgId)
    .single()

  if (!data) return false
  if (data.plan_name !== 'Institution') return false

  const capabilities = data.capabilities as Record<string, boolean> | null
  return capabilities?.ai_features === true
}

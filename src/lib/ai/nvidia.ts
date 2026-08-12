import { createOpenAI } from '@ai-sdk/openai'
import { createServiceClient } from '@/lib/supabase/service'
import { isResilientAiConfigured } from '@/lib/ai/resilient-router'

const BASE_URL = process.env.NVIDIA_API_BASE || 'https://integrate.api.nvidia.com/v1'
const API_KEY = process.env.NVIDIA_API_KEY

export const nvidia = createOpenAI({
  baseURL: BASE_URL,
  apiKey: API_KEY,
})

export const FAST_MODEL = 'meta/llama-3.1-8b-instruct'
export const SMART_MODEL = 'meta/llama-3.3-70b-instruct'

export function isAiConfigured() {
  return isResilientAiConfigured()
}

/**
 * Enforces organization-level AI access and master AI switch state.
 * Returns false if:
 * 1. AI providers are not configured
 * 2. Organization has master AI Assistance toggled OFF (ai_assistance_enabled === false)
 * 3. Organization plan does not include AI capabilities
 */
export async function checkAiAccess(orgId: string): Promise<boolean> {
  if (!isAiConfigured()) return false

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

  const capabilities = (data.capabilities as Record<string, unknown>) || {}

  // Master switch check: if explicit false, AI is disabled at the backend level
  if (capabilities.ai_assistance_enabled === false) {
    return false
  }

  // Plan level check: Sustainer / Institution tier has ai_features enabled
  const planName = data.plan_name || 'Community'
  const isSustainer = planName === 'Institution' || planName === 'Sustainer'
  const hasAiCapability = capabilities.ai_features === true || isSustainer

  return hasAiCapability
}

/**
 * Returns detailed AI configuration state for UI rendering and settings.
 */
export async function getAiAssistanceState(orgId: string): Promise<{
  isAssistanceEnabled: boolean
  isPlanSupported: boolean
  isConfigured: boolean
}> {
  const isConfigured = isAiConfigured()
  if (!isConfigured) {
    return { isAssistanceEnabled: false, isPlanSupported: false, isConfigured: false }
  }

  try {
    const supabase = createServiceClient()
    const { data } = await supabase
      .from('organisations')
      .select('plan_name, capabilities')
      .eq('id', orgId)
      .single()

    if (!data) return { isAssistanceEnabled: false, isPlanSupported: false, isConfigured }

    const capabilities = (data.capabilities as Record<string, unknown>) || {}
    const isSustainer = data.plan_name === 'Institution' || data.plan_name === 'Sustainer'
    const isPlanSupported = capabilities.ai_features === true || isSustainer
    const isAssistanceEnabled = capabilities.ai_assistance_enabled !== false && isPlanSupported

    return {
      isAssistanceEnabled,
      isPlanSupported,
      isConfigured,
    }
  } catch {
    return { isAssistanceEnabled: false, isPlanSupported: false, isConfigured }
  }
}

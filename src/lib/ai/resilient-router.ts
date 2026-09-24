import 'server-only'

import { z } from 'zod'
import { redis } from '@/lib/redis'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

type Provider = {
  name: string
  apiKey: string | undefined
  endpoint: string
  model: string
}

export type ResilientCompletionOptions = {
  messages: ChatMessage[]
  temperature?: number
  maxTokens?: number
  /**
   * Optional per-org budget key (e.g. the organisation id) used to cap
   * shared AI spend. When provided, calls are tallied in Redis and refused
   * once the daily limit is hit, so one heavy org cannot burn shared keys.
   */
  budgetKey?: string
}

export type ResilientCompletion = {
  text: string
  providerUsed: string
  latencyMs: number
}

const REQUEST_TIMEOUT_MS = 25_000
const DAILY_CALL_LIMIT = Number(process.env.AI_DAILY_CALL_LIMIT) || 200

const providers: Provider[] = [
  {
    name: 'Groq',
    apiKey: process.env.GROQ_API_KEY,
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.3-70b-versatile',
  },
  {
    name: 'Cerebras',
    apiKey: process.env.CEREBRAS_API_KEY,
    endpoint: 'https://api.cerebras.ai/v1/chat/completions',
    model: 'llama-3.3-70b',
  },
  {
    name: 'SambaNova',
    apiKey: process.env.SAMBANOVA_API_KEY,
    endpoint: 'https://api.sambanova.ai/v1/chat/completions',
    model: 'Meta-Llama-3.3-70B-Instruct',
  },
  {
    name: 'OpenRouter',
    apiKey: process.env.OPENROUTER_API_KEY,
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
  },
  {
    name: 'NVIDIA NIM',
    apiKey: process.env.NVIDIA_API_KEY,
    endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
    model: 'meta/llama-3.3-70b-instruct',
  },
  {
    name: 'Google Gemini',
    apiKey: process.env.GEMINI_API_KEY,
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    model: 'gemini-2.5-flash',
  },
]

export function isResilientAiConfigured(): boolean {
  return providers.some((provider) => Boolean(provider.apiKey))
}

/**
 * Sends an OpenAI-compatible completion request through the configured provider
 * chain. A failed provider is never retried in the same request.
 */
export async function generateResilientCompletion(
  options: ResilientCompletionOptions,
): Promise<ResilientCompletion> {
  const configuredProviders = providers.filter((provider) => provider.apiKey)

  if (configuredProviders.length === 0) {
    throw new Error('No AI provider is configured')
  }

  // Enforce per-key daily budget before spending shared provider credits.
  if (options.budgetKey) {
    const budgetKey = `ai_budget:${options.budgetKey}`
    const dayKey = `ai_budget_day:${options.budgetKey}`
    const today = new Date().toISOString().slice(0, 10)
    try {
      const [count, trackedDay] = await Promise.all([
        redis.incr(budgetKey),
        redis.get(dayKey),
      ])
      if (trackedDay !== today) {
        await redis.set(dayKey, today, { ex: 60 * 60 * 24 })
        await redis.set(budgetKey, 1, { ex: 60 * 60 * 24 })
      }
      if (count > DAILY_CALL_LIMIT) {
        throw new Error('Daily AI usage limit reached for this organisation')
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Daily AI usage limit reached for this organisation') {
        throw error
      }
      // If Redis is unavailable, fail open (budget tracking is best-effort)
    }
  }

  const failures: string[] = []

  for (const provider of configuredProviders) {
    const startedAt = Date.now()
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: provider.model,
          messages: options.messages,
          temperature: options.temperature ?? 0.3,
          max_tokens: options.maxTokens ?? 2_048,
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        failures.push(`${provider.name}: HTTP ${response.status}`)
        console.warn('[ai] Provider unavailable; switching provider', {
          provider: provider.name,
          status: response.status,
        })
        continue
      }

      const body = await response.json() as { choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }> }
      const content = body.choices?.[0]?.message?.content
      const text = typeof content === 'string'
        ? content.trim()
        : Array.isArray(content)
          ? content.map((part) => part.text ?? '').join('').trim()
          : ''

      if (!text) {
        failures.push(`${provider.name}: empty completion`)
        console.warn('[ai] Provider returned an empty completion; switching provider', { provider: provider.name })
        continue
      }

      return {
        text,
        providerUsed: provider.name,
        latencyMs: Date.now() - startedAt,
      }
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'network error'
      failures.push(`${provider.name}: ${reason}`)
      console.warn('[ai] Provider request failed; switching provider', { provider: provider.name })
    } finally {
      clearTimeout(timeout)
    }
  }

  throw new Error(`All configured AI providers failed: ${failures.join('; ')}`)
}

export async function generateStructuredCompletion<T>(
  options: Omit<ResilientCompletionOptions, 'messages'> & { prompt: string },
  schema: z.ZodType<T>,
): Promise<ResilientCompletion & { object: T }> {
  const completion = await generateResilientCompletion({
    messages: [{
      role: 'user',
      content: `${options.prompt}\n\nReturn only valid JSON. Do not wrap the JSON in Markdown code fences.`,
    }],
    temperature: options.temperature ?? 0.2,
    maxTokens: options.maxTokens,
    budgetKey: options.budgetKey,
  })

  const json = completion.text
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim()

  return {
    ...completion,
    object: schema.parse(JSON.parse(json)),
  }
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const SubscriptionSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
})

export async function subscribeToPush(input: z.infer<typeof SubscriptionSchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    // Upsert subscription
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: user.id,
          endpoint: input.endpoint,
          p256dh: input.keys.p256dh,
          auth: input.keys.auth,
          updated_at: new Date().toISOString(),
        } as never,
        { onConflict: 'user_id, endpoint' },
      )

    if (error) throw error

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function sendPushNotification(userId: string, payload: { title: string, body: string, url?: string }) {
    // This requires a service like web-push
    // Placeholder for implementation
    // const subscriptions = await db.query...
    // webpush.sendNotification(...)
    console.log(`[PUSH] Sending to ${userId}:`, payload)
    return { success: true }
}

'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import webpush from 'web-push'
import { z } from 'zod'

const SubscriptionSchema = z.object({
  endpoint: z.string(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
})

interface PushPayload {
  title: string
  body: string
  url?: string
}

let vapidConfigured = false

function getWebPushClient() {
  const subject = process.env.PUSH_CONTACT_EMAIL
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY

  if (!subject || !publicKey || !privateKey) {
    throw new Error(
      'Web Push is not configured. Missing PUSH_CONTACT_EMAIL, NEXT_PUBLIC_VAPID_PUBLIC_KEY, or VAPID_PRIVATE_KEY.'
    )
  }

  if (!vapidConfigured) {
    webpush.setVapidDetails(`mailto:${subject}`, publicKey, privateKey)
    vapidConfigured = true
  }

  return webpush
}

export async function subscribeToPush(input: z.infer<typeof SubscriptionSchema>) {
  try {
    const result = SubscriptionSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid subscription' }
    }

    const data = result.data

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    // Upsert subscription
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: user.id,
          endpoint: data.endpoint,
          p256dh: data.keys.p256dh,
          auth: data.keys.auth,
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

export async function sendPushNotification(userId: string, payload: PushPayload) {
  try {
    const supabase = createServiceClient()
    const client = getWebPushClient()

    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('id, endpoint, p256dh, auth')
      .eq('user_id', userId)

    if (error) {
      throw error
    }

    if (!subscriptions || subscriptions.length === 0) {
      return { success: false, error: 'No push subscriptions found for this user' }
    }

    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      url: payload.url || '/',
    })

    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        await client.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          notificationPayload
        )

        return subscription.id
      })
    )

    const staleSubscriptionIds = results.flatMap((result, index) => {
      if (result.status !== 'rejected') {
        return []
      }

      const statusCode = (result.reason as { statusCode?: number } | undefined)?.statusCode
      return statusCode === 404 || statusCode === 410 ? [subscriptions[index].id] : []
    })

    if (staleSubscriptionIds.length > 0) {
      await supabase.from('push_subscriptions').delete().in('id', staleSubscriptionIds)
    }

    const delivered = results.filter((result) => result.status === 'fulfilled').length

    if (delivered === 0) {
      return { success: false, error: 'Push delivery failed for all subscriptions' }
    }

    return {
      success: true,
      delivered,
      removed: staleSubscriptionIds.length,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

'use server'

import { requirePlatformAdmin } from '@/lib/auth/context'
import { generateWeeklyEngineeringDigest, sendWeeklyEngineeringDigestEmail } from '@/lib/digest/weekly-engineering-digest'
import { revalidatePath } from 'next/cache'

/**
 * Server Action to manually trigger the weekly engineering & complaints digest email
 */
export async function triggerWeeklyDigestAction(customRecipient?: string) {
  try {
    await requirePlatformAdmin()

    const recipients = customRecipient ? [customRecipient] : undefined
    const result = await sendWeeklyEngineeringDigestEmail(recipients)

    revalidatePath('/admin/logs')
    revalidatePath('/admin')

    return result
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unauthorized or error generating digest'
    return { success: false, error: errorMsg }
  }
}

/**
 * Server Action to preview the weekly digest and copyable IDE prompt
 */
export async function previewWeeklyDigestAction() {
  try {
    await requirePlatformAdmin()
    const digest = await generateWeeklyEngineeringDigest(7)
    return { success: true, digest }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to generate preview'
    return { success: false, error: errorMsg }
  }
}

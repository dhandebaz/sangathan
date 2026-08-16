'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'

export async function saveGeneratedLogoAction({
  orgId,
  base64Data,
}: {
  orgId: string
  base64Data: string
}): Promise<{ success: boolean; publicUrl?: string; error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Unauthorized. Please log in.' }
    }

    const adminClient = createServiceClient()

    // Verify user is admin or executive of org
    const { data: profile } = await adminClient
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .eq('organisation_id', orgId)
      .single()

    if (!profile || !['admin', 'executive', 'owner'].includes(profile.role)) {
      return { success: false, error: 'Permission denied. Only organization executives can update the official emblem.' }
    }

    // Convert base64 data URL to Buffer
    const base64Prefix = base64Data.split(';base64,').pop()
    if (!base64Prefix) {
      return { success: false, error: 'Invalid image data.' }
    }
    const buffer = Buffer.from(base64Prefix, 'base64')

    const filePath = `${orgId}/logo_${Date.now()}.png`

    // Upload to Supabase storage
    const { error: uploadError } = await adminClient.storage
      .from('organisation_assets')
      .upload(filePath, buffer, {
        contentType: 'image/png',
        upsert: true,
      })

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` }
    }

    // Get public URL
    const { data: publicUrlData } = adminClient.storage
      .from('organisation_assets')
      .getPublicUrl(filePath)

    const publicUrl = publicUrlData.publicUrl

    // Update organisations table
    const { error: dbError } = await adminClient
      .from('organisations')
      .update({ logo_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', orgId)

    if (dbError) {
      return { success: false, error: `Database update failed: ${dbError.message}` }
    }

    revalidatePath('/[lang]/dashboard', 'layout')
    revalidatePath('/[lang]/dashboard/settings', 'page')

    return { success: true, publicUrl }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error.'
    return { success: false, error: message }
  }
}

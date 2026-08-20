'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { revalidatePublicOrgPages } from '@/lib/seo/revalidate'

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

    // Verify user belongs to org and has privilege (admin/executive/editor/owner)
    const { data: profile, error: profileErr } = await adminClient
      .from('profiles')
      .select('role, organisation_id, status')
      .eq('id', user.id)
      .eq('organisation_id', orgId)
      .maybeSingle()

    if (profileErr) {
      return { success: false, error: `Failed to verify membership: ${profileErr.message}` }
    }

    if (!profile) {
      return { success: false, error: 'Permission denied. You are not a member of this organisation.' }
    }

    const allowedRoles = ['admin', 'executive', 'editor']
    if (!allowedRoles.includes((profile as { role: string }).role)) {
      return { success: false, error: 'Permission denied. Only organization admins or editors can update the official emblem.' }
    }

    // Allow active or null status for backward compatibility
    if ((profile as { status?: string | null }).status && (profile as { status: string }).status !== 'active') {
      return { success: false, error: 'Your membership is not active. Contact an administrator.' }
    }

    // Convert base64 data URL to Buffer - robust parsing
    const base64Marker = ';base64,'
    const markerIdx = base64Data.indexOf(base64Marker)
    if (markerIdx === -1) {
      return { success: false, error: 'Invalid image data. Missing base64 marker.' }
    }
    const base64Prefix = base64Data.slice(markerIdx + base64Marker.length)
    if (!base64Prefix || base64Prefix.length < 100) {
      return { success: false, error: 'Invalid image data. Image appears empty or corrupted.' }
    }
    let buffer: Buffer
    try {
      buffer = Buffer.from(base64Prefix, 'base64')
    } catch {
      return { success: false, error: 'Failed to decode image data.' }
    }
    if (buffer.length === 0) {
      return { success: false, error: 'Decoded image is empty.' }
    }
    if (buffer.length > 10 * 1024 * 1024) {
      return { success: false, error: 'Image too large (max 10MB). Try a smaller size.' }
    }

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

    // Update organisations table - fetch slug for revalidation
    const { data: orgSlugData, error: dbError } = await adminClient
      .from('organisations')
      .update({ logo_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', orgId)
      .select('slug')
      .maybeSingle()

    if (dbError) {
      // Compensating delete to avoid orphaned storage object
      await adminClient.storage.from('organisation_assets').remove([filePath]).catch(() => {})
      return { success: false, error: `Database update failed: ${dbError.message}` }
    }

    // Correct ISR revalidation: layout root + public org pages (en/hi)
    revalidatePath('/', 'layout')
    if (orgSlugData?.slug) {
      await revalidatePublicOrgPages(orgSlugData.slug as string)
    }

    return { success: true, publicUrl }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown server error.'
    return { success: false, error: message }
  }
}

'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { requirePlatformAdmin } from '@/lib/auth/context'
import type { Json } from '@/types/database'

const UpdateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.record(z.string(), z.unknown()),
  description: z.string().optional(),
})

export async function getSystemSetting(key: string) {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('system_settings')
    .select('*')
    .eq('key', key)
    .single()
  return data
}

export async function getAllSystemSettings() {
  await requirePlatformAdmin()
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('system_settings')
    .select('*')
    .order('key', { ascending: true })
  return data || []
}

export async function updateSystemSetting(input: z.infer<typeof UpdateSettingSchema>) {
  const result = UpdateSettingSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid input' }
  }

  await requirePlatformAdmin()

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('system_settings')
    .upsert({
      key: result.data.key,
      value: result.data.value,
      description: result.data.description || null,
      updated_by: user.id,
    })

  if (error) return { success: false, error: error.message }

  await logAction({
    organisation_id: '00000000-0000-0000-0000-000000000000',
    user_id: user.id,
    action: 'SYSTEM_SETTING_UPDATED',
    resource_table: 'system_settings',
    resource_id: result.data.key,
  })

  revalidatePath('/admin/settings', 'page')
  return { success: true }
}

export async function createSystemSetting(input: { key: string; value: Record<string, unknown>; description?: string }) {
  return updateSystemSetting(input)
}

export async function deleteSystemSetting(key: string) {
  await requirePlatformAdmin()

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('system_settings')
    .delete()
    .eq('key', key)

  if (error) return { success: false, error: error.message }

  await logAction({
    organisation_id: '00000000-0000-0000-0000-000000000000',
    user_id: user.id,
    action: 'SYSTEM_SETTING_DELETED',
    resource_table: 'system_settings',
    resource_id: key,
  })

  revalidatePath('/admin/settings', 'page')
  return { success: true }
}

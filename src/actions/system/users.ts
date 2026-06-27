'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { logAction } from '@/lib/audit/log'
import { requirePlatformAdmin } from '@/lib/auth/context'

const UpdateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  isPlatformAdmin: z.boolean(),
})

export async function togglePlatformAdmin(input: z.infer<typeof UpdateUserRoleSchema>) {
  const result = UpdateUserRoleSchema.safeParse(input)
  if (!result.success) {
    return { success: false, error: result.error.issues[0]?.message || 'Invalid input' }
  }

  await requirePlatformAdmin()

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const supabase = createServiceClient()

  const { error } = await supabase
    .from('profiles')
    .update({ is_platform_admin: result.data.isPlatformAdmin })
    .eq('id', result.data.userId)

  if (error) return { success: false, error: error.message }

  await logAction({
    organisation_id: '00000000-0000-0000-0000-000000000000',
    user_id: user.id,
    action: result.data.isPlatformAdmin ? 'USER_PROMOTED_ADMIN' : 'USER_DEMOTED_ADMIN',
    resource_table: 'profiles',
    resource_id: result.data.userId,
  })

  revalidatePath('/admin/users', 'page')
  return { success: true }
}

export async function deleteUser(userId: string) {
  await requirePlatformAdmin()

  const authClient = await createClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  if (userId === user.id) {
    return { success: false, error: 'Cannot delete your own account' }
  }

  const supabase = createServiceClient()

  const { error } = await supabase
    .from('profiles')
    .update({ deleted_at: new Date().toISOString(), status: 'removed' })
    .eq('id', userId)

  if (error) return { success: false, error: error.message }

  await logAction({
    organisation_id: '00000000-0000-0000-0000-000000000000',
    user_id: user.id,
    action: 'USER_DELETED',
    resource_table: 'profiles',
    resource_id: userId,
  })

  revalidatePath('/admin/users', 'page')
  return { success: true }
}

export async function getAllUsers() {
  await requirePlatformAdmin()
  const supabase = createServiceClient()
  const { data } = await supabase.rpc('admin_list_users')
  return (data || []) as Array<{
    id: string
    email: string
    full_name: string | null
    is_platform_admin: boolean | null
    status: string
    organisation_count: number
  }>
}

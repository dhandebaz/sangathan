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
  try {
    const result = UpdateUserRoleSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid input' }
    }

    await requirePlatformAdmin()

    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    const supabase = createServiceClient()

    const { error } = await supabase
      .from('profiles')
      .update({ is_platform_admin: result.data.isPlatformAdmin })
      .eq('id', result.data.userId)

    if (error) return { success: false, error: error.message }

    const { data: firstOrg } = await supabase.from('organisations').select('id').limit(1).maybeSingle()
    const orgId = process.env.DEFAULT_ORG_ID || firstOrg?.id

    if (orgId) {
      await logAction({
        organisation_id: orgId,
        user_id: user.id,
        action: result.data.isPlatformAdmin ? 'USER_PROMOTED_ADMIN' : 'USER_DEMOTED_ADMIN',
        resource_table: 'profiles',
        resource_id: result.data.userId,
      })
    }

    revalidatePath('/admin/users', 'page')
    return { success: true }
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to toggle admin status' }
  }
}

export async function deleteUser(userId: string) {
  try {
    await requirePlatformAdmin()

    const authClient = await createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) return { success: false, error: 'Unauthorized' }

    if (userId === user.id) {
      return { success: false, error: 'Cannot delete your own account' }
    }

    const supabase = createServiceClient()

    const { error } = await supabase
      .from('profiles')
      .update({ deleted_at: new Date().toISOString(), status: 'removed' })
      .eq('id', userId)

    if (error) return { success: false, error: error.message }

    const { data: firstOrg } = await supabase.from('organisations').select('id').limit(1).maybeSingle()
    const orgId = process.env.DEFAULT_ORG_ID || firstOrg?.id

    if (orgId) {
      await logAction({
        organisation_id: orgId,
        user_id: user.id,
        action: 'USER_DELETED',
        resource_table: 'profiles',
        resource_id: userId,
      })
    }

    revalidatePath('/admin/users', 'page')
    return { success: true }
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete user' }
  }
}

export async function getAllUsers() {
  try {
    await requirePlatformAdmin()
    const supabase = createServiceClient()
    const { data, error } = await supabase.rpc('admin_list_users')
    if (error) return []
    return (data || []) as Array<{
      id: string
      email: string
      full_name: string | null
      is_platform_admin: boolean | null
      status: string
      organisation_count: number
    }>
  } catch {
    return []
  }
}


'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import type { Database } from '@/types/database'

const NetworkSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric"),
  visibility: z.enum(['public', 'private']),
})

export async function createNetwork(input: z.infer<typeof NetworkSchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    // Check permissions (must be org admin with federation_mode)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, organisation_id, organisations(capabilities)')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      return { success: false, error: 'Permission denied' }
    }

    const org = profile.organisations as { capabilities?: Record<string, unknown> } | null
    const capabilities = org?.capabilities as { federation_mode?: boolean } | null
    if (!capabilities?.federation_mode) {
      return { success: false, error: 'Federation Mode not enabled for your organisation.' }
    }

    const supabaseAdmin = createServiceClient()

    // Create Network
    const { data: network, error } = await supabaseAdmin
      .from('networks')
      .insert({
        ...input,
        created_by: user.id
      })
      .select()
      .single()

    if (error || !network) throw new Error(error?.message || 'Failed to create network')

    // Add Creator as Admin
    await supabaseAdmin.from('network_admins').insert({
      network_id: network.id,
      user_id: user.id,
      role: 'coordinator'
    })

    await supabaseAdmin
      .from('network_memberships')
      .insert({
        network_id: network.id,
        organisation_id: profile.organisation_id as string,
        status: 'active',
      } as never)

    revalidatePath('/dashboard/networks')
    return { success: true, id: network.id }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function joinNetwork(networkId: string) {
  console.log('Join network requested for:', networkId)
  // Similar logic: check federation_mode, insert pending membership
}

export async function getNetworkDetails(slug: string) {
  const supabase = createServiceClient()

  const { data: network } = await supabase
    .from('networks')
    .select(`
            *,
            members:network_memberships(
                organisation:organisations(id, name, slug)
            )
        `)
    .eq('slug', slug)
    .single()

  return network
}

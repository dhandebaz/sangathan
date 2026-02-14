'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

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
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, organization_id, organisations(capabilities)')
      .eq('id', user.id)
      .single()

    const profile = profileData as any

    if (!profile || profile.role !== 'admin') {
      return { success: false, error: 'Permission denied' }
    }
    
    // Check Capability
    const capabilities = profile.organisations?.capabilities as any
    if (!capabilities?.federation_mode) {
        return { success: false, error: 'Federation Mode not enabled for your organisation.' }
    }

    const supabaseAdmin = createServiceClient()

    // Create Network
    const { data: networkData, error } = await (supabaseAdmin
      .from('networks') as any)
      .insert({
        ...input,
        created_by: user.id
      })
      .select()
      .single()

    const network = networkData as any

    if (error) throw error

    // Add Creator as Admin
    await (supabaseAdmin.from('network_admins') as any).insert({
        network_id: network.id,
        user_id: user.id,
        role: 'coordinator'
    })

    // Add Creator's Org as Member
    await (supabaseAdmin.from('network_memberships') as any).insert({
        network_id: network.id,
        organization_id: profile.organization_id,
        status: 'active'
    })

    revalidatePath('/dashboard/networks')
    return { success: true, id: network.id }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function joinNetwork(networkId: string) {
    // Similar logic: check federation_mode, insert pending membership
}

export async function getNetworkDetails(slug: string) {
    const supabase = createServiceClient()
    
    const { data: network } = await supabase
        .from('networks')
        .select(`
            *,
            members:network_memberships(
                organisation:organisations(id, name, slug, member_count:members(count))
            )
        `)
        .eq('slug', slug)
        .single()
        
    return network
}

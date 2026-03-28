'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { sendEmail } from '@/lib/email/sender'

const NetworkSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric"),
  visibility: z.enum(['public', 'private']),
})

const JoinNetworkSchema = z.object({
  networkId: z.string().uuid(),
})

export async function createNetwork(input: z.infer<typeof NetworkSchema>) {
  try {
    const result = NetworkSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid network data' }
    }

    const data = result.data

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

    const { data: network, error } = await supabaseAdmin
      .from('networks')
      .insert({
        ...data,
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
  try {
    const result = JoinNetworkSchema.safeParse({ networkId })
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid network request' }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false, error: 'Unauthorized' }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, organisation_id, organisations(name, capabilities)')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || !profile.organisation_id || profile.role !== 'admin') {
      return { success: false, error: 'Only organisation admins can join networks' }
    }

    const organisation = profile.organisations as { name?: string; capabilities?: Record<string, boolean> } | null
    if (!organisation?.capabilities?.federation_mode) {
      return { success: false, error: 'Federation Mode is not enabled for your organisation.' }
    }

    const supabaseAdmin = createServiceClient()

    const { data: network, error: networkError } = await supabaseAdmin
      .from('networks')
      .select('id, name, slug, visibility')
      .eq('id', result.data.networkId)
      .single()

    if (networkError || !network) {
      return { success: false, error: 'Network not found' }
    }

    const { data: existingMembership } = await supabaseAdmin
      .from('network_memberships')
      .select('id, status')
      .eq('network_id', network.id)
      .eq('organisation_id', profile.organisation_id)
      .maybeSingle()

    if (existingMembership?.status === 'active') {
      return { success: false, error: 'Your organisation is already a member of this network.' }
    }

    if (existingMembership?.status === 'pending') {
      return { success: false, error: 'Your organisation already has a pending join request.' }
    }

    const membershipStatus = network.visibility === 'public' ? 'active' : 'pending'

    const { error: insertError } = await supabaseAdmin
      .from('network_memberships')
      .insert({
        network_id: network.id,
        organisation_id: profile.organisation_id,
        status: membershipStatus,
      } as never)

    if (insertError) throw insertError

    if (membershipStatus === 'pending') {
      const { data: coordinators } = await supabaseAdmin
        .from('network_admins')
        .select('user:profiles!network_admins_user_id_fkey(email, full_name)')
        .eq('network_id', network.id)

      if (coordinators) {
        const reviewUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/network/${network.slug}`
        for (const coordinator of coordinators as { user: { email: string; full_name?: string | null } | null }[]) {
          if (!coordinator.user?.email) continue
          await sendEmail({
            to: coordinator.user.email,
            subject: `Network join request: ${organisation.name || 'An organisation'}`,
            html: `
              <p>Hello ${coordinator.user.full_name || 'Coordinator'},</p>
              <p><strong>${organisation.name || 'An organisation'}</strong> requested to join <strong>${network.name}</strong>.</p>
              <p>You can review the network here: <a href="${reviewUrl}">${reviewUrl}</a></p>
            `,
            tags: ['network', 'join-request'],
          })
        }
      }
    }

    revalidatePath('/dashboard/networks')
    revalidatePath(`/network/${network.slug}`)
    return { success: true, status: membershipStatus }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, error: message }
  }
}

export async function getNetworkDetails(slug: string) {
  const supabase = createServiceClient()

  const { data: network } = await supabase
    .from('networks')
    .select(`
            *,
            members:network_memberships(
                status,
                organisation:organisations(id, name, slug)
            )
        `)
    .eq('slug', slug)
    .single()

  return network
}

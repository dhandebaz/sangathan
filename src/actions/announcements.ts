'use server'

import { createSafeAction } from '@/lib/auth/actions'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { enqueueJobs } from '@/lib/queue'
import { checkBroadcastLimit } from '@/lib/risk-engine'

const AnnouncementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 chars'),
  content: z.string().min(10, 'Content must be at least 10 chars'),
  visibility_level: z.enum(['public', 'members', 'volunteer', 'core', 'executive']),
  is_pinned: z.boolean().default(false),
  send_email: z.boolean().default(false),
  scheduled_at: z.string().datetime().optional().nullable(),
  expires_at: z.string().datetime().optional().nullable(),
})

const DeleteSchema = z.object({
  id: z.string().uuid(),
})

export const createAnnouncement = createSafeAction(
  AnnouncementSchema,
  async (input, context) => {
    if (input.send_email) {
      const limitCheck = await checkBroadcastLimit(context.organizationId)
      if (!limitCheck.allowed) {
        return { error: `Broadcast blocked: ${limitCheck.reason}` }
      }
    }

    const supabase = await createClient()

    const { data: announcement, error } = await supabase
      .from('announcements')
      .insert({
        organisation_id: context.organizationId,
        title: input.title,
        content: input.content,
        visibility_level: input.visibility_level,
        is_pinned: input.is_pinned,
        send_email: input.send_email,
        scheduled_at: input.scheduled_at,
        expires_at: input.expires_at,
        created_by: context.user.id,
      } as never)
      .select()
      .single()

    if (error || !announcement) {
      return { error: error?.message || 'Failed to create announcement' }
    }

    if (input.send_email) {
      const supabaseAdmin = createServiceClient()

      let query = supabaseAdmin
        .from('profiles')
        .select('email, full_name')
        .eq('organisation_id', context.organizationId)
        .eq('status', 'active')

      if (input.visibility_level === 'executive') {
        query = query.in('role', ['executive', 'admin', 'editor'])
      } else if (input.visibility_level === 'core') {
        query = query.in('role', ['core', 'executive', 'admin', 'editor'])
      } else if (input.visibility_level === 'volunteer') {
        query = query.in('role', ['volunteer', 'core', 'executive', 'admin', 'editor'])
      }

      const { data: members } = (await query) as {
        data: { email: string; full_name: string | null }[] | null
        error: unknown
      }

      if (members) {
        const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`

        const emailJobs = members.map((member) => ({
          type: 'send_email' as const,
          payload: {
            to: member.email,
            subject: `New Announcement: ${input.title}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h2>${input.title}</h2>
                <div style="margin: 20px 0; white-space: pre-wrap;">${input.content}</div>
                <hr/>
                <p><a href="${dashboardUrl}">View in Dashboard</a></p>
              </div>
            `,
            tags: ['announcement', 'broadcast'],
          },
        }))

        await enqueueJobs(emailJobs)

        await supabaseAdmin
          .from('announcements')
          .update({
            email_sent_at: new Date().toISOString(),
            email_stats: { recipient_count: emailJobs.length },
          } as never)
          .eq('id', (announcement as { id: string }).id)
      }
    }

    await context.logAction({
      action: 'ANNOUNCEMENT_CREATED',
      resourceTable: 'announcements',
      resourceId: announcement.id,
      details: { title: input.title },
    })

    revalidatePath('/', 'layout')
    return { success: true, announcementId: announcement.id }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'create_announcement' },
)

export const markAnnouncementRead = createSafeAction(
  z.object({ announcementId: z.string().uuid() }),
  async (input, context) => {
    const supabase = await createClient()
    const { error } = await supabase
      .from('announcement_views')
      .upsert(
        {
          announcement_id: input.announcementId,
          user_id: context.user.id,
        } as never,
        { onConflict: 'announcement_id,user_id' },
      )

    if (error) return { error: error.message }
    return { success: true }
  },
  { actionName: 'mark_announcement_read' },
)

export const deleteAnnouncement = createSafeAction(
  DeleteSchema,
  async (input, context) => {
    const supabase = await createClient()
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', input.id)
      .eq('organisation_id', context.organizationId)

    if (error) return { error: error.message }

    revalidatePath('/', 'layout')
    return { success: true }
  },
  { allowedRoles: ['admin', 'editor'], actionName: 'delete_announcement' },
)

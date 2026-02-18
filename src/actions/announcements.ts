'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { enqueueJob } from '@/lib/queue'
import { checkBroadcastLimit } from '@/lib/risk-engine'

// --- Schemas ---

const AnnouncementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 chars"),
  content: z.string().min(10, "Content must be at least 10 chars"),
  visibility_level: z.enum(['public', 'members', 'volunteer', 'core', 'executive']),
  is_pinned: z.boolean().default(false),
  send_email: z.boolean().default(false),
  scheduled_at: z.string().datetime().optional().nullable(),
  expires_at: z.string().datetime().optional().nullable(),
})

const CreateAnnouncementSchema = AnnouncementSchema.extend({
  organisation_id: z.string().uuid(),
})

// --- Actions ---

export async function createAnnouncement(input: z.infer<typeof CreateAnnouncementSchema>) {
  try {
    const result = CreateAnnouncementSchema.safeParse(input)
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || 'Invalid announcement data' }
    }

    const data = result.data

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, organisation_id')
      .eq('id', user.id)
      .single() as { data: { role: string; organisation_id: string } | null, error: { message: string } | null }

    if (!profile || profile.organisation_id !== data.organisation_id || !['admin', 'editor'].includes(profile.role || '')) {
      return { success: false, error: 'Permission denied' }
    }
    
    // Risk Check: Broadcast Limit
    if (data.send_email) {
       const limitCheck = await checkBroadcastLimit(data.organisation_id)
       if (!limitCheck.allowed) {
          return { success: false, error: `Broadcast blocked: ${limitCheck.reason}` }
       }
    }

    const { data: announcement, error } = await supabase
      .from('announcements')
      .insert({
        ...data,
        created_by: user.id,
      } as never)
      .select()
      .single()

    if (error || !announcement) throw new Error(error?.message || 'Failed to create announcement')

    if (data.send_email) {
      const supabaseAdmin = createServiceClient()
      
      let query = supabaseAdmin
        .from('profiles')
        .select('email, full_name')
        .eq('organisation_id', data.organisation_id)
        .eq('status', 'active')

      if (data.visibility_level === 'executive') {
        query = query.in('role', ['executive', 'admin', 'editor'])
      } else if (data.visibility_level === 'core') {
        query = query.in('role', ['core', 'executive', 'admin', 'editor'])
      } else if (data.visibility_level === 'volunteer') {
        query = query.in('role', ['volunteer', 'core', 'executive', 'admin', 'editor'])
      }

      const { data: members } = (await query) as {
        data: { email: string; full_name: string | null }[] | null
        error: unknown
      }
      
      if (members) {
        let sentCount = 0
        const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`

        for (const member of members) {
           await enqueueJob('send_email', {
             to: member.email,
             subject: `New Announcement: ${data.title}`,
             html: `
               <div style="font-family: sans-serif; padding: 20px;">
                 <h2>${data.title}</h2>
                 <div style="margin: 20px 0; white-space: pre-wrap;">${data.content}</div>
                 <hr/>
                 <p><a href="${dashboardUrl}">View in Dashboard</a></p>
               </div>
             `,
             tags: ['announcement', 'broadcast']
           })
           sentCount++
        }

        await supabaseAdmin
          .from('announcements')
          .update({
            email_sent_at: new Date().toISOString(),
            email_stats: { recipient_count: sentCount },
          } as never)
          .eq('id', (announcement as { id: string }).id)
      }
    }

    revalidatePath('/dashboard/announcements')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return { success: false, error: message }
  }
}

export async function markAnnouncementRead(announcementId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false }

    const { error } = await supabase
      .from('announcement_views')
      .upsert(
        {
          announcement_id: announcementId,
          user_id: user.id,
        } as never,
        { onConflict: 'announcement_id,user_id' },
      )

    if (error) throw error
    
    return { success: true }
  } catch (err: unknown) {
    console.error('Failed to mark announcement as read:', err)
    return { success: false }
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    const supabase = await createClient()
    // Permission check handled by RLS partially, but we should be explicit
    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) throw error
    
    revalidatePath('/dashboard/announcements')
    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred'
    return { success: false, error: message }
  }
}

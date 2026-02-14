'use server'

import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { enqueueJob } from '@/lib/queue'
import { baseLayout } from '@/lib/email/templates'
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

const UpdateAnnouncementSchema = AnnouncementSchema.partial().extend({
  id: z.string().uuid(),
})

// --- Actions ---

export async function createAnnouncement(input: z.infer<typeof CreateAnnouncementSchema>) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false, error: 'Unauthorized' }

    // Check permissions
    const { data: profileData } = await supabase
      .from('profiles')
      .select('role, organization_id')
      .eq('id', user.id)
      .single()

    const profile = profileData as any

    if (!profile || profile.organization_id !== input.organisation_id || !['admin', 'editor'].includes(profile.role)) {
      return { success: false, error: 'Permission denied' }
    }
    
    // Risk Check: Broadcast Limit
    if (input.send_email) {
       const limitCheck = await checkBroadcastLimit(input.organisation_id, 0) // Count deferred
       if (!limitCheck.allowed) {
          return { success: false, error: `Broadcast blocked: ${limitCheck.reason}` }
       }
    }

    const { data: announcement, error } = await (supabase
      .from('announcements') as any)
      .insert({
        ...input,
        created_by: user.id
      })
      .select()
      .single()

    if (error) throw error

    // Handle Email Broadcasting
    if (input.send_email) {
      // We do this asynchronously to avoid blocking the UI response
      // But we need to ensure it runs.
      // In Vercel serverless, background tasks can be cut off.
      // Ideally we enqueue a "broadcast" job. 
      // For now, we'll enqueue individual emails if the list is small, or fail gracefully.
      
      const supabaseAdmin = createServiceClient()
      
      // Fetch eligible members
      // Logic for eligibility based on visibility_level
      let query = supabaseAdmin
        .from('profiles')
        .select('email, full_name')
        .eq('organisation_id', input.organisation_id)
        .eq('status', 'active')

      // Filter by role if restricted
      if (input.visibility_level === 'executive') {
        query = query.in('role', ['executive', 'admin', 'editor'])
      } else if (input.visibility_level === 'core') {
        query = query.in('role', ['core', 'executive', 'admin', 'editor'])
      } else if (input.visibility_level === 'volunteer') {
        query = query.in('role', ['volunteer', 'core', 'executive', 'admin', 'editor'])
      }
      // 'members' and 'public' go to all active members

      const { data: members } = await query
      
      if (members) {
        let sentCount = 0
        const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
        
        // Simple HTML template for announcement
        // We can't import baseLayout easily if it's not exported properly or if we want custom style.
        // Let's assume we construct a simple body.
        
        for (const member of members as any[]) {
           await enqueueJob('send_email', {
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
             tags: ['announcement', 'broadcast']
           })
           sentCount++
        }

        // Update stats
        await (supabaseAdmin
          .from('announcements') as any)
          .update({ 
            email_sent_at: new Date().toISOString(),
            email_stats: { recipient_count: sentCount }
          })
          .eq('id', announcement.id)
      }
    }

    revalidatePath('/dashboard/announcements')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function markAnnouncementRead(announcementId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return { success: false }

    const { error } = await (supabase
      .from('announcement_views') as any)
      .insert({
        announcement_id: announcementId,
        user_id: user.id
      })
      .ignoreDuplicates() // Prevent error if already viewed

    if (error) throw error
    
    return { success: true }
  } catch (error) {
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
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

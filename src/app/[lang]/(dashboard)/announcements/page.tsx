import { createClient } from '@/lib/supabase/server'
import { AnnouncementCard } from '@/components/announcements/announcement-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AnnouncementsPage(props: { params: Promise<{ lang: string }> }) {
  const { lang } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <div>Please login</div>

  // Fetch Announcements
  // We need to fetch announcements AND check if viewed
  // This is tricky with simple Supabase queries. 
  // We'll fetch announcements and user's view records separately or use a join if possible.
  
  const { data: profile } = await supabase.from('profiles').select('organisation_id, role').eq('id', user.id).single()
  
  if (!profile) return <div>Profile not found</div>

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*, announcement_views(user_id)')
    .eq('organisation_id', profile.organisation_id)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const canManage = ['admin', 'editor'].includes(profile.role)

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
          <p className="text-muted-foreground mt-1">Updates and news from your organisation.</p>
        </div>
        {canManage && (
          <Button asChild>
            <Link href={`/${lang}/dashboard/announcements/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Post Update
            </Link>
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {announcements?.map((a: any) => {
          const isRead = a.announcement_views?.some((v: any) => v.user_id === user.id)
          // Filter logic should ideally be server-side but RLS handles security.
          // UI filtering for expired?
          if (a.expires_at && new Date(a.expires_at) < new Date()) return null
          
          return (
            <AnnouncementCard key={a.id} announcement={a} isRead={isRead} />
          )
        })}

        {(!announcements || announcements.length === 0) && (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
            <p className="text-gray-500">No announcements yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

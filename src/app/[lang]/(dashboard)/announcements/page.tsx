import { createClient } from '@/lib/supabase/server'
import { AnnouncementCard } from '@/components/announcements/announcement-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { DashboardAnnouncement } from '@/types/dashboard'

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

  const { data: profileData } = await supabase.from('profiles').select('organization_id, role').eq('id', user.id).single()

  const profile = profileData as { organization_id: string; role: string } | null

  if (!profile || !profile.organization_id) return <div>No Organisation Found</div>

  const { data: announcementsData } = await supabase
    .from('announcements')
    .select('*, announcement_views(user_id)')
    .eq('organisation_id', profile.organization_id)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  const announcements = announcementsData as unknown as DashboardAnnouncement[] | null
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
        {announcements?.map((a) => {
          const isRead = a.announcement_views?.some((v) => v.user_id === user.id)
          // Filter logic should ideally be server-side but RLS handles security.
          // UI filtering for expired?
          if (a.expires_at && new Date(a.expires_at) < new Date()) return null

          return (
            <AnnouncementCard key={a.id} announcement={a} isRead={isRead ?? false} />
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

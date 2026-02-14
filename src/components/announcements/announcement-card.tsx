'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Pin, Eye } from 'lucide-react'
import { markAnnouncementRead } from '@/actions/announcements'
import { useState } from 'react'
import { DashboardAnnouncement } from '@/types/dashboard'

interface Announcement extends DashboardAnnouncement {
  visibility_level: string;
  email_sent_at?: string;
  view_count?: number;
}

export function AnnouncementCard({ announcement, isRead, onRead }: { announcement: Announcement, isRead: boolean, onRead?: () => void }) {
  const [read, setRead] = useState(isRead)

  const handleMarkRead = async () => {
    if (read) return
    setRead(true)
    await markAnnouncementRead(announcement.id)
    if (onRead) onRead()
  }

  return (
    <Card className={`transition-all ${!read ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''}`} onMouseEnter={handleMarkRead}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {announcement.is_pinned && <Pin className="w-4 h-4 text-orange-500 rotate-45" />}
            <h3 className="font-bold text-lg">{announcement.title}</h3>
            {!read && <Badge variant="default" className="bg-blue-500 h-5 text-[10px]">New</Badge>}
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {new Date(announcement.created_at).toLocaleDateString()}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap">
          {announcement.content}
        </div>
        
        <div className="mt-4 pt-4 border-t flex justify-between items-center text-xs text-gray-400">
          <div className="flex gap-2">
             <Badge variant="outline" className="capitalize">{announcement.visibility_level}</Badge>
             {announcement.email_sent_at && <Badge variant="secondary">Emailed</Badge>}
          </div>
          {/* Admin Stats View - Only visible if data provided */}
          {announcement.view_count !== undefined && (
             <div className="flex items-center gap-1" title="Views">
               <Eye className="w-3 h-3" /> {announcement.view_count}
             </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

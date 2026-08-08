'use client'

import { useState } from 'react'
import { Plus, Calendar, MapPin, Video, ArrowRight, Search, Download, Clock, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface MeetingItem {
  id: string
  title: string
  date: string
  location?: string | null
  description?: string | null
  meeting_link?: string | null
  organisation_id?: string | null
}

interface MeetingsClientProps {
  initialMeetings: MeetingItem[]
  lang: string
  title: string
  description: string
}

export function MeetingsClient({ initialMeetings, lang, title, description }: MeetingsClientProps) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past' | 'video'>('all')

  const now = new Date()

  const meetingsWithCategory = initialMeetings.map((m) => {
    const meetingDate = new Date(m.date)
    const isUpcoming = meetingDate >= now
    const isVideo = Boolean(m.meeting_link || m.location?.toLowerCase().includes('video') || m.location?.toLowerCase().includes('online') || m.location?.toLowerCase().includes('jitsi'))
    return { ...m, isUpcoming, isVideo, dateObj: meetingDate }
  })

  const filteredMeetings = meetingsWithCategory.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
                          (m.location && m.location.toLowerCase().includes(search.toLowerCase()))
    
    if (!matchesSearch) return false

    if (activeTab === 'upcoming') return m.isUpcoming
    if (activeTab === 'past') return !m.isUpcoming
    if (activeTab === 'video') return m.isVideo
    return true
  })

  const upcomingCount = meetingsWithCategory.filter(m => m.isUpcoming).length
  const videoCount = meetingsWithCategory.filter(m => m.isVideo).length

  function downloadICS(meeting: MeetingItem) {
    const startDate = new Date(meeting.date).toISOString().replace(/-|:|\.\d\d\d/g, '')
    const endDate = new Date(new Date(meeting.date).getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '')
    
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sangathan//Meetings//EN
BEGIN:VEVENT
SUMMARY:${meeting.title}
DESCRIPTION:${meeting.description || 'Sangathan Meeting'}
LOCATION:${meeting.location || 'Online'}
DTSTART:${startDate}
DTEND:${endDate}
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${meeting.title.replace(/\s+/g, '_')}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <Button asChild className="bg-brand-600 hover:bg-brand-500 text-white font-medium">
          <Link href={`/${lang}/dashboard/meetings/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Link>
        </Button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-card border-border rounded-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Total Meetings</span>
            <Calendar className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">{initialMeetings.length}</div>
        </Card>

        <Card className="p-4 bg-card border-border rounded-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Upcoming Sessions</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">{upcomingCount}</div>
        </Card>

        <Card className="p-4 bg-card border-border rounded-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Video Conferences</span>
            <Video className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-foreground mt-1">{videoCount}</div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-card p-3 rounded-sm border border-border">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All (${initialMeetings.length})` },
            { id: 'upcoming', label: `Upcoming (${upcomingCount})` },
            { id: 'video', label: `Video Calls (${videoCount})` },
            { id: 'past', label: 'Past' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-foreground text-background shadow-xs'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search meetings or locations..."
            className="pl-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Meetings List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMeetings.map((meeting) => {
          const jitsiLink = `https://meet.jit.si/sangathan-${meeting.organisation_id || 'org'}-${meeting.id}`
          const videoLink = meeting.meeting_link || jitsiLink

          return (
            <Card key={meeting.id} className="p-6 bg-card border-border hover:border-brand-400 transition-all rounded-sm shadow-xs group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-brand-600 transition-colors">
                      {meeting.title}
                    </h3>
                    {meeting.isUpcoming ? (
                      <Badge className="bg-emerald-600 text-white text-[10px]">Upcoming</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Past</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-500" />
                      <span>{meeting.dateObj.toLocaleString()}</span>
                    </div>

                    {meeting.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{meeting.location}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Attendance & Deliberation Tracked</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadICS(meeting)}
                    title="Export Calendar (.ics)"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" />
                    ICS
                  </Button>

                  <a
                    href={videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  >
                    <Video className="w-3.5 h-3.5 mr-1.5" />
                    Join Video Call
                  </a>

                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/${lang}/dashboard/meetings/${meeting.id}`}>
                      View Details
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}

        {filteredMeetings.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-sm bg-muted/30">
            <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <h3 className="font-semibold text-foreground">No meetings found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {search ? 'Try clearing your search term.' : 'Click "Schedule Meeting" to schedule your first session.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

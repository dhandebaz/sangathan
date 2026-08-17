'use client'

import React, { useState, useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Video,
  Plus,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Share2,
  Copy,
  CalendarCheck,
  Layers,
  Activity,
  ChevronRight,
  Filter
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  UnifiedCalendarItem,
  scheduleFieldDeployment,
  syncOrgToGoogleCalendarAction,
  getCalendarSubscriptionDetails,
  createInstantGoogleMeetRoom
} from '@/actions/calendar-sync'
import { createMeeting } from '@/actions/meetings'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface CentralizedCalendarHubProps {
  lang: string
  orgId: string
  orgType: string
  orgName: string
  initialItems: UnifiedCalendarItem[]
  members: Array<{ id: string; full_name: string; role: string; designation?: string; phone?: string }>
}

export function CentralizedCalendarHub({
  lang,
  orgId,
  orgType,
  orgName,
  initialItems,
  members
}: CentralizedCalendarHubProps) {
  const isHindi = lang === 'hi'
  const [items, setItems] = useState<UnifiedCalendarItem[]>(initialItems)
  const [activeFilter, setActiveFilter] = useState<'all' | 'event' | 'meeting' | 'field_survey' | 'task'>('all')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month')
  
  // Date navigation
  const [currentDate, setCurrentDate] = useState<Date>(new Date())

  // Modal States
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false)
  const [isFieldDeployOpen, setIsFieldDeployOpen] = useState(false)
  const [isSyncingGoogle, setIsSyncingGoogle] = useState(false)
  const [subscriptionUrls, setSubscriptionUrls] = useState<{ webcalUrl: string; icsUrl: string } | null>(null)

  // Field Deployment Form
  const [deployTitle, setDeployTitle] = useState('')
  const [deployArea, setDeployArea] = useState('')
  const [deployForm, setDeployForm] = useState('Grassroots Intake & Census')
  const [deployDate, setDeployDate] = useState(new Date().toISOString().slice(0, 16))
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [deployInstructions, setDeployInstructions] = useState('')
  const [isSubmittingDeploy, setIsSubmittingDeploy] = useState(false)

  // Meeting Schedule Modal State
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)
  const [meetingTitle, setMeetingTitle] = useState('')
  const [meetingDesc, setMeetingDesc] = useState('')
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().slice(0, 16))
  const [meetingEndDate, setMeetingEndDate] = useState('')
  const [meetingLocation, setMeetingLocation] = useState('')
  const [meetingVisibility, setMeetingVisibility] = useState<'public' | 'members' | 'private'>('members')
  const [meetingLink, setMeetingLink] = useState('')
  const [isSubmittingMeeting, setIsSubmittingMeeting] = useState(false)

  // Instant Google Meet State
  const [meetModalOpen, setMeetModalOpen] = useState(false)
  const [meetTitle, setMeetTitle] = useState('')
  const [generatedMeetUrl, setGeneratedMeetUrl] = useState('')

  // 1. Google OAuth Permission Trigger for Calendar
  async function handleConnectGoogleCalendar() {
    const supabase = createClient()
    toast.info(isHindi ? 'गूगल कैलेंडर अनुमति से कनेक्ट हो रहा है...' : 'Requesting Google Calendar permission...')
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(window.location.pathname)}`,
        scopes: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  }

  // 2. Sync to Google Calendar
  async function handleGoogleCalendarSync() {
    setIsSyncingGoogle(true)
    const res = await syncOrgToGoogleCalendarAction(orgId)
    setIsSyncingGoogle(false)

    if (res.success) {
      toast.success(
        isHindi
          ? `${res.syncedCount} कार्यक्रम गूगल कैलेंडर में सिंक हो गए!`
          : `Successfully synced ${res.syncedCount} events to Google Calendar!`
      )
    } else if (res.needsAuth) {
      toast.error(res.error)
      handleConnectGoogleCalendar()
    } else {
      toast.error(res.error || 'Failed to sync with Google Calendar')
    }
  }

  // 3. Open Subscribe Modal (Apple iCal / CalDAV)
  async function handleOpenSubscribe() {
    const res = await getCalendarSubscriptionDetails(orgId, lang)
    if (res.success && res.webcalUrl && res.icsUrl) {
      setSubscriptionUrls({
        webcalUrl: res.webcalUrl,
        icsUrl: res.icsUrl
      })
      setIsSubscribeOpen(true)
    } else {
      toast.error('Failed to generate calendar feed link')
    }
  }

  // 4. Submit Field Deployment Schedule
  async function handleScheduleDeployment(e: React.FormEvent) {
    e.preventDefault()
    if (!deployTitle || !deployArea || selectedMemberIds.length === 0) {
      toast.error(isHindi ? 'कृपया सभी विवरण और कम से कम एक सदस्य चुनें' : 'Please fill all required fields and select members')
      return
    }

    setIsSubmittingDeploy(true)
    const res = await scheduleFieldDeployment({
      title: deployTitle,
      targetArea: deployArea,
      surveyFormName: deployForm,
      date: deployDate,
      memberIds: selectedMemberIds,
      instructions: deployInstructions
    })
    setIsSubmittingDeploy(false)

    if (res.success && res.data) {
      toast.success(isHindi ? 'फील्ड सर्वे दल सफलतापूर्वक निर्धारित!' : 'Field survey roster scheduled!')
      setIsFieldDeployOpen(false)
      // Append local item
      const assigned = members.filter(m => selectedMemberIds.includes(m.id)).map(m => ({ id: m.id, name: m.full_name, role: m.role }))
      const newItem: UnifiedCalendarItem = {
        id: `tk-${res.data.taskId}`,
        title: `[Field Survey] ${deployTitle} • ${deployArea}`,
        type: 'field_survey',
        start_time: new Date(deployDate).toISOString(),
        location: deployArea,
        assigned_members: assigned,
        role_target: 'cadre',
        badge_color: 'emerald'
      }
      setItems(prev => [...prev, newItem].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()))
    } else {
      toast.error(res.error || 'Failed to schedule')
    }
  }

  // 5. Submit Meeting / Assembly Schedule
  async function handleScheduleMeeting(e: React.FormEvent) {
    e.preventDefault()
    if (!meetingTitle || !meetingDate) {
      toast.error(isHindi ? 'शीर्षक और तिथि आवश्यक है' : 'Title and Date are required')
      return
    }

    setIsSubmittingMeeting(true)
    const res = await createMeeting({
      title: meetingTitle,
      description: meetingDesc || undefined,
      date: new Date(meetingDate).toISOString(),
      end_time: meetingEndDate ? new Date(meetingEndDate).toISOString() : undefined,
      location: meetingLocation || undefined,
      visibility: meetingVisibility,
      meeting_link: meetingLink || undefined
    })
    setIsSubmittingMeeting(false)

    if (res.success && res.data) {
      toast.success(isHindi ? 'बैठक सफलतापूर्वक निर्धारित!' : 'Meeting scheduled!')
      setIsMeetingModalOpen(false)
      const meetingId = (res.data as any).meetingId || Date.now()
      const newItem: UnifiedCalendarItem = {
        id: `mt-${meetingId}`,
        title: meetingTitle,
        type: 'meeting',
        start_time: new Date(meetingDate).toISOString(),
        end_time: meetingEndDate ? new Date(meetingEndDate).toISOString() : undefined,
        location: meetingLocation || 'Online Video Call',
        description: meetingDesc || undefined,
        meeting_link: meetingLink || undefined,
        role_target: meetingVisibility === 'private' ? 'executive' : 'all',
        status: 'upcoming',
        badge_color: 'indigo'
      }
      setItems(prev => [...prev, newItem].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()))
      setMeetingTitle('')
      setMeetingDesc('')
      setMeetingLocation('')
      setMeetingLink('')
    } else {
      toast.error(res.error || 'Failed to schedule meeting')
    }
  }

  // 6. Generate Instant Google Meet Room
  async function handleCreateInstantMeet() {
    const res = await createInstantGoogleMeetRoom(meetTitle || `${orgName} Video Sync`)
    if (res.success && res.meetUrl) {
      setGeneratedMeetUrl(res.meetUrl)
      toast.success(isHindi ? 'Google Meet लिंक तैयार!' : 'Google Meet room created!')
    }
  }

  // Filter Items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (activeFilter !== 'all' && item.type !== activeFilter) return false
      if (roleFilter !== 'all' && item.role_target && item.role_target !== 'all' && item.role_target !== roleFilter) return false
      return true
    })
  }, [items, activeFilter, roleFilter])

  // Month navigation helpers
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthName = currentDate.toLocaleString('default', { month: 'long' })
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayIndex = new Date(year, month, 1).getDay()

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const handleToday = () => setCurrentDate(new Date())

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{isHindi ? 'केंद्रीकृत संगठन कैलेंडर एवं फील्ड रोस्टर' : 'Centralized Schedule & Field Operations Calendar'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {isHindi ? 'कैलेंडर एवं समन्वय' : 'Calendar & Operations Sync'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isHindi
              ? 'कार्यक्रम, बैठकें, फील्ड सर्वेयर जोड़ियां और भूमिका-आधारित स्वतः सिंक।'
              : 'Assemblies, governance meetings, field survey pairings, and live Google & Apple Calendar auto-sync.'}
          </p>
        </div>

        {/* Sync & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Apple iCal Subscribe */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenSubscribe}
            className="text-xs font-semibold border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
          >
            <Smartphone className="w-3.5 h-3.5 mr-1.5 text-slate-700 dark:text-slate-300" />
            {isHindi ? 'iPhone / iCal सिंक' : 'Subscribe to iCal'}
          </Button>

          {/* Google Calendar Sync */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleGoogleCalendarSync}
            disabled={isSyncingGoogle}
            className="text-xs font-semibold border-blue-200 bg-blue-50/50 text-blue-800 hover:bg-blue-100/60 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
          >
            {isSyncingGoogle ? (
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <CalendarCheck className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            )}
            {isHindi ? 'Google Calendar सिंक' : 'Sync Google Calendar'}
          </Button>

          {/* Google Meet Instant Video Modal */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMeetModalOpen(true)}
            className="text-xs font-semibold border-emerald-200 bg-emerald-50/50 text-emerald-800 hover:bg-emerald-100/60 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <Video className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            {isHindi ? 'Google Meet कक्ष' : 'Instant Google Meet'}
          </Button>

          {/* Schedule Meeting / Assembly Button */}
          <Button
            size="sm"
            onClick={() => setIsMeetingModalOpen(true)}
            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            {isHindi ? 'बैठक / सभा जोड़ें' : 'Schedule Meeting'}
          </Button>

          {/* Field Deployment Schedule Button */}
          <Button
            size="sm"
            onClick={() => setIsFieldDeployOpen(true)}
            className="text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            {isHindi ? 'फील्ड सर्वे दल जोड़ें' : 'Field Deployment'}
          </Button>
        </div>
      </div>

      {/* Control Strip: Filter Tabs + View Mode + Month Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl shadow-2xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: isHindi ? 'सभी' : 'All Items' },
            { id: 'event', label: isHindi ? 'कार्यक्रम' : 'Events' },
            { id: 'meeting', label: isHindi ? 'बैठकें' : 'Meetings' },
            { id: 'field_survey', label: isHindi ? 'फील्ड सर्वे दल' : 'Field Rosters' },
            { id: 'task', label: isHindi ? 'कार्य' : 'Tasks' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === f.id
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View Switcher & Month Navigation */}
        <div className="flex items-center justify-between md:justify-end gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-xs font-semibold bg-background border border-border rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none"
          >
            <option value="all">{isHindi ? 'सभी भूमिकाएं (All Roles)' : 'Role: All Members'}</option>
            <option value="executive">{isHindi ? 'कार्यकारिणी / Board' : 'Role: Executive Council'}</option>
            <option value="cadre">{isHindi ? 'कार्यकर्ता / Cadre' : 'Role: Cadre & Field Staff'}</option>
            <option value="volunteers">{isHindi ? 'स्वयंसेवक / Volunteers' : 'Role: Volunteers'}</option>
          </select>

          {/* Month Stepper */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg border border-border">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground"
              title="Previous Month"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleToday}
              className="px-2 py-0.5 text-xs font-bold text-foreground"
            >
              {monthName} {year}
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded hover:bg-background text-muted-foreground hover:text-foreground"
              title="Next Month"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-muted/60 p-0.5 rounded-lg border border-border">
            <button
              onClick={() => setViewMode('month')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                viewMode === 'month' ? 'bg-background text-foreground shadow-2xs' : 'text-muted-foreground'
              }`}
            >
              {isHindi ? 'माह' : 'Month'}
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition-all ${
                viewMode === 'agenda' ? 'bg-background text-foreground shadow-2xs' : 'text-muted-foreground'
              }`}
            >
              {isHindi ? 'सूची' : 'Agenda'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar View: Month Grid */}
      {viewMode === 'month' ? (
        <div className="bg-card border border-border rounded-xl shadow-2xs overflow-hidden">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-border bg-muted/40 text-center py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-border">
            {/* Empty slots for month offset */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[90px] sm:min-h-[110px] bg-muted/10 p-1.5 text-muted-foreground/30 text-xs select-none">
                {/* empty */}
              </div>
            ))}

            {/* Actual Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNumber = i + 1
              const cellDate = new Date(year, month, dayNumber)
              const dateStr = cellDate.toISOString().slice(0, 10)
              const isToday = new Date().toDateString() === cellDate.toDateString()

              const dayItems = filteredItems.filter(item => {
                const itemDateStr = new Date(item.start_time).toISOString().slice(0, 10)
                return itemDateStr === dateStr
              })

              return (
                <div
                  key={`day-${dayNumber}`}
                  className={`min-h-[90px] sm:min-h-[110px] p-1.5 transition-colors flex flex-col justify-between ${
                    isToday ? 'bg-orange-50/40 dark:bg-orange-950/20' : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-extrabold inline-flex items-center justify-center rounded-full w-5 h-5 ${
                        isToday ? 'bg-orange-600 text-white' : 'text-foreground'
                      }`}
                    >
                      {dayNumber}
                    </span>
                    {dayItems.length > 0 && (
                      <span className="text-[10px] font-bold text-muted-foreground px-1 bg-muted rounded">
                        {dayItems.length}
                      </span>
                    )}
                  </div>

                  {/* Day Events Stack */}
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px] scrollbar-none">
                    {dayItems.map(item => {
                      let colorClass = 'bg-orange-100 text-orange-900 border-orange-200 dark:bg-orange-950 dark:text-orange-200'
                      if (item.type === 'meeting') colorClass = 'bg-indigo-100 text-indigo-900 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-200'
                      if (item.type === 'field_survey') colorClass = 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200'
                      if (item.type === 'task') colorClass = 'bg-cyan-100 text-cyan-900 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-200'

                      return (
                        <div
                          key={item.id}
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border truncate cursor-pointer transition-transform hover:scale-[1.02] ${colorClass}`}
                          title={`${item.title} (${item.type})`}
                          onClick={() => {
                            if (item.meeting_link) window.open(item.meeting_link, '_blank')
                            else toast.info(`${item.title}\n${item.description || item.location || ''}`)
                          }}
                        >
                          {item.title}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* Agenda / Timeline List View */
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-card border border-border rounded-xl">
              <CalendarIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm font-bold text-foreground">
                {isHindi ? 'कोई निर्धारित कार्यक्रम या फील्ड रोस्टर नहीं' : 'No scheduled items found'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {isHindi ? 'नया कार्यक्रम या फील्ड सर्वेयर रोस्टर जोड़ें।' : 'Create an event or schedule a field deployment.'}
              </p>
            </div>
          ) : (
            filteredItems.map(item => {
              const itemDate = new Date(item.start_time)
              const isMeeting = item.type === 'meeting'
              const isField = item.type === 'field_survey'

              return (
                <div
                  key={item.id}
                  className="p-4 bg-card border border-border rounded-xl shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-muted border border-border min-w-[54px] shrink-0 text-center">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">
                        {itemDate.toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-black text-foreground leading-tight">
                        {itemDate.getDate()}
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isMeeting ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' :
                          isField ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                          'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                        }`}>
                          {item.type.replace('_', ' ')}
                        </span>

                        {item.role_target && item.role_target !== 'all' && (
                          <span className="text-[10px] font-semibold text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                            Target: {item.role_target}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-foreground truncate">{item.title}</h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Assigned Field Pairings */}
                      {item.assigned_members && item.assigned_members.length > 0 && (
                        <div className="flex items-center gap-1.5 pt-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                          <Users className="w-3.5 h-3.5" />
                          <span>Pair / Assigned: {item.assigned_members.map(m => m.name).join(' & ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {item.meeting_link && (
                      <Button
                        size="sm"
                        asChild
                        className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        <a href={item.meeting_link} target="_blank" rel="noreferrer">
                          <Video className="w-3.5 h-3.5 mr-1" />
                          {isHindi ? 'वीडियो कॉल से जुड़ें' : 'Join Video'}
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}

      {/* DIALOG 1: Field Deployment / Survey Pairing Scheduler */}
      <Dialog open={isFieldDeployOpen} onOpenChange={setIsFieldDeployOpen}>
        <DialogContent className="sm:max-w-lg bg-card text-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              {isHindi ? 'फील्ड सर्वे दल व कार्यकर्ता जोड़ी निर्धारित करें' : 'Schedule Field Survey & Member Pair'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isHindi
                ? 'सदस्यों की जोड़ी बनाकर क्षेत्र, वार्ड या फॉर्म सर्वेक्षण के लिए कार्य सौंपें। यह सीधे उनके कैलेंडर में सिंक होगा।'
                : 'Pair two or more members for door-to-door survey intake or field spot audits on a designated date.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScheduleDeployment} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">{isHindi ? 'अभियान / सर्वे शीर्षक *' : 'Deployment / Survey Title *'}</Label>
              <Input
                required
                value={deployTitle}
                onChange={e => setDeployTitle(e.target.value)}
                placeholder="e.g. Ward 44 Household Water & Grievance Intake"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isHindi ? 'लक्षित क्षेत्र / वार्ड *' : 'Target Area / Ward *'}</Label>
                <Input
                  required
                  value={deployArea}
                  onChange={e => setDeployArea(e.target.value)}
                  placeholder="e.g. Sector 12 Market / Gali 4"
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isHindi ? 'दिनांक व समय *' : 'Date & Time *'}</Label>
                <Input
                  type="datetime-local"
                  required
                  value={deployDate}
                  onChange={e => setDeployDate(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">{isHindi ? 'सर्वे फॉर्म / प्रोटोकॉल' : 'Survey Form / Intake Protocol'}</Label>
              <Input
                value={deployForm}
                onChange={e => setDeployForm(e.target.value)}
                placeholder="e.g. Grassroots Citizen Survey / Parcha Signature"
                className="text-xs"
              />
            </div>

            {/* Member Pair Selector */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">
                {isHindi ? 'सर्वे दल के सदस्य चुनें (कम से कम 1 या 2) *' : 'Select Assigned Members / Pair *'}
              </Label>
              <div className="max-h-36 overflow-y-auto border border-border rounded-lg p-2 space-y-1 bg-muted/30">
                {members.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-2">No active members found</p>
                ) : (
                  members.map(m => {
                    const isSelected = selectedMemberIds.includes(m.id)
                    return (
                      <label
                        key={m.id}
                        className={`flex items-center justify-between p-1.5 rounded cursor-pointer text-xs font-medium transition-colors ${
                          isSelected ? 'bg-orange-100 text-orange-950 dark:bg-orange-950/60 dark:text-orange-200' : 'hover:bg-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedMemberIds(prev =>
                                isSelected ? prev.filter(id => id !== m.id) : [...prev, m.id]
                              )
                            }}
                            className="rounded border-border text-orange-600 focus:ring-orange-500"
                          />
                          <span>{m.full_name}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-normal uppercase">{m.role}</span>
                      </label>
                    )
                  })
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">{isHindi ? 'विशेष निर्देश' : 'Field Instructions'}</Label>
              <Textarea
                value={deployInstructions}
                onChange={e => setDeployInstructions(e.target.value)}
                placeholder="e.g. Meet at Metro Gate 2 at 10 AM with printed survey sheets."
                rows={2}
                className="text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsFieldDeployOpen(false)}
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmittingDeploy}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold"
              >
                {isSubmittingDeploy ? (
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                )}
                {isHindi ? 'रोस्टर सेव करें' : 'Confirm & Schedule'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Apple iCal / Webcal Live Subscription */}
      <Dialog open={isSubscribeOpen} onOpenChange={setIsSubscribeOpen}>
        <DialogContent className="sm:max-w-md bg-card text-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-slate-900 dark:text-white" />
              {isHindi ? 'Apple Calendar एवं CalDAV सिंक' : 'Subscribe to Live Calendar Feed'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isHindi
                ? 'अपने iPhone, Mac या Android कैलेंडर में संगठन की सभाओं और बैठकों का ऑटो-अपडेटिंग कैलेंडर जोड़ें।'
                : 'Subscribe once to get live schedule changes automatically delivered to your iPhone, iPad, Mac, or Google Calendar.'}
            </DialogDescription>
          </DialogHeader>

          {subscriptionUrls && (
            <div className="space-y-4 pt-2">
              {/* 1-Tap iOS / Mac Button */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Apple Calendar (iOS / iPadOS / macOS)</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">1-Tap Live Sync</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tap below to trigger the native iOS subscription dialog.
                </p>
                <Button
                  size="sm"
                  asChild
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold"
                >
                  <a href={subscriptionUrls.webcalUrl}>
                    <Smartphone className="w-3.5 h-3.5 mr-1.5" />
                    {isHindi ? 'iPhone कैलेंडर में सब्सक्राइब करें' : 'Subscribe on iPhone / Mac Calendar'}
                  </a>
                </Button>
              </div>

              {/* Copyable Webcal / ICS Feed Link */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isHindi ? 'यूनिवर्सल iCal Feed URL' : 'Universal iCal Feed URL'}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={subscriptionUrls.icsUrl}
                    className="text-xs font-mono bg-muted"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(subscriptionUrls.icsUrl)
                      toast.success(isHindi ? 'कैलेंडर फीड लिंक कॉपी हुआ!' : 'Feed link copied to clipboard!')
                    }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Works with Google Calendar (From URL), Microsoft Outlook, and CalDAV sync apps.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DIALOG 3: Instant Google Meet Room Creator */}
      <Dialog open={meetModalOpen} onOpenChange={setMeetModalOpen}>
        <DialogContent className="sm:max-w-md bg-card text-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-600" />
              {isHindi ? 'त्वरित Google Meet वीडियो कक्ष' : 'Instant Google Meet Video Hub'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isHindi
                ? 'सदस्यों या समिति के साथ तुरंत 1-क्लिक वीडियो कॉल शुरू करें और लिंक साझा करें।'
                : 'Start an instant Google Meet room or conference call with members and committees.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">{isHindi ? 'बैठक का शीर्षक' : 'Meeting Title'}</Label>
              <Input
                value={meetTitle}
                onChange={e => setMeetTitle(e.target.value)}
                placeholder="e.g. Core Committee Emergency Video Sync"
                className="text-xs"
              />
            </div>

            {generatedMeetUrl ? (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-950/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{isHindi ? 'Google Meet कक्ष तैयार है:' : 'Google Meet room is active:'}</span>
                </div>
                <Input
                  readOnly
                  value={generatedMeetUrl}
                  className="text-xs font-mono bg-white dark:bg-slate-900"
                />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    asChild
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    <a href={generatedMeetUrl} target="_blank" rel="noreferrer">
                      <Video className="w-3.5 h-3.5 mr-1.5" />
                      {isHindi ? 'कॉल में प्रवेश करें' : 'Launch Video Room'}
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedMeetUrl)
                      toast.success(isHindi ? 'लिंक क्लिपबोर्ड पर कॉपी हुआ!' : 'Link copied to clipboard!')
                    }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleCreateInstantMeet}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                <Video className="w-3.5 h-3.5 mr-1.5" />
                {isHindi ? '1-क्लिक वीडियो कक्ष बनाएं' : 'Generate Instant Room Link'}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* DIALOG 4: Schedule Meeting / Assembly Modal */}
      <Dialog open={isMeetingModalOpen} onOpenChange={setIsMeetingModalOpen}>
        <DialogContent className="sm:max-w-lg bg-card text-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-indigo-600" />
              {isHindi ? 'बैठक / आम सभा निर्धारित करें' : 'Schedule Meeting / Assembly'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isHindi
                ? 'कार्यकारिणी बैठक, सामान्य सभा या ऑनलाइन वीडियो कॉल का समय और विवरण दर्ज करें।'
                : 'Schedule a governance assembly, committee sync, or online video call.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScheduleMeeting} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">{isHindi ? 'बैठक का नाम / शीर्षक *' : 'Meeting Title *'}</Label>
              <Input
                required
                value={meetingTitle}
                onChange={e => setMeetingTitle(e.target.value)}
                placeholder="e.g. Monthly Executive Council & Strategy Assembly"
                className="text-xs font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isHindi ? 'प्रारंभ तिथि व समय *' : 'Start Date & Time *'}</Label>
                <Input
                  required
                  type="datetime-local"
                  value={meetingDate}
                  onChange={e => setMeetingDate(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isHindi ? 'समाप्ति समय' : 'End Date & Time'}</Label>
                <Input
                  type="datetime-local"
                  value={meetingEndDate}
                  onChange={e => setMeetingEndDate(e.target.value)}
                  className="text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isHindi ? 'स्थान' : 'Location'}</Label>
                <Input
                  value={meetingLocation}
                  onChange={e => setMeetingLocation(e.target.value)}
                  placeholder="e.g. Union Hall / Online"
                  className="text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">{isHindi ? 'दृश्यता (Visibility)' : 'Visibility'}</Label>
                <select
                  value={meetingVisibility}
                  onChange={e => setMeetingVisibility(e.target.value as any)}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2.5 font-semibold"
                >
                  <option value="members">All Members (सभी सदस्य)</option>
                  <option value="private">Executive Committee Only (केवल कोर टीम)</option>
                  <option value="public">Public Assembly (सार्वजनिक)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-bold">{isHindi ? 'वीडियो मीटिंग लिंक' : 'Video Conference Link'}</Label>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await createInstantGoogleMeetRoom(meetingTitle || `${orgName} Meeting`)
                    if (res.success && res.meetUrl) {
                      setMeetingLink(res.meetUrl)
                      toast.success(isHindi ? 'Google Meet लिंक जोड़ा गया!' : 'Google Meet link generated!')
                    }
                  }}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <Video className="w-3 h-3" />
                  {isHindi ? 'Google Meet बनाएं' : 'Generate Meet Link'}
                </button>
              </div>
              <Input
                value={meetingLink}
                onChange={e => setMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/... or https://meet.jit.si/..."
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">{isHindi ? 'कार्यसूची / विवरण' : 'Agenda / Description'}</Label>
              <Textarea
                value={meetingDesc}
                onChange={e => setMeetingDesc(e.target.value)}
                placeholder="Key agenda points to discuss..."
                rows={3}
                className="text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmittingMeeting || !meetingTitle.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              {isSubmittingMeeting ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <CalendarIcon className="w-3.5 h-3.5 mr-1.5" />}
              {isHindi ? 'बैठक निर्धारित करें' : 'Schedule Meeting Now'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

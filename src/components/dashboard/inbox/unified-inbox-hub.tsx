'use client'

import React, { useState, useMemo } from 'react'
import {
  MessageSquare, Send, Smartphone, QrCode, Radio, Search,
  CheckCircle2, AlertTriangle, ShieldCheck, User, ArrowRight,
  Sparkles, Clock, RefreshCw, Layers, Megaphone, Plus, ExternalLink,
  Video, Phone, ShieldAlert, Copy, PowerOff, Zap, HelpCircle, Check,
  ChevronRight, Users, Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { toast } from 'sonner'
import {
  sendAdminDirectReplyAction,
  sendOrgMassBroadcastAction,
  getConversationHistoryAction,
  getOrgUnifiedCommunicationsAction,
  connectTelegramBotAction,
  sendTestOutboundMessageAction,
} from '@/actions/bot-channels'
import { triggerEmergencySosAction } from '@/actions/emergency-sos'
import { createInstantGoogleMeetRoom } from '@/actions/calendar-sync'
import { createAnnouncement } from '@/actions/announcements'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BotLog, BotConversation, BotChannelConfig } from '@/types/dashboard'

interface UnifiedInboxHubProps {
  lang: string
  orgId: string
  orgName: string
  configs: BotChannelConfig[]
  initialConversations: BotConversation[]
  stats: {
    totalConversations: number
    totalInboundMessages: number
    totalBotGrievances: number
    totalSosAlerts: number
  }
  initialSosAlerts?: any[]
  members?: Array<{ id: string; full_name: string; phone?: string | null; role: string | null }>
}

export function UnifiedInboxHub({
  lang,
  orgId,
  orgName,
  configs,
  initialConversations,
  stats: initialStats,
  initialSosAlerts = [],
  members = []
}: UnifiedInboxHubProps) {
  const router = useRouter()
  const isHindi = lang === 'hi'

  // Workspace Tab: 'chats' | 'telegram' | 'emergency' | 'broadcasts' | 'integrations'
  const [activeTab, setActiveTab] = useState<'chats' | 'telegram' | 'emergency' | 'broadcasts' | 'integrations'>('chats')

  // Chat State
  const [conversations, setConversations] = useState<BotConversation[]>(initialConversations)
  const [stats, setStats] = useState(initialStats)
  const [selectedConvId, setSelectedConvId] = useState<string | null>(
    initialConversations[0]?.id || null
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [chatLogs, setChatLogs] = useState<BotLog[]>([])
  const [loadingChat, setLoadingChat] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [sendingReply, setSendingReply] = useState(false)
  const [isLiveSyncing, setIsLiveSyncing] = useState(false)

  // Direct Member Chat Starter State
  const [newChatModalOpen, setNewChatModalOpen] = useState(false)
  const [selectedMemberToChat, setSelectedMemberToChat] = useState<string>('')

  // Broadcast Modal State
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [broadcastChannel, setBroadcastChannel] = useState<'telegram' | 'all'>('telegram')
  const [broadcastTitle, setBroadcastTitle] = useState('')
  const [broadcastMsg, setBroadcastMsg] = useState('')
  const [broadcasting, setBroadcasting] = useState(false)

  // Telegram Config State
  const tgConfig = configs.find((c) => c.channel === 'telegram')
  const [tgTokenModalOpen, setTgTokenModalOpen] = useState(false)
  const [tgToken, setTgToken] = useState<string>((tgConfig?.credentials as any)?.bot_token || '')
  const [tgLoading, setTgLoading] = useState(false)
  const [tgTestChatId, setTgTestChatId] = useState('')
  const [tgTestMsg, setTgTestMsg] = useState('Sangathan Telegram Bot operational!')
  const [tgSending, setTgSending] = useState(false)

  // Google Meet State
  const [meetModalOpen, setMeetModalOpen] = useState(false)
  const [meetTitle, setMeetTitle] = useState('')
  const [activeMeetLink, setActiveMeetLink] = useState('')

  // Emergency SOS State
  const [sosAlerts, setSosAlerts] = useState<any[]>(initialSosAlerts)
  const [sosForm, setSosForm] = useState({
    activist_name: '',
    contact_phone: '',
    location_name: '',
    situation_details: '',
    severity: 'critical' as const,
  })
  const [isTriggeringSos, setIsTriggeringSos] = useState(false)

  const selectedConv = conversations.find((c) => c.id === selectedConvId)

  // Real-time Live Subscription
  React.useEffect(() => {
    const supabase = createClient()

    const refreshInboxData = async () => {
      setIsLiveSyncing(true)
      const res = await getOrgUnifiedCommunicationsAction(orgId)
      if (res.success) {
        setConversations((res.conversations || []) as BotConversation[])
        if (res.stats) setStats(res.stats)
      }
      if (selectedConvId) {
        const historyRes = await getConversationHistoryAction(selectedConvId)
        if (historyRes.success) {
          setChatLogs(historyRes.logs || [])
        }
      }
      setIsLiveSyncing(false)
    }

    const channel = supabase
      .channel(`unified_inbox_${orgId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bot_logs',
          filter: `organisation_id=eq.${orgId}`,
        },
        (payload) => {
          const newLog = payload.new as any
          if (newLog.direction === 'incoming') {
            toast.info(`📩 New message: "${newLog.message_text?.slice(0, 35)}..."`)
          }
          refreshInboxData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orgId, selectedConvId])

  // Load chat logs when selected conversation changes
  React.useEffect(() => {
    if (!selectedConvId) {
      setChatLogs([])
      return
    }

    let isMounted = true
    setLoadingChat(true)

    getConversationHistoryAction(selectedConvId).then((res) => {
      if (isMounted) {
        if (res.success && res.logs) {
          setChatLogs(res.logs)
        } else {
          setChatLogs([])
        }
        setLoadingChat(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [selectedConvId])

  // Google Meet Permission Consent Trigger
  async function handleConnectGoogleMeet() {
    const supabase = createClient()
    toast.info(isHindi ? 'गूगल अनुमति से कनेक्ट हो रहा है...' : 'Requesting Google Meet & Calendar permission...')
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

  // Create Google Meet Room and paste into chat
  async function handleCreateMeetForChat() {
    const res = await createInstantGoogleMeetRoom(`${orgName} Member Sync`)
    if (res.success && res.meetUrl) {
      setReplyText((prev) => `${prev ? prev + '\n\n' : ''}🎥 Join our Google Meet video call: ${res.meetUrl}`)
      toast.success(isHindi ? 'Google Meet लिंक संदेश में जोड़ा गया!' : 'Google Meet link added to message draft!')
    }
  }

  // Create Standalone Meet Room
  async function handleCreateStandaloneMeet() {
    const res = await createInstantGoogleMeetRoom(meetTitle || `${orgName} Video Call`)
    if (res.success && res.meetUrl) {
      setActiveMeetLink(res.meetUrl)
      toast.success(isHindi ? 'Google Meet कक्ष तैयार!' : 'Google Meet room created!')
    }
  }

  // Send Direct Admin / Member Reply
  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedConv || !replyText.trim()) return

    setSendingReply(true)
    const res = await sendAdminDirectReplyAction({
      conversationId: selectedConv.id,
      replyText: replyText.trim(),
    })
    setSendingReply(false)

    if (res.success) {
      toast.success(isHindi ? 'संदेश सफलतापूर्वक भेजा गया!' : 'Message dispatched!')
      setReplyText('')
      // Reload chat logs
      const historyRes = await getConversationHistoryAction(selectedConv.id)
      if (historyRes.success) {
        setChatLogs(historyRes.logs || [])
      }
    } else {
      toast.error(res.error || 'Failed to dispatch reply')
    }
  }

  // Save Telegram Bot Token
  async function handleSaveTelegramToken(e: React.FormEvent) {
    e.preventDefault()
    if (!tgToken.trim()) return

    setTgLoading(true)
    const res = await connectTelegramBotAction(tgToken.trim())
    setTgLoading(false)

    if (res.success) {
      toast.success(
        isHindi
          ? 'टेलीग्राम बॉट सफलतापूर्वक कनेक्ट हो गया!'
          : 'Telegram bot connected with grammY webhooks!'
      )
      setTgTokenModalOpen(false)
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to connect Telegram Bot')
    }
  }

  // Mass Broadcast Submission
  async function handleSendBroadcast(e: React.FormEvent) {
    e.preventDefault()
    if (!broadcastMsg.trim()) return

    setBroadcasting(true)
    if (broadcastChannel === 'telegram') {
      const res = await sendOrgMassBroadcastAction({
        channel: 'telegram',
        broadcastMessage: broadcastMsg.trim(),
      })
      setBroadcasting(false)
      if (res.success) {
        const count = res.sentCount || 0
        toast.success(
          isHindi
            ? `${count} टेलीग्राम सदस्यों को ब्रॉडकास्ट भेजा गया!`
            : `Broadcast transmitted to ${count} Telegram members!`
        )
        setBroadcastOpen(false)
        setBroadcastMsg('')
      } else {
        toast.error(res.error || 'Failed to broadcast')
      }
    } else {
      // General Notice Board Announcement
      const res = await createAnnouncement({
        title: broadcastTitle || 'Urgent Organization Notice',
        content: broadcastMsg.trim(),
        visibility_level: 'members',
        is_pinned: true,
        send_email: false,
      })
      setBroadcasting(false)
      if (res.success) {
        toast.success(isHindi ? 'सूचना प्रकाशित!' : 'Announcement published!')
        setBroadcastOpen(false)
        setBroadcastMsg('')
        setBroadcastTitle('')
      } else {
        toast.error(res.error || 'Failed to create announcement')
      }
    }
  }

  // Trigger Emergency SOS
  async function handleTriggerSos(e: React.FormEvent) {
    e.preventDefault()
    if (!sosForm.activist_name || !sosForm.contact_phone) {
      toast.error('Activist name and contact phone required')
      return
    }

    setIsTriggeringSos(true)
    const res = await triggerEmergencySosAction({
      activist_name: sosForm.activist_name,
      contact_phone: sosForm.contact_phone,
      location_name: sosForm.location_name || 'Field Location',
      detainee_count: 1,
      situation_details: sosForm.situation_details || 'Detention or security incident reported.',
      severity: sosForm.severity,
    })
    setIsTriggeringSos(false)

    if (res.success && res.data) {
      toast.success(isHindi ? 'एसओएस अलर्ट सक्रिय!' : 'Emergency SOS Alert Broadcasted!')
      setSosAlerts((prev) => [res.data.alert, ...prev])
      setSosForm({
        activist_name: '',
        contact_phone: '',
        location_name: '',
        situation_details: '',
        severity: 'critical',
      })
    } else {
      toast.error(res.error || 'Failed to trigger SOS')
    }
  }

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (!searchTerm) return true
      const term = searchTerm.toLowerCase()
      return (
        c.sender_name?.toLowerCase().includes(term) ||
        c.sender_id?.includes(term) ||
        c.last_command?.toLowerCase().includes(term) ||
        c.member?.full_name?.toLowerCase().includes(term) ||
        c.member?.phone?.includes(term)
      )
    })
  }, [conversations, searchTerm])

  const isTgActive = tgConfig?.status === 'connected'

  return (
    <div className="space-y-5">
      {/* 1. Header Bar with Status Conduits & Instant Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
            <MessageSquare className="w-4 h-4" />
            <span>{isHindi ? 'एकीकृत इनबॉक्स एवं डिस्पैच डेस्क' : 'Unified Communications & Dispatch Hub'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {isHindi ? 'इनबॉक्स एवं संवाद' : 'Inbox & Live Dispatch'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {isHindi
              ? '2-तरफा सदस्य चैट, टेलीग्राम बॉट, Google Meet वीडियो कॉल, ब्रॉडकास्ट और आपातकालीन SOS एक ही स्थान पर।'
              : '2-way direct member chats, Telegram bots, Google Meet video calls, announcements, and emergency SOS.'}
          </p>
        </div>

        {/* Action Buttons & Integration Connectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Google Meet Permission / Connect */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleConnectGoogleMeet}
            className="text-xs font-semibold border-emerald-200 bg-emerald-50/50 text-emerald-800 hover:bg-emerald-100/60 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            <Video className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            {isHindi ? 'Google Meet अनुमति' : 'Connect Google Meet'}
          </Button>

          {/* Telegram Bot Connect Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTgTokenModalOpen(true)}
            className="text-xs font-semibold border-sky-200 bg-sky-50/50 text-sky-800 hover:bg-sky-100/60 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300"
          >
            <Radio className="w-3.5 h-3.5 mr-1.5 text-sky-600" />
            {isTgActive ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Telegram: Connected
              </span>
            ) : (
              isHindi ? 'Telegram बॉट जोड़ें' : 'Connect Telegram'
            )}
          </Button>

          {/* Instant Video Call Modal Trigger */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMeetModalOpen(true)}
            className="text-xs font-semibold border-indigo-200 bg-indigo-50/50 text-indigo-800 hover:bg-indigo-100/60 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300"
          >
            <Video className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
            {isHindi ? 'त्वरित वीडियो कॉल' : 'Start Video Call'}
          </Button>

          {/* Mass Broadcast Trigger */}
          <Button
            size="sm"
            onClick={() => setBroadcastOpen(true)}
            className="text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-xs"
          >
            <Megaphone className="w-3.5 h-3.5 mr-1.5" />
            {isHindi ? 'नया ब्रॉडकास्ट' : 'Mass Broadcast'}
          </Button>
        </div>
      </div>

      {/* 2. Unified KPIs Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-card border border-border rounded-xl shadow-2xs">
          <div className="text-[11px] font-bold text-muted-foreground uppercase">Active Member Chats</div>
          <div className="text-xl font-black text-foreground mt-0.5">{stats.totalConversations}</div>
        </div>
        <div className="p-3 bg-card border border-border rounded-xl shadow-2xs">
          <div className="text-[11px] font-bold text-muted-foreground uppercase">Inbound Messages</div>
          <div className="text-xl font-black text-foreground mt-0.5">{stats.totalInboundMessages}</div>
        </div>
        <div className="p-3 bg-card border border-border rounded-xl shadow-2xs">
          <div className="text-[11px] font-bold text-muted-foreground uppercase">Telegram Bot Status</div>
          <div className="text-sm font-bold text-sky-600 mt-1 flex items-center gap-1.5">
            {isTgActive ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Active Webhook
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                Unlinked
              </>
            )}
          </div>
        </div>
        <div className="p-3 bg-card border border-border rounded-xl shadow-2xs">
          <div className="text-[11px] font-bold text-muted-foreground uppercase">Emergency SOS Desk</div>
          <div className="text-sm font-bold text-rose-600 mt-1 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            {stats.totalSosAlerts} Active
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border pb-2 scrollbar-none">
        {[
          { id: 'chats', label: isHindi ? '2-तरफा सदस्य संवाद' : 'Direct & Member Chats', icon: MessageSquare },
          { id: 'telegram', label: isHindi ? 'टेलीग्राम बॉट एवं चैनल' : 'Telegram Bot & Channels', icon: Radio },
          { id: 'emergency', label: isHindi ? 'आपातकालीन एसओएस (SOS)' : 'Emergency SOS', icon: ShieldAlert },
          { id: 'broadcasts', label: isHindi ? 'ब्रॉडकास्ट एवं घोषणाएं' : 'Announcements & Broadcasts', icon: Megaphone },
          { id: 'integrations', label: isHindi ? 'कनेक्टर्स व ऐप्स' : 'Apps & Conduits', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-orange-600 text-white shadow-2xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 4. Tab 1: Direct Member Chats & Unified Inbound Workspace */}
      {activeTab === 'chats' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-card border border-border rounded-xl shadow-2xs overflow-hidden min-h-[580px]">
          {/* Left Column: Conversation Roster */}
          <div className="md:col-span-5 border-r border-border flex flex-col h-full bg-muted/20">
            {/* Search + New Chat Button */}
            <div className="p-3 border-b border-border flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isHindi ? 'नाम, फोन या संदेश खोजें...' : 'Search by name, phone or text...'}
                  className="pl-8 text-xs bg-background h-9"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setNewChatModalOpen(true)}
                className="text-xs shrink-0 font-bold"
                title="Start Direct Member Chat"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto divide-y divide-border/60 max-h-[500px]">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-muted-foreground/40" />
                  <p className="font-bold">{isHindi ? 'कोई सक्रिय चैट नहीं मिली' : 'No active chats found'}</p>
                  <p className="mt-1">{isHindi ? 'टेलीग्राम बॉट कनेक्ट करें या सदस्यों को संदेश भेजें।' : 'Connect Telegram or start a direct message.'}</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = selectedConvId === conv.id
                  const isTg = conv.channel === 'telegram'
                  const titleName = conv.sender_name || conv.member?.full_name || conv.sender_id || 'Member'
                  return (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`p-3 cursor-pointer transition-colors flex items-start gap-3 ${
                        isSelected
                          ? 'bg-orange-50/80 dark:bg-orange-950/40 border-l-4 border-orange-600'
                          : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 text-foreground font-bold text-xs">
                        {isTg ? 'TG' : 'WA'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground truncate">
                            {titleName}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {conv.updated_at ? new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {conv.last_command ? `Command: ${conv.last_command}` : (conv.last_state || 'Active thread')}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border">
                            {conv.channel}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Column: Chat History & Reply Box */}
          <div className="md:col-span-7 flex flex-col h-full bg-background">
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-3.5 border-b border-border flex items-center justify-between bg-card">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200 flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-foreground truncate">
                        {selectedConv.sender_name || selectedConv.member?.full_name || selectedConv.sender_id || 'Member Thread'}
                      </h3>
                      <p className="text-[10px] text-muted-foreground">
                        Via {selectedConv.channel?.toUpperCase()} • Sender ID: {selectedConv.sender_id}
                      </p>
                    </div>
                  </div>

                  {/* 1-Click Google Meet Insert */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCreateMeetForChat}
                    className="text-xs font-bold border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                  >
                    <Video className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    {isHindi ? '+ Google Meet आमंत्रण' : '+ Add Meet Link'}
                  </Button>
                </div>

                {/* Chat Log Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[400px]">
                  {loadingChat ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-muted-foreground" />
                      Loading message history...
                    </div>
                  ) : chatLogs.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                      No previous chat logs in this conversation thread.
                    </div>
                  ) : (
                    chatLogs.map((log) => {
                      const isOutgoing = log.direction === 'outgoing'
                      return (
                        <div
                          key={log.id}
                          className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                              isOutgoing
                                ? 'bg-orange-600 text-white rounded-br-none'
                                : 'bg-muted text-foreground rounded-bl-none border border-border'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{log.message_text}</p>
                          </div>
                          <span className="text-[9px] text-muted-foreground mt-1 px-1">
                            {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )
                    })
                  )}
                </div>

                {/* Reply Composer */}
                <form onSubmit={handleSendReply} className="p-3 border-t border-border bg-card flex items-center gap-2">
                  <Input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={isHindi ? 'संदेश लिखें (Google Meet लिंक सहित)...' : 'Type a reply or attach Google Meet link...'}
                    className="text-xs flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={sendingReply || !replyText.trim()}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold"
                  >
                    {sendingReply ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5 mr-1" />
                    )}
                    {isHindi ? 'भेजें' : 'Send'}
                  </Button>
                </form>
              </>
            ) : (
              <div className="p-12 text-center text-muted-foreground m-auto">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 text-muted-foreground/40" />
                <h4 className="text-sm font-bold text-foreground">Select a conversation</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose a member thread from the left roster to read messages and send direct replies.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Tab 2: Telegram Bot & Channels Studio */}
      {activeTab === 'telegram' && (
        <div className="p-6 bg-card border border-border rounded-xl shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Radio className="w-4 h-4 text-sky-500" />
                Telegram Bot & Channels Management
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Automated 2-way telegram dispatch with grammY webhooks for civic mobilization.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setTgTokenModalOpen(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
            >
              {isTgActive ? 'Re-configure Bot Token' : 'Link Telegram Bot'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 dark:border-sky-950 dark:bg-sky-950/20 space-y-2">
              <span className="text-xs font-bold text-sky-950 dark:text-sky-200 uppercase tracking-wider">
                1. Bot Token & Webhook Status
              </span>
              <p className="text-xs text-muted-foreground">
                {isTgActive
                  ? 'Your bot is receiving incoming messages and commands in real time via HTTPS webhook.'
                  : 'No active Telegram bot connected. Create a bot on @BotFather and paste your bot token.'}
              </p>
              <div className="pt-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  isTgActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                }`}>
                  {isTgActive ? '✅ Status: Live & Connected' : '⚠️ Status: Unlinked'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                2. Test Bot Outbound Message
              </span>
              <p className="text-xs text-muted-foreground">
                Verify outbound delivery to any Telegram Chat ID.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <Input
                  value={tgTestChatId}
                  onChange={(e) => setTgTestChatId(e.target.value)}
                  placeholder="Telegram Chat ID (e.g. 123456789)"
                  className="text-xs bg-background"
                />
                <Button
                  size="sm"
                  disabled={tgSending || !tgTestChatId}
                  onClick={async () => {
                    setTgSending(true)
                    const res = await sendTestOutboundMessageAction({
                      channel: 'telegram',
                      recipientId: tgTestChatId,
                      messageText: tgTestMsg,
                    })
                    setTgSending(false)
                    if (res.success) toast.success('Test message delivered!')
                    else toast.error(res.error || 'Failed to send test message')
                  }}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
                >
                  {tgSending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Send Test'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Tab 3: Emergency SOS Crisis Desk */}
      {activeTab === 'emergency' && (
        <div className="p-6 bg-card border border-border rounded-xl shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Emergency SOS & Legal Rapid Response
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                1-tap crisis alert and legal defense network for peaceful activists, detainees, and emergency situations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Quick Trigger Form */}
            <div className="lg:col-span-5 p-4 rounded-xl border border-rose-200 bg-rose-50/40 dark:border-rose-950 dark:bg-rose-950/20 space-y-3">
              <span className="text-xs font-bold text-rose-900 dark:text-rose-200 uppercase tracking-wider">
                Broadcast Emergency SOS Alert
              </span>
              <form onSubmit={handleTriggerSos} className="space-y-3">
                <div>
                  <Label className="text-xs font-bold">Activist / Member Name *</Label>
                  <Input
                    required
                    value={sosForm.activist_name}
                    onChange={(e) => setSosForm((prev) => ({ ...prev, activist_name: e.target.value }))}
                    placeholder="e.g. Rahul Verma"
                    className="text-xs bg-background"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold">Contact Phone Number *</Label>
                  <Input
                    required
                    value={sosForm.contact_phone}
                    onChange={(e) => setSosForm((prev) => ({ ...prev, contact_phone: e.target.value }))}
                    placeholder="e.g. 9876543210"
                    className="text-xs bg-background"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold">Location / Police Station</Label>
                  <Input
                    value={sosForm.location_name}
                    onChange={(e) => setSosForm((prev) => ({ ...prev, location_name: e.target.value }))}
                    placeholder="e.g. Connaught Place Police Station"
                    className="text-xs bg-background"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold">Situation Details</Label>
                  <Textarea
                    value={sosForm.situation_details}
                    onChange={(e) => setSosForm((prev) => ({ ...prev, situation_details: e.target.value }))}
                    placeholder="Brief description of detention, protest incident or emergency..."
                    rows={2}
                    className="text-xs bg-background"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isTriggeringSos}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                >
                  {isTriggeringSos ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />}
                  Broadcast Emergency SOS
                </Button>
              </form>
            </div>

            {/* Active SOS Log Feed */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                Active Incident Alerts ({sosAlerts.length})
              </span>
              {sosAlerts.length === 0 ? (
                <div className="p-8 text-center border border-border rounded-xl bg-muted/20 text-xs text-muted-foreground">
                  <ShieldCheck className="w-8 h-8 mx-auto mb-1 text-emerald-600" />
                  No active SOS incidents reported. All units safe.
                </div>
              ) : (
                sosAlerts.map((alt) => (
                  <div key={alt.id} className="p-3.5 rounded-xl border border-rose-200 bg-card space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-700">{alt.activist_name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
                        {alt.status || 'Active Alert'}
                      </span>
                    </div>
                    <p className="text-xs text-foreground">{alt.situation_details}</p>
                    <p className="text-[10px] text-muted-foreground">Location: {alt.location_name} • Phone: {alt.contact_phone}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. Tab 4: Announcements & Mass Broadcasts */}
      {activeTab === 'broadcasts' && (
        <div className="p-6 bg-card border border-border rounded-xl shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-orange-600" />
                Announcements & Notice Board Hub
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Broadcast official notices, resolutions, and general bulletins across members.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setBroadcastOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Publish Announcement
            </Button>
          </div>

          <div className="p-8 text-center bg-muted/20 border border-border rounded-xl">
            <Megaphone className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <p className="text-xs font-bold text-foreground">Multi-Channel Broadcast Ready</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              Broadcast announcements instantly to member dashboards, Telegram channels, and mobile devices.
            </p>
          </div>
        </div>
      )}

      {/* 8. Tab 5: Conduits & Integrations Hub */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-card border border-border rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600">
              <Radio className="w-4 h-4" />
              <span>Telegram Bot Conduit</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Automated 2-way telegram dispatch with grammY webhooks.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTgTokenModalOpen(true)}
              className="w-full text-xs font-bold"
            >
              {isTgActive ? 'Configure Token' : 'Connect Telegram'}
            </Button>
          </div>

          <div className="p-4 bg-card border border-border rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <Video className="w-4 h-4" />
              <span>Google Meet Video Hub</span>
            </div>
            <p className="text-xs text-muted-foreground">
              1-click instant Google Meet room generator with video calling directly from chat threads.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={handleConnectGoogleMeet}
              className="w-full text-xs font-bold"
            >
              Connect Google Account
            </Button>
          </div>

          <div className="p-4 bg-card border border-border rounded-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
              <ShieldAlert className="w-4 h-4" />
              <span>Emergency Legal SOS</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Instant rapid dispatch for detention defense and urgent alerts.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveTab('emergency')}
              className="w-full text-xs font-bold"
            >
              Open Crisis Desk
            </Button>
          </div>
        </div>
      )}

      {/* MODAL 1: Telegram Bot Connector */}
      <Dialog open={tgTokenModalOpen} onOpenChange={setTgTokenModalOpen}>
        <DialogContent className="sm:max-w-md bg-card text-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Radio className="w-5 h-5 text-sky-500" />
              {isHindi ? 'Telegram बॉट कनेक्ट करें' : 'Connect Telegram Bot'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isHindi
                ? 'BotFather से प्राप्त बॉट टोकन पेस्ट करें।'
                : 'Paste the Telegram Bot Token generated from @BotFather.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveTelegramToken} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Bot Token *</Label>
              <Input
                required
                value={tgToken}
                onChange={(e) => setTgToken(e.target.value)}
                placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                className="text-xs font-mono"
              />
            </div>
            <Button
              type="submit"
              disabled={tgLoading || !tgToken.trim()}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs"
            >
              {tgLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : null}
              {isHindi ? 'टोकन सेव करें एवं बॉट सक्रिय करें' : 'Verify & Activate Bot'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: Mass Broadcast Desk */}
      <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
        <DialogContent className="sm:max-w-md bg-card text-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-orange-600" />
              {isHindi ? 'मास ब्रॉडकास्ट ट्रांसमिट करें' : 'Transmit Mass Broadcast'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isHindi
                ? 'टेलीग्राम चैनल या संगठन सूचना पट्ट पर संदेश प्रसारित करें।'
                : 'Send instant messages to linked Telegram channels and member notice boards.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendBroadcast} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Broadcast Channel</Label>
              <select
                value={broadcastChannel}
                onChange={(e) => setBroadcastChannel(e.target.value as any)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2 font-semibold"
              >
                <option value="telegram">Telegram Broadcast Channel</option>
                <option value="all">Member Notice Board & Dashboard</option>
              </select>
            </div>

            {broadcastChannel === 'all' && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Notice Title</Label>
                <Input
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="e.g. Urgent General Assembly Notice"
                  className="text-xs"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Broadcast Message Content *</Label>
              <Textarea
                required
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Type the message to transmit..."
                rows={4}
                className="text-xs"
              />
            </div>

            <Button
              type="submit"
              disabled={broadcasting || !broadcastMsg.trim()}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
            >
              {broadcasting ? <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Megaphone className="w-3.5 h-3.5 mr-1.5" />}
              {isHindi ? 'ब्रॉडकास्ट ट्रांसमिट करें' : 'Transmit Broadcast Now'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: Instant Google Meet Room */}
      <Dialog open={meetModalOpen} onOpenChange={setMeetModalOpen}>
        <DialogContent className="sm:max-w-md bg-card text-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Video className="w-5 h-5 text-indigo-600" />
              {isHindi ? 'Google Meet कक्ष शुरू करें' : 'Start Google Meet Video Call'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isHindi
                ? 'तुरंत 1-क्लिक वीडियो कक्ष बनाएं और सदस्यों के साथ लिंक साझा करें।'
                : 'Instantly generate an open video conference link for member syncs.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Room / Meeting Title</Label>
              <Input
                value={meetTitle}
                onChange={(e) => setMeetTitle(e.target.value)}
                placeholder="e.g. General Member Live Sync"
                className="text-xs"
              />
            </div>

            {activeMeetLink ? (
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50 dark:border-indigo-950 dark:bg-indigo-950/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 dark:text-indigo-300">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Video Room is Active</span>
                </div>
                <Input readOnly value={activeMeetLink} className="text-xs font-mono bg-white dark:bg-slate-900" />
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    asChild
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                  >
                    <a href={activeMeetLink} target="_blank" rel="noreferrer">
                      <Video className="w-3.5 h-3.5 mr-1" />
                      Join Video Call
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(activeMeetLink)
                      toast.success('Meeting link copied!')
                    }}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleCreateStandaloneMeet}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                <Video className="w-3.5 h-3.5 mr-1.5" />
                Generate Instant Meeting Room
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: Start Direct Member Chat */}
      <Dialog open={newChatModalOpen} onOpenChange={setNewChatModalOpen}>
        <DialogContent className="sm:max-w-md bg-card text-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-600" />
              {isHindi ? 'सदस्य के साथ डायरेक्ट चैट शुरू करें' : 'Start Direct Member Chat'}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {isHindi
                ? 'संगठन के पंजीकृत सदस्यों में से किसी को भी सीधे संदेश या Google Meet आमंत्रण भेजें।'
                : 'Select a registered member from the directory to start a direct message thread.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Select Member from Directory</Label>
              <select
                value={selectedMemberToChat}
                onChange={(e) => setSelectedMemberToChat(e.target.value)}
                className="w-full text-xs bg-background border border-border rounded-lg p-2.5 font-semibold"
              >
                <option value="">-- Choose Member --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name} ({m.role || 'member'}) - {m.phone || 'No phone'}
                  </option>
                ))}
              </select>
            </div>

            <Button
              disabled={!selectedMemberToChat}
              onClick={() => {
                const targetMember = members.find((m) => m.id === selectedMemberToChat)
                if (targetMember) {
                  const existingConv = conversations.find(
                    (c) => c.sender_id === targetMember.id || c.sender_name === targetMember.full_name
                  )
                  if (existingConv) {
                    setSelectedConvId(existingConv.id)
                  } else {
                    const tempId = `direct-${targetMember.id}`
                    const newConv: BotConversation = {
                      id: tempId,
                      channel: 'whatsapp',
                      sender_id: targetMember.id,
                      sender_name: targetMember.full_name,
                      last_command: 'DIRECT_CHAT',
                      last_state: 'active',
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      member: {
                        id: targetMember.id,
                        full_name: targetMember.full_name,
                        phone: targetMember.phone,
                        role: targetMember.role
                      }
                    }
                    setConversations((prev) => [newConv, ...prev])
                    setSelectedConvId(tempId)
                  }
                  setNewChatModalOpen(false)
                }
              }}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
            >
              Open Chat Thread
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

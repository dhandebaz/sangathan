'use client'

import React, { useState, useCallback } from 'react'
import {
  MessageSquare, Send, Smartphone, QrCode, Radio, Search,
  CheckCircle2, AlertTriangle, ShieldCheck, User, ArrowRight,
  Sparkles, Clock, RefreshCw, Layers, Megaphone, Plus, ExternalLink
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
} from '@/actions/bot-channels'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BotLog, BotConversation, BotChannelConfig } from '@/types/dashboard'

interface CommunicationsClientProps {
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
}

export function CommunicationsClient({
  lang,
  orgId,
  orgName,
  configs,
  initialConversations,
  stats: initialStats,
}: CommunicationsClientProps) {
  const router = useRouter()
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

  // Broadcast Modal State
  const [broadcastOpen, setBroadcastOpen] = useState(false)
  const [broadcastChannel, setBroadcastChannel] = useState<'all' | 'whatsapp_qr' | 'telegram'>('all')
  const [broadcastMsg, setBroadcastMsg] = useState('')
  const [broadcasting, setBroadcasting] = useState(false)

  // Active channel status
  const tgConfig = configs.find((c) => c.channel === 'telegram')
  const waConfig = configs.find((c) => c.channel === 'whatsapp_qr' || c.channel === 'whatsapp_cloud')

  const selectedConv = conversations.find((c) => c.id === selectedConvId)

  // 1. Real-time Live Subscription via Supabase Realtime + Polling Sync
  React.useEffect(() => {
    const supabase = createClient()

    // Function to reload inbox data
    const refreshInboxData = async () => {
      setIsLiveSyncing(true)
      const res = await getOrgUnifiedCommunicationsAction(orgId)
      if (res.success) {
        setConversations((res.conversations || []) as BotConversation[])
        setStats(res.stats)
      }
      if (selectedConvId) {
        const historyRes = await getConversationHistoryAction(selectedConvId)
        if (historyRes.success) {
          setChatLogs(historyRes.logs || [])
        }
      }
      setIsLiveSyncing(false)
    }

    // Subscribe to real-time Postgres changes for bot_logs and bot_conversations
    const channel = supabase
      .channel(`org_comms_${orgId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bot_logs',
          filter: `organisation_id=eq.${orgId}`,
        },
        (payload) => {
          const newLog = payload.new
          if (newLog.direction === 'incoming') {
            toast.info(`📩 New message: "${newLog.message_text.slice(0, 35)}..."`)
          }
          refreshInboxData()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bot_conversations',
          filter: `organisation_id=eq.${orgId}`,
        },
        () => {
          refreshInboxData()
        }
      )
      .subscribe()

    // Also run periodic background poll every 4 seconds as a fallback
    const pollInterval = setInterval(() => {
      refreshInboxData()
    }, 4000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(pollInterval)
    }
  }, [orgId, selectedConvId])

  // Load chat history when selected conversation changes
  React.useEffect(() => {
    if (!selectedConvId) return
    let isMounted = true
    setLoadingChat(true)
    getConversationHistoryAction(selectedConvId).then((res) => {
      if (isMounted) {
        setChatLogs(res.logs || [])
        setLoadingChat(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [selectedConvId])

  const handleSendReply = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedConvId || !replyText.trim()) return

    setSendingReply(true)
    const res = await sendAdminDirectReplyAction({
      conversationId: selectedConvId,
      replyText: replyText.trim(),
    })
    setSendingReply(false)

    if (res.success) {
      toast.success('Direct reply dispatched to member!')
      const newLog = {
        id: 'temp-' + crypto.randomUUID(),
        conversation_id: selectedConvId,
        channel: selectedConv?.channel || 'whatsapp',
        direction: 'outgoing' as const,
        message_text: replyText.trim(),
        created_at: new Date().toISOString(),
      }
      setChatLogs((prev) => [...prev, newLog])
      setReplyText('')
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to dispatch reply.')
    }
  }, [selectedConvId, replyText, selectedConv, router])

  async function handleBroadcast(e: React.FormEvent) {
    e.preventDefault()
    if (!broadcastMsg.trim()) return

    setBroadcasting(true)
    const res = await sendOrgMassBroadcastAction({
      channel: broadcastChannel,
      broadcastMessage: broadcastMsg.trim(),
    })
    setBroadcasting(false)

    if (res.success) {
      toast.success(`Mass broadcast transmitted to ${res.sentCount} members!`)
      setBroadcastOpen(false)
      setBroadcastMsg('')
      router.refresh()
    } else {
      toast.error(res.error || 'Broadcast failed.')
    }
  }

  const filteredConversations = conversations.filter((c) => {
    const q = searchTerm.toLowerCase()
    return (
      (c.sender_name && c.sender_name.toLowerCase().includes(q)) ||
      (c.sender_id && c.sender_id.includes(q)) ||
      (c.last_command && c.last_command.toLowerCase().includes(q))
    )
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-indigo-600" />
            <span>Unified Member Communications &amp; Dispatch Desk</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Centralized 2-way inbox for <strong>{orgName}</strong>. View incoming WhatsApp &amp; Telegram messages, send direct admin responses, and transmit mass announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold rounded-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Realtime Live Stream</span>
          </div>

          <Button
            size="sm"
            onClick={() => setBroadcastOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 rounded-sm shadow-xs"
          >
            <Megaphone className="w-3.5 h-3.5 mr-1.5" />
            New Mass Broadcast
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-xs border-slate-300 font-semibold text-slate-700 h-9"
          >
            <Link href={`/${lang}/dashboard/channels`}>
              <Radio className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              Manage Master Channels
            </Link>
          </Button>
        </div>
      </div>

      {/* Master Channels Connectivity Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Master Telegram Card */}
        <div className="p-4 bg-white border border-slate-200 rounded-sm shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Master Telegram Bot: {tgConfig?.credentials?.bot_username ? `@${tgConfig.credentials.bot_username}` : 'Not Connected'}
              </div>
              <p className="text-[11px] text-slate-500">
                {tgConfig?.status === 'connected' ? 'Auto-Webhook Active • grammY Powered' : 'Connect your Telegram Bot Token in 30s'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${
                tgConfig?.status === 'connected'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {tgConfig?.status === 'connected' ? 'Active' : 'Unlinked'}
            </span>
             <Button asChild variant="ghost" size="sm" className="h-10 text-xs text-indigo-600">
               <Link href={`/${lang}/dashboard/channels`}>
                 Configure
               </Link>
             </Button>
          </div>
        </div>

        {/* Master WhatsApp Card */}
        <div className="p-4 bg-white border border-slate-200 rounded-sm shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Master WhatsApp: {waConfig?.credentials?.connected_phone ? `+${waConfig.credentials.connected_phone}` : 'Scan QR to Pair'}
              </div>
              <p className="text-[11px] text-slate-500">
                {waConfig?.status === 'connected' ? 'Multi-Device Session Active' : 'Scan dynamic QR code with organizer phone'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${
                waConfig?.status === 'connected'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {waConfig?.status === 'connected' ? 'Linked' : 'Scan Required'}
            </span>
             <Button asChild variant="ghost" size="sm" className="h-10 text-xs text-emerald-700">
               <Link href={`/${lang}/dashboard/channels`}>
                 Pair QR
               </Link>
             </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-sm">
          <div className="text-xs text-slate-500 font-semibold">Active Member Chats</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{stats.totalConversations}</div>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-sm">
          <div className="text-xs text-slate-500 font-semibold">Inbound Messages</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{stats.totalInboundMessages}</div>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-sm">
          <div className="text-xs text-slate-500 font-semibold">Grievances Auto-Logged</div>
          <div className="text-xl font-bold text-slate-900 mt-1">{stats.totalBotGrievances}</div>
        </div>
        <div className="p-3.5 bg-white border border-slate-200 rounded-sm">
          <div className="text-xs text-slate-500 font-semibold">Emergency SOS Alerts</div>
          <div className="text-xl font-bold text-rose-600 mt-1">{stats.totalSosAlerts}</div>
        </div>
      </div>

      {/* Split-Screen Unified Communications Inbox */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-xs grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        {/* Left Sidebar: Conversation List */}
        <div className="lg:col-span-4 border-r border-slate-200 flex flex-col">
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <Input
                placeholder="Search by name, phone, or command..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs rounded-sm bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 max-h-[500px]">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === selectedConvId
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full p-3.5 text-left transition-colors flex items-start gap-3 ${
                    isSelected ? 'bg-indigo-50/70 border-l-4 border-indigo-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      conv.channel === 'telegram'
                        ? 'bg-sky-100 text-sky-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {conv.channel === 'telegram' ? <Send className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {conv.sender_name || conv.sender_id}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(conv.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                      {conv.sender_id}
                    </div>

                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 text-[9px] font-bold uppercase rounded font-mono">
                        {conv.channel}
                      </span>
                      {conv.last_command && (
                        <span className="px-1.5 py-0.2 bg-indigo-100 text-indigo-800 text-[9px] font-bold uppercase rounded font-mono">
                          {conv.last_command}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
                <p>No active conversations found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Chat Panel: 2-Way Direct Admin Messaging */}
        <div className="lg:col-span-8 flex flex-col bg-slate-50/50">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                      selectedConv.channel === 'telegram' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{selectedConv.sender_name || 'Collective Member'}</h3>
                    <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                      <span>ID: {selectedConv.sender_id}</span>
                      <span>•</span>
                      <span className="uppercase text-[10px] font-bold text-slate-700">{selectedConv.channel}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded">
                    Verified Member Standing
                  </span>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[340px] max-h-[380px]">
                {loadingChat ? (
                  <div className="text-center py-12 text-xs text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Loading conversation history...</span>
                  </div>
                ) : chatLogs.length > 0 ? (
                  chatLogs.map((log) => {
                    const isOutgoing = log.direction === 'outgoing'
                    return (
                      <div
                        key={log.id}
                        className={`flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-md p-3 rounded-sm text-xs shadow-2xs ${
                            isOutgoing
                              ? 'bg-slate-900 text-white rounded-br-none'
                              : 'bg-white border border-slate-200 text-slate-900 rounded-bl-none'
                          }`}
                        >
                          <div className="whitespace-pre-wrap leading-relaxed">{log.message_text}</div>
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 font-mono">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12 text-xs text-slate-400">
                    No past messages logged for this contact.
                  </div>
                )}
              </div>

              {/* Quick Template Buttons */}
              <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px]">
                <span className="text-slate-400 font-semibold shrink-0">Quick Reply:</span>
                {[
                  '✅ Your grievance is under review by our executive committee.',
                  '📍 Meeting location confirmed for tomorrow 5 PM.',
                  '⚖️ Legal advocate has been assigned to your case.',
                ].map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyText(tpl)}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xs shrink-0 truncate max-w-xs transition-colors"
                  >
                    {tpl}
                  </button>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <Input
                  required
                  placeholder={`Reply directly to ${selectedConv.sender_name || 'member'} via ${selectedConv.channel.toUpperCase()}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="h-10 text-xs rounded-sm bg-slate-50 border-slate-200"
                />
                <Button
                  type="submit"
                  disabled={sendingReply}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-10 px-4 rounded-sm shrink-0"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  {sendingReply ? 'Sending...' : 'Send Direct Reply'}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-300" />
              <div className="text-sm font-bold text-slate-800">Select a Conversation</div>
              <p className="text-xs text-slate-500 max-w-xs">
                Choose a member thread from the left to view incoming grievance tickets, check-in records, or send direct 2-way replies.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MASS BROADCAST MODAL */}
      <Dialog open={broadcastOpen} onOpenChange={setBroadcastOpen}>
        <DialogContent className="max-w-lg bg-white border border-slate-200 p-6 rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-600" />
              <span>Broadcast Announcement to All Members</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Transmit an emergency alert, strike notice, or meeting call to all registered cadres via your organization&apos;s Master WhatsApp &amp; Telegram Bot.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleBroadcast} className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Select Broadcast Channel</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setBroadcastChannel('all')}
                  className={`p-2.5 text-center text-xs font-bold rounded-sm border ${
                    broadcastChannel === 'all' ? 'bg-indigo-50 border-indigo-600 text-indigo-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  All Channels (WA + TG)
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastChannel('whatsapp_qr')}
                  className={`p-2.5 text-center text-xs font-bold rounded-sm border ${
                    broadcastChannel === 'whatsapp_qr' ? 'bg-emerald-50 border-emerald-600 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  WhatsApp Only
                </button>
                <button
                  type="button"
                  onClick={() => setBroadcastChannel('telegram')}
                  className={`p-2.5 text-center text-xs font-bold rounded-sm border ${
                    broadcastChannel === 'telegram' ? 'bg-sky-50 border-sky-600 text-sky-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  Telegram Only
                </button>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Announcement / Alert Content *</Label>
              <Textarea
                rows={4}
                required
                placeholder="e.g. 📢 Urgent Meeting Call: All union delegates gather at Gandhi Bhawan tomorrow at 4 PM for the collective bargaining agenda review."
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                className="mt-1 text-xs rounded-sm"
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm text-xs text-amber-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Dispatches will be transmitted using <strong>{orgName}&apos;s</strong> verified master credentials.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setBroadcastOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={broadcasting}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                {broadcasting ? 'Transmitting Broadcast...' : 'Dispatch Announcement Now'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

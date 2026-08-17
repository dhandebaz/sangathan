'use client'

import React, { useState } from 'react'
import {
  Send, CheckCircle2, Copy, Check, MessageSquare, Radio,
  PowerOff, Zap, HelpCircle, Terminal, Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  connectTelegramBotAction,
  disconnectBotChannelAction,
  sendTestOutboundMessageAction,
} from '@/actions/bot-channels'
import { useRouter } from 'next/navigation'

import { BotChannelConfig, BotLog } from '@/types/dashboard'

interface ChannelsHubProps {
  lang: string
  orgId: string
  initialConfigs: BotChannelConfig[]
  initialOutboundLogs: BotLog[]
  appUrl: string
}

export function ChannelsHub({
  lang,
  orgId,
  initialConfigs,
  initialOutboundLogs,
  appUrl,
}: ChannelsHubProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('telegram')

  // Channel Config state
  const tgConfig = initialConfigs.find((c) => c.channel === 'telegram')

  // Telegram Form
  const [tgToken, setTgToken] = useState<string>((tgConfig?.credentials as any)?.bot_token || '')
  const [tgLoading, setTgLoading] = useState(false)
  const [tgTestChatId, setTgTestChatId] = useState('')
  const [tgTestMsg, setTgTestMsg] = useState('Sangathan Telegram Bot operational!')
  const [tgSending, setTgSending] = useState(false)

  // Copy helper
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopiedKey(null), 2000)
  }

  async function handleConnectTelegram(e: React.FormEvent) {
    e.preventDefault()
    if (!tgToken.trim()) {
      toast.error('Please provide a Telegram Bot Token from @BotFather')
      return
    }
    setTgLoading(true)
    const res = await connectTelegramBotAction(tgToken.trim())
    setTgLoading(false)
    if (res.success && res.botInfo) {
      toast.success(`Connected to @${res.botInfo.username}! Webhook live.`)
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to connect Telegram bot.')
    }
  }

  async function handleDisconnect() {
    if (!confirm('Are you sure you want to unlink this Telegram bot?')) return
    const res = await disconnectBotChannelAction('telegram')
    if (res.success) {
      toast.success('Telegram bot unlinked.')
      router.refresh()
    } else {
      toast.error('Failed to disconnect.')
    }
  }

  async function handleSendTestTelegram(e: React.FormEvent) {
    e.preventDefault()
    if (!tgTestChatId.trim()) {
      toast.error('Please enter a valid Telegram Chat ID or User ID')
      return
    }
    setTgSending(true)
    const res = await sendTestOutboundMessageAction({
      channel: 'telegram',
      recipientId: tgTestChatId.trim(),
      messageText: tgTestMsg,
    })
    setTgSending(false)
    if (res.success) {
      toast.success('Telegram test message delivered!')
      router.refresh()
    } else {
      toast.error(res.error || 'Failed to send Telegram message.')
    }
  }

  const tgBotUsername = tgConfig?.credentials?.bot_username
  const telegramInviteLink = tgBotUsername ? `https://t.me/${tgBotUsername}?start=org_${orgId}` : ''

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Radio className="w-7 h-7 text-sky-600" />
            <span>Master Telegram Bot &amp; Messaging Channel</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Connect your organization&apos;s Telegram bot via @BotFather in 20 seconds with zero setup friction, automatic webhooks, and zero Meta API bureaucracy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => router.push(`/${lang}/dashboard/communications`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs h-9 rounded-sm shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
            Unified Inbox Desk
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1 border border-slate-200 rounded-sm">
          <TabsTrigger value="telegram" className="text-xs font-semibold data-[state=active]:bg-white">
            <Send className="w-3.5 h-3.5 mr-1.5 text-sky-500" />
            Telegram Bot (grammY Live Engine)
          </TabsTrigger>
          <TabsTrigger value="logs" className="text-xs font-semibold data-[state=active]:bg-white">
            <Smartphone className="w-3.5 h-3.5 mr-1.5 text-slate-600" />
            Live Dispatch Stream ({initialOutboundLogs.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: TELEGRAM BOT */}
        <TabsContent value="telegram" className="space-y-6">
          <div className="bg-sky-50 border border-sky-200 p-4 rounded-sm flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-sky-950">
                100% Free &amp; Open Grassroots Civic Bot Engine
              </div>
              <p className="text-[11px] text-sky-800 mt-0.5">
                Telegram bots operate with instant webhooks and zero phone ban risk. Cadres can file grievances, mark attendance, check dues, cast strike votes, and trigger SOS alerts in real-time.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Connection Card */}
            <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded-sm shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                    <Send className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Master Telegram Bot</h2>
                    <p className="text-xs text-slate-500">Auto-configured grammY Webhook Engine</p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${
                    tgConfig?.status === 'connected'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {tgConfig?.status === 'connected' ? 'Connected Online 🟢' : 'Not Connected'}
                </span>
              </div>

              {tgConfig?.status === 'connected' && tgConfig.credentials && (
                <div className="p-4 bg-sky-50 border border-sky-200 rounded-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-sky-950">
                         Active Master Bot: @{(tgConfig.credentials as any)?.bot_username || 'Bot'}
                      </div>
                      <div className="text-[11px] text-sky-700">
                        All member commands routed to this organization
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDisconnect}
                      className="text-xs border-red-200 text-red-700 hover:bg-red-50 h-7"
                    >
                      <PowerOff className="w-3 h-3 mr-1" />
                      Unlink Bot
                    </Button>
                  </div>

                  {/* Sharable Cadre Join Link */}
                  {telegramInviteLink && (
                    <div className="pt-2 border-t border-sky-200">
                      <Label className="text-[11px] font-bold text-sky-900">Sharable Cadre Telegram Join Link:</Label>
                      <div className="flex items-center mt-1">
                        <Input
                          readOnly
                          value={telegramInviteLink}
                          className="h-8 text-xs font-mono bg-white text-sky-900 rounded-l-sm rounded-r-none"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => copyToClipboard(telegramInviteLink, 'invite')}
                          className="h-8 px-3 rounded-l-none border-l-0 text-xs bg-white text-sky-800"
                        >
                          {copiedKey === 'invite' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                      <p className="text-[10px] text-sky-700 mt-1">
                        Share this link in your field channels so cadres and volunteers can connect to your bot with 1 click!
                      </p>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleConnectTelegram} className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">
                    Paste Bot Token (from @BotFather) *
                  </Label>
                  <Input
                    type="password"
                    required
                    placeholder="1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ..."
                    value={tgToken}
                    onChange={(e) => setTgToken(e.target.value)}
                    className="mt-1 h-9 text-xs font-mono rounded-sm"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Sangathan automatically binds the webhook and configures all commands with 0 manual steps.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={tgLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 rounded-sm"
                >
                  <Zap className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
                  {tgLoading ? 'Connecting Bot with Telegram...' : '1-Click Link Bot & Activate Webhook'}
                </Button>
              </form>

              {/* Supported Bot Commands */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="text-xs font-bold text-slate-800">Supported Commands Available to Members:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-sm">
                    <span className="font-mono font-bold text-indigo-700">/grievance</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Logs ticket in grievance ledger</p>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-sm">
                    <span className="font-mono font-bold text-indigo-700">/checkin</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Records rally / meeting attendance</p>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-sm">
                    <span className="font-mono font-bold text-indigo-700">/sos</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Triggers emergency legal alert</p>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-200 rounded-sm">
                    <span className="font-mono font-bold text-indigo-700">/vote</span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Casts confidential secret vote</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Test & Guide Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* Test Dispatcher */}
              <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-sky-500" />
                  <span>Send Outbound Test Dispatch</span>
                </h3>
                <form onSubmit={handleSendTestTelegram} className="space-y-3">
                  <div>
                    <Label className="text-[11px] font-semibold text-slate-600">Telegram Chat / User ID *</Label>
                    <Input
                      required
                      placeholder="e.g. 987654321"
                      value={tgTestChatId}
                      onChange={(e) => setTgTestChatId(e.target.value)}
                      className="mt-1 h-8 text-xs font-mono rounded-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-semibold text-slate-600">Message Text</Label>
                    <Input
                      value={tgTestMsg}
                      onChange={(e) => setTgTestMsg(e.target.value)}
                      className="mt-1 h-8 text-xs rounded-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={tgSending}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white text-xs h-8 font-semibold rounded-sm"
                  >
                    {tgSending ? 'Dispatching...' : 'Send Test Telegram Message'}
                  </Button>
                </form>
              </div>

              {/* BotFather Quick Setup Guide */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm space-y-2 text-xs text-slate-600">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-indigo-600" />
                  <span>How to create a Bot in 20 Seconds:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-slate-600 leading-relaxed">
                  <li>Open Telegram on your phone or PC and message <strong>@BotFather</strong></li>
                  <li>Send <code>/newbot</code> and pick a bot name &amp; username</li>
                  <li>Copy the Token (e.g. <code>123456:ABC-DEF...</code>)</li>
                  <li>Paste it on this screen and click <strong>1-Click Link Bot</strong>!</li>
                </ol>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: DISPATCH STREAM AUDIT LOG */}
        <TabsContent value="logs" className="space-y-4">
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-700" />
                <span>Outbound Message Dispatch Stream ({initialOutboundLogs.length})</span>
              </h2>
              <span className="text-xs text-slate-400 font-mono">Live Dispatches</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-bold text-slate-700">Timestamp</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700">Channel</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700">Recipient</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700">Message Content</th>
                    <th className="py-2.5 px-3 font-bold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {initialOutboundLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[10px] font-bold uppercase">
                          {log.channel}
                        </span>
                      </td>
                       <td className="py-3 px-3 font-mono text-slate-700">
                         {(log as any).recipient_id || log.conversation_id}
                       </td>
                       <td className="py-3 px-3 text-slate-800 max-w-sm truncate">
                         {log.message_text}
                       </td>
                       <td className="py-3 px-3">
                         <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-mono text-[10px] font-bold uppercase">
                           {(log as any).status || log.direction}
                         </span>
                       </td>
                    </tr>
                  ))}

                  {initialOutboundLogs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        No outbound messages dispatched yet. Send a test message from the Telegram tab above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

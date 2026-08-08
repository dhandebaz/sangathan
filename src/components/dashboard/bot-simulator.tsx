'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  MessageSquare, Send, Smartphone, Terminal, RefreshCw,
  ShieldCheck, AlertTriangle, CheckCircle2, Copy, Sparkles, MessageCircle, HelpCircle,
  Radio
} from 'lucide-react'
import { processIncomingBotMessage } from '@/actions/bot'

interface BotSimulatorProps {
  orgId: string
  orgName: string
}

interface ChatMessage {
  id: string
  sender: 'user' | 'bot'
  text: string
  timestamp: string
  channel: 'whatsapp' | 'telegram'
}

const SAMPLE_COMMANDS = [
  { label: 'Grievance: Mess Quality', text: 'GRIEVANCE Mess meal quality severely deteriorated this week with stale ingredients.' },
  { label: 'Check-in: Rally', text: 'CHECKIN RALLY-DELHI-2026 SAN-9812' },
  { label: 'Check Dues', text: 'DUES SAN-9812' },
  { label: 'Cast Strike Vote', text: 'VOTE BALLOT-01 OPTION-YES' },
  { label: 'Emergency SOS', text: 'SOS JNU Main Gate 4 detained by security' },
  { label: 'Hindi: शिकायत', text: 'शिकायत हॉस्टल नंबर 4 में 3 दिनों से पानी नहीं आ रहा है' },
  { label: 'Hindi: मदद', text: 'मदद धरना स्थल पर पुलिस द्वारा हिरासत में लिया गया' },
  { label: 'Membership Status', text: 'STATUS SAN-9812' },
]

export function BotSimulator({ orgId, orgName }: BotSimulatorProps) {
  const [channel, setChannel] = useState<'whatsapp' | 'telegram'>('whatsapp')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `🏛️ Welcome to ${orgName} Grassroots Bot.\nType HELP or सहायता for available commands.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: 'whatsapp',
    },
  ])
  const [inputText, setInputText] = useState('')
  const [senderName, setSenderName] = useState('Volunteer Cadre')
  const [senderPhone, setSenderPhone] = useState('+91 98765 43210')
  const [isProcessing, setIsProcessing] = useState(false)
  const [executionLogs, setExecutionLogs] = useState<string[]>([
    'Bot daemon initialized and listening on webhooks.',
  ])

  async function handleSendMessage(customText?: string) {
    const textToSend = (customText || inputText).trim()
    if (!textToSend) return

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsProcessing(true)

    try {
      const res = await processIncomingBotMessage({
        organisationId: orgId,
        channel,
        senderId: senderPhone,
        senderName,
        messageText: textToSend,
      })

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: res.replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel,
      }

      setMessages((prev) => [...prev, botMsg])
      setExecutionLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] Executed command "${res.actionExecuted}" via ${channel.toUpperCase()} for ${senderName}`,
        ...prev.slice(0, 19),
      ])
    } catch {
      toast.error('Failed to process bot message.')
    } finally {
      setIsProcessing(false)
    }
  }

  function handleCopyWebhookUrl(type: 'whatsapp' | 'telegram') {
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const url = `${origin}/api/bot/webhook/${type}`
    navigator.clipboard.writeText(url)
    toast.success(`${type.toUpperCase()} Webhook URL copied!`)
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Smartphone className="w-7 h-7 text-emerald-600" />
            <span>WhatsApp & Telegram Conversational Console</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Low-bandwidth field messaging interface. Members log grievances, check dues, submit attendance, and trigger SOS via SMS/messaging commands.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/${window?.location?.pathname?.split('/')[1] || 'en'}/dashboard/channels`}>
            <Button
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-sm shadow-xs"
            >
              <Radio className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
              Connect Live Bot &amp; QR
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopyWebhookUrl('whatsapp')}
            className="text-xs border-emerald-200 text-emerald-800 hover:bg-emerald-50"
          >
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
            Copy WhatsApp Webhook
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopyWebhookUrl('telegram')}
            className="text-xs border-blue-200 text-blue-800 hover:bg-blue-50"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Copy Telegram Webhook
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Messaging Phone Simulator */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col h-[600px]">
          {/* Header of Phone UI */}
          <div className="p-3.5 bg-slate-900 text-white rounded-t-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 font-bold flex items-center justify-center text-xs text-white">
                {channel === 'whatsapp' ? 'WA' : 'TG'}
              </div>
              <div>
                <div className="text-xs font-bold">{orgName} Bot</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Verified Bot Service • Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded text-[11px]">
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`px-2 py-1 rounded font-medium ${
                  channel === 'whatsapp' ? 'bg-emerald-600 text-white' : 'text-slate-300'
                }`}
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setChannel('telegram')}
                className={`px-2 py-1 rounded font-medium ${
                  channel === 'telegram' ? 'bg-blue-600 text-white' : 'text-slate-300'
                }`}
              >
                Telegram
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-100/60 font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-sm text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-900'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 italic bg-white p-2 border border-slate-200 rounded-sm w-fit">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <span>Processing command on database ledger...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
          >
            <Input
              placeholder="Type command (e.g. GRIEVANCE, DUES, SOS, VOTE, मदद)..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="h-10 text-xs rounded-sm bg-slate-50"
            />
            <Button
              type="submit"
              disabled={isProcessing || !inputText.trim()}
              className="bg-slate-900 text-white font-semibold h-10 px-4 rounded-sm text-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>

        {/* Right: Quick Command Palette & Execution Logs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Quick Click Prompts */}
          <div className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>1-Click Test Prompts & Bilingual Commands</span>
              </h3>
              <span className="text-[11px] text-slate-400">Click to dispatch</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_COMMANDS.map((cmd, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(cmd.text)}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-sm text-left hover:bg-slate-100 hover:border-slate-300 transition-all group"
                >
                  <div className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600">
                    {cmd.label}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                    {cmd.text}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Execution & Audit Logs */}
          <div className="bg-slate-900 text-slate-200 border border-slate-800 p-5 rounded-sm shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Live Webhook Parser Daemon</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">PORT 443 • ACTIVE</span>
            </div>

            <div className="font-mono text-xs space-y-1.5 max-h-48 overflow-y-auto text-slate-300">
              {executionLogs.map((log, index) => (
                <div key={index} className="text-[11px] border-b border-slate-800/60 pb-1">
                  <span className="text-emerald-400 mr-1.5">❯</span>
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Integration Specs */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800">Production Webhook Setup</div>
            <p className="text-[11px] leading-relaxed">
              Configure your Meta WhatsApp Cloud API app or Telegram @BotFather webhook with the URL above. Inbound messages automatically parse commands, update grievance tickets, check attendance, or dispatch emergency SOS alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { triggerWeeklyDigestAction, previewWeeklyDigestAction } from '@/actions/system/weekly-digest'
import { Mail, Copy, Check, Terminal, RefreshCw, AlertTriangle, MessageSquare, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import type { WeeklyDigestData } from '@/lib/digest/weekly-engineering-digest'

export function DigestTriggerCard() {
  const [loading, setLoading] = useState(false)
  const [copying, setCopying] = useState(false)
  const [copied, setCopied] = useState(false)
  const [preview, setPreview] = useState<WeeklyDigestData | null>(null)
  const [showPreviewModal, setShowPreviewModal] = useState(false)

  const handleSendEmail = async () => {
    setLoading(true)
    try {
      const res = await triggerWeeklyDigestAction()
      if (res.success) {
        toast.success('Weekly IDE Digest email sent to admin successfully!')
      } else {
        toast.error(res.error || 'Failed to dispatch email')
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyPrompt = async () => {
    setCopying(true)
    try {
      let data = preview
      if (!data) {
        const res = await previewWeeklyDigestAction()
        if (res.success && res.digest) {
          data = res.digest
          setPreview(res.digest)
        }
      }

      if (data?.idePromptBlock) {
        await navigator.clipboard.writeText(data.idePromptBlock)
        setCopied(true)
        toast.success('IDE Prompt block copied! Paste directly into Cursor / Trae.')
        setTimeout(() => setCopied(false), 3000)
      } else {
        toast.error('Could not generate prompt block')
      }
    } catch {
      toast.error('Failed to copy prompt')
    } finally {
      setCopying(false)
    }
  }

  const handleOpenPreview = async () => {
    if (!preview) {
      setLoading(true)
      try {
        const res = await previewWeeklyDigestAction()
        if (res.success && res.digest) {
          setPreview(res.digest)
        }
      } finally {
        setLoading(false)
      }
    }
    setShowPreviewModal(true)
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-sky-600" />
              <h3 className="font-semibold text-slate-900 text-sm">Weekly Engineering &amp; Complaints IDE Digest</h3>
            </div>
            <p className="text-xs text-slate-500 max-w-xl">
              Automated weekly aggregation of Sentry error logs, unhandled exceptions, and member complaints. Pre-formatted for instant copy-pasting into your IDE AI assistant.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyPrompt}
              disabled={copying}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition active:scale-[0.98] disabled:opacity-60"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              {copied ? 'Copied to Clipboard' : 'Copy IDE Prompt'}
            </button>

            <button
              onClick={handleOpenPreview}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition active:scale-[0.98]"
            >
              Preview
            </button>

            <button
              onClick={handleSendEmail}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
              Send Email Digest Now
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Weekly IDE Digest Preview</h4>
                <p className="text-xs text-slate-500">
                  {preview.timeframe.startDate} to {preview.timeframe.endDate}
                </p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs px-2.5 py-1 rounded-md hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 p-5 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-slate-200">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <div>
                  <div className="text-sm font-bold text-slate-900">{preview.stats.totalErrors}</div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase">Errors Recorded</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-slate-200">
                <MessageSquare className="w-4 h-4 text-sky-600" />
                <div>
                  <div className="text-sm font-bold text-slate-900">{preview.tickets.length}</div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase">Complaints/Tickets</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-slate-200">
                <ShieldAlert className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-bold text-slate-900">{preview.stats.securityEvents}</div>
                  <div className="text-[10px] text-slate-500 font-medium uppercase">Security Events</div>
                </div>
              </div>
            </div>

            {/* Prompt Content */}
            <div className="p-5 overflow-y-auto flex-1 font-mono text-xs text-slate-100 whitespace-pre-wrap bg-slate-900 rounded-b-none selection:bg-sky-500 selection:text-white">
              {preview.idePromptBlock}
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-white">
              <button
                onClick={handleCopyPrompt}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                {copied ? 'Copied' : 'Copy Prompt'}
              </button>
              <button
                onClick={handleSendEmail}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition disabled:opacity-60"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}
                Send to Admin Email
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

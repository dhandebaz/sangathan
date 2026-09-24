'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { CheckCircle2, ExternalLink, Loader2, Lock, PlugZap, Unplug } from 'lucide-react'
import { disconnectOrgIntegration } from '@/actions/integrations'

interface ProviderView {
  id: string
  name: string
  tagline: string
  docsUrl: string
  configured: boolean
  connected: boolean
  lastError: string | null
}

export function IntegrationsClient({
  orgId,
  lang,
  isHindi,
  planEligible,
  providers,
}: {
  orgId: string
  lang: string
  isHindi: boolean
  planEligible: boolean
  providers: ProviderView[]
}) {
  const [busyId, setBusyId] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const justConnected = searchParams.get('connected')
  const justErrored = searchParams.get('error')

  const handleDisconnect = async (providerId: string) => {
    if (!window.confirm(isHindi ? 'कनेक्शन हटाएं? टोकन मिट जाएंगे।' : 'Disconnect? Tokens will be purged.')) return
    setBusyId(providerId)
    try {
      const res = await disconnectOrgIntegration({ orgId, providerId })
      if (!res.success) throw new Error(res.error || 'Disconnect failed')
      toast.success(isHindi ? 'कनेक्शन हटाया गया।' : 'Disconnected.')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-4">
      {justConnected && (
        <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          {isHindi ? `${justConnected} जुड़ गया।` : `${justConnected} connected.`}
        </p>
      )}
      {justErrored && (
        <p className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-800">
          {isHindi ? `कनेक्ट विफल: ${justErrored}` : `Connect failed: ${justErrored}`}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {providers.map((p) => {
          const locked = !planEligible
          const busy = busyId === p.id
          return (
            <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                    <PlugZap className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-extrabold text-slate-900">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.tagline}</p>
                  </div>
                </div>
                {p.connected && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {isHindi ? 'जुड़ा' : 'Live'}
                  </span>
                )}
              </div>

              {p.lastError && (
                <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {isHindi ? 'आखिरी त्रुटि: ' : 'Last error: '}{p.lastError}
                </p>
              )}

              <div className="mt-4 flex items-center gap-2">
                {locked ? (
                  <span className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-100 px-4 text-xs font-bold text-slate-500">
                    <Lock className="h-3.5 w-3.5" />
                    {isHindi ? 'मीटर पर अनलॉक' : 'Unlocks on meter'}
                  </span>
                ) : !p.configured ? (
                  <span className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-slate-100 px-4 text-xs font-bold text-slate-500">
                    {isHindi ? 'जल्द आ रहा' : 'Coming soon'}
                  </span>
                ) : p.connected ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => handleDisconnect(p.id)}
                    className="inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 px-4 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Unplug className="h-3.5 w-3.5" />}
                    {isHindi ? 'हटाएं' : 'Disconnect'}
                  </button>
                ) : (
                  <a
                    href={`/api/integrations/${p.id}/connect?orgId=${orgId}&lang=${lang}`}
                    className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700"
                  >
                    {isHindi ? 'कनेक्ट करो' : 'Connect'}
                  </a>
                )}
                <a
                  href={p.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${p.name} docs`}
                  className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 px-3 text-slate-500 hover:bg-slate-50"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        {isHindi
          ? 'टोकन एन्क्रिप्टेड रखे जाते हैं, सिर्फ तुम्हारे संगठन के लिए, और हटाने पर पूरी तरह मिट जाते हैं।'
          : 'Tokens are stored encrypted, scoped to your organisation only, and purged fully on disconnect.'}
      </p>
    </div>
  )
}

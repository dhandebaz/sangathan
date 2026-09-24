'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArchiveRestore, Loader2 } from 'lucide-react'
import { archiveDormantMembers } from '@/actions/members/maintenance'

export function ArchiveDormantButton({ orgId, isHindi }: { orgId: string; isHindi: boolean }) {
  const [busy, setBusy] = useState(false)
  const router = useRouter()

  const handleArchive = async () => {
    if (
      !window.confirm(
        isHindi
          ? '90+ दिनों से निष्क्रिय सदस्यों को आर्काइव करें? रिकॉर्ड रहेंगे, मीटर से हटेंगे।'
          : 'Archive members dormant 90+ days? Records stay, meter drops.',
      )
    ) {
      return
    }
    setBusy(true)
    try {
      const res = await archiveDormantMembers({ orgId, days: 90 })
      if (!res.success) throw new Error(res.error || 'Archive failed')
      toast.success(
        isHindi
          ? `${res.archived} सदस्य आर्काइव हुए।`
          : `${res.archived} member(s) archived.`,
      )
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleArchive}
      disabled={busy}
      className="inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArchiveRestore className="h-3.5 w-3.5" />}
      {isHindi ? 'निष्क्रिय आर्काइव करो' : 'Archive dormant'}
    </button>
  )
}

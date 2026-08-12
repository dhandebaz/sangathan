'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { markComplaintPrinted, markComplaintDelivered } from '@/actions/complaints/ai-analysis'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ComplaintPrintViewProps {
  ticket: any
  org: any
  lang: string
}

export function ComplaintPrintView({ ticket, org, lang }: ComplaintPrintViewProps) {
  const router = useRouter()
  const t = (en: string, hi: string) => (lang === 'hi' ? hi : en)

  useEffect(() => {
    // Auto-mark as printed when print view opens
    markComplaintPrinted({ ticketId: ticket.id })
  }, [ticket.id])

  const handlePrint = () => {
    window.print()
  }

  const handleDelivered = async (method: 'hand' | 'post' | 'email' | 'portal') => {
    const res = await markComplaintDelivered({ ticketId: ticket.id, deliveryMethod: method })
    if (res.success) {
      toast.success(t('Marked as delivered', 'वितरित के रूप में चिह्नित'))
      router.push(`/${lang}/dashboard/complaints`)
    } else {
      toast.error(res.error || t('Failed to mark delivered', 'वितरित चिह्नित करने में विफल'))
    }
  }

  const authority = ticket.authority_contacts

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Print Toolbar (hidden on print) */}
        <div className="mb-6 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="border-slate-300 text-xs"
            >
              ← Back
            </Button>
            <Button onClick={handlePrint} size="sm" className="bg-slate-900 text-white text-xs">
              Print / Save PDF
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelivered('hand')}
              className="border-emerald-300 text-emerald-700 text-xs"
            >
              Mark Delivered (Hand)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelivered('email')}
              className="border-blue-300 text-blue-700 text-xs"
            >
              Mark Delivered (Email)
            </Button>
          </div>
        </div>

        {/* Official Document */}
        <div className="bg-white border border-slate-200 shadow-sm print:shadow-none print:border-0">
          {/* Letterhead */}
          <div className="border-b-4 border-slate-900 p-8">
            <div className="flex items-start justify-between">
              <div>
                {org?.logo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={org.logo_url} alt={org.name} className="h-16 w-16 object-contain mb-3" />
                )}
                <h1 className="text-2xl font-bold text-slate-900">{org?.name || 'Organisation'}</h1>
                <p className="text-xs text-slate-500 mt-1">{org?.address}</p>
                <p className="text-xs text-slate-500">{org?.contact_phone}{org?.contact_email ? ` • ${org.contact_email}` : ''}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Ref. No.</p>
                <p className="text-sm font-mono font-bold text-slate-800">SG/COMP/{ticket.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-[10px] text-slate-400 mt-2">{ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</p>
              </div>
            </div>
          </div>

          {/* Authority Address */}
          <div className="px-8 pt-8">
            <p className="text-sm text-slate-600">{t('To,', 'सेवा में,')}</p>
            <div className="mt-1">
              <p className="font-bold text-slate-900">{authority?.authority_name || t('The Concerned Authority', 'संबंधित प्राधिकरण')}</p>
              {authority?.designation && <p className="text-sm text-slate-700">{authority.designation}</p>}
              {authority?.department && <p className="text-sm text-slate-700">{authority.department}</p>}
              {authority?.address && <p className="text-sm text-slate-600">{authority.address}</p>}
              {authority?.jurisdiction && <p className="text-sm text-slate-600">{authority.jurisdiction}</p>}
            </div>
          </div>

          {/* Subject */}
          <div className="px-8 pt-6">
            <p className="text-sm">
              <span className="font-bold">{t('Subject:', 'विषय:')}</span>{' '}
              <span className="underline font-semibold">{ticket.title}</span>
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-4">
            <p className="text-sm text-slate-800 leading-relaxed">{ticket.description}</p>

            {/* AI Analysis Summary */}
            {ticket.ai_analysis && (
              <div className="mt-4 border border-indigo-100 bg-indigo-50/50 rounded-sm p-4">
                <p className="text-xs font-bold text-indigo-900 mb-2">{t('Automated Analysis', 'स्वचालित विश्लेषण')}</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-500">{t('Department:', 'विभाग:')}</span>{' '}
                    {ticket.ai_analysis.department}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">{t('Issue:', 'समस्या:')}</span>{' '}
                    {ticket.ai_analysis.issue_type}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">{t('Urgency:', 'तात्कालिकता:')}</span>{' '}
                    <span className="font-bold capitalize">{ticket.ai_analysis.urgency}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500">{t('Confidence:', 'विश्वसनीयता:')}</span>{' '}
                    {Math.round((ticket.ai_analysis.confidence || 0) * 100)}%
                  </div>
                </div>
                {ticket.ai_analysis.tags?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {ticket.ai_analysis.tags.map((tag: string, i: number) => (
                      <span key={i} className="text-[10px] bg-white border border-indigo-100 rounded-sm px-1.5 py-0.5 text-indigo-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <p className="text-sm text-slate-800 leading-relaxed pt-4">
              {t(
                'We request immediate action on the above matter. Kindly acknowledge receipt and provide an update at the earliest. We are available to share further details if required.',
                'हम उपरोक्त मामले पर त्वरित कार्रवाई का अनुरोध करते हैं। कृपया प्राप्ति की पावती दें और शीघ्र अद्यतन प्रदान करें। आवश्यकता होने पर हम अतिरिक्त जानकारी साझा करने के लिए उपलब्ध हैं।'
              )}
            </p>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            <div className="mt-8 flex items-end justify-between">
              <div>
                <p className="text-xs text-slate-500">{t('Priority:', 'प्राथमिकता:')} <span className="font-bold uppercase text-slate-800">{ticket.priority}</span></p>
                <p className="text-xs text-slate-500 mt-1">{t('Status:', 'स्थिति:')} <span className="font-bold uppercase text-slate-800">{ticket.status}</span></p>
                <p className="text-xs text-slate-500 mt-1">
                  {t('Registered with Sangathan:', 'संगठन के साथ पंजीकृत:')}{' '}
                  <span className="font-mono">{ticket.id}</span>
                </p>
              </div>
              <div className="text-right">
                <div className="w-44 h-14 border border-slate-300 rounded-sm flex items-center justify-center text-[9px] text-slate-400 mb-2">
                  QR / Official Seal
                </div>
                <p className="text-sm font-semibold text-slate-800">{t('Yours sincerely,', 'भवदीय,')}</p>
                <p className="text-sm font-bold text-slate-900 mt-4 border-t border-slate-300 pt-1">{org?.name || 'Organisation'}</p>
                <p className="text-[10px] text-slate-500">{t('Registered on Sangathan Platform', 'संगठन प्लेटफॉर्म पर पंजीकृत')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
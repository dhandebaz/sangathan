'use client'

import { useState } from 'react'
import { VolunteerCertificate } from '@/types/dashboard'
import { issueVolunteerCertificate } from '@/actions/volunteer-certificates'
import { Award, ShieldCheck, Plus, Clock, User, QrCode, FileText, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface CertificatesManagerProps {
  initialCertificates: VolunteerCertificate[]
  isHindi: boolean
  orgId: string
}

export function CertificatesManager({ initialCertificates, isHindi }: CertificatesManagerProps) {
  const [certificates, setCertificates] = useState<VolunteerCertificate[]>(initialCertificates)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form State
  const [volunteerProfileId, setVolunteerProfileId] = useState('')
  const [serviceHours, setServiceHours] = useState(25)
  const [citationText, setCitationText] = useState('')

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await issueVolunteerCertificate({
        volunteer_profile_id: volunteerProfileId,
        service_hours: Number(serviceHours),
        citation_text: citationText,
      })

      if (!res.error && res.data?.certificate) {
        setCertificates([res.data.certificate, ...certificates])
        setIsModalOpen(false)
        setVolunteerProfileId('')
        setCitationText('')
        setServiceHours(25)
        toast.success(isHindi ? 'प्रमाण पत्र सफलतापूर्वक जारी किया गया।' : 'Certificate issued successfully.')
      } else {
        toast.error(res.error || 'Failed to issue certificate')
      }
    } catch {
      toast.error('An error occurred while issuing certificate.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          {isHindi ? 'जारी किए गए प्रमाण पत्र' : 'Issued Certificates'}
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition shadow-2xs active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          {isHindi ? 'प्रमाण पत्र जारी करें' : 'Issue Certificate'}
        </button>
      </div>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white border border-slate-200/80 p-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {isHindi ? 'कोई प्रमाण पत्र जारी नहीं किया गया है' : 'No Certificates Issued'}
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            {isHindi
              ? 'स्वयंसेवकों के सेवा घंटों को मान्यता देने के लिए डिजिटल प्रमाण पत्र जारी करें।'
              : 'Recognize outstanding community service by issuing verified volunteer certificates.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {cert.certificate_number}
                    </span>
                    <h3 className="mt-2 text-base font-bold text-slate-900">
                      {cert.volunteer?.full_name || 'Volunteer Contributor'}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5" />
                      {cert.service_hours_recognized} {isHindi ? 'घंटे' : 'hours'}
                    </span>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {new Date(cert.issue_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{cert.citation_text || 'In recognition of outstanding dedication to community welfare.'}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="font-mono text-[10px] text-slate-400 truncate max-w-[180px]">
                    SHA: {(cert.verification_hash || '').substring(0, 16)}...
                  </span>
                </div>

                <span className="text-[11px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-200">
                  {isHindi ? 'सत्यापित' : 'Tamper-Evident'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Issue Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {isHindi ? 'नया स्वयंसेवक प्रमाण पत्र जारी करें' : 'Issue Volunteer Certificate'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'स्वयंसेवक प्रोफ़ाइल ID (UUID)' : 'Volunteer Profile ID (UUID)'}
                </label>
                <input
                  type="text"
                  required
                  value={volunteerProfileId}
                  onChange={(e) => setVolunteerProfileId(e.target.value)}
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'मान्यता प्राप्त सेवा घंटे' : 'Recognized Service Hours'}
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={serviceHours}
                  onChange={(e) => setServiceHours(Number(e.target.value))}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'प्रशस्ति पत्र विवरण (Citation Text)' : 'Citation Text'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={citationText}
                  onChange={(e) => setCitationText(e.target.value)}
                  placeholder={isHindi ? 'नागरिक राहत, स्वास्थ्य शिविर व शिक्षा अभियान में उत्कृष्ट योगदान हेतु...' : 'For outstanding dedication and service in community relief drives...'}
                  className="w-full text-xs rounded-xl border border-slate-300 p-2.5 bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition shadow-2xs"
                >
                  {loading ? (isHindi ? 'जारी कर रहे हैं...' : 'Issuing...') : (isHindi ? 'प्रमाण पत्र जारी करें' : 'Issue Certificate')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

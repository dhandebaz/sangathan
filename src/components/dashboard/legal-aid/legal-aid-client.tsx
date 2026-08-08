'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Shield, AlertTriangle, Phone, FileText, Lock, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import { triggerLegalSosAction, submitAntiRaggingAction } from '@/actions/legal-aid'
import { toast } from 'sonner'

interface LegalAidClientProps {
  organisationId: string
  initialLogs: any[]
}

const VOLUNTEER_LAWYERS = [
  { name: 'Adv. Suresh Verma', bar: 'Delhi High Court / Supreme Court', phone: '+91 98111 22334', area: 'Student Rights & Bail Matters' },
  { name: 'Adv. Meenakshi Sundaram', bar: 'Madras High Court', phone: '+91 98440 11223', area: 'Academic Writs & Reinstatements' },
  { name: 'Adv. Vikram Singh', bar: 'Punjab & Haryana High Court', phone: '+91 98722 33445', area: 'Campus Civil Rights & Representation' }
]

export default function LegalAidClient({ initialLogs }: LegalAidClientProps) {
  const [logs, setLogs] = useState<any[]>(initialLogs)
  const [activeTab, setActiveTab] = useState<'sos' | 'ragging' | 'directory'>('sos')
  const [loading, setLoading] = useState(false)

  // SOS Form state
  const [studentName, setStudentName] = useState('')
  const [location, setLocation] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [detentionReason, setDetentionReason] = useState('')

  // Anti-Ragging state
  const [hostelOrDept, setHostelOrDept] = useState('')
  const [incidentDetails, setIncidentDetails] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(true)

  const handleTriggerSos = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentName || !contactPhone) return
    setLoading(true)

    try {
      const res = await triggerLegalSosAction({
        studentName,
        location: location || 'Campus Police Station / Gate',
        contactPhone,
        detentionReason
      })

      if (res.success && res.data) {
        toast.success('EMERGENCY LEGAL SOS DISPATCHED & SAVED TO DB!')
        setLogs([res.data, ...logs])
        setStudentName('')
        setLocation('')
        setContactPhone('')
        setDetentionReason('')
      } else {
        toast.error(res.error || 'Failed to trigger SOS')
      }
    } catch {
      toast.error('An error occurred while dispatching SOS')
    } finally {
      setLoading(false)
    }
  }

  const handleAntiRagging = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hostelOrDept || !incidentDetails) return
    setLoading(true)

    try {
      const res = await submitAntiRaggingAction({
        hostelOrDept,
        incidentDetails,
        isAnonymous
      })

      if (res.success && res.data) {
        toast.success('UGC Anti-Ragging complaint filed in DB!')
        setLogs([res.data, ...logs])
        setHostelOrDept('')
        setIncidentDetails('')
      } else {
        toast.error(res.error || 'Failed to submit complaint')
      }
    } catch {
      toast.error('An error occurred while filing complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white text-slate-900 p-6 rounded-sm border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Legal Aid &amp; Anti-Ragging Cell</h2>
            <p className="text-slate-500 text-xs mt-0.5">
              Protest detention SOS alerts, volunteer advocate directory, and UGC-compliant anti-ragging cell.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-100 p-1 rounded-sm border border-slate-200">
          <button
            onClick={() => setActiveTab('sos')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${activeTab === 'sos' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Emergency SOS Trigger
          </button>
          <button
            onClick={() => setActiveTab('ragging')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${activeTab === 'ragging' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            UGC Anti-Ragging Desk
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3 py-1.5 rounded-sm text-xs font-bold transition ${activeTab === 'directory' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Advocate Directory
          </button>
        </div>
      </div>

      {/* Tab 1: Emergency SOS Trigger */}
      {activeTab === 'sos' && (
        <Card className="border-2 border-rose-300 shadow-xl bg-white">
          <CardHeader className="border-b bg-rose-50/50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Emergency Protest Detention SOS (आपातकालीन विधिक सहायता)
            </CardTitle>
            <CardDescription>
              One-tap dispatch for union members detained during peaceful campus demonstrations.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleTriggerSos}>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Detained Student Name *</label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="e.g. Vikramaditya Singh"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Current Detention Location *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Maurice Nagar Police Station"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Detention Reason / Circumstances</label>
                <textarea
                  rows={3}
                  value={detentionReason}
                  onChange={e => setDetentionReason(e.target.value)}
                  placeholder="Detained during North Campus March regarding fee hike..."
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 flex justify-end p-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                DISPATCH LEGAL SOS ALERT TO SUPABASE
              </button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Tab 2: UGC Anti-Ragging Cell */}
      {activeTab === 'ragging' && (
        <Card className="border shadow-md bg-white">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-600" />
              Anonymous UGC Anti-Ragging Complaint Desk
            </CardTitle>
            <CardDescription>
              Directly reporting ragging incidents to Union Legal Officers & UGC Anti-Ragging Cell.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAntiRagging}>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Hostel / Department / Location *</label>
                <input
                  type="text"
                  required
                  value={hostelOrDept}
                  onChange={e => setHostelOrDept(e.target.value)}
                  placeholder="e.g. Block B, Old Boys Hostel"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Incident Details *</label>
                <textarea
                  required
                  rows={5}
                  value={incidentDetails}
                  onChange={e => setIncidentDetails(e.target.value)}
                  placeholder="Provide detailed description of the ragging or harassment incident..."
                  className="w-full rounded-lg border border-slate-300 p-3 text-sm"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={e => setIsAnonymous(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span className="text-sm font-bold text-slate-800">Keep my identity 100% Anonymous</span>
                </label>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 flex justify-end p-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                File Anti-Ragging Complaint in DB
              </button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Tab 3: Volunteer Advocate Directory */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {VOLUNTEER_LAWYERS.map((lawyer, i) => (
            <Card key={i} className="border shadow-sm">
              <CardContent className="p-6 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-base">{lawyer.name}</h4>
                <p className="text-xs text-rose-700 font-bold">{lawyer.bar}</p>
                <p className="text-xs text-slate-500">{lawyer.area}</p>
                <div className="pt-3 border-t">
                  <a
                    href={`tel:${lawyer.phone}`}
                    className="inline-flex items-center gap-2 bg-rose-50 text-rose-800 font-bold text-xs px-3 py-1.5 rounded-lg border border-rose-200"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {lawyer.phone}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Database Emergency & Complaint Records */}
      <Card className="border shadow-sm">
        <CardHeader className="bg-slate-50 border-b">
          <CardTitle className="text-slate-900 text-base">
            Database Legal Emergency & Anti-Ragging Log ({logs.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 divide-y">
          {logs.map((item: any) => (
            <div key={item.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 hover:bg-slate-50/50">
              <div>
                <span className="font-extrabold text-slate-900 text-base">{item.title}</span>
                <p className="text-xs text-slate-500 mt-0.5 whitespace-pre-wrap">{item.description}</p>
                <p className="text-[11px] text-rose-700 font-medium mt-1">
                  Logged: {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                {item.priority}
              </span>
            </div>
          ))}

          {logs.length === 0 && (
            <p className="text-xs text-slate-500 p-6 text-center">No legal emergency alerts or anti-ragging complaints in database yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

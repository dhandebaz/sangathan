'use client'

import React, { useState } from 'react'
import {
  AlertTriangle, ShieldAlert, PhoneCall, MapPin, Radio,
  UserCheck, CheckCircle2, Clock, Plus, Scale, ExternalLink, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import {
  triggerEmergencySosAction, dispatchAdvocateAction, updateSosStatusAction
} from '@/actions/emergency-sos'

interface EmergencySosClientProps {
  initialAlerts: any[]
  orgName: string
}

export function EmergencySosClient({ initialAlerts, orgName }: EmergencySosClientProps) {
  const [alerts, setAlerts] = useState<any[]>(initialAlerts)
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  // Quick Trigger Form
  const [form, setForm] = useState({
    activist_name: '',
    contact_phone: '',
    location_name: '',
    latitude: 0,
    longitude: 0,
    police_station: '',
    detainee_count: 1,
    situation_details: '',
    severity: 'critical' as const,
  })

  // Dispatch Form
  const [dispatchAlertId, setDispatchAlertId] = useState<string | null>(null)
  const [dispatchForm, setDispatchForm] = useState({
    advocate_name: '',
    advocate_phone: '',
    bar_council_no: '',
  })

  function handleCaptureGps() {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }
    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        }))
        setIsGettingLocation(false)
        toast.success(`GPS Captured: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`)
      },
      (err) => {
        setIsGettingLocation(false)
        toast.error('Could not capture GPS coordinates. Please enter location manually.')
      }
    )
  }

  async function handleTriggerSos(e: React.FormEvent) {
    e.preventDefault()
    setIsBroadcasting(true)

    const res = await triggerEmergencySosAction(form)
    setIsBroadcasting(false)

    if (res.success && res.data) {
      toast.success('EMERGENCY SOS BROADCASTED TO LEGAL NETWORK!')
      setAlerts((prev) => [res.data, ...prev])
      setForm({
        activist_name: '',
        contact_phone: '',
        location_name: '',
        latitude: 0,
        longitude: 0,
        police_station: '',
        detainee_count: 1,
        situation_details: '',
        severity: 'critical',
      })
    } else {
      toast.error(res.error || 'Failed to trigger SOS broadcast.')
    }
  }

  async function handleDispatchAdvocate(e: React.FormEvent) {
    e.preventDefault()
    if (!dispatchAlertId) return

    const res = await dispatchAdvocateAction(
      dispatchAlertId,
      dispatchForm.advocate_name,
      dispatchForm.advocate_phone,
      dispatchForm.bar_council_no
    )

    if (res.success) {
      toast.success('Advocate successfully dispatched to police station!')
      setAlerts((prev) =>
        prev.map((a) => (a.id === dispatchAlertId ? { ...a, status: 'legal_dispatched' } : a))
      )
      setDispatchAlertId(null)
      setDispatchForm({ advocate_name: '', advocate_phone: '', bar_council_no: '' })
    } else {
      toast.error(res.error || 'Failed to dispatch advocate.')
    }
  }

  async function handleUpdateStatus(alertId: string, status: string) {
    const res = await updateSosStatusAction(alertId, status)
    if (res.success) {
      toast.success(`Incident status updated to ${status.replace('_', ' ')}`)
      setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, status } : a)))
    } else {
      toast.error(res.error || 'Failed to update status.')
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6 px-4">
      {/* Top Threat Banner */}
      <div className="bg-red-50 border-2 border-red-300 p-5 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 animate-pulse">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-red-950">
              Emergency SOS & Legal Rapid-Response Network
            </h1>
            <p className="text-xs text-red-800 mt-0.5">
              1-Tap emergency broadcast for peaceful activists, detainees & union workers facing police action or legal threats.
            </p>
          </div>
        </div>

        <div className="text-xs text-red-900 font-mono bg-white/80 px-3 py-1.5 border border-red-200 rounded-sm">
          HOTLINE: 24x7 DEFENSE CELL ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 1-Tap SOS Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 p-6 rounded-sm shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Radio className="w-4 h-4 text-red-600" />
            <span>Broadcast Live SOS Alert</span>
          </h2>

          <form onSubmit={handleTriggerSos} className="space-y-3.5">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Activist / Detainee Lead Name *</Label>
              <Input
                required
                placeholder="e.g. Vikram Yadav (Field Organizer)"
                value={form.activist_name}
                onChange={(e) => setForm({ ...form, activist_name: e.target.value })}
                className="mt-1 h-9 text-xs rounded-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Contact Phone *</Label>
                <Input
                  required
                  placeholder="+91 98765 43210"
                  value={form.contact_phone}
                  onChange={(e) => setForm({ ...form, contact_phone: e.target.value })}
                  className="mt-1 h-9 text-xs rounded-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">Detainee Count</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.detainee_count}
                  onChange={(e) => setForm({ ...form, detainee_count: Number(e.target.value) })}
                  className="mt-1 h-9 text-xs rounded-sm"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Protest Location / Gate *</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  required
                  placeholder="e.g. Gate No 3 / Parliament Street"
                  value={form.location_name}
                  onChange={(e) => setForm({ ...form, location_name: e.target.value })}
                  className="h-9 text-xs rounded-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCaptureGps}
                  className="shrink-0 text-xs border-slate-300 h-9"
                >
                  <MapPin className="w-3.5 h-3.5 mr-1 text-red-600" />
                  {isGettingLocation ? 'GPS...' : 'GPS'}
                </Button>
              </div>
              {form.latitude !== 0 && (
                <p className="text-[10px] text-emerald-600 font-mono mt-1">
                  GPS Locked: {form.latitude}, {form.longitude}
                </p>
              )}
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Police Station (थाना) If Known</Label>
              <Input
                placeholder="e.g. Vasant Kunj North / Mandir Marg Thana"
                value={form.police_station}
                onChange={(e) => setForm({ ...form, police_station: e.target.value })}
                className="mt-1 h-9 text-xs rounded-sm"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Situation & Detention Notes *</Label>
              <Textarea
                required
                rows={3}
                placeholder="Details of detention, grounds cited by police, advocate needs..."
                value={form.situation_details}
                onChange={(e) => setForm({ ...form, situation_details: e.target.value })}
                className="mt-1 text-xs rounded-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={isBroadcasting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11 rounded-sm text-xs shadow-md"
            >
              {isBroadcasting ? 'Broadcasting Alert...' : '🚨 Trigger 1-Tap Legal SOS Now'}
            </Button>
          </form>
        </div>

        {/* Right: Live Crisis Dashboard & Advocate Dispatch */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-900" />
              <span>Live Emergency Escalation Desk ({alerts.length})</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Auto-Updating</span>
          </div>

          <div className="space-y-4">
            {alerts.map((alert) => {
              const statusColors: Record<string, string> = {
                alerted: 'bg-red-50 text-red-800 border-red-300',
                legal_dispatched: 'bg-amber-50 text-amber-800 border-amber-300',
                advocate_at_thana: 'bg-indigo-50 text-indigo-800 border-indigo-300',
                bail_secured: 'bg-emerald-50 text-emerald-800 border-emerald-300',
                resolved: 'bg-slate-50 text-slate-800 border-slate-200',
              }

              return (
                <div
                  key={alert.id}
                  className="bg-white border border-slate-200 p-5 rounded-sm shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${
                          statusColors[alert.status] || 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        {alert.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-bold text-slate-900">{alert.activist_name}</span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(alert.created_at).toLocaleTimeString()} • {alert.detainee_count} Detainees
                    </span>
                  </div>

                  <div className="text-xs text-slate-700 space-y-1">
                    <div>
                      <strong className="text-slate-900">Location:</strong> {alert.location_name}{' '}
                      {alert.police_station ? `(${alert.police_station})` : ''}
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-sm border border-slate-100 font-mono text-[11px]">
                      {alert.situation_details}
                    </div>
                  </div>

                  {/* Actions & Escalation Bar */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                    <Button
                      size="sm"
                      onClick={() => setDispatchAlertId(alert.id)}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 rounded-sm font-semibold"
                    >
                      <UserCheck className="w-3.5 h-3.5 mr-1" />
                      Dispatch Advocate
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(alert.id, 'advocate_at_thana')}
                      className="text-xs h-8 border-slate-300"
                    >
                      At Thana
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(alert.id, 'bail_secured')}
                      className="text-xs h-8 border-emerald-300 text-emerald-800 hover:bg-emerald-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Bail Secured
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleUpdateStatus(alert.id, 'resolved')}
                      className="text-xs h-8 text-slate-500"
                    >
                      Close Incident
                    </Button>
                  </div>

                  {/* Inline Dispatch Modal Form */}
                  {dispatchAlertId === alert.id && (
                    <form
                      onSubmit={handleDispatchAdvocate}
                      className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-sm space-y-3 mt-3"
                    >
                      <div className="text-xs font-bold text-indigo-950">
                        Assign Defense Advocate to {alert.activist_name}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          required
                          placeholder="Advocate Name"
                          value={dispatchForm.advocate_name}
                          onChange={(e) => setDispatchForm({ ...dispatchForm, advocate_name: e.target.value })}
                          className="h-8 text-xs bg-white rounded-sm"
                        />
                        <Input
                          required
                          placeholder="Advocate Phone (+91)"
                          value={dispatchForm.advocate_phone}
                          onChange={(e) => setDispatchForm({ ...dispatchForm, advocate_phone: e.target.value })}
                          className="h-8 text-xs bg-white rounded-sm"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setDispatchAlertId(null)}
                          className="h-7 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          size="sm"
                          className="h-7 text-xs bg-indigo-600 text-white font-semibold"
                        >
                          Confirm Dispatch
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )
            })}

            {alerts.length === 0 && (
              <div className="bg-white border border-slate-200 p-12 text-center rounded-sm">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No Active Emergency Incidents</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  All demonstration teams, field organizers, and legal defense desks are clear.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

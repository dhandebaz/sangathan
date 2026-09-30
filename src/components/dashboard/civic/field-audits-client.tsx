'use client'

import React, { useState } from 'react'
import {
  Activity, Plus, MapPin, AlertTriangle, ShieldCheck,
  Printer, MessageSquare, Flame, Droplets, Wind,
  Building2, Camera, CheckCircle2, ChevronRight, X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import {
  logFieldSpotAuditAction,
  generateStatutoryNoticeAction,
  generatePublicHealthBulletinAction,
  StatutoryNoticeResult,
  HealthBulletinResult
} from '@/actions/field-audits'

interface FieldAuditRecord {
  id: string
  audit_type: string
  auditor_name: string
  location_name: string
  landmark?: string | null
  ward_no?: string | null
  district?: string | null
  sensor_readings?: {
    pm2_5?: number
    pm10?: number
    aqi_category?: string
    tds_ppm?: number
    ph_level?: number
    noise_db?: number
  } | null
  source_identified?: string | null
  severity: 'moderate' | 'high' | 'severe' | 'hazardous'
  status: string
  photo_urls?: string[]
  statutory_notice_ref?: string | null
  public_bulletin_shared?: boolean
  remarks?: string | null
  created_at: string
}

interface FieldAuditsClientProps {
  orgId: string
  orgName: string
  initialAudits: FieldAuditRecord[]
}

export function FieldAuditsClient({ orgId, orgName, initialAudits }: FieldAuditsClientProps) {
  const [audits, setAudits] = useState<FieldAuditRecord[]>(initialAudits)
  const [filterType, setFilterType] = useState<string>('all')
  const [isNewAuditModalOpen, setIsNewAuditModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Modals for AI Notice & Bulletin
  const [selectedAuditForNotice, setSelectedAuditForNotice] = useState<FieldAuditRecord | null>(null)
  const [generatedNotice, setGeneratedNotice] = useState<StatutoryNoticeResult | null>(null)
  const [isGeneratingNotice, setIsGeneratingNotice] = useState(false)

  const [selectedAuditForBulletin, setSelectedAuditForBulletin] = useState<FieldAuditRecord | null>(null)
  const [generatedBulletin, setGeneratedBulletin] = useState<HealthBulletinResult | null>(null)
  const [isGeneratingBulletin, setIsGeneratingBulletin] = useState(false)

  // Form State
  const [auditType, setAuditType] = useState<string>('air_quality')
  const [locationName, setLocationName] = useState('')
  const [landmark, setLandmark] = useState('')
  const [wardNo, setWardNo] = useState('')
  const [district, setDistrict] = useState('Delhi NCR')
  const [pm25, setPm25] = useState('')
  const [pm10, setPm10] = useState('')
  const [tdsPpm, setTdsPpm] = useState('')
  const [phLevel, setPhLevel] = useState('')
  const [sourceIdentified, setSourceIdentified] = useState('')
  const [severity, setSeverity] = useState<'moderate' | 'high' | 'severe' | 'hazardous'>('severe')
  const [remarks, setRemarks] = useState('')

  const filteredAudits = audits.filter(a => {
    if (filterType === 'all') return true
    return a.audit_type === filterType
  })

  async function handleCreateAudit(e: React.FormEvent) {
    e.preventDefault()
    if (!locationName.trim()) {
      toast.error('Please enter the inspection location')
      return
    }

    setIsSubmitting(true)
    try {
      const sensorReadings: Record<string, number | string> = {}
      if (pm25) sensorReadings.pm2_5 = parseFloat(pm25)
      if (pm10) sensorReadings.pm10 = parseFloat(pm10)
      if (tdsPpm) sensorReadings.tds_ppm = parseFloat(tdsPpm)
      if (phLevel) sensorReadings.ph_level = parseFloat(phLevel)

      const res = await logFieldSpotAuditAction({
        auditType: auditType as any,
        locationName,
        landmark: landmark || undefined,
        wardNo: wardNo || undefined,
        district: district || undefined,
        sensorReadings: Object.keys(sensorReadings).length > 0 ? sensorReadings : undefined,
        sourceIdentified: sourceIdentified || undefined,
        severity,
        photoUrls: [],
        remarks: remarks || undefined,
      })

      if (res.success && res.data) {
        toast.success('Field spot audit logged successfully!')
        setAudits([res.data as unknown as FieldAuditRecord, ...audits])
        setIsNewAuditModalOpen(false)
        resetForm()
      } else {
        toast.error(res.error || 'Failed to log field audit')
      }
    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  function resetForm() {
    setLocationName('')
    setLandmark('')
    setWardNo('')
    setPm25('')
    setPm10('')
    setTdsPpm('')
    setPhLevel('')
    setSourceIdentified('')
    setRemarks('')
  }

  async function handleGenerateNotice(audit: FieldAuditRecord) {
    setSelectedAuditForNotice(audit)
    setGeneratedNotice(null)
    setIsGeneratingNotice(true)
    try {
      const res = await generateStatutoryNoticeAction(audit.id, orgName)
      if (res.success && res.data) {
        setGeneratedNotice(res.data)
        toast.success('Representation letter drafted!')
      } else {
        toast.error(res.error || 'Failed to draft letter')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error generating notice')
    } finally {
      setIsGeneratingNotice(false)
    }
  }

  async function handleGenerateBulletin(audit: FieldAuditRecord) {
    setSelectedAuditForBulletin(audit)
    setGeneratedBulletin(null)
    setIsGeneratingBulletin(true)
    try {
      const res = await generatePublicHealthBulletinAction(audit.id, orgName)
      if (res.success && res.data) {
        setGeneratedBulletin(res.data)
        toast.success('Public health advisory bulletin created!')
      } else {
        toast.error(res.error || 'Failed to generate health bulletin')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error generating bulletin')
    } finally {
      setIsGeneratingBulletin(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-rose-100 text-rose-800 rounded-lg">
              <Activity className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Field Spot Audits & Sensor Logger
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Citizen science ground evidence for air quality, water tests and waste fires — plus letter drafts to authorities that you file yourself.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsNewAuditModalOpen(true)}
            className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs gap-2 px-4 h-9 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Log Spot Audit (स्पॉट जांच दर्ज करें)</span>
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'All Audits', icon: Activity },
          { id: 'air_quality', label: 'Air Quality & PM2.5', icon: Wind },
          { id: 'waste_burning', label: 'Waste Fires', icon: Flame },
          { id: 'water_quality', label: 'Water Contamination', icon: Droplets },
          { id: 'industrial_emissions', label: 'Industrial Emissions', icon: Building2 },
          { id: 'civic_infrastructure', label: 'Civic Breakdown', icon: AlertTriangle },
        ].map((tab) => {
          const Icon = tab.icon
          const active = filterType === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                active
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Audits List */}
      {filteredAudits.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-300 rounded-lg bg-slate-50/50 space-y-3">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No field spot audits logged yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Take low-cost sensors, cameras, or notes to local hotspots (waste dumps, industrial belts, open drains) and log your first citizen inspection.
          </p>
          <Button
            onClick={() => setIsNewAuditModalOpen(true)}
            variant="outline"
            className="text-xs font-bold gap-2 text-rose-700 border-rose-200 hover:bg-rose-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log First Field Audit</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAudits.map((audit) => {
            const readings = audit.sensor_readings || {}
            return (
              <div
                key={audit.id}
                className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        audit.severity === 'hazardous'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : audit.severity === 'severe'
                          ? 'bg-red-100 text-red-900 border border-red-200'
                          : audit.severity === 'high'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {audit.severity}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 capitalize">
                        {audit.audit_type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{audit.location_name}</span>
                    </h3>
                    {audit.landmark && (
                      <p className="text-xs text-slate-500 mt-0.5 ml-5">
                        Landmark: {audit.landmark} {audit.ward_no ? `• Ward ${audit.ward_no}` : ''}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-400 block">
                      {new Date(audit.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold block">
                      By {audit.auditor_name}
                    </span>
                  </div>
                </div>

                {/* Sensor Readings Grid */}
                {Object.keys(readings).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-md border border-slate-100 text-xs">
                    {readings.pm2_5 !== undefined && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">PM 2.5</span>
                        <span className="font-extrabold text-slate-900 text-sm">{readings.pm2_5} µg/m³</span>
                      </div>
                    )}
                    {readings.pm10 !== undefined && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">PM 10</span>
                        <span className="font-extrabold text-slate-900 text-sm">{readings.pm10} µg/m³</span>
                      </div>
                    )}
                    {readings.tds_ppm !== undefined && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">TDS Level</span>
                        <span className="font-extrabold text-slate-900 text-sm">{readings.tds_ppm} ppm</span>
                      </div>
                    )}
                    {readings.ph_level !== undefined && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">pH Value</span>
                        <span className="font-extrabold text-slate-900 text-sm">{readings.ph_level}</span>
                      </div>
                    )}
                  </div>
                )}

                {audit.source_identified && (
                  <div className="text-xs text-slate-700 bg-amber-50/60 border border-amber-200/60 p-2 rounded">
                    <span className="font-bold text-amber-900">Suspected Source: </span>
                    <span>{audit.source_identified}</span>
                  </div>
                )}

                {audit.remarks && (
                  <p className="text-xs text-slate-600 italic">
                    &quot;{audit.remarks}&quot;
                  </p>
                )}

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {audit.statutory_notice_ref ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{audit.statutory_notice_ref}</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Notice pending</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateBulletin(audit)}
                      className="text-xs h-7 font-bold gap-1 text-slate-700 hover:text-rose-700"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-rose-600" />
                      <span>WhatsApp Bulletin</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleGenerateNotice(audit)}
                      className="text-xs h-7 font-bold gap-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-white shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-rose-400" />
                      <span>Authority Letter Draft</span>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal: New Spot Audit */}
      {isNewAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-rose-600" />
                <h2 className="text-base font-bold text-slate-900">Log Field Spot Inspection</h2>
              </div>
              <button
                onClick={() => setIsNewAuditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAudit} className="space-y-3.5">
              <div>
                <Label className="text-xs font-bold text-slate-700">Violation / Audit Category *</Label>
                <Select value={auditType} onValueChange={setAuditType}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="air_quality">Air Quality & Toxic Smoke (PM2.5 / PM10)</SelectItem>
                    <SelectItem value="waste_burning">Open Garbage & Biomass Burning</SelectItem>
                    <SelectItem value="water_quality">Water Contamination / Drain Frothing</SelectItem>
                    <SelectItem value="industrial_emissions">Illegal Industrial Chimney Emissions</SelectItem>
                    <SelectItem value="construction_dust">Uncovered Construction & Demolition Dust</SelectItem>
                    <SelectItem value="civic_infrastructure">Civic Breakdown (Sewer, Roads, Dark Spot)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold text-slate-700">Location / Hotspot *</Label>
                  <Input
                    required
                    placeholder="e.g. Anand Vihar ISBT / Ghazipur"
                    value={locationName}
                    onChange={e => setLocationName(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700">Landmark / Gate</Label>
                  <Input
                    placeholder="e.g. Near Pillar No 48"
                    value={landmark}
                    onChange={e => setLandmark(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold text-slate-700">Ward Number</Label>
                  <Input
                    placeholder="e.g. Ward 42"
                    value={wardNo}
                    onChange={e => setWardNo(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700">District / Region</Label>
                  <Input
                    placeholder="e.g. East Delhi"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              {/* Sensor Readings Inputs */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wide block">
                  Sensor / Metric Readings (Optional)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <Label className="text-[10px] text-slate-500 font-semibold">PM 2.5 (µg/m³)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 485"
                      value={pm25}
                      onChange={e => setPm25(e.target.value)}
                      className="mt-0.5 h-8 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-500 font-semibold">PM 10 (µg/m³)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 620"
                      value={pm10}
                      onChange={e => setPm10(e.target.value)}
                      className="mt-0.5 h-8 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-500 font-semibold">TDS (ppm)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 850"
                      value={tdsPpm}
                      onChange={e => setTdsPpm(e.target.value)}
                      className="mt-0.5 h-8 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-slate-500 font-semibold">pH Level</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g. 6.4"
                      value={phLevel}
                      onChange={e => setPhLevel(e.target.value)}
                      className="mt-0.5 h-8 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold text-slate-700">Suspected Source / Entity</Label>
                  <Input
                    placeholder="e.g. Local waste dump / Construction site"
                    value={sourceIdentified}
                    onChange={e => setSourceIdentified(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-700">Severity *</Label>
                  <Select value={severity} onValueChange={(v: any) => setSeverity(v)}>
                    <SelectTrigger className="mt-1 h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moderate">Moderate (मध्यम)</SelectItem>
                      <SelectItem value="high">High (गंभीर)</SelectItem>
                      <SelectItem value="severe">Severe (अति गंभीर)</SelectItem>
                      <SelectItem value="hazardous">Hazardous (घातक / आपातकाल)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-slate-700">Field Notes / Observations</Label>
                <Textarea
                  rows={2}
                  placeholder="Notes on wind direction, visible smoke plume, resident complaints..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  className="mt-1 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsNewAuditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs"
                >
                  {isSubmitting ? 'Saving Audit...' : 'Save Field Audit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Representation Letter Draft View */}
      {selectedAuditForNotice && (
        <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Representation Letter Draft
                </h2>
                <p className="text-xs text-slate-500">
                  A draft for DPCC, CPCB, CAQM or NGT — review, print and file it yourself
                </p>
              </div>
              <button
                onClick={() => setSelectedAuditForNotice(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isGeneratingNotice ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  Drafting letter with Air Act, Water Act & CAQM references...
                </p>
              </div>
            ) : generatedNotice ? (
              <div className="space-y-4 text-xs text-slate-800">
                {/* Notice Header Box */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded font-mono space-y-1">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>REF: {generatedNotice.referenceNumber}</span>
                    <span>DATE: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="font-bold text-slate-700 mt-2">TO:</div>
                  <div className="whitespace-pre-line">{generatedNotice.recipientAuthority}</div>
                  <div className="font-bold text-slate-900 mt-2">SUBJECT: {generatedNotice.noticeTitle}</div>
                </div>

                {/* Acts Referenced */}
                <div className="space-y-1">
                  <span className="font-bold text-slate-900 uppercase text-[11px]">Laws Referenced (for your review):</span>
                  <div className="flex flex-wrap gap-1">
                    {generatedNotice.statutoryActsCited.map((act, i) => (
                      <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded text-[10px] font-bold">
                        {act}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notice Body */}
                <div className="p-4 bg-white border border-slate-200 rounded leading-relaxed whitespace-pre-line text-xs font-sans">
                  {generatedNotice.legalNoticeBody}
                </div>

                {/* Demands */}
                <div className="space-y-1.5 p-3 bg-amber-50/50 border border-amber-200 rounded">
                  <span className="font-bold text-amber-950 uppercase text-[11px]">Mandatory Statutory Demands:</span>
                  <ul className="list-disc pl-4 space-y-1 text-slate-700">
                    {generatedNotice.statutoryDemands.map((demand, i) => (
                      <li key={i}>{demand}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `REF: ${generatedNotice.referenceNumber}\nTO: ${generatedNotice.recipientAuthority}\nSUBJECT: ${generatedNotice.noticeTitle}\n\n${generatedNotice.legalNoticeBody}`
                      )
                      toast.success('Notice copied to clipboard!')
                    }}
                  >
                    Copy Full Text
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => window.print()}
                    className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-white font-bold gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Official Letter</span>
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Modal: Public Health Bulletin Generator */}
      {selectedAuditForBulletin && (
        <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Public Health Advisory & WhatsApp Bulletin
                </h2>
                <p className="text-xs text-slate-500">
                  1-Tap broadcast for resident groups and morning walkers
                </p>
              </div>
              <button
                onClick={() => setSelectedAuditForBulletin(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isGeneratingBulletin ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700">
                  Formatting bilingual citizen health advisory...
                </p>
              </div>
            ) : generatedBulletin ? (
              <div className="space-y-4 text-xs">
                {/* Visual Card Preview */}
                <div className="p-4 bg-white text-slate-900 border border-slate-200 rounded-lg space-y-2.5 shadow-md">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-mono text-[10px] uppercase text-rose-400 font-bold">
                      {orgName} • FIELD AUDIT
                    </span>
                    <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded">
                      {generatedBulletin.healthRiskLevel}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-white leading-snug">
                    {generatedBulletin.headlineEn}
                  </h3>
                  <h4 className="font-bold text-xs text-slate-300 leading-snug">
                    {generatedBulletin.headlineHi}
                  </h4>
                  <div className="p-2.5 bg-slate-800/80 rounded border border-slate-700 space-y-1 text-[11px]">
                    <div className="text-slate-300">
                      <span className="font-bold text-slate-100">Location: </span>
                      {generatedBulletin.locationTag}
                    </div>
                    <div className="text-slate-300">
                      <span className="font-bold text-slate-100">Metric: </span>
                      {generatedBulletin.measuredMetric}
                    </div>
                    <div className="text-slate-300">
                      <span className="font-bold text-slate-100">Action: </span>
                      {generatedBulletin.legalActionStatus}
                    </div>
                  </div>
                  <p className="text-[11px] text-rose-200 leading-relaxed font-semibold">
                    ⚠️ {generatedBulletin.advisoryTextEn}
                  </p>
                </div>

                {/* WhatsApp Text Box */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700">
                    Formatted WhatsApp Broadcast Text (Ready to send):
                  </Label>
                  <Textarea
                    readOnly
                    rows={6}
                    value={generatedBulletin.whatsappFormattedText}
                    className="text-xs font-mono bg-slate-50"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(generatedBulletin.whatsappFormattedText)
                      toast.success('WhatsApp bulletin copied to clipboard!')
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Copy WhatsApp Text</span>
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}

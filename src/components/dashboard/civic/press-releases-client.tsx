'use client'

import React, { useState } from 'react'
import {
  Newspaper, Plus, MessageSquare, Printer, Sparkles,
  CheckCircle2, Clock, MapPin, X, FileText, Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import {
  generateAIPressRelease,
  savePressReleaseAction,
  AIPressReleaseResult
} from '@/actions/press-releases'

interface PressReleaseRecord {
  id: string
  title_en: string
  title_hi?: string | null
  location_header: string
  embargo_type: string
  embargo_datetime?: string | null
  body_en: string
  body_hi?: string | null
  spokesperson_name: string
  spokesperson_phone: string
  spokesperson_designation: string
  is_published: boolean
  published_at?: string | null
  created_at: string
}

interface PressReleasesClientProps {
  orgId: string
  orgName: string
  initialReleases: PressReleaseRecord[]
}

export function PressReleasesClient({ orgId, orgName, initialReleases }: PressReleasesClientProps) {
  const [releases, setReleases] = useState<PressReleaseRecord[]>(initialReleases)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedRelease, setSelectedRelease] = useState<PressReleaseRecord | null>(null)

  // AI Generator Form State
  const [topic, setTopic] = useState('')
  const [locationHeader, setLocationHeader] = useState('NEW DELHI')
  const [embargoType, setEmbargoType] = useState<'immediate' | 'timed'>('immediate')
  const [embargoDatetime, setEmbargoDatetime] = useState('')
  const [keyDemands, setKeyDemands] = useState('')
  const [spokespersonName, setSpokespersonName] = useState('')
  const [spokespersonPhone, setSpokespersonPhone] = useState('')
  const [spokespersonDesignation, setSpokespersonDesignation] = useState('Chief Spokesperson')
  const [isGenerating, setIsGenerating] = useState(false)

  // Generated draft state
  const [aiDraft, setAiDraft] = useState<AIPressReleaseResult | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!topic.trim() || !spokespersonName.trim()) {
      toast.error('Please enter topic and spokesperson details')
      return
    }

    setIsGenerating(true)
    try {
      const demandsArr = keyDemands
        .split('\n')
        .map(d => d.trim())
        .filter(Boolean)

      const res = await generateAIPressRelease({
        topic,
        orgName,
        locationHeader,
        embargoType,
        embargoDatetime: embargoDatetime || undefined,
        keyDemands: demandsArr,
        spokespersonName,
        spokespersonPhone,
        spokespersonDesignation,
      })

      if (res.success && res.data) {
        setAiDraft(res.data)
        toast.success('Bilingual press release generated!')
      } else {
        toast.error(res.error || 'Failed to generate press release')
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  async function handleSaveRelease(publish: boolean) {
    if (!aiDraft) return

    setIsSaving(true)
    try {
      const res = await savePressReleaseAction({
        titleEn: aiDraft.titleEn,
        titleHi: aiDraft.titleHi,
        locationHeader: aiDraft.locationHeader || locationHeader,
        embargoType,
        embargoDatetime: embargoDatetime || undefined,
        bodyEn: aiDraft.bodyEn,
        bodyHi: aiDraft.bodyHi,
        spokespersonName,
        spokespersonPhone,
        spokespersonDesignation,
        isPublished: publish,
      })

      if (res.success && res.data) {
        toast.success(publish ? 'Press release published!' : 'Draft saved successfully!')
        setReleases([res.data as unknown as PressReleaseRecord, ...releases])
        setIsCreateModalOpen(false)
        setAiDraft(null)
      } else {
        toast.error(res.error || 'Failed to save press release')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error saving press release')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-indigo-100 text-indigo-800 rounded-lg">
              <Newspaper className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Press Release & Media Kit Studio
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Draft and format bilingual media releases with standard embargo headers, then copy the WhatsApp snippet to send out yourself.
          </p>
        </div>

        <Button
          onClick={() => {
            setAiDraft(null)
            setIsCreateModalOpen(true)
          }}
          className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-white font-bold text-xs gap-2 px-4 h-9 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Press Release (प्रेस विज्ञप्ति)</span>
        </Button>
      </div>

      {/* Releases List */}
      {releases.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-300 rounded-lg bg-slate-50/50 space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 mx-auto flex items-center justify-center">
            <Newspaper className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No press releases drafted yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Create professional English & Hindi press statements for rallies, environmental audit disclosures, or official demands.
          </p>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="outline"
            className="text-xs font-bold gap-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Draft First Press Release</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {releases.map((rel) => (
            <div
              key={rel.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    rel.is_published
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {rel.is_published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 ml-2">
                    {rel.location_header} • {new Date(rel.created_at).toLocaleDateString()}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5 leading-snug">
                    {rel.title_en}
                  </h3>
                  {rel.title_hi && (
                    <h4 className="text-xs font-semibold text-slate-600 mt-0.5">
                      {rel.title_hi}
                    </h4>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {rel.body_en}
              </p>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px]">
                  Spokesperson: <strong>{rel.spokesperson_name}</strong>
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedRelease(rel)}
                  className="text-xs h-7 font-bold gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Statement</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Press Release */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">AI Press Release Drafting Studio</h2>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!aiDraft ? (
              <form onSubmit={handleGenerate} className="space-y-3.5">
                <div>
                  <Label className="text-xs font-bold text-slate-700">Topic / Core Development *</Label>
                  <Textarea
                    required
                    rows={3}
                    placeholder="e.g. Citizen Air Action Collective releases ground audit exposing 8x hazardous PM2.5 in Anand Vihar and serves formal notice to DPCC..."
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="mt-1 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-bold text-slate-700">Location Dateline</Label>
                    <Input
                      placeholder="e.g. NEW DELHI"
                      value={locationHeader}
                      onChange={e => setLocationHeader(e.target.value)}
                      className="mt-1 h-9 text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-slate-700">Embargo Timing</Label>
                    <Select value={embargoType} onValueChange={(v: any) => setEmbargoType(v)}>
                      <SelectTrigger className="mt-1 h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">FOR IMMEDIATE RELEASE</SelectItem>
                        <SelectItem value="timed">Embargoed Release</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-bold text-slate-700">Core Demands (One per line)</Label>
                  <Textarea
                    rows={2}
                    placeholder="1. 24x7 water sprinkling at ISBT&#10;2. Immediate stop to open garbage burning"
                    value={keyDemands}
                    onChange={e => setKeyDemands(e.target.value)}
                    className="mt-1 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded">
                  <div>
                    <Label className="text-[11px] font-bold text-slate-700">Spokesperson Name *</Label>
                    <Input
                      required
                      placeholder="e.g. Adv. Amit Kumar"
                      value={spokespersonName}
                      onChange={e => setSpokespersonName(e.target.value)}
                      className="mt-1 h-8 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-slate-700">Contact Number *</Label>
                    <Input
                      required
                      placeholder="+91 98765 43210"
                      value={spokespersonPhone}
                      onChange={e => setSpokespersonPhone(e.target.value)}
                      className="mt-1 h-8 text-xs bg-white"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] font-bold text-slate-700">Designation</Label>
                    <Input
                      placeholder="e.g. Chief Convener"
                      value={spokespersonDesignation}
                      onChange={e => setSpokespersonDesignation(e.target.value)}
                      className="mt-1 h-8 text-xs bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isGenerating}
                    className="bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isGenerating ? 'Synthesizing Press Release...' : 'Generate Bilingual Release'}</span>
                  </Button>
                </div>
              </form>
            ) : (
              /* Review & Publish AI Draft */
              <div className="space-y-4 text-xs text-slate-800">
                <div className="p-4 bg-white text-slate-900 border border-slate-200 rounded font-mono space-y-1">
                  <div className="flex justify-between text-rose-400 font-bold text-[10px]">
                    <span>{orgName.toUpperCase()} • MEDIA RELEASE</span>
                    <span>{embargoType === 'immediate' ? 'FOR IMMEDIATE RELEASE' : 'EMBARGOED'}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-white font-sans mt-2">{aiDraft.titleEn}</h3>
                  <h4 className="font-bold text-xs text-slate-300 font-sans">{aiDraft.titleHi}</h4>
                </div>

                <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded font-sans leading-relaxed">
                  <span className="font-bold text-slate-900 text-[11px] block">English Statement:</span>
                  <p className="whitespace-pre-line text-xs">{aiDraft.bodyEn}</p>
                </div>

                {aiDraft.bodyHi && (
                  <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded font-sans leading-relaxed">
                    <span className="font-bold text-slate-900 text-[11px] block">हिंदी प्रेस वक्तव्य:</span>
                    <p className="whitespace-pre-line text-xs">{aiDraft.bodyHi}</p>
                  </div>
                )}

                {/* WhatsApp copy snippet */}
                <div className="space-y-1">
                  <Label className="text-[11px] font-bold text-slate-700">WhatsApp Media Group Broadcast Copy:</Label>
                  <Textarea readOnly rows={4} value={aiDraft.whatsappBroadcastText} className="text-xs font-mono bg-slate-50" />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(aiDraft.whatsappBroadcastText)
                      toast.success('WhatsApp text copied!')
                    }}
                    className="gap-1 text-emerald-700 border-emerald-200"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Copy WhatsApp Text</span>
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isSaving}
                      onClick={() => handleSaveRelease(false)}
                    >
                      Save as Draft
                    </Button>
                    <Button
                      size="sm"
                      disabled={isSaving}
                      onClick={() => handleSaveRelease(true)}
                      className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-white font-bold"
                    >
                      Publish Release
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: View Full Statement */}
      {selectedRelease && (
        <div className="fixed inset-0 z-50 bg-white/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-mono text-xs font-bold text-indigo-700">{selectedRelease.location_header}</span>
              <button onClick={() => setSelectedRelease(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-black text-slate-900">{selectedRelease.title_en}</h2>
              {selectedRelease.title_hi && (
                <h3 className="text-sm font-bold text-slate-700">{selectedRelease.title_hi}</h3>
              )}

              <div className="p-4 bg-slate-50 border border-slate-200 rounded whitespace-pre-line text-xs leading-relaxed">
                {selectedRelease.body_en}
              </div>

              {selectedRelease.body_hi && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded whitespace-pre-line text-xs leading-relaxed">
                  {selectedRelease.body_hi}
                </div>
              )}

              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded text-xs">
                <span className="font-bold text-indigo-900">Media Inquiries: </span>
                <span>{selectedRelease.spokesperson_name} ({selectedRelease.spokesperson_designation}) • {selectedRelease.spokesperson_phone}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <Button size="sm" onClick={() => window.print()} className="bg-white text-slate-900 border border-slate-200 font-bold gap-1">
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Release</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

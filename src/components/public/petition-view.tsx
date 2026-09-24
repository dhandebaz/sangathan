'use client'

import { useState } from 'react'
import { signPetitionAction, endorsePetitionAction } from '@/actions/petitions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  Users, CheckCircle2, Share2, Sparkles, MessageCircle, Twitter,
  Linkedin, Copy, ShieldCheck, HeartHandshake, ArrowRight, Building2, Flame
} from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import Link from 'next/link'

interface PetitionViewProps {
  lang: string
  org: {
    id: string
    name: string
    slug: string
    logo_url?: string | null
    org_type?: string
  }
  petition: {
    id: string
    title: string
    description: string
    target_decision_maker: string
    signature_goal: number
    current_signatures: number
    status: string
    volunteer_prompt_enabled: boolean
    volunteer_cta_text?: string
    created_at: string
  }
  recentSignatures: {
    id: string
    supporter_name: string
    supporter_locality?: string | null
    comment?: string | null
    signed_at: string
  }[]
  endorsements: {
    id: string
    statement?: string | null
    endorsing_org?: {
      name: string
      slug: string
      logo_url?: string | null
    }
  }[]
}

export function PetitionView({ lang, org, petition, recentSignatures: initialSignatures, endorsements }: PetitionViewProps) {
  const [signaturesCount, setSignaturesCount] = useState(petition.current_signatures || 0)
  const [signaturesList, setSignaturesList] = useState(initialSignatures)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSigned, setHasSigned] = useState(false)
  const [showConversionModal, setShowConversionModal] = useState(false)
  const [showEndorseModal, setShowEndorseModal] = useState(false)
  const [endorseStatement, setEndorseStatement] = useState('')

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    locality: '',
    comment: '',
    wantsToVolunteer: true,
  })

  const goal = petition.signature_goal || 500
  const progressPercent = Math.min(100, Math.round((signaturesCount / goal) * 100))

  async function handleSign(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email) {
      toast.error('Please enter your name and email.')
      return
    }

    setIsSubmitting(true)
    const res = await signPetitionAction({
      petition_id: petition.id,
      supporter_name: form.name,
      supporter_email: form.email,
      supporter_phone: form.phone,
      supporter_locality: form.locality,
      comment: form.comment,
      wants_to_volunteer: form.wantsToVolunteer,
    })

    setIsSubmitting(false)
    if (res.success) {
      setHasSigned(true)
      setSignaturesCount(prev => prev + 1)
      setSignaturesList(prev => [
        {
          id: 'temp-' + Date.now(),
          supporter_name: form.name,
          supporter_locality: form.locality || 'Verified Citizen',
          comment: form.comment,
          signed_at: new Date().toISOString(),
        },
        ...prev,
      ])
      toast.success('Your signature has been registered!')
      setShowConversionModal(true)
    } else {
      toast.error(res.error || 'Failed to record signature.')
    }
  }

  async function handleEndorse(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    const res = await endorsePetitionAction({
      petition_id: petition.id,
      statement: endorseStatement,
    })
    setIsSubmitting(false)
    if (res.success) {
      toast.success('Solidarity endorsement published!')
      setShowEndorseModal(false)
    } else {
      toast.error(res.error || 'Failed to submit endorsement.')
    }
  }

  function handleShare(platform: 'whatsapp' | 'twitter' | 'copy') {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const text = `Support this urgent campaign: "${petition.title}" initiated by ${org.name}. Sign the open petition here:`

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    } else {
      navigator.clipboard.writeText(url)
      toast.success('Petition link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Crisp Technical Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-slate-900 text-white font-bold flex items-center justify-center text-base">
              {org.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <Link href={`/${lang}/org/${org.slug}`} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                {org.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Public Campaign Drive</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEndorseModal(true)}
              className="text-xs border-slate-300 font-medium"
            >
              <HeartHandshake className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              Co-Sponsor & Endorse
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShare('whatsapp')}
              className="text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              WhatsApp Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Campaign Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Petition Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-sm shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Official Representation & Petition</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {petition.title}
              </h1>

              {/* Target Decision Maker Strip */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-500 font-medium">Addressed To:</span>
                <span className="font-semibold text-slate-900">{petition.target_decision_maker}</span>
              </div>

              {/* Petition Body */}
              <div className="mt-6 text-slate-700 text-base leading-relaxed whitespace-pre-line border-t border-slate-100 pt-6">
                {petition.description}
              </div>

              {/* Multi-Org Endorsements / Solidarity Strip */}
              {endorsements.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-indigo-600" />
                    <span>Solidarity Co-Sponsors ({endorsements.length})</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {endorsements.map((end) => (
                      <div
                        key={end.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50/60 border border-indigo-100 rounded-sm text-xs font-medium text-indigo-900"
                      >
                        <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{end.endorsing_org?.name || 'Partner Collective'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live Signers Ticker */}
            <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span>Recent Verified Signatories</span>
                <span className="text-xs text-slate-500 font-normal">{signaturesCount} total supporters</span>
              </h3>

              <div className="space-y-3 divide-y divide-slate-100">
                {signaturesList.slice(0, 6).map((sig) => (
                  <div key={sig.id} className="pt-3 first:pt-0 flex items-start justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{sig.supporter_name}</div>
                      {sig.comment && <p className="text-slate-600 italic mt-0.5">&ldquo;{sig.comment}&rdquo;</p>}
                    </div>
                    <span className="text-slate-400 font-mono text-[11px] whitespace-nowrap ml-4">
                      {sig.supporter_locality || 'Verified Citizen'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Signature Box & Action Hub */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-8">
            <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
              {/* Progress Gauge */}
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-2xl font-extrabold text-slate-900">{signaturesCount.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 font-medium">Goal: {goal.toLocaleString()} signatures</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {progressPercent}% towards triggering official submission to {petition.target_decision_maker}.
                </p>
              </div>

              {hasSigned ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-sm text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <h4 className="font-bold text-emerald-950 text-base">You Have Signed this Petition</h4>
                  <p className="text-xs text-emerald-800 mt-1 mb-4">
                    Your endorsement is logged on the public ledger. Multiply your impact by sharing this campaign with fellow members.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleShare('whatsapp')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Share on WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleShare('twitter')}
                      className="w-full border-slate-300 text-slate-700 text-xs"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Post on Twitter / X
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSign} className="space-y-4">
                  <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                    Sign this Open Representation
                  </h3>

                  <div>
                    <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1 h-10 text-sm rounded-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="mt-1 h-10 text-sm rounded-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">
                        Phone (WhatsApp)
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="mt-1 h-10 text-sm rounded-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="locality" className="text-xs font-semibold text-slate-700">
                        College / Locality
                      </Label>
                      <Input
                        id="locality"
                        placeholder="e.g. Delhi Univ / Ward 4"
                        value={form.locality}
                        onChange={(e) => setForm({ ...form, locality: e.target.value })}
                        className="mt-1 h-10 text-sm rounded-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="comment" className="text-xs font-semibold text-slate-700">
                      Why does this cause matter to you? (Optional)
                    </Label>
                    <Textarea
                      id="comment"
                      rows={2}
                      placeholder="Leave a short note for the administration..."
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      className="mt-1 text-sm rounded-sm"
                    />
                  </div>

                  {/* Viral Volunteer Conversion Hook */}
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-sm flex items-start gap-2.5">
                    <input
                      type="checkbox"
                      id="wantsToVolunteer"
                      checked={form.wantsToVolunteer}
                      onChange={(e) => setForm({ ...form, wantsToVolunteer: e.target.checked })}
                      className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="wantsToVolunteer" className="text-xs text-indigo-950 font-medium cursor-pointer">
                      <span className="font-bold block text-indigo-900">
                        1-Click Membership / Volunteer Opt-In:
                      </span>
                      {petition.volunteer_cta_text || `Volunteer with ${org.name} to help organize on ground.`}
                    </label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-sm text-sm shadow-sm"
                  >
                    {isSubmitting ? 'Signing...' : 'Sign Petition Now'}
                  </Button>
                </form>
              )}
            </div>

            {/* Privacy & Transparency Guarantee */}
            <div className="p-4 bg-slate-100 border border-slate-200 rounded-sm text-xs text-slate-600 space-y-1.5">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Anti-Spam Public Signature Registry</span>
              </div>
              <p>
                Signatures are verified to prevent duplicate automated bot entries. Data is protected under strict organizational governance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VIRAL HOOK CONVERSION MODAL */}
      <Dialog open={showConversionModal} onOpenChange={setShowConversionModal}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-sm">
          <DialogHeader>
            <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-sm flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Take the Next Step: Join {org.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Signing the petition is step one. True democratic change requires active organizers, volunteers, and collective solidarity.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-sm space-y-1">
              <div className="text-xs font-bold text-slate-800">Your Volunteer Application is Queued</div>
              <p className="text-[11px] text-slate-600">
                You will receive your digital membership credentials and a direct invite to the regional organizing committee via WhatsApp.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => handleShare('whatsapp')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                Broadcast on WhatsApp
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare('copy')}
                className="border-slate-300 text-xs font-semibold"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                Copy Link
              </Button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConversionModal(false)}
              className="text-xs text-slate-500"
            >
              Continue to Petition
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CO-SPONSOR ENDORSEMENT MODAL */}
      <Dialog open={showEndorseModal} onOpenChange={setShowEndorseModal}>
        <DialogContent className="max-w-md bg-white border border-slate-200 p-6 rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Co-Sponsor this Petition in Solidarity
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600">
              Endorsing as a partner organization adds your emblem and official endorsement to the public campaign ledger.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEndorse} className="space-y-4 py-2">
            <div>
              <Label htmlFor="statement" className="text-xs font-semibold text-slate-700">
                Joint Solidarity Statement (Optional)
              </Label>
              <Textarea
                id="statement"
                placeholder="e.g. Our organisation stands shoulder to shoulder with this critical public demand..."
                value={endorseStatement}
                onChange={(e) => setEndorseStatement(e.target.value)}
                rows={3}
                className="mt-1 text-sm rounded-sm"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowEndorseModal(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Co-Sponsorship'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

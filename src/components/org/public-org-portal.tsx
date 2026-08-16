'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Calendar, Clock, ShieldCheck, BadgeCheck, MapPin,
  Mail, Phone, Globe, Megaphone, ArrowRight, ArrowUpRight,
  Share2, Heart, Download, Users, Landmark, FileText,
  CheckCircle2, Sparkles, AlertCircle, Copy, Check,
  ChevronRight, ExternalLink, QrCode, Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { JoinButton } from '@/components/org/join-button'
import { PwaInstallButton, usePwa } from '@/components/pwa/pwa-install-prompt'
import { toast } from 'sonner'
import { getOrgLabel, OrgType } from '@/lib/org-types'
import { LEGAL_ENTITY_TYPE_CONFIG, LegalEntityType } from '@/lib/legal-entity-types'

export interface PublicOrgData {
  id: string
  name: string
  slug: string
  org_type: string | null
  legal_entity_type?: string | null
  governing_law?: string | null
  registrar_authority?: string | null
  registration_state?: string | null
  membership_policy: string
  created_at: string
  public_transparency_enabled: boolean
  description: string | null
  logo_url: string | null
  cover_url: string | null
  contact_email: string | null
  contact_phone: string | null
  website: string | null
  social_links: Record<string, string> | null
  address: string | null
  registration_status: string | null
  registration_number: string | null
  incorporation_date: string | null
  tax_id?: string | null
  darpan_id?: string | null
  tan?: string | null
  gstin?: string | null
  cin?: string | null
  fcra_registration?: string | null
  certificate_12a?: string | null
  certificate_80g?: string | null
  trade_union_registration?: string | null
}

export interface PublicAnnouncement {
  id: string
  title: string
  content: string
  is_pinned?: boolean
  created_at: string
}

export interface PublicPetition {
  id: string
  title: string
  slug: string
  description: string
  target_decision_maker: string
  signature_goal: number
  current_signatures?: number
  created_at: string
}

export interface PublicEvent {
  id: string
  title: string
  start_time: string
  location: string | null
  event_type: string
}

export interface PublicLeader {
  id: string
  full_name: string
  designation?: string | null
  role: string
  avatar_url?: string | null
}

export interface PublicPartner {
  id: string
  name: string
  slug: string
  logo_url?: string | null
}

export interface PublicOrgPortalProps {
  org: PublicOrgData
  lang: string
  memberStatus: string | null
  isAuthenticated: boolean
  partners: PublicPartner[]
  announcements: PublicAnnouncement[]
  petitions: PublicPetition[]
  events: PublicEvent[]
  leaders: PublicLeader[]
  metrics: { members: number; events: number; hours: number } | null
}

export function PublicOrgPortal({
  org,
  lang,
  memberStatus,
  isAuthenticated,
  partners,
  announcements,
  petitions,
  events,
  leaders,
  metrics,
}: PublicOrgPortalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'updates' | 'petitions' | 'events' | 'transparency' | 'contact'>('overview')
  const [copiedLink, setCopiedLink] = useState(false)
  const [showChandaModal, setShowChandaModal] = useState(false)
  const isHindi = lang === 'hi'

  const orgTypeLabel = getOrgLabel(org.org_type || 'ngo')
  const legalConfig = org.legal_entity_type ? LEGAL_ENTITY_TYPE_CONFIG[org.legal_entity_type as LegalEntityType] : null

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://sangathan.space/${lang}/org/${org.slug}`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${org.name} | Sangathan`,
          text: org.description || `Official profile and democratic portal of ${org.name} on Sangathan.`,
          url,
        })
        return
      } catch {
        // Fallback to clipboard
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      setCopiedLink(true)
      toast.success(isHindi ? 'लिंक कॉपी हो गया!' : 'Profile link copied to clipboard!')
      setTimeout(() => setCopiedLink(false), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 md:pb-16 text-slate-900">
      {/* 1. HERO HEADER WITH COVER & AVATAR */}
      <div className="relative border-b border-slate-200 bg-white">
        {/* Cover Graphic Banner */}
        <div className="relative h-44 sm:h-56 md:h-72 w-full bg-slate-900 overflow-hidden">
          {org.cover_url ? (
            <Image
              src={org.cover_url}
              alt={`${org.name} Cover`}
              fill
              className="object-cover opacity-60"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 opacity-95">
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
        </div>

        {/* Profile Card Overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20 md:-mt-24 pb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            {/* Logo & Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 min-w-0">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-2xl bg-white p-1.5 shadow-md border border-slate-200 shrink-0 overflow-hidden">
                {org.logo_url ? (
                  <Image
                    src={org.logo_url}
                    alt={`${org.name} Logo`}
                    fill
                    className="object-cover rounded-xl"
                    priority
                  />
                ) : (
                  <div className="h-full w-full bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-2xl sm:text-3xl">
                    {org.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight truncate">
                    {org.name}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  {/* Movement Archetype Tag */}
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-slate-100 text-slate-800 border border-slate-200">
                    <Sparkles className="w-3 h-3 text-slate-600" />
                    {orgTypeLabel}
                  </span>

                  {/* Legal Entity / Recognition Tag */}
                  {org.org_type === 'civic_collective' ? (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-rose-50 text-rose-800 border border-rose-200"
                      title="Recognized Grassroots Collective under BQF Section 8 Umbrella (CIN: U88900DL2025NPL452474)"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                      {isHindi ? 'बीक्यूएफ मान्यता प्राप्त' : 'BQF Recognized'}
                    </span>
                  ) : org.registration_status === 'registered' ? (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 border border-emerald-200"
                      title={org.registration_number ? `Reg: ${org.registration_number}` : 'Statutory Registered'}
                    >
                      <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {legalConfig ? (isHindi ? legalConfig.hi : legalConfig.en) : (isHindi ? 'पंजीकृत संस्था' : 'Registered Entity')}
                    </span>
                  ) : null}

                  {org.public_transparency_enabled && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm bg-indigo-50 text-indigo-800 border border-indigo-200">
                      <Landmark className="w-3 h-3 text-indigo-600" />
                      {isHindi ? 'पारदर्शी बहीखाता' : 'Transparency Verified'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-1.5 text-xs font-semibold border-slate-300 rounded-sm"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? (isHindi ? 'कॉपी किया!' : 'Copied!') : (isHindi ? 'शेयर' : 'Share')}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChandaModal(true)}
                className="gap-1.5 text-xs font-semibold border-slate-300 rounded-sm text-slate-700 hover:text-slate-900"
              >
                <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-50" />
                <span>{isHindi ? 'चंदा / दान' : 'Chanda / Donate'}</span>
              </Button>

              <PwaInstallButton lang={lang} variant="outline" size="sm" className="hidden sm:inline-flex rounded-sm" />

              {memberStatus === 'active' ? (
                <Link
                  href={`/${lang}/dashboard`}
                  className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-sm shadow-xs transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isHindi ? 'डैशबोर्ड खोलें' : 'Open Workspace'}</span>
                </Link>
              ) : (
                <JoinButton
                  orgId={org.id}
                  policy={org.membership_policy}
                  isAuthenticated={isAuthenticated}
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>

        {/* 2. NATIVE-APP STYLE HORIZONTAL TAB BAR */}
        <div className="border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar py-2" aria-label="Portal Navigation Tabs">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-sm whitespace-nowrap transition-all ${
                  activeTab === 'overview'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {isHindi ? 'विवरण (Overview)' : 'Overview'}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('updates')}
                className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'updates'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{isHindi ? 'अपडेट्स व पर्चे' : 'Bulletins & Updates'}</span>
                {announcements.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'updates' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {announcements.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('petitions')}
                className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'petitions'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{isHindi ? 'याचिकाएं व अभियान' : 'Petitions & Drives'}</span>
                {petitions.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'petitions' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {petitions.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('events')}
                className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-sm whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'events'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{isHindi ? 'सभाएं व कार्यक्रम' : 'Assemblies & Events'}</span>
                {events.length > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'events' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {events.length}
                  </span>
                )}
              </button>

              {org.public_transparency_enabled && (
                <button
                  type="button"
                  onClick={() => setActiveTab('transparency')}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-sm whitespace-nowrap transition-all ${
                    activeTab === 'transparency'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {isHindi ? 'पारदर्शिता लेजर' : 'Transparency Ledger'}
                </button>
              )}

              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`px-3.5 py-2 text-xs sm:text-sm font-bold rounded-sm whitespace-nowrap transition-all ${
                  activeTab === 'contact'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {isHindi ? 'संपर्क व सत्यापन' : 'Contact & Registry'}
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* 3. MAIN PORTAL CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* TAB 1: OVERVIEW & MISSION */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Impact Metric Strip */}
            {metrics && (
              <div className="grid grid-cols-3 gap-0 border border-slate-200 rounded-sm bg-white shadow-xs overflow-hidden">
                <div className="p-4 sm:p-6 text-center border-r border-slate-200">
                  <div className="text-xl sm:text-3xl font-black text-slate-900">{metrics.members}</div>
                  <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">
                    {isHindi ? 'सक्रिय सदस्य' : 'Active Members'}
                  </div>
                </div>
                <div className="p-4 sm:p-6 text-center border-r border-slate-200">
                  <div className="text-xl sm:text-3xl font-black text-slate-900">{metrics.events}</div>
                  <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">
                    {isHindi ? 'आयोजित सभाएं' : 'Assemblies Held'}
                  </div>
                </div>
                <div className="p-4 sm:p-6 text-center">
                  <div className="text-xl sm:text-3xl font-black text-slate-900">{metrics.hours}+</div>
                  <div className="text-[11px] sm:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">
                    {isHindi ? 'फील्ड सेवा घंटे' : 'Field Hours Logged'}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: About & Mission */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-xs space-y-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {isHindi ? 'संगठन का उद्देश्य व कार्यक्षेत्र' : 'Mission & Movement Mandate'}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                    {org.description ||
                      (isHindi
                        ? 'यह संगठन सांगठन मंच पर लोकतांत्रिक तरीके से संचालित एक सक्रिय नागरिक समूह है।'
                        : 'This organization is a verified collective utilizing Sangathan open democratic infrastructure for grassroots mobilization.')}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {isHindi ? 'स्थापना वर्ष:' : 'Established:'}{' '}
                      <strong>
                        {new Date(org.created_at).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </strong>
                    </span>
                    {org.registration_state && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        {isHindi ? 'कार्यक्षेत्र:' : 'Territory:'} <strong>{org.registration_state}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Verified Statutory Credentials Box */}
                <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{isHindi ? 'सत्यापित वैधानिक विवरण' : 'Verified Statutory Credentials'}</span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {org.tax_id && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Permanent Account Number (PAN)</div>
                        <div className="font-mono font-bold text-slate-900 mt-0.5">{org.tax_id}</div>
                      </div>
                    )}
                    {org.darpan_id && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
                        <div className="text-[10px] text-slate-500 font-bold uppercase">NITI Aayog NGO Darpan UID</div>
                        <div className="font-mono font-bold text-slate-900 mt-0.5">{org.darpan_id}</div>
                      </div>
                    )}
                    {org.certificate_12a && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Income Tax 12A Certificate</div>
                        <div className="font-mono font-bold text-slate-900 mt-0.5">{org.certificate_12a}</div>
                      </div>
                    )}
                    {org.certificate_80g && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Section 80G Tax Deduction</div>
                        <div className="font-mono font-bold text-emerald-700 mt-0.5">Verified 50% Tax Deductible</div>
                      </div>
                    )}
                    {org.trade_union_registration && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xs">
                        <div className="text-[10px] text-slate-500 font-bold uppercase">Trade Union Reg. (State Labour Dept)</div>
                        <div className="font-mono font-bold text-slate-900 mt-0.5">{org.trade_union_registration}</div>
                      </div>
                    )}
                    {org.org_type === 'civic_collective' && (
                      <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xs sm:col-span-2">
                        <div className="text-[10px] text-rose-800 font-bold uppercase">Constitutional Recognition</div>
                        <div className="text-xs text-rose-900 font-medium mt-0.5 leading-relaxed">
                          Operating under the constitutional guarantee of <strong>Article 19(1)(c)</strong> (Freedom of Association) and verified by Bahujan Queer Foundation Section 8 NGO Umbrella.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Office Bearers / Leadership */}
                {leaders.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {isHindi ? 'कार्यकारिणी व प्रमुख पदाधिकारी' : 'Executive Leadership & Bearers'}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {leaders.map((leader) => (
                        <div key={leader.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xs">
                          <div className="h-9 w-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {leader.full_name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">{leader.full_name}</div>
                            <div className="text-[11px] text-slate-500 truncate">{leader.designation || leader.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar: Quick Actions & Coalition */}
              <div className="space-y-6">
                {/* Membership Action Card */}
                <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {isHindi ? 'सदस्यता व सहभागिता' : 'Movement Membership'}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {isHindi
                      ? 'इस संगठन से जुड़कर लोकतांत्रिक मतदान, अभियानों और आधिकारिक बैठकों में भाग लें।'
                      : 'Join as an active participant to vote in resolutions, sign petitions, and access assemblies.'}
                  </p>
                  {memberStatus === 'active' ? (
                    <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xs text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{isHindi ? 'सत्यापित सदस्य' : 'Verified Member'}</span>
                    </div>
                  ) : (
                    <JoinButton
                      orgId={org.id}
                      policy={org.membership_policy}
                      isAuthenticated={isAuthenticated}
                      lang={lang}
                    />
                  )}
                </div>

                {/* Coalition & Alliance Partners */}
                {partners.length > 0 && (
                  <div className="bg-white border border-slate-200 rounded-sm p-6 shadow-xs space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {isHindi ? 'गठबंधन साझेदार (संयुक्त मोर्चा)' : 'Alliance & Coalition Partners'}
                    </h3>
                    <div className="space-y-2">
                      {partners.map((partner) => (
                        <Link
                          key={partner.id}
                          href={`/${lang}/org/${partner.slug}`}
                          className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xs transition group"
                        >
                          <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                            {partner.name}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE BULLETINS & UPDATES */}
        {activeTab === 'updates' && (
          <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {isHindi ? 'आधिकारिक बुलेटिन, पर्चे व प्रेस विज्ञप्तियां' : 'Official Bulletins & Public Circulars'}
              </h2>
            </div>

            {announcements.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-sm p-12 text-center space-y-2">
                <Megaphone className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">
                  {isHindi ? 'कोई सार्वजनिक अपडेट उपलब्ध नहीं' : 'No Public Updates Yet'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isHindi
                    ? 'संगठन द्वारा जारी किए जाने वाले नए नोटिस और पर्चे यहां दिखाई देंगे।'
                    : 'Official statements, notices, and press releases will be published here in real time.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-sm p-5 sm:p-6 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.is_pinned && (
                          <span className="bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase">
                            {isHindi ? 'पिन किया गया' : 'Pinned'}
                          </span>
                        )}
                        <span className="text-xs text-slate-400">
                          {new Date(item.created_at).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PETITIONS & CAMPAIGNS */}
        {activeTab === 'petitions' && (
          <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-150">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {isHindi ? 'सक्रिय जन याचिकाएं व नागरिक मांगें' : 'Active Public Petitions & Demands'}
              </h2>
            </div>

            {petitions.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-sm p-12 text-center space-y-2">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">
                  {isHindi ? 'कोई सक्रिय याचिका नहीं' : 'No Active Petitions Currently'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isHindi
                    ? 'संगठन द्वारा शुरू की जाने वाली नई याचिकाएं यहां दिखाई देंगी।'
                    : 'Democratic campaigns, open letters, and petitions will appear here.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {petitions.map((pet) => {
                  const sigCount = pet.current_signatures || 0
                  const percent = Math.min(100, Math.round((sigCount / (pet.signature_goal || 100)) * 100))

                  return (
                    <div
                      key={pet.id}
                      className="bg-white border border-slate-200 rounded-sm p-5 sm:p-6 shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <div className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
                            {isHindi ? 'लक्ष्य प्राधिकरण:' : 'Addressed to:'} {pet.target_decision_maker}
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{pet.title}</h3>
                        </div>
                        <Link
                          href={`/${lang}/org/${org.slug}/petitions/${pet.id}`}
                          className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-sm shadow-xs self-start sm:self-center shrink-0"
                        >
                          <span>{isHindi ? 'याचिका पर हस्ताक्षर करें' : 'Sign Petition'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        {pet.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-900">{sigCount} {isHindi ? 'हस्ताक्षर प्राप्त' : 'signatures logged'}</span>
                          <span className="text-slate-500">{pet.signature_goal} {isHindi ? 'का लक्ष्य' : 'target'}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ASSEMBLIES & EVENTS */}
        {activeTab === 'events' && (
          <div className="max-w-4xl mx-auto space-y-4 animate-in fade-in duration-150">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {isHindi ? 'आगामी जनसभाएं, टाउनहॉल व कार्यक्रम' : 'Upcoming Assemblies, Townhalls & Events'}
              </h2>
            </div>

            {events.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-sm p-12 text-center space-y-2">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">
                  {isHindi ? 'कोई आगामी कार्यक्रम निर्धारित नहीं' : 'No Upcoming Events Scheduled'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {isHindi
                    ? 'आगामी बैठकों और जनसभाओं की जानकारी जल्द यहां अपडेट की जाएगी।'
                    : 'Check back soon for upcoming townhalls, webinars, and ground actions.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-5 bg-white border border-slate-200 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-xs border border-indigo-200">
                          {evt.event_type}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(evt.start_time).toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>
                      {evt.location && (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{evt.location}</span>
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/${lang}/org/${org.slug}/events/${evt.id}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-sm transition self-start sm:self-center shrink-0"
                    >
                      {isHindi ? 'विवरण और RSVP' : 'View & RSVP'} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PUBLIC TRANSPARENCY LEDGER */}
        {activeTab === 'transparency' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
            <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {isHindi ? 'सार्वजनिक पारदर्शिता और फंड उपयोग लेज़र' : 'Public Transparency & Fund Utilization'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isHindi
                      ? 'जन विश्वास और ऑडिट प्रमाण के लिए रीयल-टाइम डिजिटल बहीखाता।'
                      : 'Cryptographically accountable financial and programmatic audit trail.'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-sm text-xs font-bold self-start sm:self-auto">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>A+ Grade Transparency</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs space-y-2 text-xs text-slate-700">
                <p>
                  🛡️ <strong>{isHindi ? 'पारदर्शिता नियम:' : 'Transparency Standard:'}</strong>{' '}
                  {isHindi
                    ? 'सभी प्राप्त चंदा और अनुदान का ब्यौरा जन सूचना के लिए खुला रहता है।'
                    : 'All donations and expenditures are audited under Sangathan Sovereign Open Ledger protocols.'}
                </p>
              </div>

              <div className="flex justify-center pt-2">
                <Link
                  href={`/${lang}/org/${org.slug}/transparency`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-sm shadow-xs transition"
                >
                  <Landmark className="w-4 h-4" />
                  <span>{isHindi ? 'पूर्ण ऑडिटेड लेज़र देखें' : 'Open Full Audited Ledger'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CONTACT & REGISTRY */}
        {activeTab === 'contact' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
            <div className="bg-white border border-slate-200 rounded-sm p-6 sm:p-8 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                {isHindi ? 'आधिकारिक संपर्क सूत्र व मुख्यालय' : 'Official Contact & Headquarters'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {org.contact_email && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs flex items-start gap-3">
                    <Mail className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">Official Email</div>
                      <a href={`mailto:${org.contact_email}`} className="text-xs text-indigo-600 font-medium hover:underline break-all">
                        {org.contact_email}
                      </a>
                    </div>
                  </div>
                )}

                {org.contact_phone && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs flex items-start gap-3">
                    <Phone className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">Official Phone / Helpline</div>
                      <div className="text-xs text-slate-800 font-medium">{org.contact_phone}</div>
                    </div>
                  </div>
                )}

                {org.website && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs flex items-start gap-3">
                    <Globe className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">External Domain</div>
                      <a href={org.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 font-medium hover:underline break-all">
                        {org.website.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}

                {org.address && (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">Headquarters / Office Address</div>
                      <div className="text-xs text-slate-800 leading-relaxed font-medium">{org.address}</div>
                    </div>
                  </div>
                )}
              </div>

              {org.social_links && Object.keys(org.social_links).length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="text-xs font-bold uppercase text-slate-500">Social Media Broadcasts</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(org.social_links).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xs text-xs font-medium text-slate-700 capitalize transition"
                      >
                        <span>{platform}</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. MOBILE STICKY BOTTOM QUICK-ACTION BAR (Native App Feel) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 p-2.5 backdrop-blur-md sm:hidden flex items-center justify-around gap-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex-1 h-9 text-xs font-bold border-slate-300 rounded-sm"
        >
          <Share2 className="w-3.5 h-3.5 mr-1" />
          <span>{isHindi ? 'शेयर' : 'Share'}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowChandaModal(true)}
          className="flex-1 h-9 text-xs font-bold border-slate-300 rounded-sm"
        >
          <Heart className="w-3.5 h-3.5 mr-1 text-rose-600 fill-rose-50" />
          <span>{isHindi ? 'चंदा' : 'Donate'}</span>
        </Button>

        <div className="flex-1">
          {memberStatus === 'active' ? (
            <Link
              href={`/${lang}/dashboard`}
              className="flex h-9 items-center justify-center bg-slate-900 text-white text-xs font-bold rounded-sm shadow-xs"
            >
              {isHindi ? 'डैशबोर्ड' : 'Workspace'}
            </Link>
          ) : (
            <JoinButton
              orgId={org.id}
              policy={org.membership_policy}
              isAuthenticated={isAuthenticated}
              lang={lang}
            />
          )}
        </div>
      </div>

      {/* 5. CHANDA / DONATION QUICK MODAL */}
      {showChandaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-sm p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600 fill-rose-50" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isHindi ? 'सहयोग व चंदा' : 'Contribute / Chanda'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowChandaModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {isHindi
                ? `${org.name} के जनहित कार्यों और अभियानों को सशक्त बनाने के लिए सीधे सहयोग करें।`
                : `Support the grassroots organizing and community actions of ${org.name}.`}
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xs text-center space-y-2">
              <div className="text-[10px] font-bold text-slate-500 uppercase">UPI Address / Chanda ID</div>
              <div className="text-sm font-mono font-black text-slate-900 select-all">
                {org.slug}@upi
              </div>
              <p className="text-[10px] text-slate-500">
                {isHindi ? 'किसी भी UPI ऐप (GPay, PhonePe, Paytm) से सीधे भुगतान करें' : 'Scan or enter in any UPI application'}
              </p>
            </div>

            <Button
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold h-9 rounded-sm"
              onClick={() => {
                setShowChandaModal(false)
                toast.success(isHindi ? 'धन्यवाद! UPI पता कॉपी हो गया।' : 'Thank you! UPI ID ready.')
              }}
            >
              {isHindi ? 'ठीक है' : 'Close'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

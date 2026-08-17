'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatPill } from '@/components/dashboard/stat-pill'
import { ActionCard } from '@/components/dashboard/action-card'
import { FeatureTile } from '@/components/dashboard/feature-tile'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Calendar, Users, CheckSquare, ArrowRight, UsersRound, Ticket,
  HandCoins, Wrench, Scale, ScrollText, MessageSquare, Radio,
  Flag, ShieldCheck, Gift, HeartHandshake, Vote, Database,
  Megaphone, Landmark, HardHat, AlertCircle, UserCheck, Network,
  RefreshCw, Sparkles, FolderLock, Printer, FileSpreadsheet, Layers, Plus,
  Activity, Clock, Newspaper, Share2, Copy, Check, ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { AdminStats, RecentActivityItem, DashboardEvent } from '@/types/dashboard'
import { getOrgLabel, OrgColor } from '@/lib/org-types'

type OrgFeature = {
  icon: React.ElementType
  title: string
  subtitle: string
  href: string
  color: 'brand' | 'emerald' | 'amber' | 'sky' | 'rose' | 'indigo'
}

function getOrgFeatures(type: string, lang: string): OrgFeature[] {
  const isHindi = lang === 'hi'
  switch (type) {
    case 'civic_collective':
      return [
        {
          icon: Activity,
          title: isHindi ? 'फील्ड स्पॉट जांच (Sensor Desk)' : 'Field Spot Audits (Sensor Desk)',
          subtitle: isHindi ? 'PM2.5, जल व प्रदूषण विधिक नोटिस' : 'Spot tests & statutory notices',
          href: `/${lang}/dashboard/field-audits`,
          color: 'rose',
        },
        {
          icon: Printer,
          title: isHindi ? '1-पेज आंदोलन पर्चा व हस्ताक्षर' : 'Printable Parcha & Signatures',
          subtitle: isHindi ? '₹1 फोटोस्टेट पर्चे व बैठक पत्र' : 'Monochrome flyers & physical sheets',
          href: `/${lang}/dashboard/parcha`,
          color: 'indigo',
        },
        {
          icon: Clock,
          title: isHindi ? 'स्टैम्प्ड रिसीविंग व 15-दिन RTI' : 'Stamped Receiving & RTI',
          subtitle: isHindi ? 'वार्ड डायरी व आरटीआई एस्केलेटर' : '15-day countdown & Sec 6(1) RTI',
          href: `/${lang}/dashboard/receiving-tracker`,
          color: 'amber',
        },
        {
          icon: MessageSquare,
          title: isHindi ? 'प्रेस विज्ञप्ति व मीडिया डिस्पैच' : 'Press Release Studio',
          subtitle: isHindi ? 'द्विभाषी मीडिया वक्तव्य व व्हाट्सएप' : 'Bilingual statements & media copy',
          href: `/${lang}/dashboard/press-releases`,
          color: 'emerald',
        },
      ]
    case 'ngo':
      return [
        {
          icon: HandCoins,
          title: isHindi ? 'दान व चंदा' : 'Donations & Chanda',
          subtitle: isHindi ? 'रसीदें और सहयोग राशि' : 'Track receipts & contributions',
          href: `/${lang}/dashboard/donations`,
          color: 'emerald',
        },
        {
          icon: HeartHandshake,
          title: isHindi ? 'स्वयंसेवक व टीम' : 'Volunteers & Teams',
          subtitle: isHindi ? 'काडर व कार्यभार प्रबंधन' : 'Coordinate teams & ground tasks',
          href: `/${lang}/dashboard/volunteers`,
          color: 'brand',
        },
        {
          icon: ScrollText,
          title: isHindi ? 'सरकारी व CSR अनुदान' : 'Grants & Matcher',
          subtitle: isHindi ? 'अनुदान खोजें व आवेदन करें' : 'Discover schemes & CSR funding',
          href: `/${lang}/dashboard/grants`,
          color: 'indigo',
        },
        {
          icon: ShieldCheck,
          title: isHindi ? 'वार्षिक अनुपालन व ऑडिट' : 'Statutory Compliance',
          subtitle: isHindi ? '80G, 12A व नियामक फाइलिंग' : 'Regulatory returns & filings',
          href: `/${lang}/dashboard/compliance`,
          color: 'amber',
        },
      ]
    case 'student_union':
      return [
        {
          icon: Vote,
          title: isHindi ? 'चुनाव व मतदान' : 'Elections & Ballots',
          subtitle: isHindi ? 'नामांकन व गोपनीय मतदान' : 'Manage polls & candidacies',
          href: `/${lang}/dashboard/elections`,
          color: 'indigo',
        },
        {
          icon: Database,
          title: isHindi ? 'RTI व प्रशासनिक ज्ञापन' : 'RTI & ATR Assistant',
          subtitle: isHindi ? 'आवेदन व ज्ञापन ट्रैक करें' : 'Draft RTI requests & track ATR',
          href: `/${lang}/dashboard/rti-atr`,
          color: 'brand',
        },
        {
          icon: Wrench,
          title: isHindi ? 'हॉस्टल व मेस ऑडिट' : 'Hostel & Mess Audit',
          subtitle: isHindi ? 'सुविधा निरीक्षण व शिकायतें' : 'Mess food & hostel inspection',
          href: `/${lang}/dashboard/hostel-mess`,
          color: 'amber',
        },
        {
          icon: Scale,
          title: isHindi ? 'कानूनी सहायता व एंटी-रैगिंग' : 'Legal Aid & Cell',
          subtitle: isHindi ? 'छात्र सुरक्षा व कानूनी मदद' : 'Anti-ragging cell & advocacy',
          href: `/${lang}/dashboard/legal-aid`,
          color: 'rose',
        },
      ]
    case 'workers_union':
      return [
        {
          icon: ScrollText,
          title: isHindi ? 'सामूहिक समझौते (CBA)' : 'CBA Agreements',
          subtitle: isHindi ? 'मज़दूर अधिकार व अनुबंध' : 'Collective bargaining records',
          href: `/${lang}/dashboard/cba`,
          color: 'amber',
        },
        {
          icon: AlertCircle,
          title: isHindi ? 'शिकायत निवारण' : 'Grievance Redressal',
          subtitle: isHindi ? 'कार्यस्थल शिकायतें हल करें' : 'Track and resolve worker disputes',
          href: `/${lang}/dashboard/grievances`,
          color: 'rose',
        },
        {
          icon: Vote,
          title: isHindi ? 'हड़ताल व गुप्त मतदान' : 'Strike Votes & Polls',
          subtitle: isHindi ? 'गोपनीय काडर रायशुमारी' : 'Encrypted secret strike ballots',
          href: `/${lang}/dashboard/polls`,
          color: 'indigo',
        },
        {
          icon: HardHat,
          title: isHindi ? 'मज़दूर कार्य आवंटन' : 'Worker Dispatch Desk',
          subtitle: isHindi ? 'रोस्टर व दैनिक शिफ्ट' : 'Job assignments & attendance',
          href: `/${lang}/dashboard/jobs`,
          color: 'brand',
        },
      ]
    case 'rwa':
      return [
        {
          icon: Wrench,
          title: isHindi ? 'सोसायटी मरम्मत व शिकायतें' : 'Society Maintenance',
          subtitle: isHindi ? 'प्लंबिंग, बिजली व लिफ्ट टिकट' : 'Track repair requests & tickets',
          href: `/${lang}/dashboard/maintenance`,
          color: 'sky',
        },
        {
          icon: Calendar,
          title: isHindi ? 'सामुदायिक सुविधा बुकिंग' : 'Facility Bookings',
          subtitle: isHindi ? 'क्लबहाउस व पार्क आरक्षण' : 'Clubhouse & ground slots',
          href: `/${lang}/dashboard/facilities`,
          color: 'brand',
        },
        {
          icon: UserCheck,
          title: isHindi ? 'आगंतुक व सुरक्षा रजिस्टर' : 'Visitor Pass & Security',
          subtitle: isHindi ? 'सुरक्षित डिजिटल प्रवेश लॉग' : 'Digital gate entry register',
          href: `/${lang}/dashboard/visitors`,
          color: 'indigo',
        },
        {
          icon: Vote,
          title: isHindi ? 'निवासी रायशुमारी व मतदान' : 'Resident Polls & Voting',
          subtitle: isHindi ? 'सोसायटी प्रस्ताव व मत' : 'Democratic colony resolutions',
          href: `/${lang}/dashboard/polls`,
          color: 'amber',
        },
      ]
    default:
      return []
  }
}

function getOrgStats(
  type: string,
  stats: AdminStats,
  lang: string
): { icon: React.ElementType; value: string | number; label: string; href: string; color: OrgColor }[] {
  const isHindi = lang === 'hi'
  const items: { icon: React.ElementType; value: string | number; label: string; href: string; color: OrgColor }[] = [
    {
      icon: Users,
      value: stats.members,
      label: isHindi ? 'कुल सदस्य (Members)' : 'Total Members',
      href: `/${lang}/dashboard/members`,
      color: 'brand',
    },
    {
      icon: Calendar,
      value: stats.events,
      label: isHindi ? 'सभाएं (Events)' : 'Scheduled Events',
      href: `/${lang}/dashboard/events`,
      color: 'indigo',
    },
    {
      icon: CheckSquare,
      value: stats.tasks,
      label: isHindi ? 'कार्य (Tasks)' : 'Active Tasks',
      href: `/${lang}/dashboard/tasks`,
      color: 'amber',
    },
  ]

  if (type === 'ngo') {
    items.push({
      icon: HandCoins,
      value: `₹${(stats.donations / 1000).toFixed(0)}K`,
      label: isHindi ? 'कुल दान (Donations)' : 'Total Raised',
      href: `/${lang}/dashboard/donations`,
      color: 'emerald',
    })
  } else if (type === 'student_union') {
    items.push({
      icon: Vote,
      value: stats.tasks,
      label: isHindi ? 'चुनाव स्टेटस (Elections)' : 'Pending Polls',
      href: `/${lang}/dashboard/elections`,
      color: 'sky',
    })
  } else if (type === 'workers_union') {
    items.push({
      icon: Scale,
      value: stats.tasks,
      label: isHindi ? 'शिकायतें (Grievances)' : 'Open Grievances',
      href: `/${lang}/dashboard/grievances`,
      color: 'rose',
    })
  } else if (type === 'rwa') {
    items.push({
      icon: Wrench,
      value: stats.tasks,
      label: isHindi ? 'मरम्मत टिकट (Tickets)' : 'Open Tickets',
      href: `/${lang}/dashboard/maintenance`,
      color: 'sky',
    })
  } else if (type === 'civic_collective') {
    items.push({
      icon: Activity,
      value: 'Live',
      label: isHindi ? 'फील्ड एक्शन डेस्क (Field Desk)' : 'Ground Action Desk',
      href: `/${lang}/dashboard/field-audits`,
      color: 'rose',
    })
  }

  return items
}

function getPriorityActions(type: string, lang: string, membershipRequests: number) {
  const isHindi = lang === 'hi'
  const actions: { icon: React.ElementType; title: string; description: string; href: string; color: OrgColor }[] = []

  if (membershipRequests > 0) {
    actions.push({
      icon: UsersRound,
      title: isHindi
        ? `${membershipRequests} नए सदस्य आवेदन लंबित हैं`
        : `${membershipRequests} New Member Applications Pending`,
      description: isHindi
        ? 'आवेदकों के विवरण की समीक्षा करें और सदस्यता स्वीकृत करें'
        : 'Review applicant profiles and grant workspace access',
      href: `/${lang}/dashboard/membership-requests`,
      color: 'amber',
    })
  }

  if (type === 'ngo') {
    actions.push({
      icon: HandCoins,
      title: isHindi ? 'नए दान सत्यापित करें व रसीद भेजें' : 'Verify Recent Donations & Send Receipts',
      description: isHindi
        ? 'प्राप्त सहयोग राशि की जांच करें और 80G रसीद जारी करें'
        : 'Reconcile donor payments and issue 80G tax receipts',
      href: `/${lang}/dashboard/donations`,
      color: 'emerald',
    })
  }

  if (type === 'student_union') {
    actions.push({
      icon: Vote,
      title: isHindi ? 'छात्र संघ चुनाव व नामांकन स्थिति' : 'Review Election Nominations & Status',
      description: isHindi
        ? 'उम्मीदवारों की पात्रता और लिंगदोह अनुपालन की जांच करें'
        : 'Audit candidate eligibility and Lyngdoh committee limits',
      href: `/${lang}/dashboard/elections`,
      color: 'indigo',
    })
  }

  if (type === 'workers_union') {
    actions.push({
      icon: AlertCircle,
      title: isHindi ? 'मज़दूर शिकायतें देखें और समाधान करें' : 'Resolve Urgent Worker Grievances',
      description: isHindi
        ? 'कार्यस्थल सुरक्षा व वेतन संबंधी शिकायतों का त्वरित निवारण करें'
        : 'Address workplace safety and wage dispute tickets',
      href: `/${lang}/dashboard/grievances`,
      color: 'rose',
    })
  }

  if (type === 'civic_collective') {
    actions.push({
      icon: Activity,
      title: isHindi ? 'फील्ड स्पॉट जांच या पर्चा बनाएं' : 'Log Spot Sensor Audit or Print Parcha',
      description: isHindi
        ? 'प्रदूषण जांच दर्ज करें, DPCC नोटिस ड्राफ्ट करें या बैठक पर्चे प्रिंट करें'
        : 'Log ground pollution tests, draft DPCC notices, or print ₹1 colony leaflets',
      href: `/${lang}/dashboard/field-audits`,
      color: 'rose',
    })
    actions.push({
      icon: Clock,
      title: isHindi ? 'स्टैम्प्ड रिसीविंग डायरी नंबर दर्ज करें' : 'Track Stamped Receiving & RTI Timers',
      description: isHindi
        ? 'वार्ड कार्यालय की रिसीविंग पर 15-दिवसीय वैधानिक काउंटडाउन शुरू करें'
        : 'Enforce Citizens\' Charter 15-day countdown on municipal representations',
      href: `/${lang}/dashboard/receiving-tracker`,
      color: 'amber',
    })
  }

  return actions
}

function getTimeGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'सुप्रभात (Good Morning)'
  if (hour < 17) return 'नमस्कार (Namaskar)'
  if (hour < 21) return 'शुभ संध्या (Good Evening)'
  return 'शुभ रात्रि (Good Night)'
}

export function AdminDashboard({
  lang,
  stats,
  recentActivity,
  upcomingEvents,
  membershipRequests,
  openAppeals,
  orgType,
  userName,
  orgName,
  slug,
  focusBlueprint,
  designation,
}: {
  lang: string
  stats: AdminStats
  recentActivity: RecentActivityItem[]
  upcomingEvents: DashboardEvent[]
  membershipRequests: number
  openAppeals: number
  orgType?: string
  userName?: string
  orgName?: string
  slug?: string
  focusBlueprint?: string
  designation?: string
}) {
  const type = orgType || 'ngo'
  const isHindi = lang === 'hi'
  const features = getOrgFeatures(type, lang)
  const statItems = getOrgStats(type, stats, lang)
  const priorityActions = getPriorityActions(type, lang, membershipRequests)
  const [dismissedActions, setDismissedActions] = useState<number[]>([])
  const [copiedInvite, setCopiedInvite] = useState(false)

  const visibleActions = priorityActions.filter((_, i) => !dismissedActions.includes(i))

  const defaultOrigin = 'https://sangathan.space'
  const [origin, setOrigin] = useState(defaultOrigin)

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const publicOrgUrl = `${origin}/${lang}/org/${slug || 'demo'}`

  const whatsappMessage = isHindi
    ? `नमस्कार! हमारे संगठन "${orgName || 'संगठन'}" से जुड़ें, बैठकें आयोजित करें, प्रस्तावों पर मतदान करें और परिपत्र प्राप्त करें:\n${publicOrgUrl}`
    : `Greetings! Join our collective "${orgName || 'Sangathan Collective'}" to organize ground meetings, vote on proposals, and access official circulars:\n${publicOrgUrl}`

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`${whatsappMessage}`)
    setCopiedInvite(true)
    toast.success(isHindi ? 'व्हाट्सएप आमंत्रण संदेश कॉपी किया गया!' : 'WhatsApp invite message copied!')
    setTimeout(() => setCopiedInvite(false), 2500)
  }

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Crisp Light Civic Hero Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {getTimeGreeting()}{userName ? `, ${userName}` : ''}!
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {getOrgLabel(type)} • {getOrgLabel(type, 'hi')}
              {designation && <span className="text-slate-400"> ({designation})</span>}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isHindi ? 'सक्रिय कार्यक्षेत्र' : 'Active Workspace'}
              </span>
              {focusBlueprint && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  {isHindi ? 'फोकस:' : 'Focus:'} {focusBlueprint.replace(/_/g, ' ')}
                </span>
              )}
            </div>
          </div>

          {/* Quick 1-Tap Action Buttons on Header */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              size="sm"
              className="h-9 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all active:scale-95 shadow-xs"
            >
              <Link href={`/${lang}/dashboard/members`}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                {isHindi ? '+ सदस्य जोड़ें' : '+ Member'}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 px-3.5 rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all active:scale-95 shadow-2xs"
            >
              <Link href={`/${lang}/dashboard/announcements`}>
                <Megaphone className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                {isHindi ? 'सूचना भेजें' : 'Notice'}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 px-3.5 rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all active:scale-95 shadow-2xs"
            >
              <Link href={`/${lang}/dashboard/donations`}>
                <HandCoins className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                {isHindi ? 'चंदा रसीद' : 'Chanda'}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Smart Ground Quickstart Hub (If members <= 2 or events == 0) */}
      {(stats.members <= 2 || upcomingEvents.length === 0) && (
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-indigo-50/30 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  {isHindi ? 'जमीनी संगठन त्वरित शुरुआत (Smart Quickstart Hub)' : 'Ground Collective Smart Quickstart Hub'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isHindi ? 'अपने समूह को 1-मिनट में मजबूत और सक्रिय बनाएं' : 'Activate and mobilize your collective in under 1 minute'}
                </p>
              </div>
            </div>
            {slug && (
              <a
                href={publicOrgUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
              >
                <span>{isHindi ? 'सार्वजनिक प्रोफ़ाइल' : 'Public Profile'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {/* Step A: WhatsApp Member Invite */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? '1. सदस्य जोड़ें (WhatsApp)' : '1. Invite Cadre via WhatsApp'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi
                  ? 'कॉलोनी व साथियों को 1-टैप में सार्वजनिक ज्वाइन लिंक भेजें।'
                  : 'Broadcast a pre-filled join invite directly to your WhatsApp group.'}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyInviteLink}
                  className="h-8 text-xs font-bold w-full border-slate-300"
                >
                  {copiedInvite ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedInvite ? (isHindi ? 'कॉपी हो गया' : 'Copied!') : (isHindi ? 'लिंक कॉपी करें' : 'Copy Invite')}
                </Button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0 transition-colors"
                >
                  WhatsApp →
                </a>
              </div>
            </div>

            {/* Step B: Schedule First Assembly / Event */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>{isHindi ? '2. पहली सभा / बैठक बुलाएं' : '2. Call First Assembly / GBM'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi
                  ? 'मुद्दों पर चर्चा और मांग पत्र तैयार करने के लिए बैठक तय करें।'
                  : 'Set a date, location, and agenda for your inaugural neighborhood assembly.'}
              </p>
              <div className="pt-1">
                <Button asChild size="sm" variant="outline" className="h-8 text-xs font-bold w-full border-slate-300">
                  <Link href={`/${lang}/dashboard/events/new`}>
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    {isHindi ? 'सभा शेड्यूल करें' : 'Schedule Assembly'}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Step C: First Document / Parcha */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Printer className="w-4 h-4 text-rose-600" />
                <span>{isHindi ? '3. पहला पर्चा या नोटिस बनाएं' : '3. Print Parcha / Notice'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi
                  ? '₹1 फोटोस्टेट आंदोलन पर्चा बनाएं या वार्ड कार्यालय को कानूनी नोटिस भेजें।'
                  : 'Generate a 1-page monochrome flyer or statutory notice for authorities.'}
              </p>
              <div className="pt-1">
                <Button asChild size="sm" variant="outline" className="h-8 text-xs font-bold w-full border-slate-300">
                  <Link href={type === 'civic_collective' ? `/${lang}/dashboard/parcha` : `/${lang}/dashboard/announcements`}>
                    <Printer className="w-3.5 h-3.5 mr-1" />
                    {isHindi ? 'पर्चा जनरेटर' : 'Open Parcha Desk'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Glance Stats (Touch-Friendly Horizontal Scroll / Grid) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
            {isHindi ? 'एक नज़र में • स्थिति' : 'Quick Glance Overview'}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {statItems.map((item) => (
            <StatPill
              key={item.href}
              icon={item.icon}
              value={item.value}
              label={item.label}
              href={item.href}
              color={item.color}
            />
          ))}
        </div>
      </div>

      {/* Invite Members CTA for New Collectives */}
      {stats.members <= 1 && (
        <div className="bg-gradient-to-r from-indigo-50/70 to-sky-50/70 border border-indigo-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white border border-indigo-200 flex items-center justify-center shrink-0 shadow-2xs">
              <UsersRound className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">
                {isHindi ? 'अपनी कोर टीम को आमंत्रित करें' : 'Build Your Core Organizing Team'}
              </h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                {isHindi
                  ? 'अपने प्रमुख कार्यकर्ताओं व स्वयंसेवकों को लिंक भेजकर या सीधे जोड़कर लोकतांत्रिक कार्यक्षेत्र साझा करें।'
                  : 'Invite core team members, assign responsibilities, and start organizing with democratic transparency.'}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild size="sm" className="gap-1.5 h-9 px-4 rounded-xl text-xs font-bold shadow-xs">
                  <Link href={`/${lang}/dashboard/members`}>
                    <UsersRound className="w-4 h-4" />
                    {isHindi ? 'सदस्यों को जोड़ें' : 'Invite Members'}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="gap-1.5 h-9 px-4 rounded-xl text-xs font-semibold">
                  <Link href={`/${lang}/dashboard/members`}>
                    <ArrowRight className="w-4 h-4" />
                    {isHindi ? 'मैन्युअल प्रविष्टि' : 'Add Manually'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Priority Actions (⚡ आज क्या करना है) */}
      {visibleActions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
            <span>⚡</span>
            <span>{isHindi ? 'आज क्या करना है • त्वरित कार्य' : "Today's Pending Actions"}</span>
          </h2>
          <div className="space-y-2.5">
            {visibleActions.map((action, i) => {
              const originalIndex = priorityActions.indexOf(action)
              return (
                <ActionCard
                  key={originalIndex}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  actionLabel={isHindi ? 'विवरण देखें' : 'View Action'}
                  actionHref={action.href}
                  color={action.color}
                  onDismiss={() => setDismissedActions([...dismissedActions, originalIndex])}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Core Capabilities Grid (🎯 मुख्य सुविधाएं) */}
      <div className="space-y-3">
        <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
          <span>🎯</span>
          <span>{isHindi ? 'मुख्य सुविधाएं • मुख्य मॉड्यूल' : 'Core Capabilities & Modules'}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {features.map((f) => (
            <FeatureTile
              key={f.href}
              icon={f.icon}
              title={f.title}
              subtitle={f.subtitle}
              href={f.href}
              color={f.color}
            />
          ))}
        </div>
      </div>

      {/* Quick Tools (🛠️ त्वरित उपकरण) */}
      <div className="space-y-3">
        <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
          <span>🛠️</span>
          <span>{isHindi ? 'त्वरित उपकरण • आवश्यक रजिस्टर व इनबॉक्स' : 'Quick Civic Utilities & Registers'}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            href={`/${lang}/dashboard/documents`}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs group"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <FolderLock className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {isHindi ? 'दस्तावेज़ वॉल्ट (Deeds व 80G)' : 'Document Vault'}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {isHindi ? '80G, 12A व संस्थागत प्रमाण पत्र' : 'Deeds, CBAs & 80G certificates'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 shrink-0 transition-colors" />
          </Link>

          <Link
            href={`/${lang}/dashboard/registers`}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs group"
          >
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {isHindi ? 'वैधानिक रजिस्टर (Form I, H)' : 'Statutory Registers'}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {isHindi ? 'सरकारी नियमों अनुसार फॉर्म व रोकड़' : 'Form I, H & Cash Book records'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 shrink-0 transition-colors" />
          </Link>

          <Link
            href={`/${lang}/dashboard/communications`}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs group"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {isHindi ? 'यूनिफाइड इनबॉक्स (WhatsApp)' : 'Unified Inbox'}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {isHindi ? 'व्हाट्सएप व टेलीग्राम संदेश' : 'WhatsApp & Telegram messages'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 shrink-0 transition-colors" />
          </Link>

          <Link
            href={`/${lang}/dashboard/channels`}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <Radio className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {isHindi ? 'मास्टर चैनल्स व क्यूआर कोड' : 'Master Channels & QR'}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {isHindi ? 'सदस्यता पोस्टर व चैनल सेटअप' : 'Public QR & broadcast bot routing'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 shrink-0 transition-colors" />
          </Link>

          <Link
            href={`/${lang}/dashboard/reference-data`}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs group"
          >
            <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {isHindi ? 'मास्टर संदर्भ डेटा (780+ जिले)' : 'Master Reference Data'}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {isHindi ? 'मानक पिन कोड व जिला संदर्भ' : '780+ Districts, PINs & state codes'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 shrink-0 transition-colors" />
          </Link>

          <Link
            href={`/${lang}/dashboard/emergency-sos`}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs group"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {isHindi ? 'आपातकालीन SOS अलर्ट' : 'Emergency SOS Dispatch'}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {isHindi ? 'काडर को त्वरित SMS अलर्ट' : 'Instant broadcast to response team'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 shrink-0 transition-colors" />
          </Link>
        </div>
      </div>

      {/* Membership & Appeals */}
      {(membershipRequests > 0 || openAppeals > 0) && (
        <div className="grid grid-cols-2 gap-3">
          <Card className={membershipRequests > 0 ? 'border-amber-200 bg-amber-50/50' : 'border-slate-200'}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-extrabold text-slate-900">{membershipRequests}</p>
              <p className="text-xs text-slate-500 mt-1">
                {isHindi ? 'लंबित आवेदन (Pending)' : 'Pending Requests'}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-2 h-8 px-4 rounded-xl text-xs font-bold">
                <Link href={`/${lang}/dashboard/membership-requests`}>
                  {isHindi ? 'समीक्षा करें' : 'Review'}
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className={openAppeals > 0 ? 'border-rose-200 bg-rose-50/50' : 'border-slate-200'}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-extrabold text-slate-900">{openAppeals}</p>
              <p className="text-xs text-slate-500 mt-1">
                {isHindi ? 'खुली अपीलें (Appeals)' : 'Open Appeals'}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-2 h-8 px-4 rounded-xl text-xs font-bold">
                <Link href={`/${lang}/dashboard/appeals`}>
                  {isHindi ? 'प्रबंधन करें' : 'Manage'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upcoming Events & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
              <Calendar className="h-4 w-4 text-indigo-600" />
              {isHindi ? 'आगामी कार्यक्रम व बैठकें' : 'Upcoming Events & Meetings'}
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-xs h-7 font-bold text-indigo-600">
              <Link href={`/${lang}/dashboard/events`}>
                {isHindi ? 'सभी देखें' : 'View All'}
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingEvents.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={Calendar}
                  title={isHindi ? 'कोई आगामी कार्यक्रम नहीं है' : 'No upcoming events scheduled'}
                  description={isHindi ? 'नया कार्यक्रम या बैठक शेड्यूल करें' : 'Schedule a new meeting or field event'}
                  actionLabel={isHindi ? '+ कार्यक्रम बनाएं' : 'Create Event'}
                  actionHref={`/${lang}/dashboard/events/new`}
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/${lang}/dashboard/events/${event.id}`}
                    className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors active:bg-slate-100"
                  >
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{event.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(event.start_time).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        • {event.location || (isHindi ? 'ऑनलाइन' : 'Online')}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
              <Database className="h-4 w-4 text-indigo-600" />
              {isHindi ? 'हाल की गतिविधियाँ' : 'Recent Workspace Activity'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentActivity.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  emoji="📋"
                  title={isHindi ? 'अभी कोई गतिविधि दर्ज नहीं है' : 'No activity logged yet'}
                  description={isHindi ? 'पहला सदस्य या नोटिस जोड़कर शुरुआत करें!' : 'Add your first member or circular to start!'}
                />
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.title || 'Untitled'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-slate-600 capitalize">
                          {item.type.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-slate-400">• {item.created_at}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


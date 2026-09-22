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
          title: isHindi ? 'फील्ड जांच' : 'Field check',
          subtitle: isHindi ? 'प्रदूषण और पानी की जांच' : 'Pollution and water check',
          href: `/${lang}/dashboard/field-audits`,
          color: 'rose',
        },
        {
          icon: Printer,
          title: isHindi ? 'पर्चा बनाएं' : 'Make parcha',
          subtitle: isHindi ? '₹1 वाला प्रिंट पर्चा' : 'Simple print flyer',
          href: `/${lang}/dashboard/parcha`,
          color: 'indigo',
        },
        {
          icon: Clock,
          title: isHindi ? 'शिकायत और RTI' : 'Complaint and RTI',
          subtitle: isHindi ? '30 दिन की याद' : '30-day reminder',
          href: `/${lang}/dashboard/receiving-tracker`,
          color: 'amber',
        },
        {
          icon: MessageSquare,
          title: isHindi ? 'प्रेस नोट' : 'Press note',
          subtitle: isHindi ? 'अखबार के लिए बयान' : 'Statement for media',
          href: `/${lang}/dashboard/press-releases`,
          color: 'emerald',
        },
      ]
    case 'ngo':
      return [
        {
          icon: HandCoins,
          title: isHindi ? 'दान' : 'Donations',
          subtitle: isHindi ? 'रसीदें बनाएं' : 'Make receipts',
          href: `/${lang}/dashboard/donations`,
          color: 'emerald',
        },
        {
          icon: HeartHandshake,
          title: isHindi ? 'टीम' : 'Team',
          subtitle: isHindi ? 'लोग और काम' : 'People and work',
          href: `/${lang}/dashboard/volunteers`,
          color: 'brand',
        },
        {
          icon: ScrollText,
          title: isHindi ? 'अनुदान' : 'Grants',
          subtitle: isHindi ? 'फंड खोजें' : 'Find funds',
          href: `/${lang}/dashboard/grants`,
          color: 'indigo',
        },
        {
          icon: ShieldCheck,
          title: isHindi ? 'कागज़ी काम' : 'Paperwork',
          subtitle: isHindi ? 'सालाना फाइलिंग' : 'Yearly filings',
          href: `/${lang}/dashboard/compliance`,
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
      label: isHindi ? 'सदस्य' : 'Members',
      href: `/${lang}/dashboard/people`,
      color: 'brand',
    },
    {
      icon: Calendar,
      value: stats.events,
      label: isHindi ? 'बैठकें' : 'Meetings',
      href: `/${lang}/dashboard/calendar`,
      color: 'indigo',
    },
    {
      icon: CheckSquare,
      value: stats.tasks,
      label: isHindi ? 'काम' : 'Tasks',
      href: `/${lang}/dashboard/tasks`,
      color: 'amber',
    },
  ]

  if (type === 'ngo') {
    items.push({
      icon: HandCoins,
      value: `₹${(stats.donations / 1000).toFixed(0)}K`,
      label: isHindi ? 'दान' : 'Money raised',
      href: `/${lang}/dashboard/donations`,
      color: 'emerald',
    })
  } else {
    items.push({
      icon: Activity,
      value: 'Live',
      label: isHindi ? 'फील्ड काम' : 'Field work',
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
        ? `${membershipRequests} नए आवेदन`
        : `${membershipRequests} new requests`,
      description: isHindi
        ? 'देखें और स्वीकार करें'
        : 'Review and accept',
      href: `/${lang}/dashboard/membership-requests`,
      color: 'amber',
    })
  }

  if (type === 'ngo') {
    actions.push({
      icon: HandCoins,
      title: isHindi ? 'दान की रसीद बनाएं' : 'Make donation receipts',
      description: isHindi
        ? 'नया दान देखें'
        : 'Check new donations',
      href: `/${lang}/dashboard/donations`,
      color: 'emerald',
    })
  }

  if (type === 'civic_collective') {
    actions.push({
      icon: Activity,
      title: isHindi ? 'फील्ड जांच या पर्चा' : 'Field check or parcha',
      description: isHindi
        ? 'जांच लिखें या पर्चा छापें'
        : 'Log a check or print parcha',
      href: `/${lang}/dashboard/field-audits`,
      color: 'rose',
    })
    actions.push({
      icon: Clock,
      title: isHindi ? 'शिकायत का हिसाब' : 'Complaint follow-up',
      description: isHindi
        ? '30 दिन की याद देखें'
        : 'See 30-day status',
      href: `/${lang}/dashboard/receiving-tracker`,
      color: 'amber',
    })
  }

  return actions
}

function getTimeGreeting(lang: string): string {
  const hour = new Date().getHours()
  const hi = lang === 'hi'
  if (hour < 12) return hi ? 'सुप्रभात' : 'Good morning'
  if (hour < 17) return hi ? 'नमस्कार' : 'Hello'
  if (hour < 21) return hi ? 'शुभ संध्या' : 'Good evening'
  return hi ? 'शुभ रात्रि' : 'Good night'
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
      {/* Welcome — single language, no jargon */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {getTimeGreeting(lang)}{userName ? `, ${userName}` : ''}!
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {isHindi ? getOrgLabel(type, 'hi') : getOrgLabel(type)}
              {designation && <span className="text-slate-400"> • {designation}</span>}
              {orgName && <span className="text-slate-400"> • {orgName}</span>}
            </p>
          </div>

          {/* Only 2 primary actions — rest lives in sections below */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              asChild
              size="sm"
              className="h-9 px-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-all active:scale-95 shadow-xs"
            >
              <Link href={`/${lang}/dashboard/people`}>
                <Plus className="w-3.5 h-3.5 mr-1" />
                {isHindi ? '+ सदस्य' : '+ Member'}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 px-3.5 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all active:scale-95 shadow-2xs"
            >
              <Link href={`/${lang}/dashboard/calendar`}>
                <Megaphone className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                {isHindi ? 'बैठक' : 'Meeting'}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Get started — only for new workspaces, max 3 steps */}
      {(stats.members <= 2 || upcomingEvents.length === 0) && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  {isHindi ? 'शुरुआत करें — 3 कदम' : 'Get started — 3 steps'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {isHindi ? 'पहले ये 3 काम करें' : 'Do these 3 first'}
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
                <span>{isHindi ? 'सार्वजनिक पेज' : 'Public page'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            {/* Step A: WhatsApp Member Invite */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? '1. सदस्य जोड़ें' : '1. Add members'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi
                  ? 'WhatsApp पर invite लिंक भेजें।'
                  : 'Send invite link on WhatsApp.'}
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
                <span>{isHindi ? '2. पहली बैठक बुलाएं' : '2. Call first meeting'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi
                  ? 'तारीख और जगह तय करें।'
                  : 'Pick a date and place.'}
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
                <span>{isHindi ? '3. पहला काम करें' : '3. Do first work'}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isHindi
                  ? 'पर्चा, शिकायत या दान — अपने काम से चुनें।'
                  : 'Parcha, issue or donation — pick yours.'}
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

      {/* Numbers at a glance */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
            {isHindi ? 'संख्या' : 'Numbers'}
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

      {/* Pending actions — max 2, no duplicate invite card */}
      {visibleActions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
            <span>{isHindi ? 'अभी करना है' : 'Do now'}</span>
          </h2>
          <div className="space-y-2.5">
            {visibleActions.slice(0, 2).map((action, i) => {
              const originalIndex = priorityActions.indexOf(action)
              return (
                <ActionCard
                  key={originalIndex}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  actionLabel={isHindi ? 'खोलें' : 'Open'}
                  actionHref={action.href}
                  color={action.color}
                  onDismiss={() => setDismissedActions([...dismissedActions, originalIndex])}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Your main tools */}
      <div className="space-y-3">
        <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
          <span>{isHindi ? 'मुख्य काम' : 'Main tools'}</span>
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

      {/* More tools — only 3 essentials, rest in sidebar */}
      <div className="space-y-3">
        <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
          <span>{isHindi ? 'और उपकरण' : 'More tools'}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            href={`/${lang}/dashboard/inbox`}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs group"
          >
            <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {isHindi ? 'संदेश' : 'Messages'}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {isHindi ? 'सबको सूचना भेजें' : 'Announce to everyone'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 shrink-0 transition-colors" />
          </Link>

          <Link
            href={`/${lang}/dashboard/documents`}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs group"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <FolderLock className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {isHindi ? 'कागज़' : 'Documents'}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {isHindi ? 'महत्वपूर्ण फाइलें' : 'Important files'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 shrink-0 transition-colors" />
          </Link>

          <Link
            href={`/${lang}/dashboard/governance`}
            className="flex items-center gap-3.5 p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                {isHindi ? 'हिसाब और वोट' : 'Money and votes'}
              </p>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {isHindi ? 'चंदा, खर्च और फैसले' : 'Funds, expenses, decisions'}
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
                {isHindi ? 'नए आवेदन' : 'New requests'}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-2 h-8 px-4 rounded-xl text-xs font-bold">
                <Link href={`/${lang}/dashboard/membership-requests`}>
                  {isHindi ? 'देखें' : 'Review'}
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className={openAppeals > 0 ? 'border-rose-200 bg-rose-50/50' : 'border-slate-200'}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-extrabold text-slate-900">{openAppeals}</p>
              <p className="text-xs text-slate-500 mt-1">
                {isHindi ? 'अपीलें' : 'Appeals'}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-2 h-8 px-4 rounded-xl text-xs font-bold">
                <Link href={`/${lang}/dashboard/appeals`}>
                  {isHindi ? 'देखें' : 'Manage'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Meetings and recent work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900">
              <Calendar className="h-4 w-4 text-indigo-600" />
              {isHindi ? 'आने वाली बैठकें' : 'Upcoming meetings'}
            </CardTitle>
            <Button asChild variant="ghost" size="sm" className="text-xs h-7 font-bold text-indigo-600">
              <Link href={`/${lang}/dashboard/events`}>
                {isHindi ? 'सभी' : 'View all'}
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingEvents.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={Calendar}
                  title={isHindi ? 'कोई बैठक नहीं है' : 'No meetings yet'}
                  description={isHindi ? 'पहली बैठक बनाएं' : 'Create your first meeting'}
                  actionLabel={isHindi ? '+ बैठक बनाएं' : 'Create meeting'}
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
              {isHindi ? 'ताज़ा काम' : 'Recent work'}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentActivity.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  emoji="📋"
                  title={isHindi ? 'अभी कुछ नहीं' : 'Nothing yet'}
                  description={isHindi ? 'पहला सदस्य जोड़कर शुरू करें!' : 'Add your first member to start!'}
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


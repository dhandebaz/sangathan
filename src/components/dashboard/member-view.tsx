'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Calendar, CheckSquare, Megaphone, ArrowRight, AlertCircle,
  Clock, MapPin, ExternalLink, Sparkles, HelpCircle, CheckCircle2,
  Activity, Printer, Vote, Wrench, HandCoins, Award, ScrollText
} from 'lucide-react'
import Link from 'next/link'
import { DashboardEvent, DashboardTask, DashboardAnnouncement } from '@/types/dashboard'
import { getOrgLabel, OrgColor } from '@/lib/org-types'

function welcomeMessage(type: string, isHindi: boolean): string {
  if (isHindi) {
    switch (type) {
      case 'civic_collective':
        return 'फील्ड जांच, पर्चा, बैठकें और जमीनी काम देखें'
      case 'ngo':
        return 'प्रोजेक्ट काम, बैठकें और स्वयंसेवक अवसर देखें'
      default:
        return 'अपने कार्यक्षेत्र की ताज़ा जानकारी देखें'
    }
  }
  switch (type) {
    case 'civic_collective':
      return 'Field checks, parcha drives, meetings and ground work'
    case 'ngo':
      return 'Ground projects, volunteer work and meetings'
    default:
      return 'Latest updates from your workspace'
  }
}

function getMemberActionTiles(type: string, lang: string) {
  const isHindi = lang === 'hi'
  switch (type) {
    case 'civic_collective':
      return [
        { icon: Activity, title: isHindi ? 'फील्ड जांच' : 'Field check', subtitle: isHindi ? 'प्रदूषण देखें' : 'Log an issue', href: `/${lang}/dashboard/field-audits`, color: 'rose' as OrgColor },
        { icon: Printer, title: isHindi ? 'पर्चा' : 'Parcha', subtitle: isHindi ? 'पर्चा छापें' : 'Print flyer', href: `/${lang}/dashboard/parcha`, color: 'indigo' as OrgColor },
        { icon: Vote, title: isHindi ? 'वोट' : 'Vote', subtitle: isHindi ? 'फैसले पर वोट' : 'Vote now', href: `/${lang}/dashboard/polls`, color: 'brand' as OrgColor },
        { icon: AlertCircle, title: isHindi ? 'शिकायत' : 'Complaint', subtitle: isHindi ? 'समस्या बताएं' : 'Report issue', href: `/${lang}/dashboard/complaints`, color: 'amber' as OrgColor },
      ]
    default: // ngo
      return [
        { icon: CheckSquare, title: isHindi ? 'मेरा काम' : 'My work', subtitle: isHindi ? 'काम देखें' : 'See tasks', href: `/${lang}/dashboard/tasks`, color: 'emerald' as OrgColor },
        { icon: Award, title: isHindi ? 'प्रमाणपत्र' : 'Certificate', subtitle: isHindi ? 'सर्टिफिकेट लें' : 'Get certificate', href: `/${lang}/dashboard/id-card`, color: 'indigo' as OrgColor },
        { icon: HandCoins, title: isHindi ? 'दान' : 'Donate', subtitle: isHindi ? 'मदद करें' : 'Contribute', href: `/${lang}/dashboard/donations`, color: 'amber' as OrgColor },
        { icon: Sparkles, title: isHindi ? 'सर्वे' : 'Survey', subtitle: isHindi ? 'फॉर्म भरें' : 'Fill form', href: `/${lang}/dashboard/forms`, color: 'rose' as OrgColor },
      ]
  }
}

function getTimeGreeting(lang: string): string {
  const hour = new Date().getHours()
  const hi = lang === 'hi'
  if (hour < 12) return hi ? 'सुप्रभात' : 'Good morning'
  if (hour < 17) return hi ? 'नमस्कार' : 'Hello'
  if (hour < 21) return hi ? 'शुभ संध्या' : 'Good evening'
  return hi ? 'शुभ रात्रि' : 'Good night'
}

export function MemberDashboard({
  lang,
  events,
  tasks,
  announcements,
  orgType,
  userName,
  userRole,
  designation,
  focusBlueprint,
  orgName,
}: {
  lang: string
  events: DashboardEvent[]
  tasks: DashboardTask[]
  announcements: DashboardAnnouncement[]
  orgType?: string
  userName?: string
  userRole?: string
  designation?: string
  focusBlueprint?: string
  orgName?: string
}) {
  const type = orgType || 'ngo'
  const isHindi = lang === 'hi'
  const taskCount = tasks.length
  const actionTiles = getMemberActionTiles(type, lang)

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Crisp Light Civic Welcome Card */}
      <div className="rounded-sm border border-slate-200 bg-white p-5 md:p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {getTimeGreeting(lang)}{userName ? `, ${userName}` : ''}!
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {welcomeMessage(type, isHindi)}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {getOrgLabel(type)} • {designation || (userRole ? userRole.replace(/_/g, ' ') : (isHindi ? 'सक्रिय सदस्य' : 'Active Member'))}
              </span>
              {focusBlueprint && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  {focusBlueprint.replace(/_/g, ' ')}
                </span>
              )}
              {taskCount > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  <CheckSquare className="w-3 h-3" />
                  {taskCount} {isHindi ? 'कार्य बाकी' : 'tasks assigned'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="h-9 px-4 rounded-sm bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 text-white font-semibold text-xs transition-colors  shadow-xs"
            >
              <Link href={`/${lang}/dashboard/tasks`}>
                <CheckSquare className="w-3.5 h-3.5 mr-1" />
                {isHindi ? 'मेरे कार्य देखें' : 'My Tasks'}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-9 px-4 rounded-sm border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors  shadow-2xs"
            >
              <Link href={`/${lang}/dashboard/calendar`}>
                <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                {isHindi ? 'कैलेंडर व सभाएं' : 'Calendar & Events'}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Tailored 1-Tap Member Ground Action Cards */}
      <div>
        <h2 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5 uppercase tracking-wide">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>{isHindi ? 'क्या करना है' : 'What to do'}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {actionTiles.map((tile) => {
            const Icon = tile.icon
            return (
              <Link
                key={tile.href}
                href={tile.href}
                className="p-4 rounded-sm border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xs  transition-colors group block"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 rounded-sm bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-colors" />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-950">
                  {tile.title}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {tile.subtitle}
                </p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* My Tasks Section */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <span>{isHindi ? 'मेरे कार्य • सौंपे गए काम' : 'My Assigned Ground Tasks'}</span>
          </h2>
          {tasks.length > 0 && (
            <Link
              href={`/${lang}/dashboard/tasks`}
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              {isHindi ? 'सभी देखें' : 'View All'}
            </Link>
          )}
        </div>
        {tasks.length === 0 ? (
          <div className="p-6 rounded-sm border border-slate-200 bg-white">
            <EmptyState
              emoji="✅"
              title={isHindi ? 'सभी कार्य संपन्न हो गए हैं! 🎉' : 'All tasks completed! 🎉'}
              description={isHindi ? 'फिलहाल कोई लंबित कार्य नहीं है।' : 'You have no pending assignments.'}
            />
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasks.slice(0, 3).map((task) => (
              <Card key={task.id} className="border-slate-200 bg-white transition-colors hover:shadow-sm ">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-md border-2 border-slate-300 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            task.priority === 'high'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : task.priority === 'medium'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {task.priority === 'high' && <AlertCircle className="h-3 w-3" />}
                          {task.priority === 'high'
                            ? (isHindi ? 'उच्च प्राथमिकता' : 'High')
                            : task.priority === 'medium'
                            ? (isHindi ? 'मध्यम' : 'Medium')
                            : (isHindi ? 'सामान्य' : 'Normal')}
                        </span>
                        {task.due_date && (
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-slate-400" />
                            {new Date(task.due_date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Events Section */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>{isHindi ? 'आने वाली सभाएं व कार्यक्रम' : 'Upcoming Assemblies & Events'}</span>
          </h2>
          {events.length > 0 && (
            <Link
              href={`/${lang}/dashboard/events`}
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              {isHindi ? 'सभी देखें' : 'View All'}
            </Link>
          )}
        </div>
        {events.length === 0 ? (
          <div className="p-6 rounded-sm border border-slate-200 bg-white">
            <EmptyState
              emoji="📅"
              title={isHindi ? 'कोई नई सभा नहीं है' : 'No upcoming assemblies'}
              description={isHindi ? 'जल्द ही नया कार्यक्रम घोषित किया जाएगा!' : 'Check back later for new events!'}
            />
          </div>
        ) : (
          <div className="space-y-2.5">
            {events.slice(0, 2).map((event) => (
              <Link href={`/${lang}/dashboard/events/${event.id}`} key={event.id} className="block">
                <Card className="border-slate-200 bg-white transition-colors hover:shadow-sm  border-l-4 border-l-indigo-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900">{event.title}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {new Date(event.start_time).toLocaleDateString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                          {event.location && (
                            <span className="text-[11px] text-slate-500 flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-slate-400" />
                              {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Latest Announcements */}
      <section className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
            <Megaphone className="w-4 h-4 text-indigo-600" />
            <span>{isHindi ? 'ताज़ा सूचनाएं व परिपत्र' : 'Latest Circulars & Notices'}</span>
          </h2>
        </div>
        {announcements.length === 0 ? (
          <div className="p-6 rounded-sm border border-slate-200 bg-white">
            <EmptyState
              emoji="📢"
              title={isHindi ? 'कोई नई सूचना नहीं है' : 'No announcements yet'}
              description={isHindi ? 'सभी परिपत्र यहीं दिखाई देंगे।' : 'Official announcements will appear here.'}
            />
          </div>
        ) : (
          <div className="space-y-2.5">
            {announcements.slice(0, 2).map((a) => (
              <Card key={a.id} className="border-slate-200 bg-white transition-colors hover:shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    {a.is_pinned && (
                      <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                        📌 {isHindi ? 'पिन की गई' : 'Pinned'}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 mb-1">{a.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{a.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Need Helpdesk Card */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-5 text-center space-y-2">
          <p className="text-sm font-bold text-slate-900">
            {isHindi ? 'कोई सहायता चाहिए? 🤔' : 'Need Support or Guidance?'}
          </p>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            {isHindi
              ? 'कार्यक्षेत्र, मतदान अथवा अन्य तकनीकी मार्गदर्शन के लिए सहायता डेस्क देखें।'
              : 'Access organizing guides, submit inquiries, or reach out to workspace coordinators.'}
          </p>
          <div className="pt-2">
            <Button asChild variant="outline" className="h-9 px-4 rounded-sm text-xs font-bold border-slate-300">
              <Link href={`/${lang}/dashboard/helpdesk`}>
                <HelpCircle className="h-3.5 w-3.5 mr-1 text-indigo-600" />
                {isHindi ? 'सहायता केंद्र देखें' : 'Open Helpdesk'}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Calendar, CheckSquare, Megaphone, ArrowRight, AlertCircle,
  Clock, MapPin, ExternalLink, Sparkles, HelpCircle, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { DashboardEvent, DashboardTask, DashboardAnnouncement } from '@/types/dashboard'
import { getOrgLabel } from '@/lib/org-types'

function welcomeMessage(type: string, isHindi: boolean): string {
  if (isHindi) {
    switch (type) {
      case 'student_union':
        return 'कैम्पस सभाएं, ज्ञापन और छात्र संघ गतिविधियाँ देखें'
      case 'workers_union':
        return 'यूनियन बैठकें, collective actions और मज़दूर अधिकार देखें'
      case 'rwa':
        return 'सोसायटी कार्यक्रम, रखरखाव नोटिस और बिलिंग देखें'
      case 'ngo':
        return 'प्रोजेक्ट कार्यभार, बैठकें और स्वयंसेवक अवसर देखें'
      default:
        return 'अपने नागरिक कार्यक्षेत्र की ताज़ा गतिविधियां देखें'
    }
  }
  switch (type) {
    case 'student_union':
      return 'Campus assemblies, student representations, and union activities'
    case 'workers_union':
      return 'Union meetings, collective agreements, and worker solidarity'
    case 'rwa':
      return 'Community events, maintenance circulars, and society updates'
    case 'ngo':
      return 'Ground projects, volunteer coordination, and meeting agenda'
    default:
      return 'Latest updates and actions from your civic workspace'
  }
}

function getTimeGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'सुप्रभात (Good Morning)'
  if (hour < 17) return 'नमस्कार (Namaskar)'
  if (hour < 21) return 'शुभ संध्या (Good Evening)'
  return 'शुभ रात्रि (Good Night)'
}

export function MemberDashboard({
  lang,
  events,
  tasks,
  announcements,
  orgType,
  userName,
}: {
  lang: string
  events: DashboardEvent[]
  tasks: DashboardTask[]
  announcements: DashboardAnnouncement[]
  orgType?: string
  userName?: string
}) {
  const type = orgType || 'ngo'
  const isHindi = lang === 'hi'
  const nextEvent = events[0]
  const taskCount = tasks.length

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Crisp Light Civic Welcome Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {getTimeGreeting()}{userName ? `, ${userName}` : ''}!
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {welcomeMessage(type, isHindi)}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {getOrgLabel(type)} • {isHindi ? 'सक्रिय सदस्य' : 'Active Member'}
              </span>
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
              className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all active:scale-95 shadow-xs"
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
              className="h-9 px-4 rounded-xl border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-all active:scale-95 shadow-2xs"
            >
              <Link href={`/${lang}/dashboard/events`}>
                <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-600" />
                {isHindi ? 'सभाएं' : 'Events'}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href={`/${lang}/dashboard/tasks`}
          className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-xs block"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <CheckSquare className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700">
              {isHindi ? 'मेरे कार्य (Tasks)' : 'My Tasks'}
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{taskCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {taskCount > 0
              ? (isHindi ? 'कार्य पूरा करने के लिए क्लिक करें' : 'Tap to review and complete')
              : (isHindi ? 'सभी कार्य पूरे हैं 🎉' : 'All tasks completed 🎉')}
          </p>
        </Link>

        <Link
          href={`/${lang}/dashboard/events`}
          className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-xs block"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-700">
              {isHindi ? 'अगली सभा (Next Event)' : 'Next Assembly'}
            </span>
          </div>
          {nextEvent ? (
            <div>
              <div className="text-sm font-bold text-slate-900 truncate">{nextEvent.title}</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {new Date(nextEvent.start_time).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          ) : (
            <div>
              <div className="text-sm font-medium text-slate-600">
                {isHindi ? 'कोई नई सभा नहीं' : 'No upcoming event'}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {isHindi ? 'शांति है!' : 'All clear!'}
              </p>
            </div>
          )}
        </Link>
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
          <div className="p-6 rounded-2xl border border-slate-200 bg-white">
            <EmptyState
              emoji="✅"
              title={isHindi ? 'सभी कार्य संपन्न हो गए हैं! 🎉' : 'All tasks completed! 🎉'}
              description={isHindi ? 'फिलहाल कोई लंबित कार्य नहीं है।' : 'You have no pending assignments.'}
            />
          </div>
        ) : (
          <div className="space-y-2.5">
            {tasks.slice(0, 3).map((task) => (
              <Card key={task.id} className="border-slate-200 bg-white transition-all hover:shadow-sm active:scale-[0.99]">
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
          <div className="p-6 rounded-2xl border border-slate-200 bg-white">
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
                <Card className="border-slate-200 bg-white transition-all hover:shadow-sm active:scale-[0.99] border-l-4 border-l-indigo-600">
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
          <div className="p-6 rounded-2xl border border-slate-200 bg-white">
            <EmptyState
              emoji="📢"
              title={isHindi ? 'कोई नई सूचना नहीं है' : 'No announcements yet'}
              description={isHindi ? 'सभी परिपत्र यहीं दिखाई देंगे।' : 'Official announcements will appear here.'}
            />
          </div>
        ) : (
          <div className="space-y-2.5">
            {announcements.slice(0, 2).map((a) => (
              <Card key={a.id} className="border-slate-200 bg-white transition-all hover:shadow-sm">
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
            <Button asChild variant="outline" className="h-9 px-4 rounded-xl text-xs font-bold border-slate-300">
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


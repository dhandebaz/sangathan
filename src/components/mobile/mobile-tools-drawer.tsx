'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  X, Search, Users, Calendar, Vote, CheckSquare, Megaphone,
  FolderLock, BookOpen, Layers, MessageSquare, Radio, Database,
  AlertTriangle, Flag, Award, HeartHandshake, ScrollText, DollarSign,
  Printer, Scale, Wrench, UserCheck, HardHat, Landmark, Settings,
  CreditCard, ShieldCheck, Zap, BarChart, GalleryVerticalEnd, UserCog,
  BookOpenText, FileSignature, Phone, HelpCircle, ChevronRight, LogOut, Sparkles,
  Activity, Clock, Newspaper
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolItem {
  href: string
  icon: React.ElementType
  titleEn: string
  titleHi: string
  descEn: string
  descHi: string
  category: 'core' | 'governance' | 'field' | 'compliance' | 'admin'
  color: string
}

interface MobileToolsDrawerProps {
  isOpen: boolean
  onClose: () => void
  lang: string
  orgType?: string
  isAdmin?: boolean
}

export function MobileToolsDrawer({
  isOpen,
  onClose,
  lang,
  orgType = 'ngo',
  isAdmin = true,
}: MobileToolsDrawerProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const isHindi = lang === 'hi'

  const allTools: ToolItem[] = useMemo(() => {
    const list: ToolItem[] = [
      // Core Parent Hubs
      {
        href: `/${lang}/dashboard/inbox`,
        icon: MessageSquare,
        titleEn: 'Unified Inbox & Dispatch',
        titleHi: 'एकीकृत इनबॉक्स व संवाद',
        descEn: '2-way chats, Telegram, Meet & SOS',
        descHi: 'चैट, टेलीग्राम, मीट व एसओएस',
        category: 'core',
        color: 'bg-orange-50 text-orange-700 border-orange-200',
      },
      {
        href: `/${lang}/dashboard/calendar`,
        icon: Calendar,
        titleEn: 'Calendar & Operations Sync',
        titleHi: 'कैलेंडर एवं समन्वय',
        descEn: 'Assemblies, meetings & iCal/Google sync',
        descHi: 'कार्यक्रम, बैठकें व कैलेंडर सिंक',
        category: 'core',
        color: 'bg-sky-50 text-sky-700 border-sky-200',
      },
      {
        href: `/${lang}/dashboard/people`,
        icon: Users,
        titleEn: orgType === 'rwa' ? 'Residents & Cadre Hub' : 'People & Members Hub',
        titleHi: orgType === 'rwa' ? 'निवासी व रोस्टर हब' : 'सदस्य व काडर हब',
        descEn: 'Rosters, badges, committees & volunteers',
        descHi: 'सूची, बैज, समितियां व स्वयंसेवक',
        category: 'core',
        color: 'bg-brand-50 text-brand-700 border-brand-200',
      },
      {
        href: `/${lang}/dashboard/forms`,
        icon: Sparkles,
        titleEn: 'Forms & Survey Studio',
        titleHi: 'फॉर्म व सर्वेक्षण हब',
        descEn: 'Surveys, Google Forms import, analytics & PWA',
        descHi: 'सर्वेक्षण, गूगल फॉर्म आयात, एनालिटिक्स व PWA',
        category: 'core',
        color: 'bg-orange-50 text-orange-700 border-orange-200',
      },
      {
        href: `/${lang}/dashboard/tasks`,
        icon: CheckSquare,
        titleEn: 'Tasks & Volunteer Desk',
        titleHi: 'कार्य व स्वयंसेवक डेस्क',
        descEn: 'Assign and track ground work',
        descHi: 'जिम्मेदारियां सौंपें और ट्रैक करें',
        category: 'core',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
      },
      {
        href: `/${lang}/dashboard/id-card`,
        icon: Award,
        titleEn: 'Member Badges & IDs',
        titleHi: 'पहचान पत्र व बैज',
        descEn: 'Verified digital ID cards',
        descHi: 'डिजिटल आईडी कार्ड व QR',
        category: 'core',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },

      // Governance
      {
        href: `/${lang}/dashboard/governance/proposals`,
        icon: ScrollText,
        titleEn: 'Proposals & Resolutions',
        titleHi: 'प्रस्ताव व संकल्प',
        descEn: 'Democratic resolutions & voting',
        descHi: 'लोकतांत्रिक निर्णय व प्रस्ताव',
        category: 'governance',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      },
      {
        href: `/${lang}/dashboard/polls`,
        icon: Vote,
        titleEn: 'Secret Ballots & Polls',
        titleHi: 'गुप्त मतदान व रायशुमारी',
        descEn: 'Encrypted anonymous voting',
        descHi: 'गोपनीय व पारदर्शी चुनाव',
        category: 'governance',
        color: 'bg-purple-50 text-purple-700 border-purple-200',
      },
      {
        href: `/${lang}/dashboard/donations`,
        icon: DollarSign,
        titleEn: 'Donations & Receipts',
        titleHi: 'दान, चंदा व रसीदें',
        descEn: 'Track chanda & 80G tax receipts',
        descHi: 'चंदा संग्रह व रसीद प्रेषण',
        category: 'governance',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      {
        href: `/${lang}/dashboard/grants`,
        icon: DollarSign,
        titleEn: 'Grants & Scheme Matcher',
        titleHi: 'सरकारी अनुदान व योजनाएं',
        descEn: 'Discover CSR & institutional grants',
        descHi: 'सरकारी व CSR अनुदान मिलान',
        category: 'governance',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
      },

      // Field & Grassroots Ops
      {
        href: `/${lang}/dashboard/field-audits`,
        icon: Activity,
        titleEn: 'Field Spot Audits & Sensor Desk',
        titleHi: 'फील्ड स्पॉट जांच व प्रदूषण नोटिस',
        descEn: 'PM2.5, water TDS & statutory notice generator',
        descHi: 'प्रदूषण जांच व वैधानिक कानूनी नोटिस',
        category: 'field',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
      },
      {
        href: `/${lang}/dashboard/parcha`,
        icon: Printer,
        titleEn: '1-Page Printable Parcha & Signatures',
        titleHi: '1-पेज आंदोलन पर्चा व हस्ताक्षर पत्र',
        descEn: 'Monochrome A4 photostat flyers & petition tables',
        descHi: '₹1 फोटोस्टेट पर्चे व कॉलोनी हस्ताक्षर पत्र',
        category: 'field',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      },
      {
        href: `/${lang}/dashboard/receiving-tracker`,
        icon: Clock,
        titleEn: 'Stamped Receiving & 15-Day RTI',
        titleHi: 'स्टैम्प्ड रिसीविंग व 15-दिन RTI',
        descEn: 'Track ward stamps & auto-draft Section 6(1) RTIs',
        descHi: 'वार्ड रिसीविंग डायरी व आरटीआई एस्केलेटर',
        category: 'field',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
      },
      {
        href: `/${lang}/dashboard/press-releases`,
        icon: Newspaper,
        titleEn: 'Press Release & Media Dispatch',
        titleHi: 'प्रेस विज्ञप्ति व मीडिया डिस्पैच',
        descEn: 'Bilingual media statements & WhatsApp text',
        descHi: 'द्विभाषी प्रेस रिलीज व व्हाट्सएप कॉपी',
        category: 'field',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      {
        href: `/${lang}/dashboard/forms`,
        icon: Sparkles,
        titleEn: 'Forms & Survey Studio',
        titleHi: 'फॉर्म व सर्वे स्टूडियो',
        descEn: 'Build custom polls & sentiment reports',
        descHi: 'प्रश्नावली बनाएं व रिपोर्ट देखें',
        category: 'field',
        color: 'bg-orange-50 text-orange-700 border-orange-200',
      },
      {
        href: `/${lang}/dashboard/communications`,
        icon: MessageSquare,
        titleEn: 'Unified Inbox (WhatsApp & Telegram)',
        titleHi: 'यूनिफाइड इनबॉक्स (व्हाट्सएप/टेलीग्राम)',
        descEn: 'Respond to queries from all channels',
        descHi: 'सभी संदेशों का एक जगह उत्तर दें',
        category: 'field',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      },
      {
        href: `/${lang}/dashboard/channels`,
        icon: Radio,
        titleEn: 'Master Channels & QR Codes',
        titleHi: 'मास्टर चैनल्स व क्यूआर कोड',
        descEn: 'Public channel routing & posters',
        descHi: 'प्रचार सामग्री व चैनल सेटअप',
        category: 'field',
        color: 'bg-teal-50 text-teal-700 border-teal-200',
      },
      {
        href: `/${lang}/dashboard/emergency-sos`,
        icon: AlertTriangle,
        titleEn: 'Emergency SOS Broadcast',
        titleHi: 'आपातकालीन SOS अलर्ट',
        descEn: 'Instant SMS & call dispatch to team',
        descHi: 'काडर को तुरंत आपात चेतावनी भेजें',
        category: 'field',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
      },
      {
        href: `/${lang}/dashboard/campaigns`,
        icon: Flag,
        titleEn: 'Public Petitions & Campaigns',
        titleHi: 'जनहित याचिकाएं व अभियान',
        descEn: 'Citizen mobilization & signature drives',
        descHi: 'हस्ताक्षर अभियान व समर्थन',
        category: 'field',
        color: 'bg-orange-50 text-orange-700 border-orange-200',
      },
      {
        href: `/${lang}/dashboard/field-mode`,
        icon: Database,
        titleEn: 'Offline Field Mode (PWA)',
        titleHi: 'ऑफलाइन फील्ड मोड',
        descEn: 'Collect data without internet',
        descHi: 'बिना इंटरनेट डेटा दर्ज करें',
        category: 'field',
        color: 'bg-slate-50 text-slate-700 border-slate-200',
      },

      // Documents & Compliance
      {
        href: `/${lang}/dashboard/documents`,
        icon: FolderLock,
        titleEn: 'Document Vault (80G, Deeds & PAN)',
        titleHi: 'दस्तावेज़ वॉल्ट (Deeds व प्रमाण पत्र)',
        descEn: 'Secure encrypted institutional repository',
        descHi: 'सुरक्षित कानूनी दस्तावेज भंडार',
        category: 'compliance',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
      },
      {
        href: `/${lang}/dashboard/registers`,
        icon: BookOpen,
        titleEn: 'Statutory Registers (Form I, H, Cash)',
        titleHi: 'वैधानिक रजिस्टर (फॉर्म I, H, रोकड़)',
        descEn: 'Government compliant record books',
        descHi: 'सरकारी नियमों अनुसार निर्धारित रजिस्टर',
        category: 'compliance',
        color: 'bg-sky-50 text-sky-700 border-sky-200',
      },
      {
        href: `/${lang}/dashboard/compliance`,
        icon: ShieldCheck,
        titleEn: 'Compliance Calendar & Alerts',
        titleHi: 'अनुपालन कैलेंडर व अलर्ट',
        descEn: 'Annual filing & audit tracker',
        descHi: 'वार्षिक रिटर्न व ऑडिट समय सीमा',
        category: 'compliance',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      },
      {
        href: `/${lang}/dashboard/reference-data`,
        icon: Layers,
        titleEn: 'Master Reference Data (780+ Districts)',
        titleHi: 'मास्टर कोड व जिले (780+ Districts)',
        descEn: 'Standard PIN, district & state codes',
        descHi: 'प्रशासनिक व जिला कोड संदर्भ',
        category: 'compliance',
        color: 'bg-orange-50 text-orange-700 border-orange-200',
      },

      // Admin & Settings
      {
        href: `/${lang}/dashboard/billing`,
        icon: CreditCard,
        titleEn: 'Civic Contribution & Sustainer Plan',
        titleHi: 'नागरिक योगदान व योजना',
        descEn: 'Manage receipts & patronage',
        descHi: 'योगदान विवरण व संरक्षक रसीदें',
        category: 'admin',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      },
      {
        href: `/${lang}/dashboard/audit`,
        icon: ShieldCheck,
        titleEn: 'Audit Logs & Guardrails',
        titleHi: 'ऑडिट लॉग व सुरक्षा',
        descEn: 'Immutable record of workspace actions',
        descHi: 'सभी कार्यों का संप्रभु सुरक्षा रिकॉर्ड',
        category: 'admin',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
      },
      {
        href: `/${lang}/dashboard/settings`,
        icon: Settings,
        titleEn: 'Workspace Settings',
        titleHi: 'संगठन सेटिंग्स',
        descEn: 'Logo, permissions & preferences',
        descHi: 'लोगो, प्रोफाइल व अधिकार',
        category: 'admin',
        color: 'bg-slate-50 text-slate-700 border-slate-200',
      },
      {
        href: `/${lang}/dashboard/helpdesk`,
        icon: HelpCircle,
        titleEn: 'Help & Knowledge Base',
        titleHi: 'सहायता व मार्गदर्शिका',
        descEn: 'Civic organizing manuals & support',
        descHi: 'उपयोग मार्गदर्शिका व सहायता',
        category: 'admin',
        color: 'bg-brand-50 text-brand-700 border-brand-200',
      },
    ]

    // Specific additions for RWA / Student Unions
    if (orgType === 'rwa') {
      list.push(
        {
          href: `/${lang}/dashboard/chanda`,
          icon: BookOpenText,
          titleEn: 'Chanda & Festival Ledger',
          titleHi: 'चंदा व उत्सव बहीखाता',
          descEn: 'Track festival contributions & passbooks',
          descHi: 'त्योहार व आयोजन चंदा रिकॉर्ड',
          category: 'core',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        },
        {
          href: `/${lang}/dashboard/tenant-verification`,
          icon: FileSignature,
          titleEn: 'Tenant Verification Desk',
          titleHi: 'किरायेदार पुलिस सत्यापन',
          descEn: 'Generate police verification forms',
          descHi: 'सत्यापन फॉर्म व दस्तावेज',
          category: 'compliance',
          color: 'bg-purple-50 text-purple-700 border-purple-200',
        },
        {
          href: `/${lang}/dashboard/municipal-letters`,
          icon: Printer,
          titleEn: 'Municipal Letter Generator',
          titleHi: 'नगर निगम पत्र निर्माता',
          descEn: 'Formal complaints & requests',
          descHi: 'सड़क, पानी, बिजली आधिकारिक पत्र',
          category: 'compliance',
          color: 'bg-sky-50 text-sky-700 border-sky-200',
        },
        {
          href: `/${lang}/dashboard/local-directory`,
          icon: Phone,
          titleEn: 'Local Essential Directory',
          titleHi: 'स्थानीय आवश्यक फोन निर्देशिका',
          descEn: 'Police, hospital, electrician contacts',
          descHi: 'थाना, डॉक्टर, एम्बुलेंस नंबर',
          category: 'core',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
        }
      )
    }

    return list
  }, [lang, orgType])

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return allTools
    const q = searchQuery.toLowerCase().trim()
    return allTools.filter(
      t =>
        t.titleEn.toLowerCase().includes(q) ||
        t.titleHi.toLowerCase().includes(q) ||
        t.descEn.toLowerCase().includes(q) ||
        t.descHi.toLowerCase().includes(q)
    )
  }, [allTools, searchQuery])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in md:hidden">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Bottom Sheet Modal */}
      <div
        className="w-full bg-white rounded-t-3xl border-t border-slate-200 max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 16px)' }}
      >
        {/* Handle Bar & Header */}
        <div className="p-4 pb-2 border-b border-slate-100">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {isHindi ? 'सभी सुविधाएं व उपकरण' : 'All Civic Tools & Modules'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi ? '1-टैप में किसी भी सुविधा तक पहुंचें' : 'Instant access to all workspace features'}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 bg-slate-100 active:scale-95 transition-all"
              aria-label="Close tools menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mt-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={isHindi ? 'सुविधा खोजें (उदा. चंदा, सदस्य, पत्र, नोटिस)...' : 'Search tools (e.g. members, chanda, letters)...'}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Scrollable Tool Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredTools.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              {isHindi ? 'कोई सुविधा नहीं मिली।' : 'No matching tools found.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredTools.map(tool => {
                const Icon = tool.icon
                return (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={onClose}
                    className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98] transition-all shadow-2xs"
                  >
                    <div
                      className={cn(
                        'w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border',
                        tool.color
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {isHindi ? tool.titleHi : tool.titleEn}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {isHindi ? tool.descHi : tool.descEn}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

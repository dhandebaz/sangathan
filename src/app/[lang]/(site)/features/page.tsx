import Image from 'next/image'
import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, ShieldCheck, Activity, Printer, Clock, Sparkles } from 'lucide-react'
import { InteractiveFeatures } from '@/components/features/interactive-features'
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'नागरिक सुविधाएं | संगठन' : 'Features & Movement Tools | Sangathan',
    description: isHindi
      ? 'नागरिक समूहों, पर्यावरण कार्यकर्ताओं और एनजीओ के लिए विशेष डिजिटल बुनियादी ढांचा।'
      : 'Purpose-built features for civic collectives, citizen science networks, and NGOs.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/features`,
      languages: {
        'en': 'https://sangathan.space/en/features',
        'hi': 'https://sangathan.space/hi/features',
      },
    },
    openGraph: {
      title: isHindi ? 'नागरिक सुविधाएं व जमीनी टूल्स | संगठन' : 'Features & Movement Tools | Sangathan',
      description: isHindi
        ? 'नागरिक समूहों, पर्यावरण कार्यकर्ताओं और एनजीओ के लिए विशेष डिजिटल बुनियादी ढांचा।'
        : 'Purpose-built features for civic collectives, citizen science networks, and NGOs.',
      url: `https://sangathan.space/${lang}/features`,
      siteName: 'Sangathan',
      type: 'website',
      images: [
        {
          url: `https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'नागरिक सुविधाएं व जमीनी टूल्स' : 'Features & Movement Tools')}&desc=${encodeURIComponent(isHindi ? 'नागरिक समूहों और एनजीओ के लिए विशेष डिजिटल बुनियादी ढांचा।' : 'Purpose-built features for civic collectives and NGOs.')}&type=feature&tag=Movement+Tools&lang=${lang}`,
          width: 1200,
          height: 630,
          alt: isHindi ? 'संगठन सुविधाएं' : 'Sangathan Features',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@areynetaji',
      creator: '@areynetaji',
      title: isHindi ? 'नागरिक सुविधाएं व जमीनी टूल्स | संगठन' : 'Features & Movement Tools | Sangathan',
      description: isHindi
        ? 'नागरिक समूहों, पर्यावरण कार्यकर्ताओं और एनजीओ के लिए विशेष डिजिटल बुनियादी ढांचा।'
        : 'Purpose-built features for civic collectives, citizen science networks, and NGOs.',
      images: [`https://sangathan.space/api/og?title=${encodeURIComponent(isHindi ? 'नागरिक सुविधाएं व जमीनी टूल्स' : 'Features & Movement Tools')}&desc=${encodeURIComponent(isHindi ? 'नागरिक समूहों और एनजीओ के लिए विशेष डिजिटल बुनियादी ढांचा।' : 'Purpose-built features for civic collectives and NGOs.')}&type=feature&tag=Movement+Tools&lang=${lang}`],
    },
  }
}

export default async function FeaturesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const orgs = [
    {
      id: 'civic_collective',
      title: isHindi ? 'नागरिक समूह व जमीनी आंदोलन' : 'Civic Collectives & Grassroots Movements',
      icon: 'Megaphone',
      color: 'rose',
      description: isHindi
        ? 'जमीनी अभियान, अनौपचारिक समूह, स्वतंत्र छात्र इकाइयां और आपसी-सहायता नेटवर्क। किसी पंजीकरण संख्या की आवश्यकता नहीं।'
        : 'Grassroots campaigns, informal collectives, activist coalitions, and mutual-aid networks. No registration number required.',
      features: [
        { icon: 'LayoutDashboard', title: 'Smart Organization-Specific Parent Feature Hubs', desc: 'Streamlined navigation architecture grouping specialized operations inside 5 core power hubs: Dashboard, Inbox, Calendar, People, and Forms & Surveys.' },
        { icon: 'MessageSquare', title: 'Unified Inbox & Dispatch (Google Meet + Telegram Bot)', desc: 'Centralized 2-way member chats, Telegram bot webhooks, 1-click Google Meet video rooms, mass announcements, and emergency crisis SOS alerts.' },
        { icon: 'Calendar', title: 'Centralized Calendar & Operations Sync (Google & Apple iCal)', desc: 'Centralized schedule for assemblies, meetings, and field survey pairings with RFC 5545 iCalendar (.ics) / webcal:// live feeds and Google Calendar sync.' },
        { icon: 'Users', title: 'Unified People, Credentials & Volunteer Hub', desc: 'Single high-speed workspace combining member directories, verified digital ID card studio, working committees, volunteer desks, and service certificates.' },
        { icon: 'ShieldCheck', title: 'Bahujan Queer Foundation (BQF) Community Recognition', desc: 'Active grassroots collectives can seek community affiliation with Bahujan Queer Foundation (Delhi Reg. Section 8 NGO) for credibility. This is non-profit recognition, not legal immunity or government registration.' },
        { icon: 'FileSpreadsheet', title: 'Live Google Contacts & Spreadsheet Cadre Intake', desc: '1-click selectively import organizing contacts from Google People API or connect Google Sheets to populate member directories with automated deduplication.' },
        { icon: 'FileText', title: 'Legacy Google Forms & Survey Response Migrator', desc: 'Migrate past Google Forms and survey responses into the collective survey studio with automated field generation and historical response retention.' },
        { icon: 'Activity', title: 'Field Spot Audits & Sensor Logger', desc: 'Ground evidence and citizen science testing desk for air quality (PM2.5/PM10), water TDS, waste fires, and industrial emissions with GPS geotagging.' },
        { icon: 'Scale', title: 'Pollution Representation Drafter', desc: 'Draft representations citing the Air Act 1981, Water Act 1974 and CAQM GRAP directives for DPCC, CPCB and SDMs — you file them yourself.' },
        { icon: 'Printer', title: '1-Page Printable Parcha & Physical Signature Sheets', desc: 'Generate high-contrast black-and-white flyers (पर्चे) formatted for ₹1 photostat/photocopy machines and physical pen-and-paper signature tables for colony chai stalls and parks.' },
        { icon: 'Clock', title: 'Complaint Diary & 30-Day RTI Reminder', desc: 'Save stamped receiving copies with dates. Get a 30-day reminder (the legal PIO reply period) and a Section 6(1) draft you print, sign and submit yourself.' },
        { icon: 'Newspaper', title: 'Bilingual Press Release & Media Dispatch Studio', desc: 'Draft journalistic English & Hindi media releases with standard embargo headers, spokesperson quote blocks, and 1-click formatted WhatsApp media broadcast copy.' },
        { icon: 'FileText', title: 'Government Letter Draft Helper', desc: 'Draft government letters referencing relevant provisions (DMC Act, RTI) for SDMs and municipal bodies. You review, print and submit them yourself.' },
        { icon: 'Sparkles', title: 'Grassroots Survey & Goal Studio (SEO Links & WhatsApp CTA)', desc: 'Build 1-click townhall polls, issue prioritization surveys, and volunteer pledges with memorable SEO custom slugs (/f/[slug]), 1-click WhatsApp forward templates, live Sentiment Matrix, and Participant PDF Dossiers.' },
        { icon: 'Globe', title: '1-Click Public Petition & Campaign Studio', desc: 'Publish open letters, campaigns, and drives with live signature counters and instant volunteer conversion hooks.' },
        { icon: 'Vote', title: 'Direct Democracy & Secret Voting Engine', desc: 'Secure, cryptographic anonymous secret ballots and leadership elections with instant tamper-evident tallies.' },
        { icon: 'Network', title: 'Joint Front & Coalition Engine (संयुक्त मोर्चा)', desc: 'Form alliances with other movements, co-sign joint representations, and publish shared public statements.' },
        { icon: 'ShieldAlert', title: 'Emergency SOS Team Broadcast', desc: '1-tap alert to your own team members and saved contacts with location and details you type. Not a legal rescue service.' },
        { icon: 'Database', title: 'Offline-First Field Organizer PWA', desc: 'Door-to-door membership intake and field grievance capture in zero-connectivity areas with automatic background queue sync.' },
        { icon: 'Award', title: 'Sharable Verified Member Badges & Credential Studio', desc: 'Generate high-resolution verified credentials, social movement graphics, and printable ID passes with 5 layout engines, photo avatar uploads, vector heraldry, and dynamic QR verification codes.' },
        { icon: 'Users', title: 'Volunteer & Working Group Desks', desc: 'Coordinate volunteers, assign field actions, and manage decentralized working subgroups and committees.' },
        { icon: 'Users', title: 'Granular Team Roles & Permission-Based Dashboards', desc: 'Can Comment, Can Edit, Can Manage, and Second Admin roles — every member sees a dashboard tailored to exactly what they are allowed to do.' },
        { icon: 'Building2', title: 'Local Government Authority Directory', desc: 'Searchable directory of municipal, police, PWD, and utility authorities that auto-matches every complaint to the right department and official.' },
        { icon: 'Sparkles', title: 'AI Complaint Photo Analysis', desc: 'Instant AI detection of issue type, affected department, and urgency from complaint photos with a confidence score.' },
        { icon: 'Printer', title: 'Formal Complaint Print & Delivery Tracking', desc: 'Generate official print-ready complaint letters addressed to the relevant authority, with hand or email delivery tracking.' },
        { icon: 'Sparkles', title: 'Sangathan AI Assistance & Minutes Extraction', desc: 'Draft meeting minutes, extract action items, and synthesize lengthy policy proposals with absolute data isolation.' },
        { icon: 'Lock', title: '1-Click Full Sovereign Data Export', desc: 'Export complete resolution records, votes, and member logs in open JSON/CSV formats anytime with zero lock-in.' },
        { icon: 'Smartphone', title: 'All-In-One Public Portal & Native PWA Installation', desc: 'Transform public org profiles into complete standalone web portals with native tabbed feeds, 1-tap UPI Chanda donation sheets, and instant Android/iOS homescreen app installation.' },
        { icon: 'Sparkles', title: 'AI & Vector Official Emblem Studio (2048px Export)', desc: 'Generate mathematically aligned circular statutory seals, modern crests, and letterhead-ready ink stamps with 1-click apply and 2048px high-resolution PNG downloads.' },
        { icon: 'ShieldCheck', title: 'Statutory Compliance & Government Readiness', desc: 'Legal entity sub-classification, validated statutory ID fields, compliance filings tracker, government API endpoints, and civic collective statutory knowledge hub.' }
      ]
    },
    {
      id: 'ngo',
      title: isHindi ? 'पंजीकृत स्वयंसेवी संगठन (NGO)' : 'Registered Non-Governmental Organisations',
      icon: 'Building2',
      color: 'emerald',
      description: isHindi
        ? 'अपने स्वयंसेवकों को प्रबंधित करें, पारदर्शी रूप से धन जुटाएं, और अपने दान दाताओं के साथ विश्वास बनाएं।'
        : 'Manage your volunteer base, raise funds transparently, and build unshakeable trust with your donors.',
      features: [
        { icon: 'LayoutDashboard', title: 'Smart Organization-Specific Parent Feature Hubs', desc: 'Streamlined navigation architecture grouping specialized operations inside 5 core power hubs: Dashboard, Inbox, Calendar, People, and Forms & Surveys.' },
        { icon: 'MessageSquare', title: 'Unified Inbox & Dispatch (Google Meet + Telegram Bot)', desc: 'Centralized 2-way donor/supporter chats, Telegram bot webhooks, 1-click Google Meet video rooms, and urgent disaster response SOS alerts.' },
        { icon: 'Calendar', title: 'Centralized Calendar & Operations Sync (Google & Apple iCal)', desc: 'Centralized schedule for board meetings, field work, and volunteer drives with RFC 5545 iCalendar (.ics) / webcal:// live feeds and Google Calendar sync.' },
        { icon: 'Award', title: 'Cryptographic Volunteer Service Certificates', desc: 'Issue official volunteer recognition certificates with service hours recognized, digital verification seals, and tamper-proof SHA-256 hashes.' },
        { icon: 'DollarSign', title: 'Grant Tranche Accounting & Milestone Spend', desc: 'Track milestone tranche disbursements, line-item expenditures against sanctioned budgets, and real-time remaining balance accounting.' },
        { icon: 'Globe', title: '1-Click Public Petition & Campaign Studio', desc: 'Publish open letters, campaigns, and drives with live signature counters and instant volunteer conversion hooks.' },
        { icon: 'Award', title: 'Sharable Verified Member Badges & Credential Studio', desc: 'Generate high-resolution verified credentials and social graphics for volunteers, trustees, and 80G officers with photo avatars, 5 layout engines, and cryptographic verification.' },
        { icon: 'Users', title: 'Team Invite System', desc: 'Invite members via email with shareable links. New members can accept and join instantly with role-based access.' },
        { icon: 'Users', title: 'Granular Roles & Permission-Based Dashboards', desc: 'Can Comment, Can Edit, Can Manage, and Second Admin roles with dashboards tailored to each member\'s permissions.' },
        { icon: 'Building2', title: 'Local Government Authority Directory', desc: 'Searchable directory of local authorities to auto-match complaints and requests to the correct department and official.' },
        { icon: 'Printer', title: 'Formal Complaint Print & Delivery Tracking', desc: 'Print-ready official complaint letters to authorities with hand or email delivery tracking for follow-up.' },
        { icon: 'ShieldCheck', title: 'Public Trust & Transparency Ledger', desc: 'Real-time fund utilization, programmatic expenditure bar charts, and SHA-256 verified receipt audit trails with 96/100 A+ rating.' },
        { icon: 'Sparkles', title: 'Sangathan AI Grant & CSR Matcher', desc: 'Automatically scan open government schemes and CSR funds, compute match score %, and generate structured grant application drafts.' },
        { icon: 'Smartphone', title: 'Telegram Conversational Bot & Webhook Engine', desc: 'Zero-configuration Telegram bot with instant grammY webhooks allowing supporters to log grievances, submit check-ins, or check dues via text.' },
        { icon: 'Database', title: 'Offline-First Field Organizer PWA', desc: 'Door-to-door membership intake and field grievance capture in zero-connectivity areas with automatic background queue sync.' },
        { icon: 'AlertTriangle', title: 'Emergency SOS & Legal Rapid Response', desc: '1-tap emergency crisis trigger broadcasting GPS coordinates and detention notes to defense advocates with live response tracking.' },
        { icon: 'Zap', title: 'No-Code Event-Driven Automations', desc: 'Visual Trigger → Condition → Action workflow builder with prebuilt recipes for instant onboarding and rapid SOS alerts.' },
        { icon: 'Lock', title: 'Defensive Permission Guards & Dual Approvals', desc: 'Cryptographically linked immutable audit chain with mandatory dual-approval workflows for high-risk operations.' },
        { icon: 'Database', title: 'Donor CRM Database', desc: 'Centralized profiles, giving history, and engagement tracking.' },
        { icon: 'Wallet', title: 'Donation Ledger', desc: 'Process one-time, recurring, and offline contributions.' },
        { icon: 'Receipt', title: 'Tax Receipts Automation', desc: 'Auto-generate 80G/501c3 compliant tax receipts for donors.' },
        { icon: 'Briefcase', title: 'Grant Tracking', desc: 'Manage grant applications and monitor fund utilization.' },
        { icon: 'ShieldCheck', title: 'Audit-Ready Ledgers', desc: 'Automated cash books and government compliance reporting.' },
        { icon: 'Users', title: 'Volunteer Registry', desc: 'Onboard volunteers, track skills, and log service hours.' },
        { icon: 'CheckSquare', title: 'Task & Workflow', desc: 'Assign field tasks and track project milestones.' },
        { icon: 'LineChart', title: 'Impact Analytics', desc: 'Dashboards measuring outcomes and ROI for funders.' },
        { icon: 'Megaphone', title: 'Campaign Management', desc: 'Goal-based peer-to-peer and public fundraising drives.' },
        { icon: 'ClipboardList', title: 'Field Forms & Surveys', desc: 'Offline-capable data collection for field workers.' },
        { icon: 'Network', title: 'Chapters & Subgroups', desc: 'Organise large NGOs by city chapters or wings.' },
        { icon: 'ShieldCheck', title: 'Helpdesk Support', desc: 'Centralized inbox for public and beneficiary inquiries.' },
        { icon: 'CreditCard', title: 'Scalable Cadre Capacity & Pay-As-You-Grow (₹11/Cadre)', desc: '500 active cadre slots included in base Sustainer plan with transparent ₹11/cadre/month capacity expansion for large movements and federations.' },
        { icon: 'CreditCard', title: 'Subscription & Plan Capacity Governance', desc: 'Predictable tier scaling, live member slot meters, automated receipt archiving, and multi-org enterprise capabilities.' },
        { icon: 'Sparkles', title: 'Civic Form & Survey Studio (SEO Links & WhatsApp CTA)', desc: 'Deploy volunteer skills intake, beneficiary assessments, and donor feedback forms with custom memorable links (/f/[slug]), 1-click direct WhatsApp viral forwarding, live Goal Consensus %, and Participant PDF Dossiers.' },
        { icon: 'FileSpreadsheet', title: 'Live Google Workspace & CSV Importer', desc: 'Import members via live Google People API (1-click contact selection), authenticated Google Sheets API (private sheet access), or traditional CSV upload. Includes automated column matching, phone validation, and deduplication.' },

        { icon: 'FileText', title: 'Live Google Forms API Migrator', desc: 'Import Google Forms directly via the Forms API — auto-pulls form structure (questions, field types, options) and all historical responses. Also supports CSV paste and response sheet link methods.' },
        { icon: 'FolderLock', title: 'Institutional Document & Asset Vault', desc: 'Encrypted cloud storage for Trust Deeds, 12A/80G tax orders, CSR-1 certificates, and property conveyance deeds with role permissions.' },
        { icon: 'Printer', title: 'Statutory PDF Registers & Audit Books', desc: '1-click export of Form I Member Rolls and Double-Entry Cash Books formatted for inspections.' },
        { icon: 'MapPin', title: 'National Geo Engine (780+ Districts)', desc: 'Pre-populated registry of all 28 Indian States, 8 UTs, and 780+ administrative districts with ISO codes and SDG sector taxonomies.' },
        { icon: 'Globe', title: 'Public SEO & AI Search Engine Citability', desc: 'Schema.org JSON-LD structured data, dynamic Edge OpenGraph image previews, and high-signal public profiles indexed across Google, Bing, and AI answer engines.' },
        { icon: 'FileText', title: 'Smart Compliance Tracker', desc: 'Auto-suggests 12A, 80G, FCRA based on actual usage and donations.' },
        { icon: 'ShieldCheck', title: 'Legal Identity & Compliance Engine', desc: 'Manage statutory registrations (PAN, CIN, GSTIN) and compliance filings with upcoming direct Government API integrations.' },
        { icon: 'Smartphone', title: 'All-In-One Public Portal & Native PWA Installation', desc: 'Transform public org profiles into complete standalone web portals with native tabbed feeds, 1-tap UPI Chanda donation sheets, and instant Android/iOS homescreen app installation.' },
        { icon: 'Sparkles', title: 'AI & Vector Official Emblem Studio (2048px Export)', desc: 'Generate mathematically aligned circular statutory seals, modern crests, and letterhead-ready ink stamps with 1-click apply and 2048px high-resolution PNG downloads.' },
        { icon: 'ShieldCheck', title: 'Statutory Compliance & Government Readiness', desc: 'Legal entity sub-classification, validated statutory ID fields, compliance filings tracker, government API endpoints, and statutory knowledge hub.' }
      ]
    }
  ]

  return (
    <div className="bg-white min-h-screen">
      <SoftwareApplicationJsonLd />
      <BreadcrumbJsonLd items={[
        { name: isHindi ? 'होम' : 'Home', url: `https://sangathan.space/${lang}` },
        { name: isHindi ? 'सुविधाएं' : 'Features', url: `https://sangathan.space/${lang}/features` },
      ]} />
      
      {/* Crisp, light, geometric technical header design with leader anchor */}
      <div className="border-b border-slate-200 bg-gradient-to-b from-slate-50/70 via-white to-white py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 text-center lg:text-left space-y-4">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {isHindi 
                  ? 'हर आंदोलनकारी और नागरिक समूह की डिजिटल ताकत' 
                  : 'Every Tool an Organizer Needs to Build Power and Win.'}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {isHindi 
                  ? 'नागरिक समूहों और पंजीकृत एनजीओ के लिए विशेष मॉड्यूल — 1-टैप फील्ड जांच व ₹1 पर्चे से लेकर गुप्त मतदान और वैधानिक 80G लेजर तक।' 
                  : 'Purpose-built for civic collectives and NGOs. From 1-tap spot audits and ₹1 printable Parchas to secret ballots and 80G tax receipts.'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2 text-xs font-medium text-slate-600">
                <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded">
                  <Activity className="w-3.5 h-3.5 text-rose-600" /> Sensor Audits
                </span>
                <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded">
                  <Printer className="w-3.5 h-3.5 text-slate-700" /> ₹1 A4 Parchas
                </span>
                <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> 30-Day RTI Reminder
                </span>
                <span className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2.5 py-1 rounded">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" /> BQF Recognition
                </span>
              </div>
            </div>

            {/* Right Leader Box */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-full max-w-[260px] sm:max-w-[300px] bg-slate-50 border border-slate-200 rounded-lg p-3 shadow-xs">
                <div className="relative w-full h-[280px] sm:h-[320px] flex items-end justify-center">
                  <Image
                    src="/images/activist-leader.png"
                    alt="Ground Movement Leader - Sangathan Features"
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-contain object-bottom"
                    priority
                  />
                </div>
                <div className="text-center pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-bold text-slate-900 block font-mono">
                    Zero Tech Friction • 100% Ground Ready
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <InteractiveFeatures orgs={orgs} isHindi={isHindi} lang={lang} />
      </div>

      {/* Internal SEO Solutions & Comparisons Discovery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {isHindi ? 'विशेष संगठन समाधान व ब्लूप्रिंट्स' : 'Specialized Movement Solutions'}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                {isHindi
                  ? 'नागरिक समूहों और एनजीओ के लिए पूर्ण वैधानिक समाधान और टूल्स।'
                  : 'Explore purpose-built landing pages and step-by-step ground playbooks for each organization archetype.'}
              </p>
            </div>
            <Link
              href={`/${lang}/solutions`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>{isHindi ? 'सभी समाधान एक्सप्लोर करें →' : 'Explore All Solutions →'}</span>
            </Link>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {isHindi ? 'संगठन बनाम अन्य सॉफ्टवेयर' : 'Sangathan vs Other Platforms'}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                {isHindi
                  ? 'देखें कि संगठन कैसे एक्शन नेटवर्क, नेशनबिल्डर, एवरीएक्शन, मोबिलाइज, CiviCRM और मायगेट से बेहतर है।'
                  : 'Compare Sangathan against Action Network, NationBuilder, EveryAction, Mobilize, CiviCRM, MyGate, and WhatsApp.'}
              </p>
            </div>
            <Link
              href={`/${lang}/compare`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <span>{isHindi ? 'सभी तुलनाएं देखें →' : 'View Head-to-Head Comparisons →'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

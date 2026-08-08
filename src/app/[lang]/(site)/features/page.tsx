import { Metadata } from 'next'
import { InteractiveFeatures } from '@/components/features/interactive-features'
import { SoftwareApplicationJsonLd, BreadcrumbJsonLd } from '@/components/seo/json-ld'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'सुविधाएं | संगठन' : 'Features | Sangathan',
    description: isHindi
      ? 'एनजीओ, छात्र संघों, श्रमिक संघों और RWA के लिए विशेष सुविधाएं। 80G रसीदें, लिंगदोह अनुपालन, RTI सहायक, UPI भुगतान, और ऑफ़लाइन PWA।'
      : 'Purpose-built features for Indian NGOs, student unions, workers unions, and RWAs. 80G receipts, Lyngdoh compliance, RTI assistant, UPI payments, and offline-first PWA.',
    alternates: {
      canonical: `https://sangathan.space/${lang}/features`,
      languages: {
        'en': 'https://sangathan.space/en/features',
        'hi': 'https://sangathan.space/hi/features',
      },
    },
  }
}

export default async function FeaturesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const isHindi = lang === 'hi'

  const orgs = [
    {
      id: 'ngo',
      title: isHindi ? 'गैर सरकारी संगठन (NGO)' : 'Non-Governmental Organisations',
      icon: 'Building2',
      color: 'indigo',
      description: isHindi 
        ? 'अपने स्वयंसेवकों को प्रबंधित करें, पारदर्शी रूप से धन जुटाएं, और अपने दान दाताओं के साथ विश्वास बनाएं।'
        : 'Manage your volunteer base, raise funds transparently, and build unshakeable trust with your donors.',
      features: [
        { icon: 'Globe', title: '1-Click Public Petition & Campaign Studio', desc: 'Publish open letters, campaigns, and drives with live signature counters and instant volunteer conversion hooks.' },
        { icon: 'Award', title: 'Sharable Verified Member Badges', desc: 'Generate dynamic, customizable social media graphics for Instagram, Twitter/X, and WhatsApp Stories with cryptographic verification.' },
        { icon: 'ShieldCheck', title: 'Public Trust & Transparency Ledger', desc: 'Real-time fund utilization, programmatic expenditure bar charts, and SHA-256 verified receipt audit trails with 96/100 A+ rating.' },
        { icon: 'Sparkles', title: 'AI-Powered Grant & CSR Matcher', desc: 'Automatically scan open government schemes and CSR funds, compute match score %, and generate structured grant application drafts.' },
        { icon: 'Smartphone', title: 'WhatsApp & Telegram Conversational Interface', desc: 'Ground-level messaging bot and interactive console allowing supporters to log grievances, submit check-ins, or check dues via text.' },
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
        { icon: 'FileText', title: 'Smart Compliance Tracker', desc: 'Auto-suggests 12A, 80G, FCRA based on actual usage and donations.' }
      ]
    },
    {
      id: 'student-union',
      title: isHindi ? 'छात्र संघ' : 'Student Unions',
      icon: 'GraduationCap',
      color: 'emerald',
      description: isHindi 
        ? 'छात्रों की आवाज़ को संगठित करें। सुरक्षित चुनाव कराएं और कैंपस की समस्याओं को ट्रैक करें।'
        : 'Organise the student voice. Conduct secure elections, track campus grievances, and manage events.',
      features: [
        { icon: 'Globe', title: '1-Click Public Petition & Campaign Studio', desc: 'Publish public campus representations with live signature counters, 1-click volunteer conversion hooks, and inter-union solidarity endorsements.' },
        { icon: 'Award', title: 'Sharable Verified Member Badges', desc: 'Generate dynamic social media graphics for Instagram, Twitter/X, and WhatsApp Stories with verified union designations and cryptographic QR codes.' },
        { icon: 'Smartphone', title: 'WhatsApp & Telegram Conversational Bot', desc: 'Bilingual messaging bot and console for campus grievances, event attendance, and emergency SOS detention alerts.' },
        { icon: 'Database', title: 'Offline-First Field Organizer PWA', desc: 'Hostel-to-hostel and gate desk onboarding in zero-connectivity environments with automatic background synchronization.' },
        { icon: 'ShieldAlert', title: 'Emergency SOS & Legal Rapid-Response', desc: '1-tap protest detention alert broadcasting GPS coordinates to volunteer advocates with live thana response tracking.' },
        { icon: 'Sparkles', title: 'AI-Powered Grant & CSR Matcher', desc: 'Scan UGC and government student welfare grants with 1-click structured AI proposal draft generation.' },
        { icon: 'Database', title: 'Central Student DB & HEI Directory', desc: 'Pre-populated Indian government institutions database including JMI, JNU, DU, BHU, IITs & NITs with support for both official unions and independent collectives.' },
        { icon: 'Printer', title: 'Official Union Letterhead & PDF Exporter', desc: 'Customizable emblem header, reference number generator (SU/2026/08/XXX), recipient block, and print-ready Gyapan & press release layout.' },
        { icon: 'Vote', title: 'Live Campus Election Counting Tally Desk', desc: 'Round-by-round and booth-by-booth vote count logger with live lead calculations for Central Panel candidates.' },
        { icon: 'Network', title: 'Joint Front & Co-Signed Protests (संयुक्त मोर्चा)', desc: 'Multi-org alliance hub for co-signing Gyapan representations, organizing joint rallies, and publishing co-authored press statements.' },
        { icon: 'Home', title: 'Hostel & Mess Quality Audit Portal', desc: 'Hostel room allotment vacancy tracking, daily mess meal quality ratings with photo evidence, and 24x7 study hall status.' },
        { icon: 'FileText', title: 'RTI & Action Taken Report (ATR) Assistant', desc: 'RTI Act 2005 pre-formatted legal query generator and VC/Dean commitment deadline tracker.' },
        { icon: 'Shield', title: 'Legal Aid & Anti-Ragging Cell', desc: 'Emergency protest detention SOS trigger, volunteer advocate directory, and anonymous UGC-compliant anti-ragging desk.' },
        { icon: 'Megaphone', title: 'Campus Campaigning & Mobilization Suite', desc: 'Hostel-to-Hostel (H2H) canvassing manager, Class-to-Class (C2C) lecture campaign scheduler, and poster wall allocation.' },
        { icon: 'UserCheck', title: 'On-Ground Member Induction Drive', desc: 'Kiosk desk mode for canteen/gate booths, scannable QR posters, and paper slip batch intake for rapid campus onboarding.' },
        { icon: 'Badge', title: 'Union Posts (पद) & Designation Registry', desc: 'Pre-configured designations (President, Vice President, General Secretary, Coordinator, Convener) plus custom post type creation.' },
        { icon: 'Lock', title: 'Digital ID Cards', desc: 'Cryptographically secure digital IDs with QR access.' },
        { icon: 'Users', title: 'Role-Based Governance', desc: 'Tiered access for executives, presidents, and students.' },
        { icon: 'Vote', title: 'Secure Online Voting', desc: 'End-to-end verifiable, anonymous elections.' },
        { icon: 'Scale', title: 'Lyngdoh Compliance Audit', desc: 'Automated Supreme Court mandate checks for candidate age limits, attendance thresholds, and ₹5,000 expense caps.' },
        { icon: 'FileText', title: 'Gyapan (ज्ञापन) Memorandum Builder', desc: 'Draft formal representations to VCs, Deans, and Wardens with digital student signature petitions.' },
        { icon: 'AlertTriangle', title: 'Hostel & Mess Grievances', desc: 'Ticketing system for academic, hostel allotment, mess quality, and campus disputes.' },
        { icon: 'Ticket', title: 'Event Ticketing & RSVPs', desc: 'Manage campus events, QR check-ins, and waitlists.' },
        { icon: 'Wallet', title: 'Club Sub-funding', desc: 'Allow societies to request and track micro-budgets.' },
        { icon: 'FileText', title: 'Proposals & Bills', desc: 'Draft, debate, and pass union resolutions democratically.' }
      ]
    },
    {
      id: 'worker-union',
      title: isHindi ? 'श्रमिक संघ' : 'Workers Unions',
      icon: 'HardHat',
      color: 'orange',
      description: isHindi 
        ? 'मज़दूरों के अधिकारों की रक्षा करें। सामूहिक सौदेबाजी (CBA) और हड़तालों का समन्वय करें।'
        : 'Protect worker rights with power. Coordinate collective bargaining, track dues, and organise actions.',
      features: [
        { icon: 'Globe', title: '1-Click Public Petition & Campaign Studio', desc: 'Launch wage defense and collective strike petitions with live signature counts and volunteer conversion.' },
        { icon: 'Award', title: 'Sharable Verified Member Badges', desc: 'Verified shop steward and member credentials formatted for WhatsApp and Twitter/X.' },
        { icon: 'Smartphone', title: 'WhatsApp & Telegram Conversational Bot', desc: 'Bilingual grievance logging, strike ballot casting, and dues status inquiries via messaging.' },
        { icon: 'Database', title: 'Offline-First Field Organizer PWA', desc: 'Factory gate and construction site worker intake in low-connectivity areas with automatic queue sync.' },
        { icon: 'AlertTriangle', title: 'Emergency SOS & Legal Rapid Response', desc: '1-tap emergency alert for unlawful worker detention with GPS broadcast to labor defense advocates.' },
        { icon: 'ShieldCheck', title: 'Public Trust & Transparency Ledger', desc: 'Audited strike relief fund ledger and worker welfare accounting with SHA-256 verified receipts.' },
        { icon: 'Users', title: 'Member Database', desc: 'Track employment history, standing, and certifications.' },
        { icon: 'Wallet', title: 'Automated Dues Collection', desc: 'Manage percentage or flat dues, with delinquency alerts.' },
        { icon: 'Scale', title: 'Grievance Case Mgmt', desc: 'Track workplace disputes through arbitration stages.' },
        { icon: 'Briefcase', title: 'CBA Contract Tracking', desc: 'Central repository for redlining and negotiation prep.' },
        { icon: 'Megaphone', title: 'Strike Coordination', desc: 'Workplace mapping and picket line organization.' },
        { icon: 'Vote', title: 'Secure Polling', desc: 'Conduct strike ballots and leadership elections.' },
        { icon: 'HardHat', title: 'Worker Dispatch System', desc: 'Match member skills to employer job requirements.' },
        { icon: 'Building2', title: 'Employer Management', desc: 'Monitor contract compliance across signatory companies.' },
        { icon: 'BadgeAlert', title: 'Shop Steward Roles', desc: 'Granular permissions for field representatives.' },
        { icon: 'ShieldCheck', title: 'Labor Law Compliance', desc: 'Automated checks against union regulations.' }
      ]
    },
    {
      id: 'rwa',
      title: isHindi ? 'रेजिडेंट वेलफेयर एसोसिएशन' : 'Resident Welfare Associations',
      icon: 'Home',
      color: 'cyan',
      description: isHindi 
        ? 'अपने पड़ोस को बेहतर बनाएं। रखरखाव, आगंतुक और सामुदायिक मतदान प्रबंधित करें।'
        : 'Modernise your neighbourhood. Manage maintenance, visitors, and democratic community polling.',
      features: [
        { icon: 'Receipt', title: 'Maintenance Billing', desc: 'Automated invoices based on flat size and late fees.' },
        { icon: 'Wallet', title: 'Online Payment Gateway', desc: 'Collect dues via UPI/Cards with auto-reconciliation.' },
        { icon: 'Users', title: 'Digital Visitor Log', desc: 'Gatekeeper app with photo capture and timestamps.' },
        { icon: 'Lock', title: 'Pre-approved Entry', desc: 'Residents approve guests or deliveries via the app.' },
        { icon: 'CheckSquare', title: 'Staff Attendance', desc: 'Biometric/geo-enabled tracking for domestic help.' },
        { icon: 'Headphones', title: 'Helpdesk Ticketing', desc: 'System for plumbing or electrical complaints.' },
        { icon: 'Calendar', title: 'Facility Booking', desc: 'Reserve clubhouses, gyms, or sports courts easily.' },
        { icon: 'Briefcase', title: 'Vendor Management', desc: 'Track society assets and preventive maintenance.' },
        { icon: 'FileText', title: 'Financial Ledgers', desc: 'Audit-ready P&L statements and transparent expenditure.' },
        { icon: 'Vote', title: 'Community Polls', desc: 'Vote on society upgrades and committee elections.' },
        { icon: 'Bell', title: 'Digital Notice Board', desc: 'Official society announcements with read receipts.' },
        { icon: 'Home', title: 'Resident Directory', desc: 'Verified database of owners, tenants, and emergency contacts.' },
        { icon: 'FileText', title: 'Smart Compliance Tracker', desc: 'Auto-suggests renewals and NOCs based on maintenance and facility usage.' },
        { icon: 'Lock', title: 'Social OAuth', desc: 'Frictionless member onboarding via Google and X.' },
        { icon: 'ShieldCheck', title: 'Enterprise Security', desc: 'Role-based access and strict data isolation.' },
        { icon: 'Zap', title: 'Resilient Smart Intelligence', desc: 'Smart summaries, social content, meeting minutes, form analysis, personalized notifications, and proposal analysis with automatic AI provider failover for dependable availability.' }
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
      {/* Crisp, light, geometric technical header design */}
      <div className="border-b border-slate-100 bg-slate-50/20 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {isHindi ? 'नागरिक समूहों के लिए तैयार की गई सुविधाएं' : 'Purpose-Built Features for Civic Collectives'}
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-normal">
            {isHindi 
              ? 'एनजीओ, छात्र संघों, श्रमिक संघों और आरडब्ल्यूए को प्रबंधित करने के लिए शक्तिशाली डिजिटल बुनियादी ढांचा।' 
              : 'Enterprise-grade digital infrastructure designed to empower NGOs, student unions, workers unions, and Resident Welfare Associations.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <InteractiveFeatures orgs={orgs} isHindi={isHindi} lang={lang} />
      </div>
    </div>
  )
}
